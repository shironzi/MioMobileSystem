import React, { memo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";

const AnswerQuizCard = (props: {
  questionNum: number;
  question: string;
  choices: string[];
  type: string;
}) => {
  const [answer, setAnswer] = useState<string>();

  const handleAnswer = (answer: string) => {
    setAnswer(answer);
  };

  return (
    <View>
      <Text>Question {props.questionNum + 1}</Text>

      <Text>{props.question}</Text>
      {props.type === "identification" && (
        <View>
          <TextInput
            style={globalStyles.inputContainer}
            placeholder={"Answer"}
          />
        </View>
      )}

      {props.type === "true_false" && (
        <View>
          <TouchableOpacity
            onPress={() => handleAnswer("true")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 15,
              width: "100%",
            }}
          >
            {answer === "true" ? (
              <FontAwesome6 name="circle-dot" size={24} color="#FFBF18" />
            ) : (
              <Feather name="circle" size={24} />
            )}
            <Text>True</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAnswer("false")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              columnGap: 15,
            }}
          >
            {answer === "false" ? (
              <FontAwesome6 name="circle-dot" size={24} color="#FFBF18" />
            ) : (
              <Feather name="circle" size={24} />
            )}
            <Text>False</Text>
          </TouchableOpacity>
        </View>
      )}

      {props.type === "multiple_choice" && (
        <View>
          {props.choices.map((choice) => (
            <View>
              <TouchableOpacity
                onPress={() => handleAnswer(choice)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 15,
                }}
              >
                {answer === choice ? (
                  <FontAwesome6 name="circle-dot" size={24} color="#FFBF18" />
                ) : (
                  <Feather name="circle" size={24} />
                )}
                <Text>{choice}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default memo(AnswerQuizCard);
