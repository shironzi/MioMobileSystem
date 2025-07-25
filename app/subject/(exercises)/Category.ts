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
    router.push({
      pathname:
        role === "teacher"
          ? "/subject/(exercises)/(speech)/ManageActivity/AddSpeechActivity"
          : ("/subject/(exercises)/(speech)/MicrophoneTest" as any),
      params: {
        subjectId: subjectId,
        activity_type: activity_type,
        difficulty: difficulty,
        category: category,
        activityId: activityId,
        prevAttemptId: attemptId,
      },
    });
  }

  if (category === "auditory") {
    if (activity_type === "bingo") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
            : "/subject/(exercises)/(auditory)/SpeakerTest",
        // : "/subject/(exercises)/(auditory)/bingo",
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

    if (activity_type === "matching") {
      router.push({
        pathname:
          role === "teacher"
            ? "/subject/(exercises)/(auditory)/ManageAuditoryActivity/AddAuditoryActivity"
            : "/subject/(exercises)/(auditory)/SpeakerTest",
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
          prevAttemptId: attemptId,
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
          prevAttemptId: attemptId,
        },
      });
    }
  }
}
