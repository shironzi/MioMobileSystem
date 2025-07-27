import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Module {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  remedial_module?: boolean;
}

interface Assignment {
  id: string;
  title: string;
}

interface Specialized {
  id: string;
  title: string;
  difficulty: string;
}

type Props = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  index: number;
  subjectId: string;
  isRemedial?: boolean;
  role: string;
  modules?: Module[];
  assignments?: Assignment[];
  specialized?: Specialized[];
  specializedType?: string;
  handleDeleteModule: (id: string) => void;
};

const ModuleCard = ({
  id,
  title,
  description,
  visible,
  index,
  subjectId,
  isRemedial = false,
  role,
  modules,
  assignments,
  specialized,
  specializedType,
  handleDeleteModule,
}: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    if (!visible) return;
    if (translatedX.value !== 0) return;
    const encodedModules = encodeURIComponent(JSON.stringify(modules)) ?? [];
    const encodedAssignments =
      encodeURIComponent(JSON.stringify(assignments)) ?? [];
    const encodedSpecialized =
      encodeURIComponent(JSON.stringify(specialized)) ?? [];

    router.push({
      pathname: "/subject/(sub-details)/moduleDetails",
      params: {
        id: id,
        title: title,
        description: description,
        subjectId: subjectId,
        index: index + 1,
        role,
        modules: encodedModules,
        assignments: encodedAssignments,
        specialized: encodedSpecialized,
        isRemedial: isRemedial.toString(),
        specializedType: specializedType,
      },
    });
  };

  const translatedX = useSharedValue(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setIsDragging)(true);
    })
    .onUpdate((e) => {
      if (role !== "teacher") return;
      if (e.translationX < 0 && e.translationX > -110) {
        translatedX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (role !== "teacher") return;
      if (translatedX.value < -90) {
        translatedX.value = withTiming(-1000, { duration: 1500 });
        runOnJS(handleDeleteModule)(id);
      }
      translatedX.value = withTiming(0, { duration: 700 });
      runOnJS(setIsDragging)(false);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translatedX.value }],
  }));

  return (
    <View>
      {role === "teacher" && (
        <View style={styles.deleteBackground}>
          <MaterialIcons name="delete" size={28} color="white" />
        </View>
      )}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity
            onPress={() => {
              if (isDragging) return;
              if (translatedX.value !== 0) return;
              console.log(translatedX.value);
              handleRoute();
            }}
            style={styles.touchableOpacity}
            activeOpacity={100}
          >
            <View style={styles.cardContainer}>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.yellowBulletin,
                    visible
                      ? { backgroundColor: "#FFBF18" }
                      : { backgroundColor: "#00000024" },
                  ]}
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.title} numberOfLines={3}>
                    {!isRemedial ? `[Module ${index + 1}] - ${title}` : title}
                  </Text>
                </View>
                <FontAwesome6
                  name="arrow-right-long"
                  size={15}
                  color="#1f1f1f"
                  style={{ left: -10 }}
                />
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
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  cardContainer: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    margin: 0,
    borderWidth: 0,
    shadowColor: "transparent",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  yellowBulletin: {
    width: "1.5%",
    height: 30,
    borderRadius: 3,
    marginRight: 14,
    left: 3,
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  icons: {
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 5,
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#db4141",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 20,
    zIndex: 0,
  },
});

export default memo(ModuleCard);
