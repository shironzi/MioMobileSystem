import React from "react";
import { Card } from "@rneui/themed";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";

const NotificationCard = () => {
  const router = useRouter();
  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!";

  return (
    <TouchableOpacity onPress={() => router.navigate("/course/courseDetails")}>
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
          <Foundation
            name="alert"
            size={45}
            color="black"
            style={{ padding: 23 }}
          />
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "79%",
              }}
            >
              <Text style={{ fontSize: 18 }}>Announcement Title</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 14 }}>Date</Text>
                <Text style={{ fontSize: 14 }}>Time</Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, marginTop: 5, height: 60 }}>
              {description.length > 100
                ? description.substring(0, 150 - 3) + "..."
                : description}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default NotificationCard;
