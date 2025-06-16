import HeaderConfig from "@/utils/HeaderConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SpeechTrainingExercise = () => {
  const router = useRouter();

  HeaderConfig("Speech Exercises");

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

  const handleAdd = () => {
    router.push({
      pathname:
        "/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity",
      params: { subjectId: subjectId },
    });
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={styles.actHeader}>
        <Image
          source={require("@/assets/actCard/speechDev.png")}
          style={styles.actHeader}
        />
      </View>
      <Text
        style={{
          color: "#2264dc",
          fontWeight: 500,
          marginHorizontal: 30,
          marginVertical: -5,
        }}
      >
        Explore your exercises!
      </Text>

      <TouchableOpacity style={styles.actSub} onPress={handlePictureRoute}>
        <Image
          source={require("@/assets/cardImg/picImg.png")}
          style={styles.img}
        />
        <Text style={[styles.practice]}>PRACTICE WITH</Text>
        <Text style={[styles.actName]}>Picture FlashCards</Text>
        <View style={styles.choose}>
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              top: 10,
              fontWeight: 300,
              fontSize: 12,
            }}
          >
            Choose this
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actSub, { marginTop: -5 }]}
        onPress={handleQuestionRoute}
      >
        <Image
          source={require("@/assets/cardImg/wordImg.png")}
          style={styles.img}
        />
        <Text style={[styles.practice]}>PRACTICE WITH</Text>
        <Text style={[styles.actName]}>Word FlashCards</Text>
        <View style={styles.choose}>
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              top: 10,
              fontWeight: 300,
              fontSize: 12,
            }}
          >
            Choose this
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actSub, { marginTop: -5 }]}
        onPress={handlePhraseRoute}
      >
        <Image
          source={require("@/assets/cardImg/phraseImg.png")}
          resizeMode="contain"
          style={[styles.img, { height: 50, width: 50 }]}
        />
        <Text style={[styles.practice]}>PRACTICE WITH</Text>
        <Text style={[styles.actName]}>Reading FlashCards</Text>
        <View style={styles.choose}>
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              top: 10,
              fontWeight: 300,
              fontSize: 12,
            }}
          >
            Choose this
          </Text>
        </View>
      </TouchableOpacity>

      {role === "teacher" && (
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <View
            style={{
              top: 20,
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <Ionicons name="add-circle" size={20} color="#aaa" />
            <Text style={styles.addText}>Add Speech Exercises</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actHeader: {
    marginHorizontal: "auto",
    marginTop: 10,
    marginBottom: 30,
    height: 180,
    width: "95%",
  },
  actSub: {
    paddingTop: 10,
    marginTop: 20,
    margin: 20,
    borderColor: "#ddd",
    borderRadius: 20,
    borderWidth: 1,
  },
  img: {
    left: 10,
    margin: 20,
    width: 40,
    height: 50,
  },
  practice: {
    fontSize: 10,
    fontWeight: 300,
    left: 100,
    top: -62,
  },
  actName: {
    fontSize: 14,
    fontWeight: 500,
    left: 100,
    top: -60,
    marginBottom: -30,
  },
  choose: {
    backgroundColor: "#2264dc",
    height: 35,
    width: "30%",
    alignSelf: "flex-end",
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -30,
  },
  addButton: {
    position: "absolute",
    left: -8,
    width: "88%",
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    margin: 30,
    bottom: 0,
    height: 60,
  },
  addText: {
    color: "#aaa",
    fontWeight: 500,
    marginHorizontal: 10,
  },
});

export default memo(SpeechTrainingExercise);
