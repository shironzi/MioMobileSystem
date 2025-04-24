import React, { memo, useCallback, useRef, useEffect } from "react";
import { Card } from "@rneui/themed";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Swipeable, RectButton } from "react-native-gesture-handler";

const NotificationCard = (props: {
  title: string;
  desc: string;
  type: string;
  onDismiss: () => void;
  onSwipeStart?: () => void;
}) => {
  const router = useRouter();
  const swipeableRef = useRef<Swipeable>(null);

  useEffect(() => {
    return () => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };
  }, []);

  const renderIcon = useCallback(() => {
    switch (props.type.toLowerCase()) {
      case "activity":
        return (
          <MaterialIcons
            name="event"
            size={45}
            color="black"
            style={{ padding: 23 }}
          />
        );
      case "warning":
        return (
          <Entypo
            name="warning"
            size={45}
            color="black"
            style={{ padding: 23 }}
          />
        );
      case "fire":
        return (
          <FontAwesome5
            name="fire"
            size={45}
            color="black"
            style={{ padding: 23 }}
          />
        );
      default:
        return (
          <MaterialIcons
            name="notifications"
            size={45}
            color="gray"
            style={{ padding: 23 }}
          />
        );
    }
  }, [props.type]);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [0, 0, 0, 50],
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.5, 0],
    });

    return (
      <RectButton
        style={styles.rightAction}
        onPress={() => {
          if (swipeableRef.current) {
            swipeableRef.current.close();
            setTimeout(props.onDismiss, 200);
          }
        }}
      >
        <Animated.View
          style={[
            styles.dismissContainer,
            { transform: [{ translateX: trans }], opacity },
          ]}
        >
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.dismissText}>Dismiss</Text>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => props.onSwipeStart?.()}
      onSwipeableRightOpen={() => {
        setTimeout(props.onDismiss, 200);
      }}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      overshootRight={false}
    >
      <TouchableOpacity
        accessibilityLabel={`Notification: ${props.title}`}
        onPress={() =>
          props.type.toLowerCase() === "message"
            ? router.navigate("/(notification)/messageDetails")
            : router.navigate("/(notification)/notificationDetails")
        }
      >
        <Card containerStyle={{ paddingLeft: 0, margin: 0 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {renderIcon()}
            <View style={styles.contentContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{props.title}</Text>
              </View>
              <Text style={styles.description}>
                {props.desc.length > 100
                  ? props.desc.substring(0, 100 - 3) + "..."
                  : props.desc}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    height: 60,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  rightAction: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  dismissContainer: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "100%",
  },
  dismissText: {
    color: "white",
    fontWeight: "bold",
    marginTop: 4,
  },
});

export default memo(NotificationCard);
