import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  submit: () => void;
  cancel: () => void;
  isSubmitting: boolean;
}

const Button = ({ submit, cancel, isSubmitting }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={cancel}
        style={styles.cancelButton}
        disabled={isSubmitting}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={submit}
        style={styles.submitButton}
        disabled={isSubmitting}
      >
        <Text style={styles.submitText}>
          {isSubmitting ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#FFBF18",
    borderRadius: 15,
    paddingVertical: 15,
    width: 165,
    marginBottom: 10,
  },
  cancelButton: {
    borderColor: "#FFBF189E",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 17,
    width: 165,
    marginBottom: 10,
    borderWidth: 1,
  },
  submitText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelText: {
    textAlign: "center",
    color: "#FFBF189E",
    fontWeight: 500,
    fontSize: 16,
  },
});

export default Button;
