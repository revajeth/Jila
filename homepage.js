import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Async function to fetch topics from your server
async function fetchAllTopics() {
    console.log("Fetching topics from the server...");
    try {
        const response = await fetch('http://18.117.181.90:5000/fetch/topics');
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const topics = await response.json();
        console.log("Data converted to JSON:", topics);
        return topics.map(topic => {
            const base64String = topic.icon.split('base64,')[1];
            if (!base64String) {
                throw new Error(`Base64 string not found in topic icon for topic '${topic.topicName}'`);
            }
            const mimeType = topic.icon.substring(5, topic.icon.indexOf(';'));
            if (!mimeType) {
                throw new Error(`MIME type not found in topic icon for topic '${topic.topicName}'`);
            }
            return {
                icon: `data:${mimeType};base64,${base64String}`,
                label: topic.topicName
            };
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export default function App() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTopics = async () => {
            setLoading(true);
            try {
                const fetchedTopics = await fetchAllTopics();
                setTopics(fetchedTopics);
                setError(null);
            } catch (err) {
                setError("Failed to fetch topics. Tap to retry.");
                console.error(err);
            }
            setLoading(false);
        };

        loadTopics();
    }, []);

    // Function to render each button
    const renderButton = (button) => (
        <TouchableOpacity key={button.label} style={styles.button}>
            <Image style={styles.icon} source={{ uri: button.icon }} />
            <Text style={styles.buttonText}>{button.label}</Text>
        </TouchableOpacity>
    );

    // Function to render each section
    const renderSection = (section) => (
        <View key={section.category}>
            <Text style={styles.sectionHeader}>{section.category}</Text>
            <View style={styles.section}>
                {section.buttons.map(renderButton)}
            </View>
        </View>
    );

    const buttonData = [
        { category: 'Most Used', buttons: topics.slice(0, 3) },
        { category: 'All Topics', buttons: topics }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Image style={styles.f1} source={require('./assets/snack-icon.png')} />
                </TouchableOpacity>
                <View style={styles.centeredimage}>
                    <Text style={styles.f2}>Home Page</Text>
                </View>
                <TouchableOpacity>
                    <Image style={styles.f1} source={require('./assets/snack-icon.png')} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <TouchableOpacity style={styles.errorButton} onPress={() => setTopics([])}>
                        <Text style={styles.errorText}>{error}</Text>
                    </TouchableOpacity>
                ) : (
                    buttonData.map(renderSection)
                )}
            </ScrollView>

            <View style={styles.navBar}>
                <TouchableOpacity>
                    <Image style={styles.navIcon} source={require('./assets/snack-icon.png')} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.navIcon} source={require('./assets/snack-icon.png')} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.navIcon} source={require('./assets/snack-icon.png')} />
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

// Styles for your app
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 95,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#800000',
        paddingHorizontal: 50,
    },
    scrollView: {
        flex: 1,
    },
    sectionHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        padding: 10,
        backgroundColor: '#F3F3F3',
        textAlign: 'center'
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    button: {
        width: 115,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        borderRadius: 20,
        padding: 10,
    },
    icon: {
        width: '90%',
        height: '90%',
    },
    buttonText: {
        marginTop: 5,
    },
    navBar: {
        height: 95,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#800000',
    },
    navIcon: {
        width: 30,
        height: 30,
    },
    centeredimage: {
        flex: 1,
        alignItems: 'center',
    },
    f1: {
        width: 30,
        height: 30,
    },
    f2: {
        marginTop: 5,
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
    },
    errorButton: {
        padding: 10,
        margin: 20,
        backgroundColor: 'red',
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
    },
});


