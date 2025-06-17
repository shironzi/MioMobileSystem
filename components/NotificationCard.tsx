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
import globalStyles from "@/styles/globalStyles";

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
            <View
              style={{
                width: "20%",
                marginVertical: "auto",
              }}
            >
              <Image
                source={require("@/assets/images/icons/earthquakeIcon.png")}
                style={{
                  height: 50,
                  width: 50,
                  marginHorizontal: "auto",
                  marginTop: -5,
                }}
              />
            </View>
            <View style={{ width: "70%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[globalStyles.title, { paddingRight: 20 }]}
                >
                  {props.title}
                </Text>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[globalStyles.title, { paddingRight: 20 }]}
                >
                  {props.time}
                </Text>
              </View>
              <View>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={3}
                  style={[globalStyles.label, { paddingRight: 20 }]}
                >
                  {props.desc}
                </Text>
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
    borderRadius: 20,
    height: 110,
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  iconBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FF5646",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00000024",
  },
  card: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00000024",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default memo(NotificationCard);
