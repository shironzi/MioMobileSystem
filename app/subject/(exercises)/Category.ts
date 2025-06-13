import { router } from "expo-router";

interface Params {
  category: string;
  activity_type: string;
  role: string;
  subjectId: string;
  activityId: string;
  difficulty: string;
  attemptId?: string;
}

export default function handleCategory({
  category,
  activity_type,
  role,
  subjectId,
  activityId,
  difficulty,
  attemptId = "",
}: Params) {
  if (category === "speech") {
    if (activity_type === "picture") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity"
            : "/subject/(exercises)/(speech)/PictureFlashcards",
        params: {
          subjectId,
          activity_type,
          difficulty,
          category,
          activityId,
          prevAttemptId: attemptId,
        },
      });
    }

    if (
      activity_type === "phrase" ||
      activity_type === "question" ||
      activity_type === "pronunciation"
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
          category,
          activityId,
          attemptId,
        },
      });
    }
  }

  if (category === "auditory") {
    if (activity_type === "bingo") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
            : "/subject/(exercises)/(auditory)/bingo",
        params: {
          subjectId,
          activity_type,
          difficulty,
          category,
          activityId,
          attemptId,
        },
      });
    }

    if (activity_type === "matching") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
            : "/subject/(exercises)/(auditory)/MatchingCards",
        params: {
          subjectId,
          activity_type,
          difficulty,
          category,
          activityId,
          attemptId,
        },
      });
    }
  }

  if (category === "language") {
    if (activity_type === "fill") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/ManageActivity/AddLanguageActivity"
            : "/subject/(exercises)/(language)/fillInTheBlank",
        params: {
          subjectId,
          activity_type,
          difficulty,
          category,
          activityId,
          attemptId,
        },
      });
    }

    if (activity_type === "homonyms") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/ManageActivity/AddLanguageActivity"
            : "/subject/(exercises)/(language)/Homonyms",
        params: {
          subjectId,
          activity_type,
          difficulty,
          category,
          activityId,
          attemptId,
        },
      });
    }
  }
}
