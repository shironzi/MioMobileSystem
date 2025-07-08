import HeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { checkAvailableRemedial } from "@/utils/specialized";
import LoadingCard from "@/components/loadingCard";

const CARD_DATA: Record<
  string,
  { img: any; actName: string; actDesc: string }
> = {
  picture: {
    img: require("@/assets/cardImg/picImg.png"),
    actName: "Picture Flashcards",
    actDesc:
      "Practice saying words by looking at pictures. This exercise helps you improve your speech by naming what you see using the microphone.",
  },
  question: {
    img: require("@/assets/cardImg/wordImg.png"),
    actName: "Word Flashcards",
    actDesc:
      "Practice saying words by reading them and understanding their sounds. This exercise helps you improve pronunciation by speaking words shown with their phonemes.",
  },
  phrase: {
    img: require("@/assets/cardImg/phraseImg.png"),
    actName: "Reading Flashcards",
    actDesc:
      "Practice saying short phrases to improve your speaking and fluency. This exercise helps you learn how to say phrases clearly using the microphone.",
  },
  bingo: {
    img: require("@/assets/cardImg/piddieImg.png"),
    actName: "Piddie Says",
    actDesc:
      "Train your listening skills by playing a fun Piddie Says game. This exercise helps you pair sounds to the correct pictures by listening carefully.",
  },
  matching: {
    img: require("@/assets/cardImg/matchImg.png"),
    actName: "Matching Cards",
    actDesc:
      "Improve your listening and sound recognition skills by matching what you hear to the correct image. This exercise helps you focus on identifying sounds accurately.",
  },
  fill: {
    img: require("@/assets/cardImg/fillImg.png"),
    actName: "Fill in the Box",
    actDesc:
      "Improve your sentence skills by listening and arranging words. This exercise helps you understand sentence structure by putting words in the correct order.",
  },
  homonyms: {
    img: require("@/assets/cardImg/homImg.png"),
    actName: "Homonyms",
    actDesc:
      "Learn how to tell the difference between words that sound the same but have different meanings. This exercise helps you understand and choose the correct homonyms in sentences.",
  },
};

