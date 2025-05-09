import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from "react-native";
import React, { memo, useState } from "react";
import HeaderConfig from "@/components/HeaderConfig";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const addAnnouncement = () => {
    const [title, setTitle] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    HeaderConfig("Add Announcement");

  return (
    <View>
        <View style={styles.container}>
        <View style={styles.row}>
            <Text style={styles.label}>Title</Text>
            <TextInput
            style={styles.textInput}
            placeholder="Event Title"
            placeholderTextColor="#aaa"
            multiline={true}
            numberOfLines={2}
            value={title}
            onChangeText={setTitle}
            />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: selectedDate ? "#000" : "#aaa" }}>
            {selectedDate ? selectedDate.toDateString() : "Select date"}
          </Text>
          <MaterialIcons name="date-range" size={22} color="#ffbf18" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selected) => {
              setShowDatePicker(false);
              if (selected) setSelectedDate(selected);
            }}
          />
        )}
      </View>
      <TouchableOpacity style={styles.button}>
        <View style={styles.buttonRow}>
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Announcement</Text>
        </View>

      </TouchableOpacity>
    </View>
    </View>
    

    
  );
};

export default memo(addAnnouncement);


const styles = StyleSheet.create ({
    container: {
        margin:20,
        padding:20,
        backgroundColor:"#fff",
        borderRadius:10,
        elevation:5
    },
    row:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:20
        
    },
    label: {
        fontSize:16,
        fontWeight:"bold",
        color:"#000",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#f9f9f9",
        fontSize: 14,
        textAlignVertical: "top",
        width:"80%"
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#f9f9f9",
        width:"80%"
      },
    buttonRow: {
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    button: {
        backgroundColor:"#ffbf18",
        padding:14,
        borderRadius:50
    },
    buttonText: {
        color:"#fff",
        fontWeight:"bold",
        fontSize:16,
        left:5
    }
})
