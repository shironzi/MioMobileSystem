import { router } from "expo-router";

export default function takeActivity(
  role: string,
  subjectId: string,
  activity_type: string,
  phoneme: string,
  activityId: string,
  difficulty: string,
) {
  router.push({
    pathname:
      role === "teacher"
        ? "/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity"
        : "/subject/(exercises)/(speech)/Flashcards",
    params: {
      subjectId,
      activity_type,
      difficulty,
      activityId,
      phoneme,
    },
  });
}
