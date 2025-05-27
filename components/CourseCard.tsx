import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CourseCard = (props: {
	courseTitle: string;
	courseSection: string;
	courseId: string;
	courseImage: any;
	description: string;
	subjectType: string;
	role: string | null;
}) => {
	const router = useRouter();

	return (
		<TouchableOpacity
			activeOpacity={0.9}
			onPress={() =>
				router.push({
					pathname: "/subject/courseDetails",
					params: {
						id: props.courseId,
						description: props.description,
						title: props.courseTitle,
						subjectType: props.subjectType,
						role: props.role,
					},
				})
			}
		>
			<View
				style={{
					borderRadius: 10,
					backgroundColor: "#fff",
					marginHorizontal: 5,
					marginVertical: 10,
					elevation: 5,
					marginTop: 10,
					padding: 0,
					marginBottom: -15,
				}}
			>
				<View>
					<Image
						source={props.courseImage}
						style={{
							width: "100%",
							borderRadius: 10,
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
						}}
					/>
				</View>
				<MaterialIcons
					name="circle"
					color="#ffbf18"
					size={12}
					style={{ left: 13, top: 10 }}
				></MaterialIcons>
				<Text
					style={{
						color: "#333",
						fontWeight: "bold",
						fontSize: 16,
						marginTop: -8,
						marginLeft: 35,
						marginBottom: 2,
					}}
				>
					{props.courseTitle}
				</Text>
				<Text style={{ color: "#666", marginLeft: 35, marginBottom: 10 }}>
					{props.courseSection}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export default memo(CourseCard);
