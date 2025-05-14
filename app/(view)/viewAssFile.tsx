import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { memo, useState } from "react";
import { Card } from "@rneui/themed";
import { useRouter } from "expo-router";
import HeaderConfig from "@/components/HeaderConfig";
import { FontAwesome } from "@expo/vector-icons";

const data = [
  {
    id: 1,
    title: "Activity 1",
    deadline: "January 12, 2024",
    points: 50,
    availability: "January 11, 2024 9:00 AM - January 12, 2024 9:00 AM",
    attempt: 1,
    type:"File Upload"
  },
];

const ques = "Create a presentation about plants.";

const viewAssFile = () => {
  const router = useRouter();
  const [files, setFiles] = useState<string[]>([""]);

  const handleFileChange = (index: number, fileName: string) => {
    const updatedFiles = [...files];
    updatedFiles[index] = fileName;
    setFiles(updatedFiles);
  };

  const handleAddFile = () => {
    setFiles([...files, ""]);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  HeaderConfig("Activity 1");

  return (
    <ScrollView>
      <View style={styles.container}>
        {data.map((item) => (
          <View key={item.id}>
            <Card containerStyle={styles.cardContainer}>
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.row}>
                  <Text style={styles.deadline}>Deadline: {item.deadline}</Text>
                  <Text style={styles.points}>Points: {item.points}</Text>
                </View>
                <Text style={styles.availability}>Availability: {item.availability}</Text>
                <Text style={styles.attempt}>Attempts: {item.attempt}</Text>
                 <Text style={styles.type}>Type: {item.type}</Text>
              </View>
            </Card>

            <View style={styles.question}>
              <View style={styles.header}></View>
              <Text style={styles.headerText}>Question</Text>
              <Text style={styles.quesText}>{ques}</Text>

              {files.map((file, index) => (
                <View key={index} style={styles.fileRow}>
                  <TouchableOpacity
                    style={styles.fileContainer}
                    onPress={() => handleFileChange(index, `selected_file_${index + 1}.pdf`)}
                  >
                    <Text style={{ color: "#aaa", fontWeight: "500" }}>Choose File</Text>
                  </TouchableOpacity>

                  <View style={styles.fileArea}>
                    <Text style={{ paddingTop: 15, color:"#808080" }}>{file || "No file chosen"}</Text>
                  </View>

                  <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                    <FontAwesome name="times" size={20} color="#aaa" style={{ left: -33 }} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity onPress={handleAddFile} style={{ flexDirection: "row", alignItems: "center", top:-30, marginBottom:-30}}>
                <FontAwesome name="plus" size={12} color="#ffbf18" style={{ top: 0, left: 10 }} />
                <Text style={styles.addFileText}>Add file</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            </View>

           
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  cardContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0,
    elevation: 5,
    paddingBottom: -10,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: 10,
  },
  title: {
    fontSize: 20,
    color: "#2264dc",
    marginBottom: 15,
    fontWeight: "bold",
    marginTop: -5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  deadline: {
    fontSize: 14,
    color: "#000",
    marginRight: 10,
  },
  points: {
    fontSize: 14,
    color: "#000",
  },
  availability: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
    lineHeight: 20,
  },
  attempt: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
  type: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFBF18",
    margin: 10,
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  question: {
    marginTop: 20,
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    borderWidth: 0,
  },
  header: {
    height: 50,
    backgroundColor: "#1f1f1f",
    margin: -10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    top: -48,
    left: 10,
  },
  quesText: {
    fontSize: 14,
    padding: 10,
    top: -30,
  },
  fileRow: {
    flexDirection: "row",
    top: -30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileContainer: {
    margin: 10,
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
  },
  fileArea: {
    marginRight: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: "55%",
    textAlignVertical: "top",
    paddingLeft: 10,
    height: 50,
  },
  addFileText: {
    left: 15,
    color: "#ffbf18",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default memo(viewAssFile);
