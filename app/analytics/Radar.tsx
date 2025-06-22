import React from "react";
import { Text, View } from "react-native";
import { RadarChart } from "react-native-gifted-charts";

interface TotalPerDifficulty {
  phrase: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  picture: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  question: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  bingo: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  matching: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  fill: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
  homonyms: {
    easy: number;
    average: number;
    difficulty: number;
    challenge: number;
  };
}

const Radar = ({ Props }: { Props: TotalPerDifficulty }) => {
  const data = [
    Props.phrase.easy ?? 0,
    Props.picture.easy || 0,
    Props.question.easy || 0,
    Props.bingo.easy || 0,
    Props.matching.easy || 0,
    Props.fill.easy || 0,
    Props.homonyms.easy || 0,

    // Props.phrase.average || 0,
    // Props.picture.average || 0,
    // Props.question.average || 0,
    // Props.bingo.average || 0,
    // Props.matching.average || 0,
    // Props.fill.average || 0,
    // Props.homonyms.average || 0,
    //
    // Props.phrase.difficulty || 0,
    // Props.picture.difficulty || 0,
    // Props.question.difficulty || 0,
    // Props.bingo.difficulty || 0,
    // Props.matching.difficulty || 0,
    // Props.fill.difficulty || 0,
    // Props.homonyms.difficulty || 0,
    //
    // Props.phrase.challenge || 0,
    // Props.picture.challenge || 0,
    // Props.question.challenge || 0,
    // Props.bingo.challenge || 0,
    // Props.matching.challenge || 0,
    // Props.fill.challenge || 0,
    // Props.homonyms.challenge || 0,
  ];

  const labels = [
    "Phrase - Easy",
    "Picture - Easy",
    "Question - Easy",
    "Bingo - Easy",
    "Matching - Easy",
    "Fill - Easy",
    "Homonyms - Easy",

    // "Phrase - Average",
    // "Picture - Average",
    // "Question - Average",
    // "Bingo - Average",
    // "Matching - Average",
    // "Fill - Average",
    // "Homonyms - Average",
    //
    // "Phrase - Difficulty",
    // "Picture - Difficulty",
    // "Question - Difficulty",
    // "Bingo - Difficulty",
    // "Matching - Difficulty",
    // "Fill - Difficulty",
    // "Homonyms - Difficulty",
    //
    // "Phrase - Challenge",
    // "Picture - Challenge",
    // "Question - Challenge",
    // "Bingo - Challenge",
    // "Matching - Challenge",
    // "Fill - Challenge",
    // "Homonyms - Challenge",
  ];

  const dataLabels = [
    `$${Props.phrase.easy || 100}`,
    `$${Props.picture.easy || 100}`,
    `$${Props.question.easy || 100}`,
    `$${Props.bingo.easy || 100}`,
    `$${Props.matching.easy || 100}`,
    `$${Props.fill.easy || 100}`,
    `$${Props.homonyms.easy || 100}`,
    // `$${Props.phrase.average || 0}`,
    // `$${Props.picture.average || 0}`,
    // `$${Props.question.average || 0}`,
    // `$${Props.bingo.average || 0}`,
    // `$${Props.matching.average || 0}`,
    // `$${Props.fill.average || 0}`,
    // `$${Props.homonyms.average || 0}`,
    // `$${Props.phrase.difficulty || 0}`,
    // `$${Props.picture.difficulty || 0}`,
    // `$${Props.question.difficulty || 0}`,
    // `$${Props.bingo.difficulty || 0}`,
    // `$${Props.matching.difficulty || 0}`,
    // `$${Props.fill.difficulty || 0}`,
    // `$${Props.homonyms.difficulty || 0}`,
    // `$${Props.phrase.challenge || 0}`,
    // `$${Props.picture.challenge || 0}`,
    // `$${Props.question.challenge || 0}`,
    // `$${Props.bingo.challenge || 0}`,
    // `$${Props.matching.challenge || 0}`,
    // `$${Props.fill.challenge || 0}`,
    // `$${Props.homonyms.challenge || 0}`,
  ];

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20 }}>
        Student Progress in Specialized Trainings
      </Text>
      <RadarChart
        data={data}
        labels={labels}
        dataLabels={dataLabels}
        labelConfig={{ stroke: "blue", fontWeight: "bold" }}
        dataLabelsConfig={{ stroke: "brown" }}
        dataLabelsPositionOffset={0}
        maxValue={500}
      />
    </View>
  );
};

export default Radar;
