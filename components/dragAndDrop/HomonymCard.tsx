import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

const HomonymCard = (props: { questions: string[]; choices: string[] }) => {
  HeaderConfig("Homonyms");

  const splitAtBlank = (sentence: string) => {
    const parts = sentence.split("BLANK");
    return {
      before: parts[0],
      after: parts[1],
    };
  };

  return (
    <View style={{ width: "100%", rowGap: 14 }}>
      {props.questions.map((question, index) => {
        const questionParts = splitAtBlank(question);

        return (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 20,
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#FFBF18",
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 180,
              }}
            >
              <FontAwesome6 name="volume-high" size={20} color="#fff" />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                width: "80%",
              }}
            >
              <Text
                style={{
                  flexShrink: 1,
                  lineHeight: 37,
                  fontSize: 20,
                }}
              >
                {questionParts.before}
              </Text>
              <View style={[styles.blankSpace, { marginHorizontal: 8 }]}></View>
              <Text style={{ flexShrink: 1, lineHeight: 37, fontSize: 20 }}>
                {questionParts.after}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  blankSpace: {
    backgroundColor: "#DEDFE2",
    padding: 10,
    borderRadius: 5,
    width: 50,
    marginHorizontal: 20,
  },
});

export default HomonymCard;
