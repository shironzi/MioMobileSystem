import { View } from "react-native";
import { useState } from "react";
import useHeaderConfig from "@/utils/HeaderConfig";

interface Props {
  video_url: string;
}

const AuditoryWord = ({ video_url }: Props) => {
  useHeaderConfig("Modules");

  const [show, setShow] = useState<boolean>(false);

  return <View style={{ backgroundColor: "#fff", height: "100%" }}></View>;
};

export default AuditoryWord;
