import { useFocusEffect, useNavigation } from "expo-router";
import React, {memo, useCallback} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";



const PicgameCard = () => {
   const navigation = useNavigation();
   useFocusEffect(
      useCallback(() => {
        navigation.setOptions({
          headerTitle: "Picture Flashcards",
          headerStyle: {
            backgroundColor: "#2264DC",
          },
          headerTintColor: "#fff",
        });
  
        return () => {
          navigation.setOptions({
            headerTitle: "",
            headerStyle: {
              backgroundColor: "",
            },
            headerTintColor: "",
          });
        };
      }, [navigation])
    );
    return (
        <View>
            <Text>Hi</Text>
        </View>
    )
}


export default memo(PicgameCard);