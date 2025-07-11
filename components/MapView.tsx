import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ImageOverlay,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import type { Layer, GoldDepositPoint } from '../types';
import { SamplingGrid } from './SamplingGrid';
import MapLegend from './MapLegend';

// Custom icon for gold deposits
const goldIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854894.png',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const SATELLITE_LAYERS = [
  {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
];

interface MapViewProps {
  activeLayers: Set<Layer>;
  deposits: GoldDepositPoint[];
  onSelectDeposit: (deposit: GoldDepositPoint) => void;
  selectedDeposit: GoldDepositPoint | null;
  satelliteDataVersion: number;
  isTrainingModel?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  activeLayers,
  deposits,
  onSelectDeposit,
  selectedDeposit,
  satelliteDataVersion,
  isTrainingModel,
}) => {
  const center: [number, number] = [18.5, 33.5]; // Central Sudan
  const sudanBounds: L.LatLngBoundsExpression = [
    [10.0, 21.5],
    [20.0, 36.0],
  ];

  const satVersionIndex = (satelliteDataVersion - 1) % SATELLITE_LAYERS.length;
  const currentSatLayer = SATELLITE_LAYERS[satVersionIndex];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        {/* Satellite or Dark Base */}
        {activeLayers.has('Satellite') ? (
          <TileLayer
            key={satelliteDataVersion}
            url={currentSatLayer.url}
            attribution={currentSatLayer.attribution}
          />
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        )}

        {/* Thematic Layers */}
        {activeLayers.has('NDVI') && (
          <TileLayer
            attribution="NDVI"
            url="https://tiles.arcgis.com/tiles/9GZ8u0dbG7pU3nRy/arcgis/rest/services/NDVI/MapServer/tile/{z}/{y}/{x}"
            opacity={0.4}
          />
        )}

        {activeLayers.has('Iron Oxide') && (
          <TileLayer
            attribution="Iron Oxide"
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            opacity={0.3}
          />
        )}

        {activeLayers.has('Clay') && (
          <TileLayer
            attribution="Clay Minerals"
            url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"
            opacity={0.5}
          />
        )}

        {activeLayers.has('Slope') && (
          <TileLayer
            attribution="Slope"
            url="https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png"
            opacity={0.5}
          />
        )}

        {activeLayers.has('Gold Potential') && (
          <ImageOverlay
            url="/gold_prediction_map.png" // Assumes overlay is in /public
            bounds={sudanBounds}
            opacity={0.6}
            zIndex={10}
          />
        )}

        {/* Markers for Known Deposits */}
        {activeLayers.has('Deposits') &&
          deposits.map((deposit) => (
            <Marker
              key={deposit.id}
              position={[deposit.coords.lat, deposit.coords.lng]}
              icon={goldIcon}
              eventHandlers={{
                click: () => onSelectDeposit(deposit),
              }}
            >
              <Popup>
                <strong>{deposit.name}</strong>
                <br />
                {deposit.description}
              </Popup>
            </Marker>
          ))}
        
        {activeLayers.has('Gold Potential') && <MapLegend />}

      </MapContainer>

      {/* Grid animation during model training */}
      {isTrainingModel && <SamplingGrid />}
    </div>
  );
};