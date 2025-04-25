import { View, Text } from "react-native";
import React, { memo } from "react";

const activitiesCard = (props: { difficulty: String; questionNo: Number }) => {
  return (
    <View>
      <View>
        <Text>{props.difficulty}</Text>
        <View>
          <View></View>
        </View>
      </View>
    </View>
  );
};

export default memo(activitiesCard);
