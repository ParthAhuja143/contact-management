import React from 'react'
import { useMap } from 'react-leaflet';
import {LatLngExpression} from 'leaflet';

function ChangeView({ center, zoom } : {
    center: LatLngExpression,
    zoom: number
}) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

export default ChangeView
  