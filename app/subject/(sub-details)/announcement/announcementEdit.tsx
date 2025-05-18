import React, {memo} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import HeaderConfig from "@/components/HeaderConfig";
import { useLocalSearchParams, useRouter } from "expo-router";

const AnnouncementEdit = () => {
    HeaderConfig("Announcement");
    const router = useRouter();

    const { title, description, date, time } =
        useLocalSearchParams<{ title: string; description: string; date: string; time: string }>();

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <Text style={styles.date}>{date} {time}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={() => {
                        console.log("Save tapped");
                    }}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    cardContainer: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 5,
    },
    cardContent: {
        flexDirection: "column",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        color: "#2264dc",
        fontWeight: "bold",
    },
    date: {
        fontSize: 14,
        color: "#888",
        marginVertical: 8,
    },
    description: {
        fontSize: 16,
        color: "#333",
        lineHeight: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        elevation: 2,
    },
    cancelButton: {
        backgroundColor: "#DC3545",
    },
    saveButton: {
        backgroundColor: "#28A745",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default memo(AnnouncementEdit);
