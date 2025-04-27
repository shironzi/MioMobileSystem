import { View, Text, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import ActivityProgress from "@/components/activityProgress";
import Draggable from "react-native-draggable";
import { Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

type Box = {
  id: string;
  text: string;
  x: number;
  y: number;
};

type DropZone = {
  id: string;
  x: number;
  y: number;
  occupied: string;
};

const fillInTheBlank = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Picture Flashcards",
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

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translationX.value = e.translationX;
      translationY.value = e.translationY;
    })
    .onEnd(() => {
      translationX.value = 0;
      translationY.value = 0;
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ActivityProgress
          difficulty="Easy"
          totalItems={10}
          completedItems={0}
          instruction="Drag the word to complete the sentence"
        />

        <View>
          <View style={styles.questionCard}>
            <FontAwesome6
              name="volume-high"
              size={20}
              color="#fff"
              style={styles.speakerIcon}
            />
            <View></View>
          </View>
          <GestureDetector gesture={panGesture}>
            <View>
              <Text>Choices</Text>
            </View>
          </GestureDetector>
        </View>
      </View>
    </GestureHandlerRootView>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  questionCard: {
    backgroundColor: "#fff",
    height: "30%",
    borderRadius: 10,
  },
  speakerIcon: {
    backgroundColor: "#FFBF18",
    borderRadius: 180,
    padding: 10,
  },
});

export default fillInTheBlank;
