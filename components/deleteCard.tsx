import React, {memo} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type DeleteCardProps = {
  onClose: () => void;
};

const deleteCard = ({ onClose }: DeleteCardProps) => {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.row}>
                <Text style={styles.headerText}>Delete</Text>
                <TouchableOpacity>
                    <MaterialIcons name="close" size={20} color="#fff" style={styles.close}/>
                </TouchableOpacity>
            </View> 
        </View>
      <Text style={styles.text}>Are you sure you want to delete this?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.cancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.delete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
  row:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  close:{
    margin:15,
  },
  header:{
    backgroundColor:"#2264dc",
    height:50,
    top:-20,
    margin:-20,
    marginBottom:5,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  headerText: {
    color:"#fff",
    fontSize:18,
    fontWeight:"bold",
    marginTop:13,
    marginLeft:20,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    justifyContent:"center",
    textAlign:"center",
    flexWrap:"wrap",
    paddingHorizontal:40,
    lineHeight:25
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    marginLeft: 10,
  },
  cancel:{
    borderWidth: 1,
    borderColor: "#ffbf18",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: "45%",
    elevation: 3,
  },
  cancelText:{
    color: "#ffbf18",
    fontWeight: "bold",
    textAlign: "center",

  },
  delete: {
    backgroundColor: "#ffbf18",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    width: "45%",
    elevation: 3,
  },
  deleteText:{
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  }
});

export default memo(deleteCard);
