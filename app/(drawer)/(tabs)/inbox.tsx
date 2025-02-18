import { ScrollView, View } from "react-native";
import React, { memo } from "react";
import MessageCard from "@/components/MessageCard";

const inbox = () => {
  return (
    <ScrollView>
      <MessageCard
        title="Message"
        date={new Date(Date.now())}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date("2025-02-14")}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date("2025-02-13")}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date("2025-02-12")}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date(Date.now())}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date(Date.now())}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date(Date.now())}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date(Date.now())}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
      <MessageCard
        title="Message"
        date={new Date(Date.now())}
        time="10:00 AM"
        desc={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam accusamus aperiam vel quas minima iure, obcaecati fuga eum blanditiis, error cupiditate sit exercitationem, tempora laboriosam nisi sed molestiae impedit omnis. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit blanditiis officiis neque facilis veniam recusandae, dolore at inventore eum accusantium ut,tempora ad quos a dignissimos quae quam, odio tempore!"
        }
        type="message"
      />
    </ScrollView>
  );
};

export default memo(inbox);
