import { Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Image } from "expo-image";
import { formatTime12Hour2 } from "@/utils/DateFormat";
import { router } from "expo-router";

interface Props {
  message: string;
  has_schedule: boolean;
  date: string;
  end_time: string;
  start_time: string;
}

const RemedialSchedule = ({
  message,
  has_schedule,
  date,
  end_time,
  start_time,
}: Props) => {
  const newDate = new Date(date).toDateString();
  const newEnd = formatTime12Hour2(end_time);
  const newStart = formatTime12Hour2(start_time);

  const handleRoute = () => {
    router.back();
    router.back();
  };

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={[globalStyles.cardContainer1]}>
        <Image
          source={require("@/assets/images/oops.png")}
          style={{ width: 250, height: 250, marginHorizontal: "auto" }}
        />

        <Text style={[{ textAlign: "center" }]}>{message}</Text>
        {has_schedule && (
          <View style={{ rowGap: 5 }}>
            <Text
              style={[
                globalStyles.text1,
                { textAlign: "center", fontSize: 14 },
              ]}
            >
              🗓️ {newDate}
            </Text>
            <Text
              style={[
                globalStyles.text1,
                { textAlign: "center", fontSize: 14 },
              ]}
            >
              ⏰ {newStart} to {newEnd}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
          onPress={handleRoute}
        >
          <Text style={globalStyles.submitButtonText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RemedialSchedule;
