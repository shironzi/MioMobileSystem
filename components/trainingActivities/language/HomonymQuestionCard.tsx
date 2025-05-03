import { View, Text, TouchableOpacity } from "react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const HomonymQuestionCard = (props: {
  question: string[];
  choices: string[];
  onAnswerChange: (answers: Record<string, string>) => void;
  onAudioPlay: () => void;
}) => {
  const dropdownItems = useMemo(
    () =>
      props.choices.map((choice) => ({
        label: choice,
        value: choice,
      })),
    [props.choices]
  );

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const handleToggleDropdown = useCallback((key: string, isOpen: boolean) => {
    setOpenDropdowns((prev) => {
      if (isOpen) {
        const result: Record<string, boolean> = {};
        result[key] = true;
        return result;
      }
      return { ...prev, [key]: isOpen };
    });
  }, []);

  const handleSelect = useCallback(
    (qKey: string, value: string) => {
      setSelectedAnswers((prev) => {
        const updated = { ...prev, [qKey]: value };
        props.onAnswerChange(updated);
        return updated;
      });
    },
    [props.onAnswerChange]
  );

  const handleAudioPlay = () => {
    props.onAudioPlay();
    setTimeout(() => {
      props.onAudioPlay();
    }, 8000);
  };

  return (
    <View style={styles.container}>
      {props.question.map((sentence, qIndex) => {
        const wordsArray = sentence.split(/\s+/);

        return (
          <View key={qIndex} style={styles.questionCard}>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={handleAudioPlay}
            >
              <FontAwesome6 name="volume-high" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.wordsContainer}>
              {wordsArray.map((word, wIndex) => {
                const dropdownKey = `${word}-${qIndex}-${wIndex}`;

                return word.replace(/[^a-zA-Z]/g, "") === "BLANK" ? (
                  <View key={wIndex} style={styles.dropdownContainer}>
                    <DropDownPicker
                      open={openDropdowns[dropdownKey] || false}
                      setOpen={(isOpen) =>
                        handleToggleDropdown(dropdownKey, !!isOpen)
                      }
                      value={selectedAnswers[dropdownKey]}
                      setValue={(callback) => {
                        const newValue = callback(
                          selectedAnswers[dropdownKey] || null
                        );
                        handleSelect(dropdownKey, newValue as string);
                      }}
                      items={dropdownItems}
                      placeholder="Select"
                      style={styles.dropdown}
                      textStyle={styles.selectedTextStyle}
                      placeholderStyle={styles.placeholderStyle}
                      dropDownContainerStyle={styles.dropdownListContainer}
                      ArrowDownIconComponent={() => (
                        <FontAwesome6
                          name="chevron-down"
                          size={18}
                          color="#434242"
                        />
                      )}
                      ArrowUpIconComponent={() => (
                        <FontAwesome6
                          name="chevron-up"
                          size={18}
                          color="#434242"
                        />
                      )}
                      listItemLabelStyle={styles.itemLabelStyle}
                      zIndex={5000 - qIndex * 100 - wIndex}
                      zIndexInverse={1000 + qIndex * 100 + wIndex}
                    />
                  </View>
                ) : (
                  <Text
                    key={`word-${qIndex}-${wIndex}`}
                    style={styles.wordText}
                  >
                    {word}{" "}
                  </Text>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    rowGap: 15,
  },
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  audioButton: {
    backgroundColor: "#FFBF18",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  wordsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  dropdownContainer: {
    marginHorizontal: 5,
    width: 120,
    zIndex: 5000,
  },
  dropdown: {
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DEDFE2",
    minHeight: 40,
  },
  dropdownListContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DEDFE2",
    borderWidth: 1,
  },
  placeholderStyle: {
    fontSize: 20,
    lineHeight: 20,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 20,
    color: "#333",
    fontWeight: "500",
  },
  itemLabelStyle: {
    fontSize: 18,
    color: "#434242",
  },
  wordText: {
    fontSize: 18,
    color: "#434242",
    lineHeight: 40,
  },
});

export default memo(HomonymQuestionCard);
