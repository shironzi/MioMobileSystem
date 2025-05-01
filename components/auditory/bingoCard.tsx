import React, { memo } from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface BingoCardProps {
  image: any;
  isMatched: boolean;
  onPress: () => void;
}

const BingoCard: React.FC<BingoCardProps> = ({ image, isMatched, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={image} style={styles.image} />
    {isMatched && (
      <View style={styles.overlay}>
        <Image
          source={require("@/assets/face/yellow.png")}
          style={{ width: 50, height: 50 }}
        />
        {/* <MaterialIcons name='stars' size={60} style={styles.star}/> */}
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 115,
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
  },
});

export default memo(BingoCard);
