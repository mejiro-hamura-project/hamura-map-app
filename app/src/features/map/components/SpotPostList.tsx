import { Link } from 'react-router-dom';
import type { Post } from '../../../shared/types';

type SpotPostListProps = { spotId: string; posts: Post[] };

export default function SpotPostList({ spotId }: SpotPostListProps) {
  return <div className="mt-3 border-t border-line pt-3">
    <Link className="text-xs font-bold text-brand-blue" to={`/posts?spotId=${encodeURIComponent(spotId)}`}>この店・イベントの口コミを見る</Link>
  </div>;
}
