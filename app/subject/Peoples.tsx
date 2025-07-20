import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import React, { useEffect, useState } from "react";
import { getPeoples } from "@/utils/query";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import useHeaderConfig from "@/utils/HeaderConfig";
import LoadingCard from "@/components/loadingCard";

interface User {
  student_id: string;
  first_name: string;
  last_name: string;
  role: string;
}

const Peoples = () => {
  useHeaderConfig("People");

  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  const [peoples, setPeoples] = useState<User[]>([]);
  const [searchBar, setSearchBar] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const filteredPeoples = peoples.filter((person) => {
    const query = searchBar.toLowerCase();
    return (
      person.student_id.toLowerCase().includes(query) ||
      person.first_name.toLowerCase().includes(query) ||
      person.last_name.toLowerCase().includes(query) ||
      person.role.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const fetchPeoples = async () => {
      const res = await getPeoples(subjectId);

      if (res.success) {
        setPeoples(res.peoples);
      }

      setLoading(false);
    };

    fetchPeoples();
  }, []);

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
    <ScrollView style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={{ width: "80%", marginHorizontal: "auto", marginTop: 20 }}>
        <View
          style={[
            globalStyles.textInputContainer,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Ionicons name="search-sharp" size={24} color="black" />
          <TextInput
            value={searchBar}
            onChangeText={setSearchBar}
            style={{ width: "100%" }}
          />
        </View>
      </View>
      <View
        style={[
          globalStyles.cardContainer1,
          { padding: 10, marginHorizontal: 5 },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: "#ccc",
            paddingBottom: 6,
          }}
        >
          <Text style={[styles.cell, styles.header, { flex: 1.3 }]}>
            User ID
          </Text>
          <Text style={[styles.cell, styles.header, { flex: 1.5 }]}>
            First Name
          </Text>
          <Text style={[styles.cell, styles.header, { flex: 0.9 }]}>
            Last Name
          </Text>
          <Text style={[styles.cell, styles.header, { flex: 0.7 }]}>Role</Text>
        </View>

        {filteredPeoples.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              paddingVertical: 6,
              borderBottomWidth: 0.5,
              borderColor: "#eee",
            }}
          >
            <Text style={[styles.cell, { flex: 1.3 }]}>{item.student_id}</Text>
            <Text style={[styles.cell, { flex: 1.5 }]}>{item.first_name}</Text>
            <Text style={[styles.cell, { flex: 0.9 }]}>{item.last_name}</Text>
            <Text style={[styles.cell, { flex: 0.7 }]}>{item.role}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    fontSize: 13,
  },
  header: {
    fontWeight: "bold",
  },
});

export default Peoples;
