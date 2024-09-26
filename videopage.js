import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, Linking, ActivityIndicator } from 'react-native';

// Helper function to open YouTube links
const openYouTubeVideo = (url) => {
  Linking.openURL(url).catch((err) => console.error('An error occurred', err));
};

const VideoListItem = ({ title, duration, youtubeUrl }) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.listText}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>
      <TouchableOpacity onPress={() => openYouTubeVideo(youtubeUrl)}>
        <Image source={require('./assets/snack-icon.png')} style={styles.playIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://18.117.181.90:5000/fetchtopic/education')
      .then(response => response.json())
      .then(data => {
        setVideos(data.map(video => ({
          id: video.title, // Assuming title is unique for simplicity
          title: video.title.replace('.mp4', ''),
          duration: video.length,
          youtubeUrl: video.youtubeLink
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch videos:', err);
        setError('Failed to load videos');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Public Transportation</Text>
        </View>
        {/* Main content */}
        <FlatList
          data={videos}
          renderItem={({ item }) => (
            <VideoListItem title={item.title} duration={item.duration} youtubeUrl={item.youtubeUrl} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Image source={require('./assets/snack-icon.png')} style={styles.navIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    flexDirection: "column"
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '40%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: '1%',
    marginLeft: 20
  },
  headerText: {
    color: '#29465B',
    fontWeight: '600',
    fontSize: 30,
    marginTop: 30,
  },
  FlatList: {
    marginTop: '10%'
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listText: {
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 16,
    color: '#666',
  },
  playIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'red', // Placeholder, replace with actual icon
    borderRadius: 20,
  },
  navBar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopColor: '#ccc',
    backgroundColor: '#8C0802',
  },
  navIcon: {
    width: 40,
    height: 40,
  },
  // ... any additional styles
});


