export async function getActivityTypeName(activityType: string) {
  if (activityType === "phrase") {
    return "Reading Flashcards";
  } else if (activityType === "question") {
    return "Word Flashcards";
  } else if (activityType === "picture") {
    return "Picture Flashcards";
  } else if (activityType === "bingo") {
    return "Piddie Says";
  } else if (activityType === "matching") {
    return "Matching Cards";
  }
}
