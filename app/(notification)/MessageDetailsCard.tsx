import React, {memo, useCallback} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Card } from "@rneui/themed";
import {useRouter} from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const MessageDetailsCard = (props:{
    name: string;
    date: Date;
    time: string;
    mess: string;

}) => {
    // const router = useRouter();
    const formatDate = useCallback(
        (date: Date) => {
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
        },
        [Date]
      );
    
      return (
        <Card
            containerStyle={{
                paddingBottom:10,
                margin: 0,
                backgroundColor: "#f0f0f0",
                marginBottom: -25,
            }}>
            <View style={styles.container}>
                <Image style={styles.image} source={require("@/assets/1.png")}></Image>
                <Text style={styles.name}>{props.name}</Text>
                <View style={styles.row}>
                    <Text style={styles.date}>{formatDate(props.date)}</Text>
                    <Text style={styles.time}>at {props.time}</Text>
                    <View style={styles.icons}>
                    <TouchableOpacity>
                    <Entypo name="reply" size={20} color="#999" style={{marginRight:10}} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Entypo name="trash" size={20} color="#999" />
                    </TouchableOpacity>
                </View>
                </View>
              
                <Text style={styles.mess}>{props.mess}</Text>

            </View>
        </Card>
      );
    
};

const styles=StyleSheet.create({
    container: {
        // margin:10,
        padding:0,
        paddingBottom:0

    },
    name: {
        fontSize: 20,
        fontWeight:500,
        top:-48,
        left: 70
    },
    row: {
        flexDirection: "row",
        // justifyContent: "space between",
        paddingLeft:-10,
        marginTop:5,
        marginBottom:5,
        top:-53,
        left: 70

    },
    date: {
        fontSize: 12,
        
    },
    time: {
        fontSize: 12,
        paddingLeft:5
    },
    mess: {
        fontSize: 14,
        top:-40,
        left:5,
    },
    image: {
        width:50,
        height:50,
        borderRadius:50
    },
    icons: {
        flexDirection: "row",
        marginLeft: 5,
        marginRight:-5,
        top:-10,
        right:-80,
    },
});

export default memo(MessageDetailsCard);
