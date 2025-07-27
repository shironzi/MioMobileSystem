import AssCard from "@/components/assignment/AssCard";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingCard from "@/components/loadingCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { deleteAssignment, getAssignments } from "@/utils/query";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NoAssignments from "@/components/noData/NoAssignments";

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
  is_submitted: boolean;
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
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [targetAssignment, setTargetAssignment] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAssignments = async () => {
        const response = await getAssignments(subjectId);
        if (response.success) {
          setAssignments(response.assignments);
        }
        setLoading(false);
      };

      fetchAssignments();
    }, [subjectId]),
  );

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

  const handleDelete = async () => {
    if (targetAssignment === null) return;

    const res = await deleteAssignment(subjectId, targetAssignment);

    if (res.success) {
      setAssignments((prev) =>
        prev.filter((ass) => ass.assignment_id != targetAssignment),
      );
    }
    setDeleteConfirm(false);
    setTargetAssignment(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {role === "teacher" && (
          // <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          // 	<MaterialIcon name="add" size={30} color="#fff" />
          // </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              router.push({
                pathname: "/subject/(sub-details)/assignment/addAssignment",
                params: { subjectId: subjectId },
              });
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
              <Text style={styles.addText}>Add Assignment</Text>
            </View>
          </TouchableOpacity>
        )}
        <View>
          {assignments.length > 0 ? (
            <View style={{ rowGap: 15 }}>
              {assignments?.map((item) => (
                <GestureHandlerRootView key={item.assignment_id}>
                  <AssCard
                    subjectId={subjectId}
                    title={item.title}
                    description={item.description}
                    availability={item.availability}
                    createdAt={item.createdAt}
                    totalPoints={item.total}
                    attempts={item.attempts}
                    assignment_id={item.assignment_id}
                    submission_type={item.submission_type}
                    is_submitted={item.is_submitted}
                    role={role}
                    handleDelete={() => {
                      setDeleteConfirm(true);
                      setTargetAssignment(item.assignment_id);
                    }}
                  />
                </GestureHandlerRootView>
              ))}
            </View>
          ) : (
            <View
              style={[
                { marginVertical: "auto", height: "100%" },
                role === "teacher" ? { marginTop: 180 } : { marginTop: 200 },
              ]}
            >
              <NoAssignments />
            </View>
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        isVisible={deleteConfirm}
        description={"Are you sure you want to delete this assignment?"}
        cancelDisplay={"Cancel"}
        approveDisplay={"Delete"}
        handleCancel={() => setDeleteConfirm(false)}
        handleApprove={() => handleDelete()}
        isActive={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    left: -8,
    width: "88%",
    backgroundColor: "#fcefcc",
    borderColor: "#ffbf18",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    margin: 30,
    marginBottom: 20,
    height: 60,
    marginVertical: 5,
  },
  addText: {
    color: "#ffbf18",
    fontWeight: 500,
    marginHorizontal: 10,
  },
});

export default memo(assignments);
