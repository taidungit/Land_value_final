import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  LayersControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, LatLng, Icon } from "leaflet";
import { Card } from "@/components/ui/card";
import { MapPin, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mockLands } from "@/services/landData";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

// 👉 Component xử lý click để thêm marker
const ClickHandler = ({ onAddMarker }: { onAddMarker: (latlng: LatLng) => void }) => {
  useMapEvents({
    click: (e) => {
      onAddMarker(e.latlng);
    },
  });
  return null;
};

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

// 👉 Nút xóa tất cả marker tùy chỉnh
const ClearMarkersButton = ({ onClear }: { onClear: () => void }) => {
  return (
    <Button
      onClick={onClear}
      className="absolute bottom-3 right-3 z-[1000] w-8 h-8 flex items-center justify-center p-1 rounded shadow-md border bg-white border-white hover:bg-gray-300 cursor-pointer"
    >
      <X className="w-4 h-4 text-black" />
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

// 👉 Tạo icon tùy chỉnh cho marker click
const createCustomIcon = (color: string = '#ff4444') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    ">📍</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface MiniMapProps {
  landIndex?: number; // index của lô đất đang chọn
  height?: number;
  onSelectLand?: (index: number) => void; // callback khi chọn lô đất
  background?: boolean; // nếu là background thì chỉ render map
  searchingAddress?: string;
  simple?: boolean; // nếu true chỉ render bản đồ, không card, header, viền
}

const MiniMap = ({ landIndex, height = 350, onSelectLand, background = false, searchingAddress, simple = false }: MiniMapProps) => {
  // 👉 State để quản lý các marker tùy chỉnh
  const [customMarkers, setCustomMarkers] = useState<Array<{ id: string; latlng: LatLng; address?: string }>>([]);
  
  // Nếu chưa có lô nào được chọn, mặc định chọn lô đầu tiên
  const selectedIndex = typeof landIndex === 'number' ? landIndex : 0;
  const selectedLand = mockLands[selectedIndex]?.landInfo;

  // Tìm center map: lấy vị trí lô đang chọn hoặc lô đầu tiên
  const center: LatLngExpression = selectedLand?.location
    ? [selectedLand.location.lat, selectedLand.location.lng]
    : [21.0285, 105.8542]; // fallback Hà Nội

  // State cho marker tìm kiếm tạm thời
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Tự động move map/marker khi có searchingAddress (background mode)
  useEffect(() => {
    if (background && searchingAddress) {
      const found = mockLands.find(l => l.landInfo.address.toLowerCase().includes(searchingAddress.toLowerCase()));
      if (found) {
        setSearchMarker({
          lat: found.landInfo.location.lat,
          lng: found.landInfo.location.lng,
          address: found.landInfo.address
        });
      } else {
        setSearchMarker(null);
      }
    } else {
      setSearchMarker(null);
    }
  }, [searchingAddress, background]);

  // 👉 Hàm thêm marker khi click
  const handleAddMarker = (latlng: LatLng) => {
    const newMarker = {
      id: `marker-${Date.now()}`,
      latlng,
      address: `Tọa độ: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`
    };
    setCustomMarkers(prev => [...prev, newMarker]);
  };

  // 👉 Hàm xóa tất cả marker tùy chỉnh
  const handleClearMarkers = () => {
    setCustomMarkers([]);
  };

  // 👉 Hàm xóa marker cụ thể
  const handleRemoveMarker = (id: string) => {
    setCustomMarkers(prev => prev.filter(marker => marker.id !== id));
  };

  if (background) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
        <MapContainer
          center={searchMarker ? [searchMarker.lat, searchMarker.lng] : center as [number, number]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          dragging={true}
        >
          <LayersControl>
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                // @ts-ignore
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                // @ts-ignore
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
            {/* 👉 Thêm marker tùy chỉnh cho background map */}
            {customMarkers.map((marker) => (
              <Marker
                key={marker.id}
                // @ts-ignore
                position={marker.latlng}
                // @ts-ignore
                icon={createCustomIcon('#ff4444')}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>Vị trí đánh dấu</strong>
                    <br />
                    {marker.address}
                    <br />
                    <button
                      onClick={() => handleRemoveMarker(marker.id)}
                      className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Xóa marker
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Marker cho tìm kiếm tạm thời */}
            {searchMarker && (
              <Marker position={[searchMarker.lat, searchMarker.lng]} icon={createCustomIcon('#2563eb')}>
                <Popup>
                  <strong>{searchMarker.address}</strong>
                  <br />
                  (Địa chỉ bạn đang gõ)
                </Popup>
              </Marker>
            )}
            {background && (
              mockLands.map((land, idx) => (
                <Polygon
                  key={idx}
                  positions={land.landInfo.shape}
                  pathOptions={{
                    color: '#2563eb',
                    weight: 2,
                    fillOpacity: 0.15,
                  }}
                />
              ))
            )}
          </LayersControl>
          {/* 👉 Thêm ClickHandler cho background map */}
          <ClickHandler onAddMarker={handleAddMarker} />
          <ResetViewButton center={center} zoom={16} />
          {/* 👉 Thêm nút xóa marker cho background map */}
          {customMarkers.length > 0 && (
            <ClearMarkersButton onClear={handleClearMarkers} />
          )}
        </MapContainer>
      </div>
    );
  }

  if (!background) {
    if (simple) {
      // Render bản đồ đầy đủ, chỉ bỏ card, header, chú thích
      return (
        <div
          className="rounded-lg overflow-hidden border border-gray-300"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <MapContainer
            center={center as [number, number]}
            zoom={16}
            style={{ height: `${height}px`, width: "100%" }}
            scrollWheelZoom={true}
            doubleClickZoom={false}
            dragging={true}
          >
            <LayersControl>
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  // @ts-ignore
                  url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  // @ts-ignore
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
                      weight: idx === selectedIndex ? 4 : 2,
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
            <ClickHandler onAddMarker={handleAddMarker} />
            <ResetViewButton center={center} zoom={16} />
            {customMarkers.length > 0 && (
              <ClearMarkersButton onClear={handleClearMarkers} />
            )}
          </MapContainer>
        </div>
      );
    }
    return (
      <Card className="p-4 bg-gradient-to-br from-green-50 via-white to-green-100 border-2 border-green-200 shadow-xl rounded-2xl mt-2">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-green-800">
          <MapPin className="h-6 w-6 text-green-500" />
          Vị trí và ranh giới
        </h3>
        <div
          className="rounded-lg overflow-hidden border border-gray-300"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <MapContainer
            center={center as [number, number]}
            zoom={16}
            style={{ height: `${height}px`, width: "100%" }}
            scrollWheelZoom={true}
            doubleClickZoom={false}
            dragging={true}
          >
            <LayersControl>
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  // @ts-ignore
                  url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  // @ts-ignore
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
                      weight: idx === selectedIndex ? 4 : 2,
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
              {/* 👉 Thêm layer cho marker tùy chỉnh */}
              <LayersControl.Overlay checked name="Marker tùy chỉnh">
                {customMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    // @ts-ignore
                    position={marker.latlng}
                    // @ts-ignore
                    icon={createCustomIcon('#ff4444')}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>Vị trí đánh dấu</strong>
                        <br />
                        {marker.address}
                        <br />
                        <button
                          onClick={() => handleRemoveMarker(marker.id)}
                          className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Xóa marker
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayersControl.Overlay>
            </LayersControl>
            {/* 👉 Thêm ClickHandler */}
            <ClickHandler onAddMarker={handleAddMarker} />
            <ResetViewButton center={center} zoom={16} />
            {/* 👉 Thêm nút xóa marker */}
            {customMarkers.length > 0 && (
              <ClearMarkersButton onClear={handleClearMarkers} />
            )}
          </MapContainer>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            * Click vào bản đồ để thêm marker. Bật/tắt các lớp: nền, quy hoạch, ranh giới, vị trí.
          </p>
        </div>
      </Card>
    );
  }

  return null;
};

export default MiniMap;
