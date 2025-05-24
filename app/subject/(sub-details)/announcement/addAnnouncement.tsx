import FileUpload from "@/components/FileUpload";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getAnnouncementById } from "@/utils/query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface FileInfo {
	uri: string;
	name: string;
	mimeType?: string;
}

const addAnnouncement = () => {
	useHeaderConfig("Announcement");
	const router = useRouter();

	const { subjectId, announcementId } = useLocalSearchParams<{
		subjectId: string;
		announcementId: string;
	}>();

	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [descHeight, setDescHeight] = useState<number>(200);
	const [files, setFiles] = useState<FileInfo[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const handlePreview = () => {
		router.push({
			pathname: "/subject/(sub-details)/announcement/announcementPreview",
			params: {
				title,
				description,
				files: JSON.stringify(files),
				subjectId,
				announcementId,
			},
		});
	};

	const handleFileUpload = (files: FileInfo[]) => {
		setFiles(files);
	};

	useEffect(() => {
		if (!announcementId) return;

		setLoading(true);
		(async () => {
			try {
				const res = await getAnnouncementById(subjectId, announcementId);
				setTitle(res.assignment.title);
				setDescription(res.assignment.description);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		})();
	}, [subjectId, announcementId]);

	if (loading) {
		return (
			<View>
				<Text>Loading......</Text>
			</View>
		);
	}

	return (
		<View style={{ padding: 20, rowGap: 15 }}>
			<View style={[globalStyles.contentPadding, globalStyles.cardContainer]}>
				<View>
					<Text style={{ fontWeight: 500, marginVertical: 10, fontSize: 16 }}>
						Title
					</Text>
					<TextInput
						placeholder="Enter title"
						style={globalStyles.inputContainer}
						value={title}
						onChangeText={setTitle}
					/>
				</View>

				<View>
					<Text style={{ fontWeight: 500, marginVertical: 10, fontSize: 16 }}>
						Description
					</Text>
					<TextInput
						style={{
							height: 200,
							borderWidth: 1,
							borderColor: "#ddd",
							borderRadius: 10,
							padding: 10,
							fontSize: 16,
						}}
						placeholder="Enter description..."
						multiline={true}
						// onContentSizeChange={(e) =>
						// 	setDescHeight(e.nativeEvent.contentSize.height)
						// }
						textAlignVertical="top"
						value={description}
						onChangeText={setDescription}
					/>
				</View>

				{/* <View style={[globalStyles.cardContainer, globalStyles.cardBody]}> */}
				{/* <Text style={globalStyles.sectionHeader}>File Upload</Text> */}

				<View style={globalStyles.contentPadding}>
					{/* <View style={styles.fileContainer}>
						{/* <TouchableOpacity>
							<FontAwesome5
								name="upload"
								size={30}
								style={styles.upload}
								// onPress-={() => handleAddFile()}
							/>
						</TouchableOpacity> */}

					<View style={{ left: 100, top: 10 }}></View>
					{/* </View>  */}
					<FileUpload handleFiles={handleFileUpload} />

					<View style={styles.actionsRow}>
						{/* <TouchableOpacity
							style={[globalStyles.submitButton, { width: "48%" }]}
							onPress={() => router.back()}
						>
							<Text style={globalStyles.submitButtonText}>Cancel</Text>
						</TouchableOpacity> */}
					</View>
				</View>
				<TouchableOpacity
					style={[globalStyles.submitButton, { width: "100%", elevation: 5 }]}
					onPress={handlePreview}
				>
					<Text style={[globalStyles.submitButtonText, { fontWeight: "bold" }]}>
						Preview
					</Text>
				</TouchableOpacity>
				{/* </View> */}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	upload: {
		alignSelf: "center",
		top: 10,
		color: "#ddd",
	},
	fileContainer: {
		backgroundColor: "#f5f5f5",
		borderColor: "#ddd",
		borderWidth: 2,
		borderStyle: "dashed",
		height: 100,
		width: 300,
		alignSelf: "center",
	},
	// uploadHeader: {
	// 	width: "100%",
	// 	backgroundColor: "#434242",
	// 	paddingVertical: 9,
	// 	paddingHorizontal: 26,
	// },
	// uploadHeaderText: {
	// 	color: "#fff",
	// },
	// fileRow: {
	// 	flexDirection: "row",
	// 	alignItems: "center",
	// 	justifyContent: "space-between",
	// },
	fileUpload: {
		padding: 9,
		borderRadius: 15,
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.10)",
		backgroundColor: "#F4F4F4",
		elevation: 5,
		width: 100,
		alignItems: "center",
	},
	filename: {
		marginLeft: 10,
		flex: 1,
	},
	addFileRow: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: 12,
	},
	addFileText: {
		color: "#FFBF18",
	},
	actionsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
});

export default memo(addAnnouncement);
