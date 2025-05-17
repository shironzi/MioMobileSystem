import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, {useState, memo, useContext, useMemo, useEffect} from "react";
import { CourseCardViewContext } from "@/contexts/CourseCardViewContext";
import CourseCard from "@/components/CourseCard";
import {getSubjects} from "@/utils/query";
import {useAuthGuard} from "@/utils/useAuthGuard";

const data = [
    { label: "All Subjects", value: "all" },
    { label: "Academic Subjects", value: "academic" },
    { label: "Specialized Subjects", value: "specialized" },
    { label: "Previous Subjects", value: "previous" },
];

type Subject = {
    title: string;
    section: string;
    subject_id: string;
    description: string;
    subjectType: string;
};

const index = () => {
    const [selectedValue, setSelectedValue] = useState("all");
    const { courseCardView } = useContext(CourseCardViewContext);
    const [subjects, setSubjects] = useState<Subject[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSubjects() {
            try {
                const data = await getSubjects("GR7");
                setSubjects(data.subjects);
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
                return subjects.filter((s) => s.subjectType === "auditory" || s.subjectType === "language" || s.subjectType === "speech");

            case "previous":
                return null;

            case "all":
            default:
                return subjects;
        }
    }, [subjects, selectedValue]);

    if (loading) {
        return (
            <View>
                <Text>Loading........</Text>
            </View>
        );
    }

    return (
        <View>
            <View>
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
                    contentContainerStyle={[
                        courseCardView ? styles.gridContainer : null,
                    ]}
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
                                            courseImage={require("@/assets/images/dashImage/language.png")}
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
                                        courseImage={require("@/assets/images/dashImage/language.png")}
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
        </View>
    );
};

const styles = StyleSheet.create({
    courseContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 10,
    },
    courseTitle: {
        fontSize: 20,
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
