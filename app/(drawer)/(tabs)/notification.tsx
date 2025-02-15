import { ScrollView } from "react-native";
import React, { memo } from "react";

import NotificationCard from "@/components/NotificationCard";

const notification = () => {
  return (
    <ScrollView>
      <NotificationCard
        title="Notification Title"
        date={new Date(Date.now())}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="activity"
      />
      <NotificationCard
        title="Notification Title 1"
        date={new Date("2025-02-14")}
        time="11:00 AM"
        desc="Description for notification 1"
        type="activity"
      />
      <NotificationCard
        title="Notification Title 2"
        date={new Date("2023-10-03")}
        time="12:00 PM"
        desc="Description for notification 2"
        type="warning"
      />
      <NotificationCard
        title="Notification Title 3"
        date={new Date("2023-10-04")}
        time="01:00 PM"
        desc="Description for notification 3"
        type="warning"
      />
      <NotificationCard
        title="Notification Title 4"
        date={new Date("2023-10-05")}
        time="02:00 PM"
        desc="Description for notification 4"
        type="warning"
      />
      <NotificationCard
        title="Notification Title 5"
        date={new Date("2023-10-06")}
        time="03:00 PM"
        desc="Description for notification 5"
        type="fire"
      />
      <NotificationCard
        title="Notification Title 6"
        date={new Date("2023-10-07")}
        time="04:00 PM"
        desc="Description for notification 6"
        type="fire"
      />
      <NotificationCard
        title="Notification Title 7"
        date={new Date("2023-10-08")}
        time="05:00 PM"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt eius corporis provident, officia iure deleniti, dolorum suscipit dolor, illo quod cum architecto magni ipsa aspernatur alias eveniet reprehenderit ipsum?"
        type="fire"
      />
      <NotificationCard
        title="Notification Title 8"
        date={new Date("2023-10-09")}
        time="06:00 PM"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt eius corporis provident, officia iure deleniti, dolorum suscipit dolor, illo quod cum architecto magni ipsa aspernatur alias eveniet reprehenderit ipsum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt eius corporis provident, officia iure deleniti, dolorum suscipit dolor, illo quod cum architecto magni ipsa aspernatur alias eveniet reprehenderit ipsum?"
        type="fire"
      />
      <NotificationCard
        title="Notification Title 9"
        date={new Date(Date.now())}
        time="07:00 PM"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt eius corporis provident, officia iure deleniti, dolorum suscipit dolor, illo quod cum architecto magni ipsa aspernatur alias eveniet reprehenderit ipsum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt eius corporis provident, officia iure deleniti, dolorum suscipit dolor, illo quod cum architecto magni ipsa aspernatur alias eveniet reprehenderit ipsum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero deserunt eius corporis provident, officia iure deleniti, dolorum suscipit dolor, illo quod cum architecto magni ipsa aspernatur alias eveniet reprehenderit ipsum?"
        type="fire"
      />
    </ScrollView>
  );
};

export default memo(notification);
