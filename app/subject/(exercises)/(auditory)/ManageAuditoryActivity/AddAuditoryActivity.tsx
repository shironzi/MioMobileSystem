import AddBingoCards from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddBingoCards";
import AddMatchingCards from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddMatchingCards";
import ListFooter from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/ListFooter";
import ListHeader from "@/app/subject/(exercises)/(auditory)/ManageAuditoryActivity/ListHeader";
import LoadingCard from "@/components/loadingCard";
import {
  getBingoActivityById,
  getMatchingActivityById,
} from "@/utils/auditory";
import HeaderConfig from "@/utils/HeaderConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

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
  audio_path: string;
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
  const [activityTitle, setActivityTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<boolean>(false);

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
            { audio_path: "", audio_id: null, audio: null, filename: null },
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
            { audio_path: "", audio_id: null, audio: null, filename: null },
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

  const [bingoError, setBingoError] = useState<{
    errorMessage: string;
    error: string;
  }>({ errorMessage: "", error: "" });
  const [matchingError, setMatchingError] = useState<{
    errorMessage: string;
    error: string;
  }>({ errorMessage: "", error: "" });

  const handleRoute = () => {
    if (!activityTitle.trim()) {
      setTitleError(true);
      return;
    }

    setTitleError(false);

    if (activityType === "bingo") {
      if (bingoItems.length !== 9 && bingoItems.length !== 12) {
        setBingoError({
          error: "images",
          errorMessage: "Images must be either 9 or 12 images.",
        });
        return;
      }
      if (bingoAudio.length < 1) {
        setBingoError({
          error: "audio",
          errorMessage: "There must be at least 1 audio.",
        });
        return;
      }

      setBingoError({ errorMessage: "", error: "" });

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
          title: activityTitle,
        },
      });
    } else if (activityType === "matching") {
      if (matchingAudio.length !== matchingItems.length) {
        setMatchingError({
          errorMessage:
            "The number of audio items does not match the number of matching images.",
          error: "length",
        });
        return;
      }

      if (matchingAudio.length > 5 || matchingItems.length > 5) {
        setMatchingError({
          errorMessage: `You can only have a maximum of 5 items.`,
          error: "max",
        });
        return;
      }

      setMatchingError({ errorMessage: "", error: "" });

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
          title: activityTitle,
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
          setActivityTitle(res.title);
        } else if (activity_type === "matching") {
          const res = await getMatchingActivityById(
            subjectId,
            activity_type,
            difficulty,
            activityId,
          );

          console.log(res);
          setMatchingItems(res.items);
          setMatchingAudio(res.audio);
          setMatchingAnswers(res.answers);
          setActivityType("matching");
          setActivityTitle(res.title);
        }
        setLoading(false);
      };
      fetchActivity();
    }
  }, []);

  if (loading && activityId) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LoadingCard></LoadingCard>
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
          bingoError={bingoError}
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
          totalImages={matchingItems.length}
          error={matchingError}
        />
      );
    }
    return null;
  };
  // HeaderConfig(activityId ? "Update Flashcard" : "Add Flashcard");

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      {activityType === "bingo" && (
        <Animated.FlatList
          data={bingoItems}
          keyExtractor={(item) => item.image_path ?? item.id}
          ListHeaderComponent={
            <ListHeader
              activityType={activityType}
              setActivityType={(value: string) => setActivityType(value)}
              activityDifficulty={activityDifficulty}
              setActivityDifficulty={(value: string) =>
                setActivityDifficulty(value)
              }
              setActivityTitle={setActivityTitle}
              activityTitle={activityTitle}
              titleError={titleError}
              activityId={activityId}
            />
          }
          ListFooterComponent={
            <ListFooter
              activityId={activityId}
              activityType={activityType}
              handleAudioRemove={(index) => handleAudioRemove(index)}
              bingoAudio={bingoAudio}
              handleAddAudio={handleAddAudio}
              handleAddItem={handleAddItem}
              handleRoute={handleRoute}
              errors={bingoError}
              matchingAudio={matchingAudio}
              handleAudioUpload={(index, file) =>
                handleAudioUpload(index, file)
              }
            />
          }
          renderItem={({ item, index }) => renderItem({ item, index })}
          itemLayoutAnimation={LinearTransition}
        />
      )}
      {activityType === "matching" && (
        <Animated.FlatList
          data={matchingItems}
          keyExtractor={(item) => item.image_path ?? item.id}
          ListHeaderComponent={
            <ListHeader
              activityType={activityType}
              setActivityType={(value: string) => setActivityType(value)}
              activityDifficulty={activityDifficulty}
              setActivityDifficulty={(value: string) =>
                setActivityDifficulty(value)
              }
              setActivityTitle={setActivityTitle}
              activityTitle={activityTitle}
              titleError={titleError}
              activityId={activityId}
            />
          }
          ListFooterComponent={
            <ListFooter
              activityId={activityId}
              activityType={activityType}
              handleAudioRemove={(index) => handleAudioRemove(index)}
              bingoAudio={bingoAudio}
              handleAddAudio={handleAddAudio}
              handleAddItem={handleAddItem}
              handleRoute={handleRoute}
              errors={matchingError}
              matchingAudio={matchingAudio}
              handleAudioUpload={(index, file) =>
                handleAudioUpload(index, file)
              }
            />
          }
          renderItem={({ item, index }) => renderItem({ item, index })}
          itemLayoutAnimation={LinearTransition}
        />
      )}
    </View>
  );
};

export default memo(AddAuditoryActivity);
