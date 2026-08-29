import type { Post } from '../shared/types';

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
    userId: 'user-taro',
    spotId: 'spot-11',
    caption: '焼きそば、行列だったけど並ぶ価値あり！',
    images: [],
    likeCount: 5,
    createdAt: '2026-08-15T12:00:00+09:00',
  },
];
