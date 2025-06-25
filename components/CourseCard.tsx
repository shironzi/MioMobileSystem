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
	specializedType: string | null;
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
						specializedType: props.specializedType,
					},
				})
			}
		>
			<View
				style={{
					height: 190,
					borderRadius: 10,
					backgroundColor: "#fff",
					marginHorizontal: 5,
					marginVertical: 10,
					elevation: 5,
					marginTop: 10,
					// paddingVertical: 10,
					marginBottom: -15,
				}}
			>
				<View>
					<Image
						source={props.courseImage}
						resizeMode="cover"
						style={{
							width: "100%",
							// height: "50%",
							// height: 100,
							borderRadius: 10,
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
							// marginTop: -5,
						}}
					/>
				</View>
				<View>
					<MaterialIcons
						name="circle"
						color="#ffbf18"
						size={12}
						style={{ left: 13, top: 10 }}
					></MaterialIcons>
					<Text
						style={{
							color: "#333",
							fontWeight: 500,
							fontSize: 16,
							marginTop: -8,
							marginLeft: 35,
							marginBottom: 2,
							textTransform: "capitalize",
						}}
					>
						{props.courseTitle}
					</Text>
				</View>

				<Text
					style={{
						color: "#333",
						marginLeft: 35,
						marginBottom: 10,
						fontWeight: 300,
					}}
				>
					{props.courseSection}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export default memo(CourseCard);
