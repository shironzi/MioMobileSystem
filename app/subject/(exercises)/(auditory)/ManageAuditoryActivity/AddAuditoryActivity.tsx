import React, { memo, useEffect, useState } from "react";
import { Text, View } from "react-native";
import HeaderConfig from "@/utils/HeaderConfig";
import Animated, { LinearTransition } from "react-native-reanimated";
import AddBingoCards from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddBingoCards";
import AddMatchingCards from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddMatchingCards";
import { router, useLocalSearchParams } from "expo-router";
import ListHeader from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/ListHeader";
import ListFooter from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/ListFooter";
import {
  getBingoActivityById,
  getMatchingActivityById,
} from "@/utils/auditory";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Items {
  id: string;
  file: FileInfo | null;
  image_id: string | null;
  image_path: string | null;
}

interface Audio {
  filename: string | null;
  audio_id: string | null;
  audio_path: string | null;
  audio: FileInfo | null;
}

const AddAuditoryActivity = () => {
  HeaderConfig("Add Auditory Activity");

  const { subjectId, activity_type, difficulty, category, activityId } =
    useLocalSearchParams<{
      subjectId: string;
      activity_type: string;
      difficulty: string;
      category: string;
      activityId: string;
    }>();
  const [bingoItems, setBingoItems] = useState<Items[]>([
    { id: "0", file: null, image_path: null, image_id: null },
  ]);
  const [matchingItems, setMatchingItems] = useState<Items[]>([
    {
      id: "0",
      file: null,
      image_path: null,
      image_id: null,
    },
  ]);
  const [bingoAudio, setBingoAudio] = useState<Audio[]>([]);
  const [matchingAudio, setMatchingAudio] = useState<Audio[]>([]);
  const [matchingAnswers, setMatchingAnswers] = useState<
    { image_id: string; audio_id: string }[]
  >([]);
  const [activityType, setActivityType] = useState<string>("bingo");
  const [activityDifficulty, setActivityDifficulty] = useState<string>("easy");
  const [loading, setLoading] = useState<boolean>(true);

  const handleFileUpload = (index: number, file: FileInfo) => {
    if (activityType === "bingo") {
      setBingoItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], file };
        return updated;
      });
    } else {
      setMatchingItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], file };
        return updated;
      });
    }
  };

  const handleRemoveBingoItem = (index: number) => {
    if (
      index === 0 &&
      (activityType === "bingo"
        ? bingoItems.length <= 1
        : matchingItems.length <= 1)
    ) {
      console.error("Cannot remove the last item.");
      return;
    }

    if (activityType === "bingo") {
      setBingoItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      setMatchingItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddItem = () => {
    if (activityType === "bingo") {
      setBingoItems((prev) => {
        const lastItem = prev[prev.length - 1];
        if (lastItem?.file !== null || lastItem?.image_path !== null) {
          const newId = (parseInt(lastItem.id) + 1).toString() + "b";
          return [
            ...prev,
            { id: newId, file: null, image_path: null, image_id: null },
          ];
        }
        return prev;
      });
    } else {
      setMatchingItems((prev) => {
        const lastItem = prev[prev.length - 1];
        if (lastItem?.file !== null || lastItem?.image_path !== null) {
          const newId = (parseInt(lastItem.id) + 1).toString() + "b";
          return [
            ...prev,
            { id: newId, file: null, image_path: null, image_id: null },
          ];
        }
        return prev;
      });
    }
  };

  const handleAddAudio = () => {
    if (activityType === "bingo") {
      setBingoAudio((prev) => {
        const lastItem = prev[prev.length - 1];
        if (
          !lastItem ||
          lastItem.audio !== null ||
          lastItem.audio_path !== null
        ) {
          return [
            ...prev,
            { audio_path: null, audio_id: null, audio: null, filename: null },
          ];
        }
        return prev;
      });
    } else {
      setMatchingAudio((prev) => {
        const lastItem = prev[prev.length - 1];
        if (
          !lastItem ||
          lastItem.audio !== null ||
          lastItem.audio_path !== null
        ) {
          return [
            ...prev,
            { audio_path: null, audio_id: null, audio: null, filename: null },
          ];
        }
        return prev;
      });
    }
  };

  const handleAudioRemove = (index: number) => {
    if (
      index === 0 &&
      (activityType === "bingo"
        ? bingoItems.length <= 1
        : matchingItems.length <= 1)
    ) {
      console.error("Cannot remove the last item.");
      return;
    }

    if (activityType === "bingo") {
      setBingoAudio((prev) => prev.filter((_, i) => i !== index));
    } else {
      setMatchingAudio((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAudioUpload = (index: number, audio: FileInfo) => {
    if (activityType === "bingo") {
      setBingoAudio((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], audio };
        return updated;
      });
    } else {
      setMatchingAudio((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], audio };
        return updated;
      });
    }
  };

  const handleRoute = () => {
    if (activityType === "bingo") {
      if (bingoItems.length !== 9 && bingoItems.length !== 12) {
        console.error("Images must be either 9 or 12.");
        return;
      }
      if (bingoAudio.length < 1) {
        console.error("There must be at least 1 audio.");
        return;
      }

      const encodedItems = encodeURIComponent(JSON.stringify(bingoItems)) ?? [];
      const encodedAudio = encodeURIComponent(JSON.stringify(bingoAudio)) ?? [];

      router.push({
        pathname: "/subject/ManageAuditoryActivity/BingoPreview",
        params: {
          subjectId,
          activityType,
          activityDifficulty,
          activityId: activityId,
          bingoItems: encodedItems,
          bingoAudio: encodedAudio,
        },
      });
    } else if (activityType === "matching") {
      if (matchingAudio.length !== 5 || matchingItems.length !== 5) {
        console.error("There must be exactly 5 audios and 5 images.");
        return;
      }

      const encodedItems =
        encodeURIComponent(JSON.stringify(matchingItems)) ?? [];
      const encodedAudios =
        encodeURIComponent(JSON.stringify(matchingAudio)) ?? [];
      const encodedAnswer =
        encodeURIComponent(JSON.stringify(matchingAnswers)) ?? [];

      router.push({
        pathname: "/subject/ManageAuditoryActivity/MatchingPreview",
        params: {
          subjectId,
          activityType,
          activityDifficulty,
          activityId: activityId,
          matchingItems: encodedItems,
          matchingAudio: encodedAudios,
          matchingAnswers: encodedAnswer,
        },
      });
    }
  };

  useEffect(() => {
    if (activityId) {
      const fetchActivity = async () => {
        if (activity_type === "bingo") {
          const res = await getBingoActivityById(
            subjectId,
            activity_type,
            difficulty,
            activityId,
          );
          setBingoItems(res.items);
          setBingoAudio(res.audio);
        } else if (activity_type === "matching") {
          const res = await getMatchingActivityById(
            subjectId,
            activity_type,
            difficulty,
            activityId,
          );
          setMatchingItems(res.items);
          setMatchingAudio(res.audio);
          setMatchingAnswers(res.answers);
          setActivityType("matching");
        }
        setLoading(false);
      };
      fetchActivity();
    }
  }, []);

  if (loading && activityId) {
    return (
      <View>
        <Text>loading.....</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (activityType === "bingo") {
      return (
        <AddBingoCards
          isFirst={index === 0}
          index={index}
          image_path={item.image_path}
          image={item.file ?? null}
          handleFileRemove={() => handleRemoveBingoItem(index)}
          handleFileUpload={(file: FileInfo) => handleFileUpload(index, file)}
        />
      );
    } else if (activityType === "matching") {
      return (
        <AddMatchingCards
          isFirst={index === 0}
          index={index}
          image_path={item.image_path}
          image={item.file ?? null}
          handleFileRemove={() => handleRemoveBingoItem(index)}
          handleFileUpload={(file: FileInfo) => handleFileUpload(index, file)}
        />
      );
    }
    return null;
  };

  return (
    <View>
      {activityType === "bingo" && (
        <Animated.FlatList
          data={bingoItems}
          keyExtractor={(item) => item.image_path ?? item.id}
          ListHeaderComponent={() =>
            !activityId && (
              <ListHeader
                activityType={activityType}
                setActivityType={(value: string) => setActivityType(value)}
                activityDifficulty={activityDifficulty}
                setActivityDifficulty={(value: string) =>
                  setActivityDifficulty(value)
                }
              />
            )
          }
          ListFooterComponent={() => (
            <ListFooter
              activityId={activityId}
              activityType={activityType}
              handleAudioRemove={(index) => handleAudioRemove(index)}
              bingoAudio={bingoAudio}
              handleAddAudio={handleAddAudio}
              handleAddItem={handleAddItem}
              handleRoute={handleRoute}
              matchingAudio={matchingAudio}
              handleAudioUpload={(index, file) =>
                handleAudioUpload(index, file)
              }
            />
          )}
          renderItem={({ item, index }) => renderItem({ item, index })}
          itemLayoutAnimation={LinearTransition}
        />
      )}
      {activityType === "matching" && (
        <Animated.FlatList
          data={matchingItems}
          keyExtractor={(item) => item.image_path ?? item.id}
          ListHeaderComponent={() =>
            !activityId && (
              <ListHeader
                activityType={activityType}
                setActivityType={(value: string) => setActivityType(value)}
                activityDifficulty={activityDifficulty}
                setActivityDifficulty={(value: string) =>
                  setActivityDifficulty(value)
                }
              />
            )
          }
          ListFooterComponent={() => (
            <ListFooter
              activityId={activityId}
              activityType={activityType}
              handleAudioRemove={(index) => handleAudioRemove(index)}
              bingoAudio={bingoAudio}
              handleAddAudio={handleAddAudio}
              handleAddItem={handleAddItem}
              handleRoute={handleRoute}
              matchingAudio={matchingAudio}
              handleAudioUpload={(index, file) =>
                handleAudioUpload(index, file)
              }
            />
          )}
          renderItem={({ item, index }) => renderItem({ item, index })}
          itemLayoutAnimation={LinearTransition}
        />
      )}
    </View>
  );
};

export default memo(AddAuditoryActivity);
