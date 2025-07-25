import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getAnnouncementById } from "@/utils/query";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	Alert,
	Linking,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

interface Announcement {
	title: string;
	description: string;
	files: string[];
	links: string[];
	date_posted: string;
}

const AnnouncementDetails = () => {
	useHeaderConfig("Announcement");

	const { subjectId, announcementId } = useLocalSearchParams<{
		subjectId: string;
		announcementId: string;
	}>();

	const [announcement, setAnnouncement] = useState<Announcement | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const res = await getAnnouncementById(subjectId, announcementId);
				if (res.success) {
					setAnnouncement(res.announcement);
					console.log(announcement);
				} else {
					setError(res.error || "Failed to load announcement");
				}
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [subjectId, announcementId]);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#fff",
				}}
			>
				<LoadingCard></LoadingCard>
			</View>
		);
	}

	if (error || !announcement) {
		return (
			<View style={[globalStyles.container, styles.centered]}>
				<Text style={styles.errorText}>
					{error || "Announcement not available."}
				</Text>
			</View>
		);
	}

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<SafeAreaView
				style={{ backgroundColor: "#fff", flex: 1, paddingBottom: 400 }}
			>
				<View style={[globalStyles.container, { marginBottom: 50 }]}>
					<View
						style={[
							globalStyles.cardContainer,
							{
								flex: 1,
								borderColor: "#ddd",
								borderWidth: 1,
								borderRadius: 20,
							},
						]}
					>
						<Text style={[styles.label]}>{announcement.title}</Text>
						<Text style={[styles.text]}>{announcement.date_posted}</Text>
						<Text style={[styles.desc]}>{announcement.description}</Text>

						{announcement.links.length > 0 && (
							<>
								<Text
									style={[styles.label, { color: "#2264dc", marginTop: 16 }]}
								>
									Links
								</Text>
								{announcement.links.map((link, idx) => (
									<Text
										key={idx}
										style={[styles.text, styles.linkText]}
										onPress={() =>
											Linking.openURL(link).catch(() =>
												Alert.alert("Error", "Unable to open link.")
											)
										}
									>
										{link}
									</Text>
								))}
							</>
						)}

						{announcement.files.length > 0 && (
							<>
								<Text
									style={[
										styles.label,
										{
											color: "#000",
											fontStyle: "italic",
											marginTop: 16,
											fontWeight: 300,
											fontSize: 14,
										},
									]}
								>
									Attachments:
								</Text>
								{announcement.files.map((fileUrl, idx) => {
									const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
									return (
										<View key={idx} style={styles.attachment}>
											{isImage ? (
												<ExpoImage
													source={{ uri: fileUrl }}
													style={styles.image}
													contentFit="contain"
												/>
											) : (
												<TouchableOpacity
													onPress={() => Linking.openURL(fileUrl)}
												>
													<Text
														style={[styles.text, styles.fileText]}
														numberOfLines={1}
														ellipsizeMode="middle"
													>
														{fileUrl.split("/").pop()}
													</Text>
												</TouchableOpacity>
											)}
										</View>
									);
								})}
							</>
						)}
					</View>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	label: {
		fontWeight: "bold",
		fontSize: 18,
		marginTop: 10,
		color: "#000",
	},
	text: {
		marginTop: -4,
		fontSize: 14,
		color: "#aaa",
		fontWeight: 400,
	},
	desc: {
		marginVertical: 10,
		fontSize: 14,
		textAlign: "justify",
		lineHeight: 20,
		fontWeight: 300,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		fontSize: 16,
		color: "red",
	},
	linkText: {
		marginTop: 4,
		color: "#1d4ed8",
		textDecorationLine: "underline",
	},
	attachment: {
		marginBottom: 10,
		fontSize: 14,
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
	},
	fileText: {
		fontSize: 14,
		color: "#555",
		marginTop: 4,
	},
	buttonWrapper: {
		marginTop: 24,
		alignItems: "center",
	},
});

export default memo(AnnouncementDetails);
