import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#FFBF18",
    borderRadius: 50,
    paddingVertical: 17,
    width: "100%",
    marginBottom: 10,
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: 500,
    fontSize: 16,
  },
  cardContainer: {
    paddingHorizontal: 26,
    paddingVertical: 15,
    borderRadius: 10,
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
  text1: {
    fontSize: 16,
    lineHeight: 28,
    color: "#1F1F1F",
    fontWeight: "500",
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#82828257",
    marginHorizontal: -10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitWrapper: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    width: "100%",
    justifyContent: "center",
  },
});

export default globalStyles;
