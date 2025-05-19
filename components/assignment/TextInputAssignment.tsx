import globalStyles from "@/styles/globalStyles";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const TextInputAssignment = (props: {
  handleSubmit: (answer: string) => void;
}) => {
  const [descHeight, setDescHeight] = useState<number>(200);
  const [answer, setAnswer] = useState<string>("");

  const processSubmit = () => {
    props.handleSubmit(answer);
  };

  return (
    <View style={[globalStyles.cardContainer, { rowGap: 20 }]}>
      <TextInput
        placeholder="Your Answer Here"
        style={[
          globalStyles.inputContainer,
          { height: Math.max(200, descHeight) },
        ]}
        multiline
        onContentSizeChange={(e) =>
          setDescHeight(e.nativeEvent.contentSize.height)
        }
        textAlignVertical="top"
        onChangeText={setAnswer}
      />
      <TouchableOpacity
        style={globalStyles.submitButton}
        onPress={processSubmit}
      >
        <Text style={globalStyles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TextInputAssignment;
