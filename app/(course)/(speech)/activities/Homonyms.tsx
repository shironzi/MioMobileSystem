import { View, Text } from "react-native";
import React from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import HomonymCard from "@/components/dragAndDrop/HomonymCard";

const Data = [
  {
    question1:
      "Let's BLANK tomorrow to finalize the details. Let's tomorrow to finalize the details.",
    question2: "I want to buy fresh BLANK for the barbercue.",
    choices: ["meet", "meat"],
  },
];

const Homonyms = () => {
  HeaderConfig("Homonyms");

  return (
    <View style={{ padding: 20 }}>
      <HomonymCard
        questions={[Data[0].question1, Data[0].question2]}
        choices={Data[0].choices}
      />
    </View>
  );
};

export default Homonyms;
