import HeaderConfig from "@/utils/HeaderConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const auditoryTrainingExercise = () => {
  const router = useRouter();

  HeaderConfig("Auditory Exercises");

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const handleAdd = () => {
    router.push({
      pathname:
        "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity",
      params: { subjectId: subjectId },
    });
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <Image
        source={require("@/assets/actCard/audDev.png")}
        style={styles.actHeader}
      />
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
      <TouchableOpacity
        style={styles.actSub}
        onPress={() =>
          router.push({
            pathname: "/subject/(exercises)/level",
            params: {
              subjectId: subjectId,
              activity_type: "bingo",
              category: "auditory",
              role: role,
            },
          })
        }
      >
        <Image
          source={require("@/assets/cardImg/piddieImg.png")}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={[styles.practice]}>PRACTICE WITH</Text>
        <Text style={[styles.actName]}>Piddie Says</Text>
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
        onPress={() =>
          router.push({
            pathname: "/subject/(exercises)/level",
            params: {
              subjectId: subjectId,
              activity_type: "matching",
              category: "auditory",
              role: role,
            },
          })
        }
      >
        <Image
          source={require("@/assets/cardImg/matchImg.png")}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={[styles.practice]}>PRACTICE WITH</Text>
        <Text style={[styles.actName]}>Matching Cards</Text>
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
            <Text style={styles.addText}>Add Auditory Exercises</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actHeader: {
    marginHorizontal: "auto",
    marginTop: 15,
    marginBottom: 20,
    height: 185,
    width: "92%",
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
    width: 50,
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

export default memo(auditoryTrainingExercise);
