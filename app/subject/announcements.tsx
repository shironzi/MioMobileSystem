import AnnounceCard from "@/components/AnnounceCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { getAnnouncements } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import {useLocalSearchParams, useRouter} from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View>
        <Text>Loading........</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {announcements.length > 0 ? (
          announcements.map((item, index) => (
            <AnnounceCard
              key={index}
              subjectId={subjectId}
              title={item.title}
              date={item.date_posted}
              time="09:00 AM"
              description={item.description}
              announcementId={item.announcement_id}
            />
          ))
        ) : (
          <View>
            <Text>This subject has no announcements yet.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          router.push({
            pathname: "/subject/(sub-details)/announcement/addAnnouncement"
          })
        }}
      >
        <MaterialIcon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
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
