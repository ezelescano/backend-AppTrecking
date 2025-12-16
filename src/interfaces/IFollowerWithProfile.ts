export interface FollowerWithProfile {
  following_user_id: string;
  userProfile: {
    id: string;
    user_name: string | null;
    avatar_url: string | null;
  } | null;
}
