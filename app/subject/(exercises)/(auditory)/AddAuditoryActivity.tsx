import React, {memo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import HeaderConfig from '@/utils/HeaderConfig';
import globalStyles from '@/styles/globalStyles';
import {Picker} from '@react-native-picker/picker';
import {MaterialIcons} from "@expo/vector-icons";
import Animated, {LinearTransition} from 'react-native-reanimated';
import AddMatchingCards from "@/app/subject/(exercises)/(auditory)/AddMatchingCards";

interface FileInfo {
    uri: string;
    name: string;
    mimeType?: string;
}

const AddAuditoryActivity = () => {
    HeaderConfig('Add Auditory Activity');

    const [bingoItems, setBingoItems] = useState<{id: string, file: FileInfo | null}[]>([{id: "0", file: null}]);
    const [activityType, setActivityType] = React.useState<string>('');
    const [activityDifficulty, setActivityDifficulty] = React.useState<string>('');

    const handleAddBingoItem = (id: string) => {
        setBingoItems((prev) => {
            const itemId = parseInt(id);
            if (prev[itemId]?.file !== null) {
                return [...prev, { id: (itemId + 1).toString(), file: null }];
            }
            return prev;
        });
    };

    const handleRemoveBingoItem = (id: string) => {
        const itemId = parseInt(id)

        if(itemId === 0){
            console.log("Bingo items should at least one item");
            return
        }
        setBingoItems((prev) => {
            return prev.filter((_, index) => index !== itemId);
        });
    }

    const handleFileUpload = (id: string, file: FileInfo) => {
        const itemId = parseInt(id);
        setBingoItems((prev) => {
            if (!prev[itemId]) return prev;

            const updatedItem = { ...prev[itemId], file };
            const newBingoItems = [...prev];
            newBingoItems[itemId] = updatedItem;

            return newBingoItems;
        });
    };

    const handleFileRemove = (id: string) =>{
        const itemId = parseInt(id)

        setBingoItems((prev) => {
            if (!prev[itemId]) return prev;

            const updatedItem = { ...prev[itemId], file:null };
            const newBingoItems = [...prev];
            newBingoItems[itemId] = updatedItem;

            return newBingoItems;
        });

    }

    const ListHeader = () => (
        <View style={styles.header}>
            <View style={globalStyles.cardContainer}>
                <Text>Type of Exercise</Text>
                <Picker
                    mode="dropdown"
                    selectedValue={activityType}
                    onValueChange={(value) => {
                        setActivityType(value);
                    }}
                >
                    <Picker.Item label="Bingo Cards" value="bingo" />
                    <Picker.Item label="Matching Cards" value="matching" />
                </Picker>

                <Text>Difficulty</Text>
                <Picker
                    mode="dropdown"
                    selectedValue={activityDifficulty}
                    onValueChange={setActivityDifficulty}
                >
                    <Picker.Item label="Easy" value="easy" />
                    <Picker.Item label="Average" value="average" />
                    <Picker.Item label="Difficult" value="difficult" />
                    <Picker.Item label="Challenge" value="challenge" />
                </Picker>
            </View>
        </View>
    );

    const ListFooter = (id: string) => (
        <View style={{paddingBottom: 20,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        backgroundColor: "#fff"}}>
            <TouchableOpacity style={styles.addFileRow} onPress={() => handleAddBingoItem(id)}>
                <MaterialIcons name="add" size={24} color="#FFBF18" />
                <Text style={styles.addFileText}>Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    globalStyles.submitButton,
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        marginHorizontal: "auto",
                        justifyContent: "center",
                        columnGap: 15,
                    },
                ]}
            >
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={globalStyles.submitButtonText}>
                    {/*{activityId ? "Update Activity" : "Add Activity"}*/}
                    Add Activity
                </Text>
            </TouchableOpacity>
        </View>
    )

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        return (

                    <AddMatchingCards isFirst={true} index={index} bingoItem={bingoItems[parseInt(item.id)]?.file?.uri ?? null} handleRemoveBingoItem={() => handleRemoveBingoItem(item.id)} handleFileRemove={() => handleFileRemove(item.id)} handleFileUpload={(file: FileInfo) => handleFileUpload(item.id, file)} />

            // <Animated.View
            //     entering={FadeInUp}
            //     exiting={FadeOut}
            //     layout={LinearTransition}
            //     style={[
            //         {
            //             backgroundColor: '#fff',
            //             paddingHorizontal: 20,
            //             marginHorizontal: 20
            //         },
            //         isFirst && {
            //             paddingTop: 20,
            //             borderTopLeftRadius: 20,
            //             borderTopRightRadius: 20,
            //         },
            //     ]}
            // >
            //     <View style={{ paddingHorizontal: 20 }}>
            //         {isFirst && (<Text>Bingo Items</Text>)}
            //         <View style={styles.cardRow}>
            //             <Text
            //                 style={[
            //                     globalStyles.text1
            //                 ]}
            //             >
            //                 Bingo Image {index + 1}
            //             </Text>
            //             <TouchableOpacity onPress={() => handleRemoveBingoItem(item.id)}>
            //                 <AntDesign name="close" size={24} color="red" />
            //             </TouchableOpacity>
            //         </View>
            //         <ImageUpload
            //             handleFiles={(file: FileInfo) => handleFileUpload(item.id ,file)}
            //             imageUri={bingoItems[parseInt(item.id)]?.file?.uri ?? null}
            //             handleImageRemove={() => handleFileRemove(item.id)}
            //             isError={false}
            //         />
            //         <View style={styles.divider} />
            //     </View>
            // </Animated.View>
        );
    };

    return (
            <Animated.FlatList
                data={bingoItems}
                keyExtractor={(bingoItems) => bingoItems.id}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={() => {
                    const lastItemId = bingoItems[bingoItems.length - 1]?.id ?? "0";
                    return ListFooter(lastItemId);
                }}
                renderItem={({ item, index }) =>
                        renderItem({ item, index })
                }
                itemLayoutAnimation={LinearTransition}
            />
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 16,
        backgroundColor: '#f2f2f2',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputBox: {
        width: "100%",
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 7,
        height: 45,
    },
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
    addFileRow: {
        flexDirection: "row",
        alignItems: "center",
        width: 120,
        borderRadius: 20,
        marginBottom: 15,
    },
    addFileText: {
        color: "#FFBF18",
        fontSize: 16,
    },
});

export default memo(AddAuditoryActivity);
