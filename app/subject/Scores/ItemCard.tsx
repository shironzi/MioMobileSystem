import { Text, TouchableOpacity } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";

interface Props {
  handleRoute?: () => void;
  placeholder: string;
}

const ItemCard = ({ handleRoute, placeholder }: Props) => {
  return (
    <TouchableOpacity style={globalStyles.cardContainer2} onPress={handleRoute}>
      <Text style={globalStyles.text1}>{placeholder}</Text>
      <FontAwesome
        name="long-arrow-right"
        size={20}
        color="black"
        style={{ top: 5, left: -5 }}
      />
    </TouchableOpacity>
  );
};

export default ItemCard;
