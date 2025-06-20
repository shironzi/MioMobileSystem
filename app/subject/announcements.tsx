import AnnounceCard from "@/components/AnnounceCard";
import LoadingCard from "@/components/loadingCard";

import ConfirmationModal from "@/components/ConfirmationModal";
import HeaderConfig from "@/utils/HeaderConfig";
import { deleteAnnouncements, getAnnouncements } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Announcement = {
	title: string;
	description: string;
	subject_id: string;
	date_posted: string;
	announcement_id: string;
};

function Announcements() {
	HeaderConfig("Announcements");
	const router = useRouter();

	const { subjectId, role } = useLocalSearchParams<{
		subjectId: string;
		role: string;
	}>();

	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
	const [targetAnnouncement, setTargetAnnouncement] = useState<string | null>(
		null
	);

	useFocusEffect(
		useCallback(() => {
			let isActive = true;

			const fetchAnnouncements = async () => {
				try {
					const response = await getAnnouncements(subjectId);
					if (isActive) {
						setAnnouncements(response.announcements);
					}
				} catch (err) {
					useAuthGuard(err);
				} finally {
					if (isActive) {
						setLoading(false);
					}
				}
			};

			fetchAnnouncements();

			return () => {
				isActive = false;
			};
		}, [subjectId])
	);

	const handleAdd = () => {
		router.push({
			pathname: "/subject/(sub-details)/announcement/addAnnouncement",
			params: { subjectId },
		});
	};

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

	const handleDelete = async () => {
		if (targetAnnouncement === null) return;

		try {
			const res = await deleteAnnouncements(subjectId, targetAnnouncement);

			console.log(res);
			setDeleteConfirm(false);
			setTargetAnnouncement(null);
		} catch (err) {
			console.error("Deleting error: " + err);
		}
	};

	return (
		<View style={styles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 50 }}
			>
				{announcements.length > 0 ? (
					<View style={{ rowGap: 15 }}>
						{announcements.map((item, index) => (
							<GestureHandlerRootView key={index}>
								<AnnounceCard
									subjectId={subjectId}
									title={item.title}
									date={item.date_posted}
									time="09:00 AM"
									description={item.description}
									announcementId={item.announcement_id}
									role={role}
									handleDelete={() => {
										setDeleteConfirm(true);
										setTargetAnnouncement(item.announcement_id);
									}}
								/>
							</GestureHandlerRootView>
						))}
					</View>
				) : (
					<View>
						<Text>This subject has no announcements yet.</Text>
					</View>
				)}
			</ScrollView>

			<ConfirmationModal
				isVisible={deleteConfirm}
				description={"Are you sure you want to delete this announcement?"}
				cancelDisplay={"Cancel"}
				approveDisplay={"Delete"}
				handleCancel={() => setDeleteConfirm(false)}
				handleApprove={() => handleDelete()}
			/>

			{role === "teacher" && (
				<TouchableOpacity style={styles.addButton} onPress={handleAdd}>
					<MaterialIcon name="add" size={30} color="#fff" />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 20,
		backgroundColor: "#fff",
	},
	addButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#2264DC",
		height: 60,
		width: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
});

export default memo(Announcements);
