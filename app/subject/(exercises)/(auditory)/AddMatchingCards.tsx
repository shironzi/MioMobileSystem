import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Animated, {FadeInUp, FadeOut, LinearTransition} from "react-native-reanimated";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImageUpload from "@/components/ImageUpload";

interface FileInfo {
    uri: string;
    name: string;
    mimeType?: string;
}

const AddMatchingCards = (props: {isFirst: boolean, index: number, handleFileUpload: (file: FileInfo) => void, handleFileRemove: () => void, handleRemoveBingoItem: () => void, bingoItem: string |null}) => {
    return (
        <Animated.View
            entering={FadeInUp}
            exiting={FadeOut}
            layout={LinearTransition}
            style={[
                {
                    backgroundColor: '#fff',
                    paddingHorizontal: 20,
                    marginHorizontal: 20
                },
                props.isFirst && {
                    paddingTop: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                },
            ]}
        >
            <View style={{ paddingHorizontal: 20 }}>
                {props.isFirst && (<Text>Bingo Items</Text>)}
                <View>
                    <View style={styles.cardRow}>
                        <Text
                            style={[
                                globalStyles.text1
                            ]}
                        >
                            Bingo Image {props.index + 1}
                        </Text>
                        <TouchableOpacity onPress={() => props.handleRemoveBingoItem()}>
                            <AntDesign name="close" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                    <ImageUpload
                        handleFiles={(file: FileInfo) => props.handleFileUpload(file)}
                        imageUri={props.bingoItem}
                        handleImageRemove={() => props.handleFileRemove()}
                        isError={false}
                    />
                    <View style={styles.divider} />
                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    divider: {
        borderTopWidth: 1,
        borderColor: "#82828257",
        marginHorizontal: -25,
        marginVertical: 20,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
})


export default memo(AddMatchingCards);