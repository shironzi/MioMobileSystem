import LoadingCard from "@/components/loadingCard";
import NoNotif from "@/components/noData/noNotif";
import NotificationCard from "@/components/NotificationCard";
import globalStyles from "@/styles/globalStyles";
import getCurrentDateTime, {
	getFormattedTimeFromDateString,
} from "@/utils/DateFormat";
import { dismissNotification, getNotifications } from "@/utils/notification";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import messaging from "@react-native-firebase/messaging";
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Pressable,
	SafeAreaView,
	SectionList,
	StyleSheet,
	Text,
	View,
} from "react-native";

type Notification = {
	notification_id: string;
	title: string;
	body: string;
	date: string;
	subject_id: string;
	announcement_id: string;
	type: "announcement" | "emergency" | "assignment" | "achievement";
	time?: string;
};

const Notification = () => {
	const [expandedSections, setExpandedSections] = useState(new Set<string>());
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [mount, setMount] = useState<boolean>(false);
	const openSwipeableRef = useRef<number | null>(null);

	const deleteNotification = useCallback(async (id: string) => {
		openSwipeableRef.current = null;

		const res = await dismissNotification(id);

		if (res.success) {
			console.log(res.message);
		}

		setTimeout(() => {
			setNotifications((prev) =>
				prev.filter((item) => item.notification_id !== id)
			);
		}, 100);
	}, []);

	const now = getCurrentDateTime();
	const filteredData = useMemo(
		() => notifications.filter((item) => now > item.date),
		[notifications, now]
	);

	const sections = Object.values(
		filteredData.reduce(
			(acc, item) => {
				const dateStr = new Date(item.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});
				if (!acc[dateStr]) {
					acc[dateStr] = { date: dateStr, data: [] };
				}
				acc[dateStr].data.push(item);
				return acc;
			},
			{} as Record<string, { date: string; data: typeof filteredData }>
		)
	).filter((section) => section.data.length > 0);

	const handleToggle = (date: string) => {
		setExpandedSections((prev) => {
			const next = new Set(prev);
			if (next.has(date)) {
				next.delete(date);
			} else {
				next.add(date);
			}
			return next;
		});
	};

	const fetchAnnouncements = async () => {
		const res = await getNotifications();

		if (res.success) {
			setNotifications(res.notifications);
			setExpandedSections(new Set());

			const sorted = res.notifications
				.filter((item: any) => getCurrentDateTime() > item.date)
				.sort(
					(
						a: { date: string | number | Date },
						b: { date: string | number | Date }
					) => new Date(a.date).getTime() - new Date(b.date).getTime()
				);

			if (sorted.length > 0) {
				const firstDate = new Date(sorted[0].date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});

				setExpandedSections(new Set([firstDate]));
			}
		}
	};

	useEffect(() => {
		if (!mount) {
			fetchAnnouncements();
			setMount(true);
		}

		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			const type = remoteMessage.data?.type;

			if (type === "notification") {
				await fetchAnnouncements();
			}
		});

		setLoading(false);

		return () => unsubscribe();
	}, []);

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

	return (
		<SafeAreaView style={styles.container}>
			{sections.length === 0 ? (
				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<NoNotif />
				</View>
			) : (
				<SectionList
					sections={sections}
					extraData={[expandedSections, notifications]}
					keyExtractor={(item) => item.notification_id}
					renderItem={({ section, item }) => {
						const isExpanded = expandedSections.has(section.date);
						if (!isExpanded) return null;
						return (
							<NotificationCard
								key={item.notification_id}
								title={item.title}
								desc={item.body}
								time={getFormattedTimeFromDateString(item.date)}
								type={item.type}
								handleDelete={() => deleteNotification(item.notification_id)}
							/>
						);
					}}
					renderSectionHeader={({ section: { date } }) => {
						const isExpanded = expandedSections.has(date);
						return (
							<Pressable onPress={() => handleToggle(date)}>
								<View style={styles.header}>
									<Text style={globalStyles.text1}>{date}</Text>
									{isExpanded ? (
										<MaterialIcons
											name="arrow-drop-up"
											size={30}
											color="#FFBF18"
										/>
									) : (
										<MaterialIcons
											name="arrow-drop-down"
											size={30}
											color="#FFBF18"
										/>
									)}
								</View>
							</Pressable>
						);
					}}
				/>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		fontSize: 16,
		padding: 10,
		display: "flex",
		flexDirection: "row",
		width: "100%",
		paddingHorizontal: 20,
		justifyContent: "space-between",
		backgroundColor: "white",
		marginHorizontal: "auto",
	},
});

export default memo(Notification);
