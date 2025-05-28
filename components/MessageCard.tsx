import React, { memo, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MessageCard = (props: {
  name: string;
  date: Date;
  time: string;
  desc: string;
  type: string;
}) => {
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        // router.push("messageDetails")
        console.log("message Details");
      }}
    >
      <View
        style={{
          padding: 0,
          margin: 0,
          backgroundColor: "#fff",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 0,
            marginBottom: -20,
            top: -10,
            padding: 10,
            paddingBottom: -20,
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/1.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              margin: 20,
              alignItems: "center",
              top: -5,
            }}
          />
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 500 }}>
                {props.name}
              </Text>
              <Text style={{ fontSize: 12, marginTop: 5, marginRight: 15 }}>
                {formatDate(props.date)}
              </Text>
            </View>
            <Text
              style={{ fontSize: 14, marginTop: 5, height: 50, width: 300 }}
            >
              {props.desc.length > 100
                ? props.desc.substring(0, 50 - 3) + "..."
                : props.desc}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(MessageCard);
