import React, { useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useHeaderHeight } from '@react-navigation/elements';

const speechTrainingExercise = () => {
  const navigation = useNavigation();

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
    <View>
      <SpeechCards />
    </View>
  );
};

type IconName = "photo" | "quiz" | "sms" | "local-library";

const SpeechCard = ({ title, iconName }: { title: string, iconName: IconName }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(speech)/picture');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <MaterialIcons name={iconName} style={styles.icons} />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
};

const SpeechCards = () => {
  const cards = [
    'Picture Flashcards', 
    'Question Flashcards', 
    'Phrase Flashcards', 
    'ReadMe Flashcards'
  ];
  const icons: IconName[] = ['photo', 'quiz', 'sms', 'local-library'];

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <View key={index} style={styles.cardWrapper}>
          <SpeechCard title={card} iconName={icons[index]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
  },
  cardWrapper: {
    width: '48%',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  icons: {
    fontSize: 50,
    color: '#FFBF18',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default memo(speechTrainingExercise);
