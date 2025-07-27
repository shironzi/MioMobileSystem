import AnnounceCard from "@/components/AnnounceCard";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import {
  deleteAnnouncement,
  getAnnouncements,
  deleteAnnouncements,
} from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Announcement = {
  title: string;
  description: string;
  subject_id: string;
  date_posted: string;
  announcement_id: string;
};

function Announcements() {
  HeaderConfig("Announcements");
  const router = useRouter();

  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [targetAnnouncement, setTargetAnnouncement] = useState<string | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<string[]>(
    [],
  );
  const [selectAllAnnouncements, setSelectAllAnnouncements] =
    useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      const fetchAnnouncements = async () => {
        try {
          const response = await getAnnouncements(subjectId);
          if (isActive) {
            setAnnouncements(response.announcements);
          }
        } catch (err) {
          useAuthGuard(err);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchAnnouncements();

      return () => {
        isActive = false;
      };
    }, [subjectId]),
  );

  const handleAdd = () => {
    router.push({
      pathname: "/subject/(sub-details)/announcement/addAnnouncement",
      params: { subjectId },
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
    setIsDeleting(true);
    if (selectedAnnouncements.length > 0) {
      const res = await deleteAnnouncements(subjectId, selectedAnnouncements);

      if (res.success) {
        setAnnouncements((prev) =>
          prev.filter(
            (ann) => !selectedAnnouncements.includes(ann.announcement_id),
          ),
        );
      } else {
        Alert.alert("", res.message);
      }
    } else {
      if (targetAnnouncement === null) return;

      const res = await deleteAnnouncement(subjectId, targetAnnouncement);

      if (res.success) {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter(
            (ann) => ann.announcement_id !== targetAnnouncement,
          ),
        );
      } else {
        Alert.alert("", res.message);
      }
    }

    setDeleteConfirm(false);
    setTargetAnnouncement(null);
    setIsEditing(false);
  };

  const handleSelectAll = () => {
    setSelectAllAnnouncements(!selectAllAnnouncements);
    const announcementIds = announcements.map((item) => item.announcement_id);

    if (!selectAllAnnouncements) {
      setSelectedAnnouncements(announcementIds);
    } else {
      setSelectedAnnouncements([]);
    }
  };

  const handleAddSelectAnnouncement = (id: string) => {
    setSelectedAnnouncements((prev) => {
      let updated;

      if (prev.includes(id)) {
        updated = prev.filter((announcementId) => announcementId !== id);
      } else {
        updated = [...prev, id];
      }

      setSelectAllAnnouncements(updated.length === announcements.length);

      return updated;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {isEditing && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 10,
              marginRight: 40,
              marginBottom: 10,
            }}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={handleSelectAll}>
                <MaterialCommunityIcons
                  name={
                    selectAllAnnouncements
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <Text>Select All</Text>
            </View>
            <TouchableOpacity
              style={[styles.header, { columnGap: 2 }]}
              onPress={() => setDeleteConfirm(true)}
            >
              <Text
                style={[
                  selectedAnnouncements.length
                    ? { color: "red" }
                    : { color: "black" },
                ]}
              >
                Delete{" "}
                {selectedAnnouncements.length > 0 &&
                  " (" + selectedAnnouncements.length + ")"}
              </Text>
              <MaterialIcons
                name="delete"
                size={24}
                color={selectedAnnouncements.length ? "red" : "black"}
              />
            </TouchableOpacity>
          </View>
        )}

        {role === "teacher" && !isEditing && (
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <View
              style={{
                top: 20,
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <Ionicons name="add-circle" size={20} color="#ffbf18" />
              <Text style={styles.addText}>Add Announcement</Text>
            </View>
          </TouchableOpacity>
        )}
        {announcements.length > 0 ? (
          <View style={{ rowGap: 15 }}>
            {announcements.map((item, index) => (
              <GestureHandlerRootView
                key={index}
                style={{
                  borderRadius: 20,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: "auto",
                  }}
                >
                  {isEditing && (
                    <View style={{ width: "5%" }}>
                      <TouchableOpacity
                        onPress={() =>
                          handleAddSelectAnnouncement(item.announcement_id)
                        }
                      >
                        <MaterialCommunityIcons
                          name={
                            selectedAnnouncements.includes(item.announcement_id)
                              ? "checkbox-marked"
                              : "checkbox-blank-outline"
                          }
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[isEditing ? { width: "90%" } : { width: "100%" }]}
                  >
                    <AnnounceCard
                      subjectId={subjectId}
                      title={item.title}
                      date={item.date_posted}
                      time="09:00 AM"
                      description={item.description}
                      announcementId={item.announcement_id}
                      role={role}
                      handleDelete={() => {
                        setDeleteConfirm(true);
                        setTargetAnnouncement(item.announcement_id);
                      }}
                      disable={isEditing}
                    />
                  </View>
                </View>
              </GestureHandlerRootView>
            ))}
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              backgroundColor: "#fff",
              flex: 1,
            }}
          >
            <Image
              source={require("@/assets/load/noavailable.png")}
              resizeMode="contain"
              style={globalStyles.image}
            />
            <Text style={globalStyles.line1}>No Announcement Yet</Text>
            <Text style={globalStyles.line2}>
              There’s nothing available in this{"\n"}section right now.
            </Text>
          </View>
        )}
      </ScrollView>

      {role === "teacher" && (
        <View>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <FontAwesome5 name="pen" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.editButton, { padding: 15 }]}
              onPress={() => {
                setIsEditing(false);
                setSelectedAnnouncements([]);
                setSelectAllAnnouncements(false);
              }}
            >
              <MaterialIcons name="cancel" size={32} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ConfirmationModal
        isVisible={deleteConfirm}
        description={"Are you sure you want to delete this announcement?"}
        cancelDisplay={"Cancel"}
        approveDisplay={isDeleting ? "Deleting..." : "Delete"}
        handleCancel={() => setDeleteConfirm(false)}
        handleApprove={() => handleDelete()}
        isActive={isDeleting}
      />
    </View>
  );
}

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
  editButton: {
    position: "absolute",
    bottom: 50,
    right: 25,
    padding: 20,
    backgroundColor: "#2264DC",
    borderRadius: 360,
  },
  header: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
});

export default memo(Announcements);
