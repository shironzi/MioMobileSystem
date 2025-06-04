import React, { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface BingoCardProps {
  image: any;
  isMatched: boolean;
  onPress: () => void;
}

const BingoCard: React.FC<BingoCardProps> = ({ image, isMatched, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      {isMatched && (
        <View style={styles.overlay}>
          <Image
            source={require("@/assets/face/yellow.png")}
            style={{ width: 50, height: 50 }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "30%",
    height: 115,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 5,
    margin: 5,
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
