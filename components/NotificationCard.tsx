import React, { memo, useCallback } from "react";
import { Card } from "@rneui/themed";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const NotificationCard = (props: {
  title: string;
  desc: string;
  type: string;
}) => {
  const router = useRouter();
  const renderIcon = useCallback(() => {
    switch (props.type.toLowerCase()) {
      case "activity":
        return (
          <MaterialIcons
            name="event"
            size={45}
            color="black"
            style={{ padding: 23 }}
          />
        );
      case "warning":
        return (
          <Entypo
            name="warning"
            size={45}
            color="black"
            style={{ padding: 23 }}
          />
        );
      case "fire":
        return (
          <FontAwesome5
            name="fire"
            size={45}
            color="black"
            style={{ padding: 23 }}
          />
        );
      default:
        return null;
    }
  }, [props.type]);

  return (
    <TouchableOpacity
      onPress={() =>
        props.type.toLowerCase() === "message"
          ? router.navigate("/(notification)/messageDetails")
          : router.navigate("/(notification)/notificationDetails")
      }
    >
      <Card containerStyle={{ paddingLeft: 0, margin: 0 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {renderIcon()}
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {props.title}
              </Text>
            </View>
            <Text
              style={{ fontSize: 14, marginTop: 5, height: 60, width: 300 }}
            >
              {props.desc.length > 100
                ? props.desc.substring(0, 100 - 3) + "..."
                : props.desc}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default memo(NotificationCard);
