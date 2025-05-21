import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#fafafa",
  },
  submitButton: {
    backgroundColor: "#FFBF18",
    borderRadius: 50,
    paddingVertical: 17,
    width: "100%",
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
  },
  cardContainer: {
    paddingHorizontal: 26,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },
  cardBody: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  sectionHeader: {
    backgroundColor: "#434242",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 26,
    paddingVertical: 15,
    color: "#fff",
  },
  contentPadding: {
    paddingHorizontal: 26,
    paddingVertical: 15,
  },
  textLabel: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
});

export default globalStyles;
