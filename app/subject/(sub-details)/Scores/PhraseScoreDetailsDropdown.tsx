import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import AudioPlayer from "@/components/trainingActivities/AudioPlayer";

const PhraseScoreDetailsDropdown = ({
  items,
  placeholder,
}: {
  items: {
    id: string;
    feedback: string;
    audio: string;
    words: {
      word: string;
      score: number;
      phonemes: {
        phone: string;
        quality_score: number;
        sound_most_like: string;
      }[];
    }[];
    text: string;
  };
  placeholder: number;
}) => {
  useHeaderConfig("Scores");

  const [isVisible, setIsVisible] = useState(false);
  const toggleDropdown = () => setIsVisible(!isVisible);

  const convert = (word: string) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();

    return firstLetter + restOfWord;
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <View
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderColor: "#00000024",
          }}
        >
          <View style={styles.yellowBulletin}></View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              width: "92.5%",
            }}
          >
            <Text style={styles.buttonText}>Flashcard {placeholder + 1}</Text>
            <AntDesign
              name={isVisible ? "up" : "down"}
              size={24}
              color="#FFBF18"
            />
          </View>
        </View>
        <MaterialIcons
          name={isVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {isVisible && (
        <View style={{ width: "100%" }}>
          {items ? (
            <View>
              <View style={{ rowGap: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={globalStyles.text1}>Word: </Text>
                  <Text>{convert(items.text)}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={globalStyles.text1}>Score: </Text>
                  {/*<Text>{items.score}%</Text>*/}
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text style={globalStyles.text1}>Feedback: </Text>
                  <Text style={{ maxWidth: 300 }}>{items.feedback}</Text>
                </View>
                <AudioPlayer uri={items.audio} />
              </View>
              {items.words?.map((word, index) => (
                <View key={index}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={globalStyles.text1}>Word: </Text>
                    <Text>{convert(word.word)}</Text>
                  </View>
                  <View style={styles.table}>
                    <View style={styles.headerRow}>
                      <Text style={styles.headerCell}>Phone</Text>
                      <Text style={styles.headerCell}>Sound Most Like</Text>
                      <Text style={styles.headerCell}>Score</Text>
                    </View>

                    {word.phonemes.map((phone, index) => (
                      <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{phone.phone}</Text>
                        <Text style={styles.cell}>{phone.sound_most_like}</Text>
                        <Text style={styles.cell}>{phone.quality_score}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.dropdownContent}>
              <Text style={styles.item}>No Feedback</Text>
            </View>
          )}
        </View>
      )}
      <View style={[globalStyles.divider, { marginTop: 20 }]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    borderRadius: 8,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownContent: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00000024",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
  yellowBulletin: {
    borderColor: "#FFBF18",
    backgroundColor: "#FFBF18",
    borderWidth: 2.5,
    borderRadius: 100,
    marginRight: 15,
    height: 30,
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default PhraseScoreDetailsDropdown;
