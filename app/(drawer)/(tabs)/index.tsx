import CourseCard from "@/components/CourseCard";
import LoadingCard from "@/components/loadingCard";
import { CourseCardViewContext } from "@/contexts/CourseCardViewContext";
import globalStyles from "@/styles/globalStyles";
import { getSubjects } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import NoSubjects from "@/components/noData/NoSubjects";

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
  image: string;
  background_color: string;
  banner_subTitle: string;
  banner_title: string;
  banner_description: string;
};

const index = () => {
  const [selectedValue, setSelectedValue] = useState("all");
  const { courseCardView } = useContext(CourseCardViewContext);
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [archive, setArchive] = useState<Subject[] | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("All");
  const dropdownRef = React.useRef<View | null>(null);
  const [name, setName] = useState<string>("");

  const [dropdownPosition, setDropdownPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data.subjects);
      setArchive(data.archiveSubjects);
      setRole(data.role);
      setName(data.name);
      if (data.role) {
        await SecureStore.setItemAsync("role", data.role);
        await SecureStore.setItemAsync("name", data.name);
      }
      setLoading(false);
    } catch (err) {
      useAuthGuard(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubjects();
    }, 3000); // 3000 ms = 3 seconds

    // Cleanup timeout if component unmounts before 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const filteredSubjects = useMemo<Subject[] | null>(() => {
    if (!subjects) return [];
    switch (selectedValue) {
      case "academic":
        return subjects.filter((s) => s.subjectType === "academics");
      case "specialized":
        return subjects.filter(
          (s) =>
            s.specialized_type === "auditory" ||
            s.specialized_type === "language" ||
            s.specialized_type === "speech",
        );

      case "previous":
        return archive;

      case "all":
      default:
        return subjects;
    }
  }, [subjects, selectedValue, archive]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchSubjects();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 3000);
  };

  if (loading) {
    return <LoadingCard></LoadingCard>;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.container]}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerName}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.yellow}></View>
          <Text style={styles.greet}>Welcome back, {name}!</Text>
        </View>
        <Text style={styles.banner}>
          Helping deaf children develop communication skills and confidence for
          a brighter future.
        </Text>
      </View>
      <View style={[styles.headerName, { top: -30, marginBottom: -10 }]}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.yellow}></View>
          <Text style={styles.greet}>School Year 2024 - 2025</Text>
        </View>
        <Text style={styles.banner}>
          June 2024 - March 2025 {"\n"}3rd Quarter
        </Text>
      </View>
      <View style={styles.courseContainer}>
        <Text style={styles.courseTitle}>Subjects</Text>
        <TouchableOpacity
          ref={dropdownRef}
          onPress={() => {
            dropdownRef.current?.measureInWindow?.((x, y, width, height) => {
              setDropdownPosition({ x, y, width, height });
              setShowDropdown(true);
            });
          }}
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
          style={[
            styles.modalBackdrop,
            {
              top: dropdownPosition.y + dropdownPosition.height,
              left: dropdownPosition.x,
            },
          ]}
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
                      item.value === selectedValue && {
                        color: "#FFBF18",
                        fontWeight: "600",
                      },
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
        {filteredSubjects?.length ? (
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
                    courseImage={subject.image}
                    role={role}
                    background_color={subject.background_color}
                    banner_subTitle={subject.banner_subTitle}
                    banner_title={subject.banner_title}
                    banner_description={subject.banner_description}
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
                  courseImage={subject.image}
                  role={role}
                  background_color={subject.background_color}
                  banner_subTitle={subject.banner_subTitle}
                  banner_title={subject.banner_title}
                  banner_description={subject.banner_description}
                />
                <Text>{courseCardView}</Text>
              </View>
            );
          })
        ) : (
          <View style={{ marginTop: 100, marginHorizontal: "auto" }}>
            <NoSubjects />
          </View>
        )}
      </ScrollView>
      <View style={{ paddingBottom: 50 }}>
        {/* <Text style={styles.courseTitle}>Badges</Text> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerName: {
    alignSelf: "center",
    marginVertical: 10,
    marginHorizontal: 10,
    left: -3,
    width: 340,
    top: -25,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
  },
  yellow: {
    backgroundColor: "#ffbf18",
    height: 55,
    width: "2%",
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  greet: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 500,
    marginVertical: 10,
  },
  banner: {
    marginHorizontal: 20,
    textAlign: "justify",
    marginLeft: 40,
    fontSize: 12,
    marginTop: -40,
    marginVertical: 10,
    lineHeight: 15,
    fontWeight: 300,
  },
  courseContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: -10,
  },
  courseTitle: {
    top: -15,
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 500,
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
    top: -5,
    left: 30,
  },

  modalBackdrop: {
    position: "absolute",
    // flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
    right: 5,
    marginTop: -10,

    // top: 15,
  },

  dropdownModal: {
    backgroundColor: "#2264dc",
    width: 120,
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 5,
  },

  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  dropdownItemText: {
    fontSize: 14,
    color: "#fff",
    paddingVertical: 5,
  },
  iconStyle: {
    fontSize: 20,
    color: "#FFBF18",
    alignSelf: "flex-end",
    top: -24,
    left: 25,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20,
    top: -10,
  },
  gridItem: {
    width: "50%",
    justifyContent: "center",
  },
});

export default memo(index);
