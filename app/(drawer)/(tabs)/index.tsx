import CourseCard from "@/components/CourseCard";
import LoadingCard from "@/components/loadingCard";
import { CourseCardViewContext } from "@/contexts/CourseCardViewContext";
import globalStyles from "@/styles/globalStyles";
import { getSubjects } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
const data = [
	{ label: "All", value: "all" },
	{ label: "Academic", value: "academic" },
	{ label: "Specialized", value: "specialized" },
	{ label: "Previous", value: "previous" },
];

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("All Subjects");

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
			</View>
		);
	}

	return (
		<ScrollView 
    showsVerticalScrollIndicator={false}
    style={[globalStyles.container]}>
      <View style={styles.headerName}>
        <View style={{flexDirection:"row"}}>
        <View style={styles.yellow}>
        </View>
					<Text style={styles.greet}>Welcome back, Ava!</Text>
				</View>
        <Text style={styles.banner}>Helping deaf children develop communication skills and confidence for a brighter future.</Text>
      </View>
      <View style={[styles.headerName, {top:-10}]}>
        <View style={{flexDirection:"row"}}>
        <View style={styles.yellow}>
        </View>
					<Text style={styles.greet}>School Year 2024 - 2025</Text>
				</View>
        <Text style={styles.banner}>June 2024 - March 2025 {"\n"}3rd Quarter</Text>
      </View>
			<View style={styles.courseContainer}>
				<Text style={styles.courseTitle}>Subjects</Text>
				<TouchableOpacity
          onPress={() => setShowDropdown(true)}
          style={styles.dropdownTrigger}
        >
          <Text style={styles.selectedText}>{selectedLabel}</Text>
          <MaterialIcons
            name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            style={styles.iconStyle}
          />
        </TouchableOpacity>

			</View>
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownModal}>
          {data.map((item, index) => (
            <React.Fragment key={item.value}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedValue(item.value);
                  setSelectedLabel(item.label);
                  setShowDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    item.value === selectedValue && { color: "#FFBF18", fontWeight: "600" },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
              {index < data.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
          </View>
        </TouchableOpacity>
      </Modal>
			<ScrollView
        showsVerticalScrollIndicator={false}
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
								style={[courseCardView ? styles.gridItem : null]}
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
					<View style={{flex:1}}>
						<Text style={{marginVertical:20, left:10}}>No {selectedValue} subjects available.</Text>
					</View>
				)}
			</ScrollView>
      <View style={{paddingBottom:50}}>
        <Text style={styles.courseTitle}>Badges</Text>
      </View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	headerName: {
    alignSelf:"center",
		marginVertical: 10,
    marginHorizontal:10,
    left:-3,
    width:340,
    top:-5,
    borderColor:"#ddd",
    borderWidth:1,
    borderRadius:20,
    paddingVertical:5
	},
  yellow:{
    backgroundColor:"#ffbf18",
    height:55,
    width:"2%",
    marginVertical:10,
    marginHorizontal:15,
    borderRadius:10,
  },
  greet:{
    textAlign:"center",
    fontSize:16,
    fontWeight:500,
    marginVertical:10,
  },
  banner:{
    marginHorizontal:20,
    textAlign:"justify",
    marginLeft:40,
    fontSize:12,
    marginTop:-40,
    marginVertical:10,
    lineHeight:15,
    fontWeight:300

  },
	courseContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
    marginBottom:-10,
	},
	courseTitle: {
    top:-15,
    marginHorizontal:10,
		fontSize: 16,
    fontWeight:500,
	},
  divider: {
    borderBottomColor: "#ffffff99",
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
	dropdownTrigger: {
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    width: 160,
    justifyContent: "space-around",
  },
  
  selectedText: {
    color: "#FFBF18",
    fontSize: 14,
    top:-5,
    left:30
  },
  
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin:20,
    top:30
  },
  
  dropdownModal: {
    backgroundColor: "#2264dc",
    width: 120,
    borderRadius: 10,
    elevation: 5,
    paddingVertical:5,
  },
  
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal:12
  },
  
  dropdownItemText: {
    fontSize: 14,
    color: "#fff",
    paddingVertical:5
  },
	iconStyle: {
		fontSize: 20,
		color: "#FFBF18",
    alignSelf:"flex-end",
    top:-24,
    left:25
	},
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingBottom: 20,
    top:-10
	},
	gridItem: {
		width: "50%",
		justifyContent: "center",
	},
});

export default memo(index);
