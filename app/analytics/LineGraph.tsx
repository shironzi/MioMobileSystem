import React from "react";
import { Text, View } from "react-native";
import { RadarChart } from "react-native-gifted-charts";

interface TotalPerDifficulty {
  phrase?: {
    easy?: number;
    average?: number;
    difficulty?: number;
    challenge?: number;
  };
  picture?: {
    easy?: number;
    average?: number;
    difficulty?: number;
    challenge?: number;
  };
  question?: {
    easy?: number;
    average?: number;
    difficulty?: number;
    challenge?: number;
  };
  bingo?: {
    easy?: number;
    average?: number;
    difficulty?: number;
    challenge?: number;
  };
  matching?: {
    easy?: number;
    average?: number;
    difficulty?: number;
    challenge?: number;
  };
  fill?: {
    easy?: number;
    average?: number;
    difficulty?: number;
    challenge?: number;
  };
  homonyms?: {
    easy?: number;
    average?: number;
    difficulty?: number;
    challenge?: number;
  };
}

const LineGraph = ({
  data,
  difficulty,
}: {
  data: TotalPerDifficulty | undefined;
  difficulty: "easy" | "average" | "difficulty" | "challenge";
}) => {
  const safeGetValue = (
    category: any,
    difficulty: "easy" | "average" | "difficulty" | "challenge",
  ): number => {
    return category?.[difficulty] ?? 0;
  };

  if (!data) {
    return (
      <View>
        <Text>No data available</Text>
      </View>
    );
  }

  const phraseEasy = safeGetValue(data.phrase, difficulty);
  const pictureEasy = safeGetValue(data.picture, difficulty);
  const questionEasy = safeGetValue(data.question, difficulty);
  const homonymsEasy = safeGetValue(data.homonyms, difficulty);
  const fillEasy = safeGetValue(data.fill, difficulty);
  const bingoEasy = safeGetValue(data.bingo, difficulty);
  const matchingEasy = safeGetValue(data.matching, difficulty);

  const chartData = [
    phraseEasy,
    pictureEasy,
    questionEasy,
    homonymsEasy,
    fillEasy,
    bingoEasy,
    matchingEasy,
  ];
  const chartLabels = [
    "Reading Flashcards",
    "Word Flashcards",
    "Picture Flashcards",
    "Homonyms",
    "Fill in the Blanks",
    "Piddie Says",
    "Matching Cards",
  ];
  const dataLabels = chartData.map((value) => `${value}`);

  const maxValue = Math.max(...chartData, 10);

  const PolygonConfig = {
    fill: "#DEFFCB80",
    stroke: "#439558",
    opacity: 80,
    showDataValuesAsLabels: false,
    strokeWidth: 1.5,
  };

  return (
    <View>
      <RadarChart
        data={chartData}
        labels={chartLabels}
        labelConfig={{
          stroke: "#1F1F1F80",
          fontWeight: "500",
          fontSize: 12,
        }}
        chartSize={300}
        polygonConfig={PolygonConfig}
        dataLabels={dataLabels}
        hideAsterLines
        labelsPositionOffset={0}
        dataLabelsPositionOffset={10}
        maxValue={maxValue}
      />
    </View>
  );
};

export default LineGraph;
