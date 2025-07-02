import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  LayersControl,
  useMap,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mockLands } from "@/services/landData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

// 👉 Nút ResetView nằm trong file này luôn
const ResetViewButton = ({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) => {
  const map = useMap();
  const [disabled, setDisabled] = useState(true);

  const isAtCenter = () => {
    const current = map.getCenter();
    const currentZoom = map.getZoom();
    const [lat, lng] = center as [number, number];
    return (
      Math.abs(current.lat - lat) < 0.0001 &&
      Math.abs(current.lng - lng) < 0.0001 &&
      Math.abs(currentZoom - zoom) < 0.1
    );
  };

  useEffect(() => {
    const update = () => setDisabled(isAtCenter());
    update();
    map.on("moveend", update);
    map.on("zoomend", update);
    return () => {
      map.off("moveend", update);
      map.off("zoomend", update);
    };
  }, [map]);

  return (
    <Button
      onClick={() => !disabled && map.setView(center, zoom)}
      disabled={disabled}
      className={`absolute bottom-3 left-3 z-[1000] w-8 h-8 flex items-center justify-center p-1 rounded shadow-md border text-base transition 
        ${
          disabled
            ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white border-white hover:bg-gray-300 cursor-pointer"
        }`}
    >
      <RefreshCw
        className={`w-4 h-4 transition-colors ${
          disabled ? "text-gray-400" : "text-black"
        }`}
      />
    </Button>
  );
};

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -34],
  shadowSize: [40, 40],
});

interface MiniMapProps {
  landIndex?: number; // index của lô đất đang chọn
  height?: number;
  onSelectLand?: (index: number) => void; // callback khi chọn lô đất
  background?: boolean; // nếu là background thì chỉ render map
}

const MiniMap = ({ landIndex, height = 350, onSelectLand, background = false }: MiniMapProps) => {
  // Nếu chưa có lô nào được chọn, mặc định chọn lô đầu tiên
  const selectedIndex = typeof landIndex === 'number' ? landIndex : 0;
  const selectedLand = mockLands[selectedIndex]?.landInfo;

  // Tìm center map: lấy vị trí lô đang chọn hoặc lô đầu tiên
  const center: LatLngExpression = selectedLand?.location
    ? [selectedLand.location.lat, selectedLand.location.lng]
    : [21.0285, 105.8542]; // fallback Hà Nội

  if (background) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
        <MapContainer
          center={center as [number, number] as any}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
          doubleClickZoom={false}
          dragging
        >
          <LayersControl>
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                // @ts-ignore
                attribution="&copy; Google"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Vệ tinh Esri">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                // @ts-ignore
                attribution="Tiles &copy; Esri"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="Bản đồ quy hoạch TP.HCM 2030">
              <TileLayer
                url="https://l5cfglaebpobj.vcdn.cloud/tp-ho-chi-minh-2030/{z}/{x}/{y}.png"
                attribution="Bản đồ quy hoạch TP.HCM 2030"
                opacity={0.6}
              />
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Ranh giới lô đất">
              {mockLands.map((land, idx) => (
                <Polygon
                  key={idx}
                  positions={land.landInfo.shape}
                  pathOptions={{
                    color: idx === selectedIndex ? "#ff9800" : "#2563eb",
                    weight: idx === selectedIndex ? 8 : 2,
                    fillOpacity: idx === selectedIndex ? 0.5 : 0.3,
                  }}
                  eventHandlers={{
                    click: () => onSelectLand && onSelectLand(idx),
                  }}
                />
              ))}
            </LayersControl.Overlay>
            {selectedLand?.location && (
              <LayersControl.Overlay checked name="Vị trí thửa đất">
                <Marker position={[selectedLand.location.lat, selectedLand.location.lng]}>
                  <Popup>
                    <strong>{selectedLand.address}</strong>
                    <br />
                    Tọa độ: {selectedLand.location.lat.toFixed(5)}, {selectedLand.location.lng.toFixed(5)}
                  </Popup>
                </Marker>
              </LayersControl.Overlay>
            )}
          </LayersControl>
          <ResetViewButton center={center} zoom={16} />
        </MapContainer>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center">
        <MapPin className="mr-2 h-4 w-4" />
        Vị trí và ranh giới
      </h3>

      <div
        className="rounded-lg overflow-hidden border border-gray-300"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <MapContainer
          center={center as [number, number] as any}
          zoom={16}
          style={{ height: `${height}px`, width: "100%" }}
          scrollWheelZoom
          doubleClickZoom={false}
          dragging
        >
          <LayersControl>
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                // @ts-ignore
                attribution="&copy; Google"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Vệ tinh Esri">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                // @ts-ignore
                attribution="Tiles &copy; Esri"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay name="Bản đồ quy hoạch TP.HCM 2030">
            
            <TileLayer
          url="https://l5cfglaebpobj.vcdn.cloud/tp-ho-chi-minh-2030/{z}/{x}/{y}.png"
          attribution="Bản đồ quy hoạch TP.HCM 2030"
          opacity={0.6}
        />
          </LayersControl.Overlay>


            <LayersControl.Overlay checked name="Ranh giới lô đất">
              {/* Render tất cả các polygon */}
              {mockLands.map((land, idx) => (
                <Polygon
                  key={idx}
                  positions={land.landInfo.shape}
                  pathOptions={{
                    color: idx === selectedIndex ? "#ff9800" : "#2563eb",
                    weight: idx === selectedIndex ? 8 : 2,
                    fillOpacity: idx === selectedIndex ? 0.5 : 0.3,
                  }}
                  eventHandlers={{
                    click: () => onSelectLand && onSelectLand(idx),
                  }}
                />
              ))}
            </LayersControl.Overlay>
            {/* Marker cho lô đang chọn */}
            {selectedLand?.location && (
              <LayersControl.Overlay checked name="Vị trí thửa đất">
                <Marker position={[selectedLand.location.lat, selectedLand.location.lng]}>
                  <Popup>
                    <strong>{selectedLand.address}</strong>
                    <br />
                    Tọa độ: {selectedLand.location.lat.toFixed(5)}, {selectedLand.location.lng.toFixed(5)}
                  </Popup>
                </Marker>
              </LayersControl.Overlay>
            )}
          </LayersControl>
          <ResetViewButton center={center} zoom={16} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        * Bản đồ có thể bật/tắt các lớp: nền, quy hoạch, ranh giới, vị trí – hỗ trợ minh họa trực quan.
      </p>
    </Card>
  );
};

export default MiniMap;
