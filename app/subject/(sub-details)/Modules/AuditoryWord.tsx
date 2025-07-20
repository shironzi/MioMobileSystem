import useHeaderConfig from "@/utils/HeaderConfig";
import { useAudioPlayer } from "expo-audio";
import { memo, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import globalStyles from "@/styles/globalStyles";
import YoutubeVideoPlayer from "@/components/YoutubeVideoPlayer";

interface Props {
  text: string;
  video_link?: string;
}

const HUME_TTS_URL = "https://api.hume.ai/v0/tts";
const HUME_API_KEY = "J2md8OWBoYeMpZsENhGmr1AmR5yoKnBDA5p4aGA1JxdjosEn";

const AuditoryWord = ({ text, video_link }: Props) => {
  useHeaderConfig("Modules");

  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const player = useAudioPlayer();

  const playTTS = async () => {
    setLoading(true);
    if (!text.trim().length) return;

    try {
      const response = await fetch(HUME_TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hume-Api-Key": HUME_API_KEY,
        },
        body: JSON.stringify({
          utterances: [
            {
              text: text,
              description:
                "Neutral female voice, articulate and clear, standard American English.",
            },
          ],
        }),
      });

      const result = await response.json();
      const base64Audio = result?.generations?.[0]?.audio;
      console.log(result);

      if (!base64Audio) {
        Alert.alert("Error", "Failed to play audio. Please try again later!");
        setLoading(false);
        return;
      }

      const audioUri = `data:audio/mp3;base64,${base64Audio}`;
      player.replace(audioUri);

      player.play();
    } catch (error) {
      Alert.alert("Error", "Failed to play audio. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 20,
          width: "90%",
        }}
        onPress={playTTS}
        disabled={loading}
      >
        <FontAwesome6
          name="volume-high"
          size={30}
          color={"#FFBF18"}
          // color={ "#FFBF18" : "#0000000"}
        />
        <Text style={[globalStyles.text1]}>{text}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShow(!show)}>
        <FontAwesome5 name="question-circle" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => setShow(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <YoutubeVideoPlayer video_url={video_link ?? ""} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShow(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default memo(AuditoryWord);
