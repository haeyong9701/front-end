import React, { useEffect } from 'react';

import { Map, MapEvent } from '@vis.gl/react-google-maps';

import MapControlComponents from '@/app/map/_components/Map/MapControls';
import MapHandler from '@/app/map/_components/Map/MapHandler';
import Markers from '@/app/map/_components/Marker/Markers';
import { DEFAULT_STYLES, DISPLAY_NONE } from '@/app/map/_constants/mapOptions';
import { useMapStore } from '@stores/useMapStore';

import style from './MapTest.module.scss';
import formatted from '../../_mock/trees';

interface BlobMapProps {
  isDisplaying?: boolean;
}

export default function BlobMap({ isDisplaying = true }: BlobMapProps) {
  const lastMapCenter = useMapStore((state) => state.lastMapCenter);
  const setLastMapCenter = useMapStore((state) => state.setLastMapCenter);

  const lastSearchCity = useMapStore((state) => state.lastSearchCity);
  console.log('lastSearchCity', lastSearchCity);

  const handleDragMap = (event: MapEvent) => {
    const newLocation = event.map.getCenter()?.toJSON();
    setLastMapCenter(newLocation);
  };

  useEffect(() => {}, []);

  return (
    <div className={style['map-container']}>
      <Map
        defaultCenter={lastMapCenter}
        defaultZoom={15}
        style={isDisplaying ? DEFAULT_STYLES : DISPLAY_NONE}
        minZoom={4}
        disableDefaultUI
        mapId={process.env.NEXT_PUBLIC_MAP_ID}
        onDrag={handleDragMap}
      >
        <Markers points={formatted} />
        <MapControlComponents />
        <MapHandler />
      </Map>
    </div>
  );
}
