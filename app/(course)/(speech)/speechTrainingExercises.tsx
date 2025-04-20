import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SpeechTrainingExercise = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Speech Training Exercises",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

  return (
    <View style={{ display: "flex", 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-around", 
    padding: 10, 
    rowGap: 18, 
    columnGap: 21 }}>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(speech)/level")}>
        <MaterialIcons name="photo" size={60} style={styles.icons} />
        <Text>Picture Flashcards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(speech)/level")}>
        <MaterialIcons name="quiz" size={60} style={styles.icons} />
        <Text>Question Flashcard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(speech)/level")}>
        <MaterialIcons name="local-library" size={60} style={styles.icons} />
        <Text>Phrase Flashcards</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(speech)/level")}>
        <MaterialCommunityIcons name="message-bulleted" size={60} style={styles.icons} />
        <Text>ReadMe Flashcard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icons: {
    color: "#FFBF18",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: 172,
    height: 140,
    padding: 23,
    fontSize: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
  }
});

export default memo(SpeechTrainingExercise);
