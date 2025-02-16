import { Text, TouchableOpacity } from "react-native";
import { Card } from "@rneui/themed";
import React, { memo } from "react";
import { useRouter } from "expo-router";

const SpecializedCard = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.navigate("/(course)/specializedDetails")}
    >
    <Card containerStyle={{ borderRadius: 10, backgroundColor: "#f0f0f0" }}>
      <Card.Image
        source={{
        uri: "https://pic-bstarstatic.akamaized.net/ugc/093038ab9a4a29b0d4d6edb0575c82a7.jpg",
        }}
      />
      <Text style={{ color: "#333" }}>Course Title</Text>
      <Text style={{ color: "#666" }}>Course Section</Text>
    </Card>
    </TouchableOpacity>
  );
};

export default memo(SpecializedCard);
