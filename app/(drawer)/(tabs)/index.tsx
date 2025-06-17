import CourseCard from "@/components/CourseCard";
import LoadingCard from "@/components/loadingCard";
import { CourseCardViewContext } from "@/contexts/CourseCardViewContext";
import globalStyles from "@/styles/globalStyles";
import { getSubjects } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
const data = [
	{ label: "All Subjects", value: "all" },
	{ label: "Academic Subjects", value: "academic" },
	{ label: "Specialized Subjects", value: "specialized" },
	{ label: "Previous Subjects", value: "previous" },
];
const name = "Ava";
const feedback =
	"Piddie says Try emphasizing the ‘x’ sound a bit more for clearer pronunciation.";

type Subject = {
	title: string;
	section: string;
	subject_id: string;
	description: string;
	subjectType: string;
	specialized_type: string | null;
};

const index = () => {
	const [selectedValue, setSelectedValue] = useState("all");
	const { courseCardView } = useContext(CourseCardViewContext);
	const [subjects, setSubjects] = useState<Subject[] | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchSubjects() {
			try {
				const data = await getSubjects();
				setSubjects(data.subjects);
				setRole(data.role);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching subjects: ", err);
				useAuthGuard(err);
			}
		}
		fetchSubjects();
	}, []);

	const filteredSubjects = useMemo<Subject[] | null>(() => {
		if (!subjects) return [];
		switch (selectedValue) {
			case "academic":
			case "specialized":
				return subjects.filter(
					(s) =>
						s.specialized_type === "auditory" ||
						s.specialized_type === "language" ||
						s.specialized_type === "speech"
				);

			case "previous":
				return null;

			case "all":
			default:
				return subjects;
		}
	}, [subjects, selectedValue]);

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
				{/* <ActivityIndicator size="large" color="#007bff" />
				<Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
					Loading...
				</Text> */}
			</View>
		);
	}

	return (
		<View style={globalStyles.container}>
      <View style={styles.headerName}>
        <View style={styles.yellow}></View>
					<Text styles={styles.name}>Welcome back, {name}</Text>
				</View>
			<View style={styles.courseContainer}>
				<Text style={styles.courseTitle}>Subjects</Text>
				<View style={styles.dropdownContainer}>
					{/*<Dropdown*/}
					{/*    style={styles.dropdown}*/}
					{/*    selectedTextStyle={styles.selectedTextStyle}*/}
					{/*    renderRightIcon={(isOpened) => (*/}
					{/*        <MaterialIcons*/}
					{/*            name={isOpened ? "keyboard-arrow-up" : "keyboard-arrow-down"}*/}
					{/*            style={styles.iconStyle}*/}
					{/*        />*/}
					{/*    )}*/}
					{/*    data={data}*/}
					{/*    value={selectedValue}*/}
					{/*    labelField="label"*/}
					{/*    valueField="value"*/}
					{/*    onChange={(item) => {*/}
					{/*        setSelectedValue(item.value);*/}
					{/*    }}*/}
					{/*/>*/}
				</View>
			</View>
			<ScrollView
				contentContainerStyle={[courseCardView ? styles.gridContainer : null]}
			>
				
				{filteredSubjects ? (
					filteredSubjects.map((subject: Subject) => {
						if (subject.subjectType === selectedValue) {
							return (
								<View
									key={subject.subject_id}
									style={courseCardView ? styles.gridItem : null}
								>
									<CourseCard
										courseTitle={subject.title}
										courseSection={subject.section}
										courseId={subject.subject_id}
										description={subject.description}
										subjectType={subject.subjectType}
										specializedType={subject.specialized_type}
										courseImage={require("@/assets/images/dashImage/language.png")}
										role={role}
									/>
									<Text>{courseCardView}</Text>
								</View>
							);
						}
						return (
							<View
								key={subject.subject_id}
								style={courseCardView ? styles.gridItem : null}
							>
								<CourseCard
									courseTitle={subject.title}
									courseSection={subject.section}
									courseId={subject.subject_id}
									description={subject.description}
									subjectType={subject.subjectType}
									specializedType={subject.specialized_type}
									courseImage={require("@/assets/images/dashImage/language.png")}
									role={role}
								/>
								<Text>{courseCardView}</Text>
							</View>
						);
					})
				) : (
					<View>
						<Text>No {selectedValue} subjects available.</Text>
					</View>
				)}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	headerName: {
		margin: 10,
    top:-5,
		// backgroundColor: "#000",
    borderColor:"#ddd",
    borderWidth:1,
    borderRadius:20,
		// height: 100,
	},
  yellow:{
    backgroundColor:"#ffbf18",
    height:50,
    width:"2%",
    marginVertical:18,
    marginHorizontal:15,
    borderRadius:10,

  },
  name:{
    fontSize:16,
    margin: 10,
    fontWeight:500,
    top:-30,
    color:"#2264dc",
  },
	feedContainer: {
		width: "85%",
		backgroundColor: "#fff",
		paddingVertical: 20,
		padding: 10,
		margin: 10,
		borderRadius: 20,
		alignSelf: "center",
		elevation: 5,
		marginRight: 10,
	},
	courseContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	courseTitle: {
		fontSize: 20,
		// color: "#ffbf18",
	},
	dropdownContainer: {
		width: 200,
	},
	dropdown: {
		flexDirection: "row-reverse",
		alignItems: "center",
		paddingHorizontal: 5,
		paddingVertical: 8,
	},
	selectedTextStyle: {
		color: "#FFBF18",
		fontSize: 14,
		textAlign: "right",
		flex: 1,
	},
	iconStyle: {
		fontSize: 20,
		color: "#FFBF18",
	},
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingBottom: 20,
	},
	gridItem: {
		width: "50%",
		justifyContent: "center",
	},
});

export default memo(index);
