import { StyleSheet } from "react-native";

const SpeechStyles = StyleSheet.create({
  flashcardContainer: {
    backgroundColor: "#fff",
    padding: 20,
    height: 230,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  textContainer: {
    margin: "auto",
    textAlign: "center",
  },
  flashcardText: {
    fontSize: 22,
    flexWrap: "wrap",
    textAlign: "center",
    top: -15,
    fontWeight: 300,
    lineHeight: 35,
  },
  continueButton: {
    flex: 1,
    marginHorizontal: 5,
    left: -5,
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    top: 15,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 8,
    margin: "auto",
  },
});

export default SpeechStyles;
