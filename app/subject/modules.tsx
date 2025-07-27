import ModuleCard from "@/components/ModuleCard";
import LoadingCard from "@/components/loadingCard";
import globalStyles from "@/styles/globalStyles";
import HeaderConfig from "@/utils/HeaderConfig";
import { deleteModule, getModules } from "@/utils/modules";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
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

const ModulesScreen = () => {
  const { subjectId, role, specializedType } = useLocalSearchParams<{
    subjectId: string;
    role: string;
    specializedType: string;
  }>();

  const [moduleList, setModuleList] = useState<Module[]>([]);
  const [remedialList, setRemedialList] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [specialized, setSpecialized] = useState<Specialized[]>([]);
  const [loading, setLoading] = useState(true);

  HeaderConfig("Modules");

  const handleAddModule = () => {
    const encodedModules = encodeURIComponent(JSON.stringify(moduleList)) ?? [];
    const encodedAssignments =
      encodeURIComponent(JSON.stringify(assignments)) ?? [];
    const encodedSpecialized =
      encodeURIComponent(JSON.stringify(specialized)) ?? [];
    router.push({
      pathname: "/subject/(sub-details)/Modules/AddModules",
      params: {
        modules: encodedModules,
        assignments: encodedAssignments,
        specialized: encodedSpecialized,
        subjectId: subjectId,
        specializedType: specializedType,
      },
    });
  };

  const handleDeleteModule = async (moduleId: string) => {
    const res = await deleteModule(subjectId, moduleId);

    if (res.success) {
      Alert.alert(
        "Success",
        res.message,
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert("Failed", res.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (!subjectId) return;

      const fetch = async () => {
        const res = await getModules(subjectId);
        if (res.success) {
          setModuleList(res.modules);
          setRemedialList(res.remedials);
          setAssignments(res.assignments);
          setSpecialized(res.specialized);
        }
        setLoading(false);
      };

      fetch();
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

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {role === "teacher" && (
        <View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddModule}>
            <View
              style={{
                top: 20,
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <Ionicons name="add-circle" size={20} color="#ffbf18" />
              <Text style={styles.addText}>Add Module</Text>
            </View>
          </TouchableOpacity>
          <Text
            style={[
              globalStyles.text1,
              {
                marginHorizontal: 15,
                color: "#000",
                // marginTop: 10,
                marginBottom: 5,
              },
            ]}
          >
            Subject Modules
          </Text>
        </View>
      )}
      <View>
        <GestureHandlerRootView>
          {moduleList.length > 0 ? (
            <View style={{ rowGap: 15, marginTop: 10, marginHorizontal: 10 }}>
              {moduleList.map((item, index) => (
                <ModuleCard
                  key={index}
                  index={index}
                  id={item.id}
                  title={item.title}
                  visible={item.visible}
                  description={item.description}
                  subjectId={subjectId}
                  role={role}
                  modules={moduleList}
                  assignments={assignments}
                  specialized={specialized}
                  specializedType={specializedType}
                  handleDeleteModule={handleDeleteModule}
                />
              ))}

              <View style={{ rowGap: 15, marginHorizontal: 0 }}>
                <Text
                  style={[
                    globalStyles.text1,
                    { marginHorizontal: 10, color: "#000", left: -5 },
                  ]}
                >
                  Supplementary Modules
                </Text>
                {remedialList.map((item, index) => (
                  <ModuleCard
                    key={index}
                    index={index}
                    id={item.id}
                    title={item.title}
                    visible={item.visible}
                    description={item.description}
                    subjectId={subjectId}
                    isRemedial={item.remedial_module}
                    role={role}
                    specializedType={specializedType}
                    handleDeleteModule={handleDeleteModule}
                  />
                ))}
              </View>
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
              <Text style={globalStyles.line1}>No Module Yet</Text>
              <Text style={globalStyles.line2}>
                There’s nothing available in this{"\n"}section right now.
              </Text>
            </View>
          )}
        </GestureHandlerRootView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    height: "100%",
  },
  addButton: {
    alignSelf: "center",
    width: "95%",
    backgroundColor: "#fcefcc",
    borderColor: "#ffbf18",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    margin: 30,
    marginBottom: 15,
    height: 60,
    marginTop: 8,
    // marginVertical: 5,
  },
  addText: {
    color: "#ffbf18",
    fontWeight: 500,
    marginHorizontal: 10,
  },
});

export default memo(ModulesScreen);
