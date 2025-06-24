import globalStyles from "@/styles/globalStyles";
import { Image, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const AnalyticsCard = ({
	data,
	title,
	percentage,
}: {
	data: number;
	title: string;
	percentage: string;
}) => {
	return (
		<View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					backgroundColor: "#fff",
					paddingHorizontal: 19,
					paddingVertical: 17,
					borderRadius: 20,
					borderColor: "#ddd",
					borderWidth: 1,
					marginVertical: 10,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						columnGap: 15,
					}}
				>
					{title === "Assignments" && (
						<Image
							source={require("@/assets/course/ass.png")}
							resizeMode={"contain"}
							style={{ width: 47, height: 47 }}
						/>
					)}

					{title === "Quizzes" && (
						<Image
							source={require("@/assets/course/qz.png")}
							resizeMode={"contain"}
							style={{ width: 47, height: 47 }}
						/>
					)}

					{title === "Speech" && (
						<Image
							source={require("@/assets/course/speech_icon.png")}
							resizeMode={"contain"}
							style={{ width: 47, height: 47 }}
						/>
					)}

					{title === "Auditory" && (
						<Image
							source={require("@/assets/course/auditory_icon.png")}
							resizeMode={"contain"}
							style={{ width: 47, height: 47 }}
						/>
					)}

					{title === "Language" && (
						<Image
							source={require("@/assets/course/language_icon.png")}
							resizeMode={"contain"}
							style={{ width: 47, height: 47 }}
						/>
					)}
					<View>
						<Text style={globalStyles.text1}>{title}</Text>
						<Text style={globalStyles.label}>Average</Text>
					</View>
				</View>
				<PieChart
					donut
					innerRadius={23}
					radius={28}
					data={[
						{ value: data, color: "#2264DC" },
						{ value: 100 - data, color: "#D9D9D9" },
					]}
					centerLabelComponent={() => {
						return (
							<Text style={[globalStyles.text1, { fontSize: 10 }]}>
								{percentage}%
							</Text>
						);
					}}
				/>
			</View>
		</View>
	);
};

export default AnalyticsCard;
