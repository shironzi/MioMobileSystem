import AnswerQuizCard from "@/components/AnswerQuizCard";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import useHeaderConfig from "@/utils/HeaderConfig";
import { getQuizById } from "@/utils/query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface InputErrorState {
	deadline: boolean;
	availabilityFrom: boolean;
	availabilityTo: boolean;
	attempt: boolean;
	title: boolean;
	description: boolean;
}

const QuizDetails = () => {
	useHeaderConfig("Quiz");
	const router = useRouter();

	const { subjectId, quizId } = useLocalSearchParams<{
		subjectId: string;
		quizId: string;
	}>();

	const [loading, setLoading] = useState<boolean>(false);
	const [title, setTitle] = useState<string>();
	const [deadline, setDeadline] = useState<string>();
	const [points, setPoints] = useState<number>();
	const [availability, setAvailability] = useState<string>();
	const [attempts, setAttempts] = useState<number>();
	const [description, setDescription] = useState<string>();
	const [questions, setQuestions] =
		useState<
			{ question: string; options: string[]; answer: string; type: string }[]
		>();

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

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const res = await getQuizById(subjectId, quizId);
				const data = res.quiz;
				setTitle(data.title);
				setDeadline(data.deadline);
				setPoints(data.total);
				setAttempts(data.attempts);
				setDescription(data.description);

				setQuestions(
					data.questions.map(
						(item: {
							question: string;
							options: string[];
							answer: string;
							type: string;
						}) => ({
							question: item.question,
							options: item.options,
							answer: item.answer,
							type: item.type,
						})
					)
				);
			} catch (err) {
				console.error("Fetch Quiz Error: " + err);
			}
		};

		fetchQuiz();
	});

	return (
		<ScrollView style={globalStyles.container}>
			<View style={{ rowGap: 15 }}>
				<View style={globalStyles.cardContainer}>
					<Text>title {title}</Text>
					<View>
						<Text>Deadline {deadline}</Text>
						<Text>Points {points}</Text>
					</View>
					<Text>Availability {availability}</Text>
					<Text>Attempts {attempts}</Text>
				</View>

				<View style={globalStyles.cardContainer}>
					<Text>Quiz Description</Text>
					<Text>{description}</Text>
				</View>

				<View>
					{questions?.map((item, index) => (
						<View style={globalStyles.cardContainer}>
							<AnswerQuizCard
								key={index}
								question={item.question}
								choices={item.options}
								type={item.type}
								questionNum={index}
							/>
						</View>
					))}
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	separator: {
		height: 3,
		backgroundColor: "#f0f0f0",
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	dropdown: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		padding: 12,
		borderRadius: 10,
		backgroundColor: "#f9f9f9",
		width: "55%",
	},
	dropdownButton: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#f9f9f9",
		width: "55%",
	},
	dropdownList: {
		position: "absolute",
		top: 75,
		left: 161,
		width: "55%",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		backgroundColor: "#fff",
		zIndex: 999,
	},
	dropdownItem: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
});

export default memo(QuizDetails);
