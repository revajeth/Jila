# Internal Facing Endpoints:

  ## get_topic(topicName):
  ```/fetchTopic/<topicName>```
  Returns a json formatted list of all videos with the topic that was specified in the url. The json list returns the videoId, videoName, 
  youtubeLink, and the videoLength of a video. If the topic is not a valid topic in the databse the endpoint returns a 404 error code.

  ### example:

  input: ``http://api.jila-app.org/fetchTopic/education``
  
  output: [{"length":"2:49","title":"education1.mp4","youtubeLink":"education1.mp4"},  
            {"length":"1:27","title":"education2.mp4","youtubeLink":"education2.mp4"},
            {"length":"3:14","title":"education3.mp4","youtubeLink":"education3.mp4"}]

  ## fetchTopics():
  ```/fetch/topics', methods=["GET"])```
  Returns a json formatted list of all the topics currently in the database. The json list returns the topicName, and icon for every topic.
    
    
  ### example:

  input: `http://api.jila-app.org/fetch/topics`


  output: ["topicName":"education2", "icon": "data:image/jpeg;base64,/9..."}]      
