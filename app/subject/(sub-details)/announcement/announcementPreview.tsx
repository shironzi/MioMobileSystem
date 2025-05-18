import React, {memo} from 'react';
import {Text, View} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";

const announcementPreview = () => {
    useHeaderConfig("Announcement")

    return(
        <View>
            <Text>Preview</Text>
        </View>
    )
}

export default memo(announcementPreview);
