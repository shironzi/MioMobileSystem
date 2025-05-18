import Talk2MeMessageCard from "@/components/trainingActivities/language/Talk2MeMessageCard";
import HeaderConfig from "@/utils/HeaderConfig";
import React from "react";
import { View } from "react-native";

const talk2Me = () => {
  HeaderConfig("Talk2Me: Responding Questions");
  return (
    <View style={{ padding: 20 }}>
      <Talk2MeMessageCard />
    </View>
  );
};

export default talk2Me;
