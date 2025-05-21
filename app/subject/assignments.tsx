import AssCard from "@/components/assignment/AssCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { getAssignments } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

interface Availability {
  start: string;
  deadline: string;
}

export interface Assignment {
  assignment_id: string;
  attempts: string;
  availability: Availability;
  createdAt: string;
  description: string;
  publishedAt: string;
  total: string;
  title: string;
  submission_type: string;
}

const assignments = () => {
  HeaderConfig("Assignments");

  const router = useRouter();

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getAssignments(subjectId);
        setAssignments(response.assignments);
        setLoading(false);
      } catch (err) {
        console.error("Fetch assignment error: ", err);
        useAuthGuard(err);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading.........</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {assignments.length > 0 ? (
            assignments.map((item) => (
              <AssCard
                key={item.assignment_id}
                subjectId={subjectId}
                title={item.title}
                description={item.description}
                availability={item.availability}
                createdAt={item.createdAt}
                totalPoints={item.total}
                attempts={item.attempts}
                assignment_id={item.assignment_id}
                submission_type={item.submission_type}
                role={role}
              />
            ))
          ) : (
            <View>
              <Text>This subject has no assignments yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {role === "teacher" ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            router.push({
              pathname: "/subject/(sub-details)/assignment/addAssignment",
              params: { subjectId: subjectId },
            });
          }}
        >
          <MaterialIcon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 2,
  },
  headerStyle: {
    backgroundColor: "#2264DC",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default memo(assignments);
