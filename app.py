from flask import Flask, jsonify, request
import os
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client['video_app']
videos_collection = db['videos']
topics_collection = db['Topics']

@app.route('/')
def hi():
    return "the api is up!", 200

@app.route('/fetchVideos/all', methods=["GET"])
def fetchAll():
    # work with video collections to return a list of all the info from the videos except for video ID
    videos = videos_collection.find({}, {'videoID': 0})
    videoInfo = []
    for video in videos: 
        video.pop('_id', None)
        for key, value in video.items():
            if isinstance(value,ObjectId):
                video[key] = str(value)
        videoInfo.append(video)
    return jsonify(videoInfo)

@app.route('/fetch/topics', methods=["GET"])
def fetchTopics():
    topics = topics_collection.find({}).sort("topicName")
    alltopics = []
    for topic in topics:
        alltopics.append({"topicName" : topic['topicName'], "icon": topic["icon"]})
    return jsonify(alltopics)

@app.route('/addTopic', methods = ["POST"])
def add_topic():
    body = request.get_json()
    dict = {"topicName": body["topicName"], "icon" : body["icon"]}
    x = topics_collection.insert_one(dict)

    if x is not None:
        return "ok", 200
    else:
        return "not added", 406   
    
@app.route("/deleteTopic/<topicName>", methods = ["DELETE"])
def delete_topic(topicName):
    res = topics_collection.delete_one({"topicName":topicName})
    if res is not None:
        return "deleted", 200
    else:
        return "something went wrong", 406
    
@app.route("/deleteVideo/<videoName>", methods = ["DELETE"])
def delete_video(videoName):
    res = videos_collection.delete_one({"title":videoName})
    if res is not None:
        return "deleted", 200
    else:
        return "something went wrong", 406

@app.route('/updateTopic', methods = ["PUT"])
def update_topic():
    body = request.get_json()

    myquery = { "topicName": body["topicName"]}
    newvalues = { "$set": { "icon":  body["icon"] } }


    topics_collection.update_one(myquery, newvalues)
    
    return 'ok', 200

@app.route('/fetchTopic/<topicName>', methods = ["GET"])
def get_topic(topicName):
    print(topicName)
    topics = videos_collection.find({"topicName":topicName}, {"_id": 0})
    topic_info = [] 
    for topic in topics:
        filtered_topic = {key: value for key, value in topic.items() if key not in ['bucketKey', 'show', 'topicName']}
        if 'videos' in filtered_topic:
            topic['videos'] = [
                {"videoID": video.get("videoID"),
                 "videoName": video.get("videoName"),
                 "videoLength": video.get("videoLength")}
                for video in filtered_topic['videos']
            ]
        topic_info.append(filtered_topic)
    if not topic_info:
        return jsonify({"error": "Topic not found"}), 404
    return jsonify(topic_info)

@app.route('/addVideo', methods=["PUT"])
def addVideo():
    body = request.get_json()
    dict = {"title": body["title"], "show" : body["show"],  "topicName" : body["topicName"], "length" : body["length"], "youtubeLink" : body["youtubeLink"]}
    x = videos_collection.insert_one(dict)

    if x is not None:
        return "ok", 200
    else:
        return "not added", 406 
    
@app.route('/editVideo', methods=["PUT"])
def editVideo():
    body = request.get_json()

    result = videos_collection.find_one({"title": body["title"]})
    print(result)

    if result != None:
       return 'Error: The string is already in the database', 412 
    else:
        myquery = { "title": body["videoToChange"]}
        newvalues = { "$set": {"title": body["title"], "show" : body["show"],  "topicName" : body["topicName"], "length" : body["length"], "youtubeLink" : body["youtubeLink"]}}


        videos_collection.update_one(myquery, newvalues)
    
        return 'ok', 200


if __name__ == '__main__':
    app.run(debug=False, port=80, host='0.0.0.0')    