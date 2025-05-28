import AnnounceCard from "@/components/AnnounceCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { deleteAnnouncements, getAnnouncements } from "@/utils/query";
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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ConfirmationModal from "@/components/ConfirmationModal";

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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements(subjectId);
        setAnnouncements(response.announcements);
      } catch (err) {
        useAuthGuard(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [subjectId]);

  const handleAdd = () => {
    router.push({
      pathname: "/subject/(sub-details)/announcement/addAnnouncement",
      params: { subjectId },
    });
  };

  if (loading) {
    return (
      <View>
        <Text>Loading........</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    if (targetAnnouncement === null) return;

    try {
      const res = await deleteAnnouncements(subjectId, targetAnnouncement);

      console.log(res);
      setDeleteConfirm(false);
      setTargetAnnouncement(null);
    } catch (err) {
      console.error("Deleting error: " + err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {announcements.length > 0 ? (
          <View style={{ rowGap: 15 }}>
            {announcements.map((item, index) => (
              <GestureHandlerRootView key={index}>
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
                />
              </GestureHandlerRootView>
            ))}
          </View>
        ) : (
          <View>
            <Text>This subject has no announcements yet.</Text>
          </View>
        )}
      </ScrollView>

      <ConfirmationModal
        isVisible={deleteConfirm}
        description={"Are you sure you want to delete this announcement?"}
        cancelDisplay={"Cancel"}
        approveDisplay={"Delete"}
        handleCancel={() => setDeleteConfirm(false)}
        handleApprove={() => handleDelete()}
      />

      {role === "teacher" && (
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <MaterialIcon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
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

export default memo(Announcements);
