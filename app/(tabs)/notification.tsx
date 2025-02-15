import { ScrollView } from "react-native";
import React from "react";

import NotificationCard from "@/components/NotificationCard";

const notification = () => {
  return (
    <ScrollView>
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
      <NotificationCard />
    </ScrollView>
  );
};

export default notification;
