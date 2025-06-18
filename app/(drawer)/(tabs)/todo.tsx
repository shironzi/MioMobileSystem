import NoTodo from "@/components/noData/noTodo";
import TodoCard from "@/components/todoCard";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

enum todoType {
	academic = "academic",
	specialized = "specialized",
}

// const data = [
// 	{
// 		id: 1,
// 		title: "Math",
// 		sub: "Task 1",
// 		date: "2025-04-23",
// 		time: "10:00 AM",
// 		type: "Not Submitted",
// 		category: todoType.academic,
// 	},
// 	{
// 		id: 2,
// 		title: "Speech Development",
// 		sub: "Picture Flashcards",
// 		date: "2025-04-23",
// 		time: "10:00 AM",
// 		type: "Not Submitted",
// 		category: todoType.specialized,
// 	},
// 	{
// 		id: 3,
// 		title: "Science",
// 		sub: "Assignment 1",
// 		date: "2025-04-23",
// 		time: "10:00 AM",
// 		type: "Not Submitted",
// 		category: todoType.academic,
// 	},
// 	{
// 		id: 4,
// 		title: "Speech Development",
// 		sub: "Picture Flashcards",
// 		date: "2025-04-23",
// 		time: "10:00 AM",
// 		type: "Submitted",
// 		category: todoType.specialized,
// 	},
// 	{
// 		id: 5,
// 		title: "English",
// 		sub: "Activity 1",
// 		date: "2025-04-23",
// 		time: "10:00 AM",
// 		type: "Submitted",
// 		category: todoType.academic,
// 	},
// 	{
// 		id: 6,
// 		title: "English",
// 		sub: "Activity 1",
// 		date: "2025-04-23",
// 		time: "10:00 AM",
// 		type: "Submitted",
// 		category: todoType.academic,
// 	},
// ];

const data: any[] = [];

const Todo = () => {
	const [selectedCategory, setSelectedCategory] = useState<todoType | "all">(
		"all"
	);
	const [dropdownVisible, setDropdownVisible] = useState(false);

	const filteredData = useMemo(() => {
		return selectedCategory === "all"
			? data
			: data.filter((item) => item.category === selectedCategory);
	}, [selectedCategory]);

	const handleSelect = useCallback((value: todoType | "all") => {
		setSelectedCategory(value);
		setDropdownVisible(false);
	}, []);

	return (
		<View style={styles.container}>
			{filteredData.length > 0 && (
				<>
					<Text style={styles.act}>Tasks</Text>
					<TouchableOpacity
						style={styles.dropdownHeader}
						onPress={() => setDropdownVisible(!dropdownVisible)}
					>
						<Text style={styles.dropdownLabel}>
							{selectedCategory === "all"
								? "All"
								: selectedCategory === todoType.academic
									? "Academic"
									: "Specialized"}
						</Text>
						<MaterialIcon
							name={
								dropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"
							}
							size={24}
							color="#FFBF18"
							style={{ marginLeft: 5, marginRight: 5, marginTop: 5 }}
						/>
					</TouchableOpacity>
				</>
			)}

			{filteredData.length > 0 && (
				<Modal transparent visible={dropdownVisible} animationType="fade">
					<TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
						<View style={styles.modalOverlay} />
					</TouchableWithoutFeedback>
					<View style={styles.dropdownBox}>
						{["all", todoType.academic, todoType.specialized].map(
							(type, index) => (
								<TouchableOpacity
									key={type}
									onPress={() => handleSelect(type as todoType | "all")}
								>
									<View style={styles.dropdownItem}>
										<Text
											style={[
												styles.dropdownItemText,
												selectedCategory === type && {
													color: "#FFBF18",
													fontWeight: "bold",
												},
											]}
										>
											{type === "all"
												? "All"
												: type === todoType.academic
													? "Academic"
													: "Specialized"}
										</Text>
										{index < 2 && <View style={styles.divider} />}
									</View>
								</TouchableOpacity>
							)
						)}
					</View>
				</Modal>
			)}
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => {
					// router.push("addTodo")
					console.log("add todo");
				}}
			>
				<View
					style={{
						top: 20,
						alignSelf: "center",
						flexDirection: "row",
					}}
				>
					<Ionicons name="add-circle" size={20} color="#ffbf18" />
					<Text style={styles.addText}>Add To Do</Text>
				</View>
			</TouchableOpacity>

			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				{filteredData.length === 0 ? (
					<NoTodo />
				) : (
					filteredData.map((item, idx) => (
						<React.Fragment key={item.id}>
							<TodoCard
								title={item.title}
								sub={item.sub}
								date={item.date}
								time={item.time}
								type={item.type}
							/>
							{idx < filteredData.length - 1 && (
								<View
									style={{
										height: 1,
										backgroundColor: "#ddd",
										marginTop: -10,
										marginHorizontal: 0,
									}}
								/>
							)}
						</React.Fragment>
					))
				)}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		// padding: 10,
		// margin: -20,
	},
	act: {
		fontSize: 16,
		fontWeight: "500",
		margin: 15,
		left: 10,
		marginTop: 105,
	},
	dropdownHeader: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-end",
		marginBottom: -25,
		top: -45,
		left: -20,
	},
	dropdownLabel: {
		fontSize: 16,
		color: "#FFBF18",
		marginTop: 5,
		left: -5,
	},
	modalOverlay: {},
	dropdownBox: {
		position: "absolute",
		right: 25,
		top: 205,
		backgroundColor: "#3267e3",
		borderRadius: 10,
		paddingVertical: 10,
		width: 140,
		elevation: 5,
	},
	dropdownItem: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	dropdownItemText: {
		fontSize: 16,
		color: "#fff",
		left: 5,
	},
	divider: {
		borderBottomColor: "#ffffff99",
		borderBottomWidth: 1,
		marginTop: 10,
	},
	scrollContainer: {
		padding: 10,
		rowGap: 15,
	},
	addButton: {
		position: "absolute",
		left: -8,
		width: "88%",
		backgroundColor: "#fcefcc",
		borderColor: "#ffbf18",
		borderWidth: 2,
		borderRadius: 20,
		borderStyle: "dashed",
		margin: 30,
		top: -10,
		bottom: 0,
		height: 60,
	},
	addText: {
		color: "#ffbf18",
		fontWeight: 500,
		marginHorizontal: 10,
	},
});

export default memo(Todo);
