import { Link } from 'react-router-dom';

type SpotPostListProps = { spotId: string };

export default function SpotPostList({ spotId }: SpotPostListProps) {
  return <div className="mt-3 border-t border-line pt-3">
    <Link className="text-xs font-bold text-brand-blue" to={`/posts?spotId=${encodeURIComponent(spotId)}`}>この店・イベントの口コミを見る</Link>
  </div>;
}
