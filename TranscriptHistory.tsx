import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import firebase from "firebase";
import Swiper from "react-native-deck-swiper";

import {formatDate} from "./Utilities";

class TranscriptEntry {
  topic: string;
  value: string;
  time: string;
  date: string;

  constructor(topic, value, time, date) {
    this.topic = topic;
    this.value = value;
    this.time = time;
    this.date = date;
  }
}

// Define a class to represent the entire transcript data
class Transcript {
  text: string;
  timestamp: Date;
  entries: TranscriptEntry[];

  constructor(text: string, timestamp, entries) {
    this.text = text;
    this.timestamp = timestamp;
    this.entries = entries.map(
        (entry) => new TranscriptEntry(entry.topic, entry.value, entry.time, entry.date)
    );
  }
}

// A function to parse the raw data from Firebase and return an instance of the `Transcript` class
function parseTranscriptData(rawData) {
  const {text, timestamp, entries} = rawData;
  const parsedEntries = JSON.parse(entries);
  const parsedTimestamp = new Date(timestamp); // assuming timestamp is already a valid Date object, otherwise use `new Date(timestamp.toDate())`
  return new Transcript(text, parsedTimestamp, parsedEntries);
}

export function TranscriptHistory({userId}: { userId: string }) {
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("transcripts")
        // .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          const fetchedTranscripts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("fetchedTranscripts: ", fetchedTranscripts);
          setTranscripts(fetchedTranscripts);
        });

    return () => unsubscribe();
  }, [userId]);

  async function deleteMatchingEntries(topic: string, entryIds: string[],
                                       batch: firebase.firestore.WriteBatch): Promise<void> {
    const entriesRef = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('topics')
        .doc(topic)
        .collection('entries');

    for (const entryId of entryIds) {
      const entryRef = entriesRef.doc(entryId);
      const entryDoc = await entryRef.get();
      if (entryDoc.exists) {
        const entryData = entryDoc.data();
        console.log("Deleting entryRef with entryData: ", entryData);
      }
      batch.delete(entryRef);
    }
  }

  const onDelete = async (transcriptId: string, entries) => {
    Alert.alert(
        "Delete Transcript",
        "Are you sure you want to delete this transcript and its entries?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              const batch = firebase.firestore().batch();

              // Delete transcript
              const transcriptRef = firebase
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("transcripts")
                  .doc(transcriptId);

              async function fetchIdsField() {
                try {
                  const doc = await transcriptRef.get();
                  if (doc.exists) {
                    const idsList = doc.data().ids;
                    console.log('ids list:', idsList);
                    return idsList;
                  } else {
                    console.log('No such document!');
                  }
                } catch (error) {
                  console.error('Error fetching ids field:', error);
                }
              }

              const entryIds = await fetchIdsField();

              // Delete entries
              for (const entry of JSON.parse(entries)) {
                await deleteMatchingEntries(entry.topic, entryIds, batch);
              }

              batch.delete(transcriptRef);
              await batch.commit();
            },
          },
        ]
    );
  };

  const renderCard = (item) => {
    // const { item } = props;
    console.log("renderCard item: ", item);
    if (!item) {
      return (
          // Return an empty card component or null
          // You can customize the appearance of the empty card as needed
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Something went wrong.</Text>
          </View>
      );
    } else {
      return (
          <View
              style={{
                borderRadius: 10,
                padding: 20,
                alignSelf: "center",
                height: "50%",
                width: "80%",
                justifyContent: "space-between",
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 1,
              }}
          >
            <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: "red",
                  borderRadius: 50,
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => onDelete(item.id, item.entries)}
            >
              <Text style={{color: "white", fontWeight: "bold"}}>X</Text>
            </TouchableOpacity>
            <View>
              <Text style={{fontWeight: "bold", fontSize: 18}}>Transcript</Text>
              <Text>{item.text}</Text>
            </View>
            <View style={{flex: 1, marginTop: 20}}>
              <Text style={{fontWeight: "bold", fontSize: 18}}>Entries</Text>
              {JSON.parse(item.entries).map((entry, index) => (
                  <Text key={index}>
                    {entry.topic}: {entry.value} at {entry.time} on {formatDate(entry.date)}
                  </Text>
              ))}
            </View>
            <View style={{alignItems: "flex-end"}}>
              <Text style={{fontStyle: "italic"}}>
                Recorded {new Date(item.timestamp?.toDate()).toLocaleString()}
              </Text>
            </View>
          </View>
      );
    }
  };

  if (transcripts.length === 0) {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text>Loading transcripts...</Text>
        </View>
    );
  } else {
    return (
        <View style={{flex: 1}}>
          <Swiper
              cards={transcripts}
              renderCard={renderCard}
              backgroundColor="transparent"
              cardIndex={0}
              stackSize={3}
              stackSeparation={15}
              animateCardOpacity
              showSecondCard
              disableBottomSwipe
              disableTopSwipe
              onSwiped={(cardIndex) => console.log(cardIndex)}
              onSwipedAll={() => console.log("All cards swiped")}
          />
        </View>
    );
  }
};

