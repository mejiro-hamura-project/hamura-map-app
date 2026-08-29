import { createContext, useContext, type ReactNode } from 'react';
import type { MapProvider } from './types';
import { imageMapProvider } from './ImageMapProvider';

const MapProviderContext = createContext<MapProvider>(imageMapProvider);

type MapProviderRootProps = {
  /** 差し替えたい場合のみ指定。省略時はImageMapProvider（画像座標版）を使う */
  provider?: MapProvider;
  children: ReactNode;
};

/**
 * 地図の座標変換方式をアプリ全体に配る。
 * 将来、実地図（GeoMap）版に差し替えるときは、ここに渡す provider を変えるだけでよい。
 */
export function MapProviderRoot({ provider = imageMapProvider, children }: MapProviderRootProps) {
  return <MapProviderContext.Provider value={provider}>{children}</MapProviderContext.Provider>;
}

export function useMapProvider(): MapProvider {
  return useContext(MapProviderContext);
}
