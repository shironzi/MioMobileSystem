import { View, Text } from "react-native";
import React from "react";
import HeaderConfig from "@/components/HeaderConfig";
import Talk2MeMessageCard from "@/components/trainingActivities/language/Talk2MeMessageCard";

const talk2Me = () => {
  HeaderConfig("Talk2Me: Responding Questions");
  return (
    <View>
      <Talk2MeMessageCard />
    </View>
  );
};

export default talk2Me;