const level = () => {
  HeaderConfig("Levels");
  const router = useRouter();
  const { activity_type, category, subjectId, role } = useLocalSearchParams<{
    activity_type: string;
    category: string;
    subjectId: string;
    role: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [remedialPhoneme, setRemedialPhoneme] = useState<string[]>([]);
  const [remedialId, setRemedialId] = useState<string>("");

  const handleRoute = (difficulty: string) =>
    router.push({
      pathname: "/subject/(exercises)/play",
      params: {
        subjectId: subjectId,
        activity_type: activity_type,
        difficulty: difficulty,
        category: category,
        role: role,
      },
    });

  const handleRemedial = () => {
    const phonemeParam = JSON.stringify(remedialPhoneme);

    router.push({
      pathname: "/subject/SpeechRemedial",
      params: {
        subjectId: subjectId,
        activity_type: activity_type,
        remedialPhoneme: phonemeParam,
        remedialId: remedialId,
      },
    });
  };

  const difficultyStyles: Record<
    string,
    { backgroundColor: string; borderColor: string }
  > = {
    easy: { backgroundColor: "#C8FFB7", borderColor: "#439558" },
    average: { backgroundColor: "#ffe9ae", borderColor: "#ffbf18" },
    difficult: { backgroundColor: "#FFCEA1", borderColor: "#FF7A00" },
    challenge: { backgroundColor: "#FFB1B1", borderColor: "#DB4141" },
  };
  const card = CARD_DATA[activity_type] ?? CARD_DATA.picture;

  useEffect(() => {
    const checkForRemedial = async () => {
      const res = await checkAvailableRemedial(subjectId, activity_type);

      if (res.success) {
        setRemedialPhoneme(res.phonemes);
        setRemedialId(res.remedial_id);
      }

      setLoading(false);
    };

    checkForRemedial();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#fff", flex: 1 }}
    >
      <View style={{ paddingBottom: 50 }}>
        <View style={styles.header_act}>
          <FontAwesome
            name="circle"
            size={40}
            color="#FFCEA1"
            style={styles.circle}
          />
          <FontAwesome
            name="circle"
            size={40}
            color="#ffe9ae"
            style={styles.circle2}
          />
          <Image source={card.img} resizeMode={"contain"} style={styles.img} />
          <View>
            <Text style={[styles.practice]}>PRACTICE WITH</Text>
            <Text style={[styles.actName]}>{card.actName}</Text>
          </View>
          <Text style={styles.actDesc}>{card.actDesc}</Text>
        </View>
        {role === "student" && remedialPhoneme.length > 0 ? (
          <TouchableOpacity
            style={[styles.subLevel, difficultyStyles.easy]}
            onPress={handleRemedial}
          >
            <MaterialIcons
              name="hexagon"
              size={40}
              color="#439558"
              style={styles.shape1}
            />
            <Text style={styles.name}>Remedial</Text>
            <MaterialIcons
              name="hexagon"
              size={70}
              color="#439558"
              style={styles.shape2}
            />
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.headerText}>Choose Difficulty Mode</Text>
            <TouchableOpacity
              style={[styles.subLevel, difficultyStyles.easy]}
              onPress={() => handleRoute("easy")}
            >
              <Fontisto
                name="star"
                size={40}
                color="#439558"
                style={styles.shape1}
              />
              <Text style={styles.try}>TRY THE</Text>
              <Text style={styles.name}>Easy Mode</Text>
              <Fontisto
                name="star"
                size={70}
                color="#439558"
                style={styles.shape2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subLevel,
                difficultyStyles.average,
                { marginTop: -5 },
              ]}
              onPress={() => handleRoute("average")}
            >
              <Ionicons
                name="square"
                size={40}
                color="#ffbf18"
                style={styles.shape1}
              />
              <Text style={styles.try}>TRY THE</Text>
              <Text style={styles.name}>Average Mode</Text>
              <Ionicons
                name="square"
                size={70}
                color="#ffbf18"
                style={styles.shape2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subLevel,
                difficultyStyles.difficult,
                { marginTop: -5 },
              ]}
              onPress={() => handleRoute("difficult")}
            >
              <Ionicons
                name="triangle"
                size={40}
                color="#FF7A00"
                style={styles.shape1}
              />
              <Text style={styles.try}>TRY THE</Text>
              <Text style={styles.name}>Difficult Mode</Text>
              <Ionicons
                name="triangle"
                size={70}
                color="#FF7A00"
                style={styles.shape2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subLevel,
                difficultyStyles.challenge,
                { marginTop: -5 },
              ]}
              onPress={() => handleRoute("challenge")}
            >
              <FontAwesome
                name="circle"
                size={40}
                color="#DB4141"
                style={styles.shape1}
              />
              <Text style={styles.try}>TRY THE</Text>
              <Text style={styles.name}>Challenge Mode</Text>
              <FontAwesome
                name="circle"
                size={70}
                color="#DB4141"
                style={styles.shape2}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
  },
  headerText: {
    color: "#2264dc",
    fontWeight: "500",
    marginHorizontal: 30,
    fontSize: 16,
    top: 15,
    left: -5,
    marginBottom: 10,
  },
  subLevel: {
    margin: 20,
    borderWidth: 1,
    borderRadius: 20,
    height: 100,
    overflow: "hidden",
    position: "relative",
  },
  shape1: {
    transform: [{ rotate: "-15deg" }],
    left: 20,
    top: -15,
  },
  shape2: {
    position: "absolute",
    transform: [{ rotate: "20deg" }],
    left: 250,
    top: 45,
  },
  try: {
    fontSize: 12,
    fontWeight: 400,
    left: 90,
    top: -12,
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
    left: 90,
    top: -10,
  },
  img: { width: 50, height: 60, margin: 20, left: 50, top: 10 },
  header_act: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 0,
  },
  actName: { fontSize: 16, fontWeight: 500, left: 130, top: -60 },
  actDesc: {
    textAlign: "justify",
    fontSize: 12,
    margin: 20,
    marginTop: -40,
    fontWeight: 300,
  },
  practice: {
    fontSize: 12,
    fontWeight: 400,
    left: 130,
    top: -62,
  },
  circle: {
    left: 280,
    top: 20,
  },
  circle2: {
    left: 30,
    top: -50,
    marginBottom: -80,
  },
});

export default memo(level);
