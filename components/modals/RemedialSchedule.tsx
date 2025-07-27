import { Text, TouchableOpacity, View } from "react-native";
import globalStyles from "@/styles/globalStyles";
import { Image } from "expo-image";

interface Props {
  message: string;
  has_schedule: boolean;
}

const RemedialSchedule = ({ message, has_schedule }: Props) => {
  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      <View style={[globalStyles.cardContainer1]}>
        <Image
          source={require("@/assets/images/oops.png")}
          style={{ width: 250, height: 250, marginHorizontal: "auto" }}
        />

        {has_schedule ? (
          <View></View>
        ) : (
          <View>
            <Text style={[{ textAlign: "center" }]}>{message}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[globalStyles.submitButton, { marginHorizontal: "auto" }]}
        >
          <Text style={globalStyles.submitButtonText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RemedialSchedule;
