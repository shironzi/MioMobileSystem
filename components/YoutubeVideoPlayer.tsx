import React, { useState, useCallback } from "react";
import { View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function YoutubeVideoPlayer({
  video_url,
}: {
  video_url: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(video_url);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <YoutubePlayer
        height={200}
        width={300}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
      />
    </View>
  );
}
