import AnalyticsCard from "@/app/analytics/AnalyticsCard";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import { fetchStudentAnalytics, getChildAnalytics } from "@/utils/analytics";
import useHeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

interface TotalPerDifficulty {
	phrase: {
		easy: number;
		average: number;
		difficulty: number;
		challenge: number;
	};
	picture: {
		easy: number;
		average: number;
		difficulty: number;
		challenge: number;
	};
	question: {
		easy: number;
		average: number;
		difficulty: number;
		challenge: number;
	};
	bingo: {
		easy: number;
		average: number;
		difficulty: number;
		challenge: number;
	};
	matching: {
		easy: number;
		average: number;
		difficulty: number;
		challenge: number;
	};
	fill: {
		easy: number;
		average: number;
		difficulty: number;
		challenge: number;
	};
	homonyms: {
		easy: number;
		average: number;
		difficulty: number;
		challenge: number;
	};
}

const StudentAnalytics = () => {
	const { studentId, role } = useLocalSearchParams<{
		studentId: string;
		role: string;
	}>();
	useHeaderConfig("Analytics");
	console.log(studentId);
	const [loading, setLoading] = useState<boolean>();
	const [data, setData] = useState<{
		sessions: number;
		active_today: boolean;
		overall_completion_rate: number;
		overall_average: number;
		average_score_quizzes: number;
		speech_completion_rate: number;
		auditory_completion_rate: number;
		language_completion_rate: number;
		total_score_per_difficulty: TotalPerDifficulty;
		failed_quizzes: number;
	}>();
	const [barchartData, setBarchartData] = useState<any[]>([]);

	useEffect(() => {
		setLoading(true);
		const fetchStudentData = async () => {
			const res =
				role === "parent"
					? await getChildAnalytics()
					: await fetchStudentAnalytics(studentId);

			if (res.success) {
				setData({
					sessions: res.sessions,
					active_today: res.active_today,
					overall_completion_rate: res.overall_completion_rate ?? 0,
					overall_average: res.overall_average ?? 0,
					average_score_quizzes: res.average_score_quizzes ?? 0,
					speech_completion_rate: res.speech_completion_rate ?? 0,
					auditory_completion_rate: res.auditory_completion_rate ?? 0,
					language_completion_rate: res.language_completion_rate ?? 0,
					total_score_per_difficulty: res.total_score_per_difficulty ?? {},
					failed_quizzes: res.failed_quizzes ?? 0,
				});

				const barData = Object.keys(res.weekdays_present_count).map((day) => {
					const shortDay = day.charAt(0).toUpperCase();
					return {
						label: shortDay,
						value: res.weekdays_present_count[day],
						frontColor:
							res.weekdays_present_count[day] > 0 ? "#2264dc" : "#FFBF18",
					};
				});

				setBarchartData(barData);
				console.log(barData);
			} else {
				console.log("Failed to fetch data");
			}
			setLoading(false);
		};

		fetchStudentData();
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
		<ScrollView style={{ paddingHorizontal: 20, backgroundColor: "#fff" }}>
			<View style={styles.headerContainer}>
				<View style={{ flexDirection: "column", width: "48%", rowGap: 10 }}>
					<View style={[styles.header, { backgroundColor: "#FFBF1926" }]}>
						<View style={styles.headerItem}>
							<MaterialIcons name="person" size={24} color="#FFBF19" />
						</View>
						<View>
							<Text style={globalStyles.text1}>
								{data?.active_today ? "Active" : "Inactive"}
							</Text>
							<Text style={globalStyles.label}>Active Today</Text>
						</View>
					</View>
					<View style={styles.header}>
						<View
							style={[
								styles.headerItem,
								{ backgroundColor: "#2264DC47", left: -10 },
							]}
						>
							<MaterialIcons
								name="av-timer"
								size={24}
								color="#2264DC"
								// style={{ left: 30 }}
							/>
						</View>
						<View style={{ left: -10 }}>
							<Text style={globalStyles.text1}>{data?.sessions}</Text>
							<Text style={globalStyles.label}>Sessions</Text>
						</View>
					</View>
				</View>

				<View style={{ flexDirection: "column", width: "48%", rowGap: 10 }}>
					<View style={[styles.header, { backgroundColor: "#55BC8E26" }]}>
						<View
							style={[
								styles.headerItem,
								{ backgroundColor: "#55BC8E47", left: 5 },
							]}
						>
							<Entypo name="check" size={20} color="#55BC8E" />
						</View>
						<View>
							<Text style={globalStyles.text1}>
								{data?.overall_completion_rate.toFixed(2)}%
							</Text>
							<Text style={globalStyles.label}>Completion Rate</Text>
						</View>
					</View>
					<View style={[styles.header, { backgroundColor: "#FF7A6726" }]}>
						<View style={[styles.headerItem, { backgroundColor: "#FF7A6747" }]}>
							<Ionicons name="book" size={20} color="#FF7A67" />
						</View>
						<View style={{ left: -5 }}>
							<Text style={globalStyles.text1}>
								{data?.overall_average.toFixed(2)}%
							</Text>
							<Text style={globalStyles.label}>Average Score</Text>
						</View>
					</View>
				</View>
			</View>
			<View>
				<AnalyticsCard
					data={data?.average_score_quizzes ?? 0}
					title={"Assignments"}
					percentage={data?.average_score_quizzes.toFixed(0).toString() ?? "0"}
				/>

				<AnalyticsCard
					data={data?.average_score_quizzes ?? 0}
					title={"Quizzes"}
					percentage={data?.average_score_quizzes.toString() ?? "0"}
				/>

				<AnalyticsCard
					data={data?.speech_completion_rate ?? 0}
					title={"Speech"}
					percentage={data?.speech_completion_rate.toString() ?? "0"}
				/>

				<AnalyticsCard
					data={data?.auditory_completion_rate ?? 0}
					title={"Auditory"}
					percentage={data?.auditory_completion_rate.toString() ?? "0"}
				/>
				<AnalyticsCard
					data={data?.language_completion_rate ?? 0}
					title={"Language"}
					percentage={data?.language_completion_rate.toString() ?? "0"}
				/>
			</View>
			<View
				style={{
					borderColor: "#ddd",
					borderWidth: 1,
					borderRadius: 20,
					marginVertical: 10,
				}}
			>
				<Text style={[globalStyles.text1, { margin: 10 }]}>
					Student Progress in Specialized Trainings
				</Text>
			</View>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginVertical: 10,
				}}
			>
				<View
					style={{
						width: "48%",
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderRadius: 20,
						height: 230,
						borderColor: "#ddd",
					}}
				>
					<Text style={[globalStyles.text1, { marginTop: 10, fontSize: 14 }]}>
						Assignment Result
					</Text>
					<View style={{ marginVertical: 20 }}>
						<PieChart
							data={[
								{
									value: data?.failed_quizzes
										? 100 - data?.failed_quizzes
										: 100,
									color: "#2264dc",
									text: data?.failed_quizzes
										? `${100 - data?.failed_quizzes}%`
										: "100",
								},
								{
									value: data?.failed_quizzes ?? 0,
									color: "#FFBF18",
									text: data?.failed_quizzes ? `${data?.failed_quizzes}%` : "0",
								},
							]}
							isAnimated
							radius={50}
							innerRadius={0}
							donut
							showText
							textColor="white"
							textSize={20}
							fontWeight="bold"
							textBackgroundRadius={22}
							showValuesAsLabels
						/>
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginLeft: -10,
							}}
						>
							<Entypo name="dot-single" size={35} color="#2264dc" />
							<Text
								style={[
									globalStyles.label,
									{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
								]}
							>
								Pass
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Entypo name="dot-single" size={35} color="#FFBF18" />
							<Text
								style={[
									globalStyles.label,
									{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
								]}
							>
								Fail
							</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						width: "48%",
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderRadius: 20,
						height: 230,
						borderColor: "#ddd",
						alignContent: "center",
					}}
				>
					<Text style={[globalStyles.text1, { fontSize: 14, marginTop: 10 }]}>
						Quizzes Result
					</Text>
					<View style={{ marginVertical: 20 }}>
						<PieChart
							data={[
								{
									value: data?.failed_quizzes
										? 100 - data?.failed_quizzes
										: 100,
									color: "#2264dc",
									text: data?.failed_quizzes
										? `${100 - data?.failed_quizzes}%`
										: "100",
								},
								{
									value: data?.failed_quizzes ?? 0,
									color: "#FFBF18",
									text: data?.failed_quizzes ? `${data?.failed_quizzes}%` : "0",
								},
							]}
							isAnimated
							radius={50}
							innerRadius={0}
							donut
							showText
							textColor="white"
							textSize={20}
							fontWeight="bold"
							textBackgroundRadius={22}
							showValuesAsLabels
						/>
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginLeft: -10,
							}}
						>
							<Entypo name="dot-single" size={35} color="#2264dc" />
							<Text
								style={[
									globalStyles.label,
									{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
								]}
							>
								Pass
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Entypo name="dot-single" size={35} color="#FFBF18" />
							<Text
								style={[
									globalStyles.label,
									{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
								]}
							>
								Fail
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginVertical: 10,
				}}
			>
				<View
					style={{
						width: "48%",
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderRadius: 20,
						height: 230,
						borderColor: "#ddd",
					}}
				>
					<Text
						style={[
							globalStyles.text1,
							{ marginBottom: 10, marginTop: 15, fontSize: 14 },
						]}
					>
						Submission Rate
					</Text>
					<View style={{ marginBottom: 8 }}>
						<PieChart
							data={[
								{
									value: data?.failed_quizzes
										? 100 - data?.failed_quizzes
										: 100,
									color: "#2264dc",
									text: data?.failed_quizzes
										? `${100 - data?.failed_quizzes}%`
										: "100",
								},
								{
									value: data?.failed_quizzes ?? 0,
									color: "#FFBF18",
									text: data?.failed_quizzes ? `${data?.failed_quizzes}%` : "0",
								},
							]}
							isAnimated
							radius={50}
							innerRadius={45}
							donut
							showText
							textColor="white"
							textSize={20}
							fontWeight="bold"
							textBackgroundRadius={22}
							showValuesAsLabels
						/>
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginLeft: -10,
								}}
							>
								<Entypo name="dot-single" size={35} color="#2264dc" />
								<Text
									style={[
										globalStyles.label,
										{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
									]}
								>
									On-time
								</Text>
								<Entypo name="dot-single" size={35} color="#f68d2b" />
								<Text
									style={[
										globalStyles.label,
										{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
									]}
								>
									Late
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginLeft: -10,
								}}
							></View>
						</View>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginTop: -10,
						}}
					>
						<Entypo name="dot-single" size={35} color="#FFBF18" />
						<Text
							style={[
								globalStyles.label,
								{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
							]}
						>
							Missing
						</Text>
					</View>
				</View>
				<View
					style={{
						width: "48%",
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 1,
						borderRadius: 20,
						height: 230,
						borderColor: "#ddd",
					}}
				>
					<Text
						style={[
							globalStyles.text1,
							{ marginBottom: 5, marginTop: 5, fontSize: 14 },
						]}
					>
						Attendance Overview
					</Text>
					<BarChart
						barWidth={5}
						noOfSections={5}
						barBorderRadius={5}
						frontColor="lightgray"
						data={barchartData}
						yAxisThickness={0}
						xAxisThickness={0}
						yAxisTextStyle={{ fontSize: 10 }}
						xAxisLength={50}
						height={100}
						width={110}
						xAxisLabelTextStyle={{ fontSize: 10 }}
					/>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginLeft: -10,
							}}
						>
							<Entypo name="dot-single" size={35} color="#2264dc" />
							<Text
								style={[
									globalStyles.label,
									{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
								]}
							>
								Passed
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Entypo name="dot-single" size={35} color="#FFBF18" />
							<Text
								style={[
									globalStyles.label,
									{ fontSize: 13, marginLeft: -10, fontWeight: 400 },
								]}
							>
								Failed
							</Text>
						</View>
					</View>
				</View>
			</View>
			<TouchableOpacity style={styles.exportButton}>
				<FontAwesome6 name="file-export" size={20} color="#439558" />
				<Text style={[globalStyles.text1, { color: "#439558" }]}>
					Export CSV
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	exportButton: {
		flexDirection: "row",
		borderColor: "#439558",
		borderRadius: 20,
		borderWidth: 3,
		borderStyle: "dashed",
		backgroundColor: "#43955826",
		width: "100%",
		height: 60,
		alignItems: "center",
		justifyContent: "center",
		columnGap: 10,
		marginBottom: 70,
		marginTop: 10,
	},
	lineChart: {
		color: "#1F1F1F80",
		fontSize: 15,
		marginLeft: 20,
	},
	lineChartContainer: {
		width: "100%",
		marginHorizontal: "auto",
		borderWidth: 1,
		borderRadius: 20,
		paddingVertical: 20,
		marginVertical: 10,
		backgroundColor: "#fff",
		borderColor: "#ddd",
	},
	overallContainer: {
		width: "48%",
		backgroundColor: "#fff",
		borderRadius: 20,
		alignItems: "center",
		height: 230,
		justifyContent: "center",
		rowGap: 10,
		borderColor: "#ddd",
		borderWidth: 1,
	},
	activitiesContainer: {
		width: "48%",
		backgroundColor: "#fff",
		borderRadius: 20,
		alignItems: "center",
		height: 230,
		justifyContent: "center",
		rowGap: 10,
		borderColor: "#ddd",
		borderWidth: 1,
	},
	activities: {
		alignItems: "center",
		justifyContent: "center",
		width: "48%",
		backgroundColor: "#55BC8E26",
		borderRadius: 20,
		height: 160,
	},
	header: {
		flexDirection: "row",
		backgroundColor: "#2264DC26",
		alignItems: "center",
		width: "100%",
		justifyContent: "center",
		borderRadius: 20,
		height: 75,
		columnGap: 15,
	},
	headerItem: {
		backgroundColor: "#FFBF1947",
		width: 35,
		height: 35,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 360,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 160,
		columnGap: 10,
		marginHorizontal: "auto",
		marginVertical: 10,
		marginTop: 20,
	},
});

export default StudentAnalytics;
