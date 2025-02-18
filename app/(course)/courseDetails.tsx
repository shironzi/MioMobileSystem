import { View, Text, StyleSheet } from "react-native";
import React, { memo } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

import globalStyle from "@/styles/globalStyle";

const courseDetails = () => {
  return (
    <View style={[globalStyle.container, { marginTop: 22 }]}>
      <View
        style={{ backgroundColor: "#1F1F1F", padding: 13, borderRadius: 10 }}
      >
        <View
          style={{
            borderLeftColor: "#fff",
            borderLeftWidth: 5,
            paddingHorizontal: 19,
          }}
        >
          <Text style={[globalStyle.secondary, styles.fontSizeOne]}>
            Course Code
          </Text>
          <Text style={[globalStyle.secondary, styles.fontSizeOne]}>
            Course Title
          </Text>
          <Text style={[globalStyle.secondary, styles.fontSizeOne]}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis
            maiores, quidem voluptate quis facere doloribus quas optio. Nisi
            tempore iure error labore est quisquam repudiandae itaque, aperiam
            quia, vitae reiciendis. Lorem
          </Text>
        </View>
      </View>
      <View style={{ rowGap: 10, marginTop: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5,
            backgroundColor: "#fff",
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
            width: "100%",
          }}
        >
          {/* temporary icon */}
          <MaterialIcons name="record-voice-over" size={40} color="#FFBF18" />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.fontSizeOne}>Speech Traning Excecises</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5,
            backgroundColor: "#fff",
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
          }}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Announcements</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5,
            backgroundColor: "#fff",
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
          }}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Announcements</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5,
            backgroundColor: "#fff",
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
          }}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Assignments</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5,
            backgroundColor: "#fff",
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
          }}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Scores</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 5,
            backgroundColor: "#fff",
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
          }}
        >
          <View style={styles.linkDecoration}>
            <Text style={styles.fontSizeOne}>Modules</Text>
            <Entypo name="chevron-small-right" size={30} color="#CCC" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fontSizeOne: { fontSize: 18 },
  fontSizeTwo: { fontSize: 15 },
  fontSizeThree: { fontSize: 14 },
  linkDecoration: {
    borderLeftColor: "#FFBF18",
    borderLeftWidth: 5,
    paddingLeft: 19,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default memo(courseDetails);
