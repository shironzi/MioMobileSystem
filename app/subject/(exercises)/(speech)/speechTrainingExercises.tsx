import HeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/globalStyles";

const SpeechTrainingExercise = () => {
  const router = useRouter();

  HeaderConfig("Speech Training Exercises");

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const handlePictureRoute = () => {
    router.push({
      pathname: "/subject/(exercises)/level",
      params: {
        subjectId: subjectId,
        activity_type: "picture",
        category: "speech",
        role: role,
      },
    });
  };

  const handleQuestionRoute = () => {
    router.push({
      pathname: "/subject/(exercises)/level",
      params: {
        subjectId: subjectId,
        activity_type: "question",
        category: "speech",
        role: role,
      },
    });
  };

  const handlePhraseRoute = () => {
    router.push({
      pathname: "/subject/(exercises)/level",
      params: {
        subjectId: subjectId,
        activity_type: "phrase",
        category: "speech",
        role: role,
      },
    });
  };

  const handlePronunciationRoute = () => {
    router.push({
      pathname: "/subject/(exercises)/level",
      params: {
        subjectId: subjectId,
        activity_type: "pronunciation",
        category: "speech",
        role: role,
      },
    });
  };

  const handleAdd = () => {
    router.push({
      pathname: "/subject/(exercises)/(speech)/AddSpeechActivity",
      params: { subjectId: subjectId },
    });
  };

  return (
    <View style={[globalStyles.container, { flex: 1 }]}>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <TouchableOpacity style={styles.card} onPress={handlePictureRoute}>
            <Image
              source={require("@/assets/icons/Picture.png")}
              style={styles.icon}
            />
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              Picture Flashcards
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridItem}>
          <TouchableOpacity style={styles.card} onPress={handleQuestionRoute}>
            <Image
              source={require("@/assets/icons/Questions.png")}
              style={styles.icon}
            />
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              Question Flashcards
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridItem}>
          <TouchableOpacity style={styles.card} onPress={handlePhraseRoute}>
            <Image
              source={require("@/assets/icons/Dictionary.png")}
              style={styles.icon}
            />
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              Phrase Flashcards
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridItem}>
          <TouchableOpacity
            style={styles.card}
            onPress={handlePronunciationRoute}
          >
            <Image
              source={require("@/assets/icons/Speaker_Notes.png")}
              style={styles.icon}
            />
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              ReadMe: Pronunciation Challenge
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {role === "teacher" && (
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <MaterialIcon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  courseTitle: {
    fontSize: 20,
  },
  dropdownContainer: {
    width: 200,
  },
  dropdown: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  selectedTextStyle: {
    color: "#FFBF18",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
  },
  iconStyle: {
    fontSize: 20,
    color: "#FFBF18",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    justifyContent: "center",
    marginBottom: 16,
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    height: 140,
    padding: 16,
    fontSize: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  icon: {
    width: 60,
    height: 60,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default memo(SpeechTrainingExercise);
