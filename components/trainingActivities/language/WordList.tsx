import React, { ReactElement, useEffect, useState, useRef, memo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSharedValue, runOnUI, runOnJS } from "react-native-reanimated";

import SortableWord from "./SortableWord";
import Lines from "./Lines";
import { MARGIN_LEFT } from "./Layout";

const containerWidth = Dimensions.get("window").width * 0.8;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: MARGIN_LEFT,
    marginTop: 0,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    opacity: 1,
  },
});

interface WordListProps {
  children: ReactElement<{ id: number; word: string }>[];
  onSentenceChange: (sentence: string) => void;
}

const WordList = ({ children, onSentenceChange }: WordListProps) => {
  const [ready, setReady] = useState(false);
  const previousSentenceRef = useRef<string>("");

  const offsets = children.map(() => ({
    order: useSharedValue(0),
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0),
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  useEffect(() => {
    if (ready) {
      const interval = setInterval(() => {
        const currentOrder = [];
        for (let i = 0; i < offsets.length; i++) {
          if (offsets[i].order.value >= 0) {
            currentOrder.push({
              word: children[i].props.word,
              order: offsets[i].order.value,
            });
          }
        }

        currentOrder.sort((a, b) => a.order - b.order);
        const newSentence = currentOrder.map((item) => item.word).join(" ");

        if (newSentence !== previousSentenceRef.current) {
          previousSentenceRef.current = newSentence;

          if (onSentenceChange) {
            onSentenceChange(newSentence);
          }
        }
      }, 700);

      return () => clearInterval(interval);
    }
  }, [ready, offsets, children, onSentenceChange]);

  if (!ready) {
    return (
      <View style={styles.row}>
        {children.map((child, index) => {
          return (
            <View
              key={index}
              onLayout={({
                nativeEvent: {
                  layout: { x, y, width, height },
                },
              }) => {
                const offset = offsets[index]!;
                offset.order.value = -1;
                offset.width.value = width;
                offset.height.value = height;
                offset.originalX.value = x;
                offset.originalY.value = y;
                runOnUI(() => {
                  "worklet";
                  if (
                    offsets.filter((o) => o.order.value !== -1).length === 0
                  ) {
                    runOnJS(setReady)(true);
                  }
                })();
              }}
            >
              {child}
            </View>
          );
        })}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {children.map((child, index) => (
        <SortableWord
          key={index}
          offsets={offsets}
          index={index}
          containerWidth={containerWidth}
        >
          {child}
        </SortableWord>
      ))}
      <Lines />
    </View>
  );
};

export default memo(WordList);
