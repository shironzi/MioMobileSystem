import React, { memo, useCallback } from "react";
import { Card } from "@rneui/themed";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const MessageCard = (props: {
  title: string;
  date: Date;
  time: string;
  desc: string;
  type: string;
}) => {
  const router = useRouter();

  const formatDate = useCallback(
    (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    },
    [Date]
  );

  return (
    <TouchableOpacity
      onPress={() => router.push("messageDetails") }
    >
      <Card
        containerStyle={{
          padding: 0,
          margin: 0,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
            height: 80,
            marginTop: 15,
          }}
        >
          <MaterialIcons
            name="account-circle"
            size={45}
            color="black"
            style={{ paddingHorizontal: 20, top:-5 }}
          />
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {props.title}
              </Text>
              <Text style={{ fontSize: 12, marginTop: 5, marginRight:15}}>
                {formatDate(props.date)}
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

export default memo(MessageCard);
