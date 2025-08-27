export interface ActivityItem {
  activityId: string;
  title: string;
}

export interface SpecializedActivity {
  activityType: string;
  difficulty: string;
  activities: ActivityItem[];
}
