import { MaterialIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const NotificationCard = (props: {
  title: string;
  desc: string;
  time: string;
  type: string;
  handleDelete: () => void;
}) => {
  const translatedX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0 && e.translationX > -110) {
        translatedX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translatedX.value < -90) {
        translatedX.value = withTiming(-1000, { duration: 1500 });
        runOnJS(props.handleDelete)();
      }
      translatedX.value = withTiming(0, { duration: 700 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translatedX.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.iconBackground}>
          <MaterialIcons name="delete" size={32} color="white" />
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Image
              source={require("@/assets/images/icons/earthquakeIcon.png")}
              style={{ height: 50, width: 50 }}
            />
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>{props.title}</Text>
                <Text>{props.time}</Text>
              </View>
              <View>
                <Text>{props.desc}</Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: 120,
    justifyContent: "center",
  },
  iconBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FF5646",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 30,
  },
  card: {
    backgroundColor: "white",
    height: "100%",
    justifyContent: "center",
    paddingVertical: 25,
    paddingHorizontal: 60,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    flexDirection: "row",
    columnGap: 30,
    width: "100%",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default memo(NotificationCard);
