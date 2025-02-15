import React from "react";
import { Card } from "@rneui/themed";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const NotificationCard = (props: {
  title: string;
  date: Date;
  time: string;
  desc: string;
  type: string;
}) => {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const renderIcon = () => {
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
      case "message":
        return (
          <MaterialIcons
            name="account-circle"
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
  };

  return (
    <TouchableOpacity
      onPress={() =>
        props.type.toLowerCase() === "message"
          ? router.navigate("/notification/messageDetails")
          : router.navigate("/notification/notificationDetails")
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
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  columnGap: 5,
                }}
              >
                <Text style={{ fontSize: 15 }}>
                  {isToday(props.date)
                    ? "Today"
                    : isYesterday(props.date)
                    ? "Yesterday"
                    : formatDate(props.date)}
                </Text>
                <Text style={{ fontSize: 15 }}>{props.time}</Text>
              </View>
            </View>
            <Text
              style={{ fontSize: 14, marginTop: 5, height: 60, width: 300 }}
            >
              {props.desc.length > 100
                ? props.desc.substring(0, 150 - 3) + "..."
                : props.desc}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default NotificationCard;
