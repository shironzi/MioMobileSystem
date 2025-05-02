import React, {memo} from "react";
import {View, Text} from "react-native";
import HeaderConfig from "@/components/HeaderConfig";

const attendance = () => {
    HeaderConfig("Attendance")
    return (
        <View>
            <Text>
                hi
            </Text>
        </View>
    )
};

export default memo(attendance);