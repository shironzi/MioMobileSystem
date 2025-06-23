import AnnounceCard from "@/components/AnnounceCard";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { deleteAnnouncements, getAnnouncements } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import { Ionicons } from "@expo/vector-icons";
// import MaterialIc from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

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
    if (targetAnnouncement === null) return;

    try {
      const res = await deleteAnnouncements(subjectId, targetAnnouncement);

      if (res.success) {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter(
            (ann) => ann.announcement_id !== targetAnnouncement,
          ),
        );
      }

      setDeleteConfirm(false);
      setTargetAnnouncement(null);
    } catch (err) {
      console.error("Deleting error: " + err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {role === "teacher" && (
          // <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          // 	<MaterialIcon name="add" size={30} color="#fff" />
          // </TouchableOpacity>
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
          // <View>
          // 	<Text>This subject has no announcements yet.</Text>
          // </View>
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

      <ConfirmationModal
        isVisible={deleteConfirm}
        description={"Are you sure you want to delete this announcement?"}
        cancelDisplay={"Cancel"}
        approveDisplay={"Delete"}
        handleCancel={() => setDeleteConfirm(false)}
        handleApprove={() => handleDelete()}
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
});

export default memo(Announcements);
