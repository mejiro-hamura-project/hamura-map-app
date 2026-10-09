import type { Post } from '../shared/types';
import { storeSpotId } from './stores';

// 地図のブース経由で店の投稿を確認できるダミーデータ。第1会場の「目白」（band/1）は
// 配置ツールの実際のブースに紐づいている唯一の店なので、ここに口コミを数件入れている。
const MEJIRO_SPOT_ID = storeSpotId({ style: 'band', code: '1' });

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    userId: 'user-taro',
    spotId: 'spot-d',
    caption: '地ビールがうまい。暑い日にぴったり。',
    images: [],
    likeCount: 8,
    createdAt: '2026-08-15T10:30:00+09:00',
  },
  {
    id: 'post-2',
    userId: 'user-mika',
    spotId: 'spot-stage1',
    caption: '和太鼓の演奏、迫力がすごかった👏',
    images: [],
    likeCount: 23,
    createdAt: '2026-08-15T11:05:00+09:00',
  },
  {
    id: 'post-3',
    userId: 'user-ito',
    spotId: 'spot-11',
    caption: '焼きそば、行列だったけど並ぶ価値あり！',
    images: [],
    likeCount: 5,
    createdAt: '2026-08-15T12:00:00+09:00',
  },
  {
    id: 'post-4',
    userId: 'user-aya',
    spotId: MEJIRO_SPOT_ID,
    caption: '店員さんが気さくで話しやすかったです。',
    images: [],
    likeCount: 3,
    createdAt: '2026-08-15T12:20:00+09:00',
  },
  {
    id: 'post-5',
    userId: 'user-rio',
    spotId: MEJIRO_SPOT_ID,
    caption: '目白、また来ます！',
    images: [],
    likeCount: 1,
    createdAt: '2026-08-15T12:40:00+09:00',
  },
  {
    id: 'post-6',
    userId: 'user-you',
    spotId: MEJIRO_SPOT_ID,
    caption: '初めて行きましたが良かったです。',
    images: [],
    likeCount: 0,
    createdAt: '2026-08-15T13:00:00+09:00',
  },
];
