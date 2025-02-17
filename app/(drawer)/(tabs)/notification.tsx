import { ScrollView } from "react-native";
import React, { memo } from "react";

import NotificationCard from "@/components/NotificationCard";

const data = [
  {
    title: "Notification Title",
    date: new Date(Date.now()),
    time: "10:00 AM",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!",
    type: "activity",
  },
];

const notification = () => {
  const now = new Date();
  const filteredData = data.filter((item) => now > item.date);
  const dateList = filteredData.map((data) => data.date);

  return (
    <ScrollView>
      <NotificationCard
        title="Notification Title"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="activity"
      />
    </ScrollView>
  );
};

export default memo(notification);
