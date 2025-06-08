import HeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

const SpeechTrainingExercise = () => {
  const router = useRouter();
  HeaderConfig("Language Training Exercise");

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const handleFillRoute = () => {
    router.push({
      pathname: "/subject/(exercises)/level",
      params: {
        subjectId: subjectId,
        activity_type: "fill",
        category: "language",
        role: role,
      },
    });
  };

  const handleHomonymsRoute = () => {
    router.push({
      pathname: "/subject/(exercises)/level",
      params: {
        subjectId: subjectId,
        activity_type: "homonyms",
        category: "language",
        role: role,
      },
    });
  };

  const handleAdd = () => {
    router.push({
      pathname: "/subject/ManageActivity/AddLanguageActivity",
      params: { subjectId: subjectId },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.courseContainer}>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <TouchableOpacity style={styles.card} onPress={handleFillRoute}>
              <Image
                source={require("@/assets/icons/Speaker_Notes.png")}
                style={styles.icon}
              />
              <Text style={{ textAlign: "center", marginTop: 5 }}>
                Fill in the Blanks
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridItem}>
            <TouchableOpacity style={styles.card} onPress={handleHomonymsRoute}>
              <Image
                source={require("@/assets/icons/homonyms.png")}
                style={styles.icon}
              />
              <Text style={{ textAlign: "center", marginTop: 5 }}>
                Homonyms
              </Text>
            </TouchableOpacity>
          </View>
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
  courseContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
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
    marginTop: 20,
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
