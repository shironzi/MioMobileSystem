import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        padding: 20
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
        width: "100%"
    },
    submitButtonText: {
        textAlign: "center",
        color: "#fff"
    }
})

export default globalStyles;