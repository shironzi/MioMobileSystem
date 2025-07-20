import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
}: Props) => {
  const router = useRouter();

  const handleRoute = () => {
    if (!visible) return;
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

  return (
    <TouchableOpacity onPress={handleRoute} style={styles.touchableOpacity}>
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
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: "#fff",
    // padding: 15,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    margin: 10,
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
});

export default memo(ModuleCard);
