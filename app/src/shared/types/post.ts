/** スポットに紐づくユーザーの口コミ・写真投稿 */
export interface Post {
  id: string;
  userId: string;
  spotId: string;
  caption: string;
  images: string[];
  likeCount: number;
  /** ISO 8601形式の日時文字列 */
  createdAt: string;
}
