export interface Flashcard {
  flashcard_id: string;
  text: string;
  image_url: string;
}

export interface Schedule {
  has_schedule: boolean;
  message: string;
  date: string;
  start_time: string;
  end_time: string;
}

export const defaultSchedule: Schedule = {
  has_schedule: false,
  message: "",
  date: "",
  start_time: "",
  end_time: "",
};
