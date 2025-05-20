import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type fabProps = {
  open: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const fab = ({ open, onToggle, onAdd, onEdit, onDelete }: fabProps) => {
  return (
    <View style={styles.container}>
      {open && (
        <>
          <TouchableOpacity style={styles.option} onPress={onAdd}>
            <MaterialIcon name="add" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onEdit}>
            <MaterialIcon name="edit" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onDelete}>
            <MaterialIcon name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.moreButton} onPress={onToggle}>
        <MaterialIcon name={open ? "close" : "edit-document"} size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
  },
  moreButton: {
    backgroundColor: "#2264DC",
    height: 60,
    width: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  option: {
    backgroundColor: "#2264DC",
    height: 50,
    width: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
  },
});

export default memo(fab);
