import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { createAnnouncement, editAnnouncement } from "@/utils/query";
import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

interface FileInfo {
	uri: string;
	name: string;
	mimeType?: string;
}

const AnnouncementPreview = () => {
	useHeaderConfig("Announcement Preview");

	const router = useRouter();

	const { title, description, files, subjectId, announcementId } =
		useLocalSearchParams<{
			title: string;
			description: string;
			files?: string;
			subjectId: string;
			announcementId: string;
		}>();

	const fileList: FileInfo[] = files ? JSON.parse(files) : [];

	const [localUris, setLocalUris] = useState<string[]>([]);

	const handleCreateAnnouncement = async () => {
		let isSuccess = false;
		if (announcementId !== null) {
			try {
				const res = await editAnnouncement(
					subjectId,
					title,
					description,
					announcementId
				);

				isSuccess = res.success;

				console.log(res);
			} catch (err) {
				console.error(err);
			}
		} else {
			try {
				const res = await createAnnouncement(subjectId, title, description);
				isSuccess = res.success;

				console.log(res);
			} catch (err) {
				console.error(err);
			}
		}

		if (!isSuccess) return;

		router.back();
		router.back();
	};

	useEffect(() => {
		(async () => {
			const uris = await Promise.all(
				fileList.map(async (file) => {
					try {
						const cached = await ExpoImage.getCachePathAsync(file.uri);
						return cached ?? file.uri;
					} catch {
						return file.uri;
					}
				})
			);
			setLocalUris(uris);
		})();
	}, [fileList]);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={[styles.label, { color: "#2264dc" }]}>Title</Text>
			<Text style={[styles.text, { top: 5 }]}>{title}</Text>

			<Text style={[styles.label, { color: "#2264dc", top: 5 }]}>
				Description
			</Text>
			<Text style={[styles.text, { top: 10 }]}>{description}</Text>

			{fileList.length > 0 && (
				<Text style={[styles.label, { color: "#2264dc", top: 10 }]}>
					Attachments
				</Text>
			)}

			{fileList.map((file, idx) => {
				const localUri = localUris[idx];
				const isImage = file.mimeType?.startsWith("image/");
				return (
					<View key={idx} style={styles.attachment}>
						{isImage && localUri ? (
							<ExpoImage
								source={localUri}
								style={styles.image}
								contentFit="contain"
							/>
						) : (
							<Text style={[styles.text]}>{file.name}</Text>
						)}
					</View>
				);
			})}
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					top: 10,
					marginTop: 20,
					// marginBottom: 20,
				}}
			>
				<TouchableOpacity
					style={[
						globalStyles.submitButton,
						{
							width: "49%",
							borderWidth: 1,
							borderColor: "#ffbf18",
							backgroundColor: "#fff",
							elevation: 5,
							// // padding: 10,
							// paddingVertical: 10,
							// borderRadius: 40,
						},
					]}
					onPress={() => router.back()}
				>
					<Text
						style={[
							globalStyles.submitButtonText,
							{ color: "#ffbf18", fontSize: 16 },
						]}
					>
						Cancel
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[globalStyles.submitButton, { width: "49%", elevation: 5 }]}
					onPress={handleCreateAnnouncement}
				>
					<Text style={globalStyles.submitButtonText}>Save</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#fff",
		margin: 20,
		borderRadius: 10,
		elevation: 5,
	},
	label: {
		fontWeight: 600,
		marginTop: 12,
		fontSize: 18,
	},
	text: {
		marginTop: 4,
		fontSize: 16,
		color: "#333",
	},
	attachment: {
		marginTop: 12,
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
	},
	fileName: {
		fontSize: 14,
		color: "#555",
	},
});

export default memo(AnnouncementPreview);
