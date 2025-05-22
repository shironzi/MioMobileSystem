import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const announceCard = (props: {
  subjectId: string;
  title: string;
  date: string;
  time: string;
  description: string;
  announcementId: string;
  role: string;
  handleDelete: () => void;
}) => {
  const router = useRouter();

  const newDate = new Date(props.date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const handleNavigate = () => {
    if (props.role === "teacher") {
      router.push({
        pathname: "/subject/(sub-details)/announcement/addAnnouncement",
        params: {
          subjectId: props.subjectId,
          announcementId: props.announcementId,
        },
      });
    } else {
      router.push({
        pathname: "/subject/(sub-details)/announcement/announcementDetails",
        params: {
          subjectId: props.subjectId,
          title: props.title,
          date: newDate,
          time: props.time,
          description: props.description,
          announcementId: props.announcementId,
          role: props.role,
        },
      });
    }
  };

  const translatedX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0 && e.translationX > -110) {
        translatedX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translatedX.value < -90) {
        translatedX.value = withTiming(-1000, { duration: 1500 });
        runOnJS(props.handleDelete)();
      }
      translatedX.value = withTiming(0, { duration: 700 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translatedX.value }],
  }));

  return (
    <View style={{ marginHorizontal: 20 }}>
      {props.role === "teacher" && (
        <View style={styles.deleteBackground}>
          <MaterialIcons name="delete" size={28} color="white" />
        </View>
      )}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity
            onPress={handleNavigate}
            style={styles.touchableOpacity}
            activeOpacity={100}
          >
            <View style={styles.row}>
              <View style={styles.yellowBulletin}></View>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={3}>
                  {props.title}
                </Text>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.date}>
                  {newDate} {props.time}
                </Text>
                <Entypo name="chevron-small-right" size={30} color="#aaa" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FF5646",
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 10,
    zIndex: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  yellowBulletin: {
    backgroundColor: "#FFBF18",
    height: 45,
    width: "1.5%",
    borderRadius: 100,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  icons: {
    flexDirection: "row",
  },
});

export default memo(announceCard);
