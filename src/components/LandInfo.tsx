import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandInfo as LandInfoType } from "@/services/landData";
import MiniMap from "./MiniMap";
import {
  Home,
  Compass,
  FileText,
  Ruler,
  MapPin,
  Building,
  TrendingUp,
  Gavel,
  Expand,
  Landmark,
} from "lucide-react";
import clsx from "clsx";

interface LandInfoProps {
  data: LandInfoType;
  landIndex: number;
}

// Hàm xử lý màu sắc theo tình trạng pháp lý
const getLegalColor = (status: string) => {
  if (status.includes("đầy đủ")) {
    return {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      title: "text-green-900",
    };
  }
  if (status.includes("chờ")) {
    return {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      title: "text-yellow-900",
    };
  }
  return {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    title: "text-gray-900",
  };
};

const getExpansionColor = (canExpand: boolean) => {
  return canExpand
    ? {
        bg: "bg-green-50",
        icon: "text-green-600",
        title: "text-green-900",
        text: "text-green-700",
      }
    : {
        bg: "bg-red-50",
        icon: "text-red-600",
        title: "text-red-900",
        text: "text-red-700",
      };
};

const LandInfo = ({ data, landIndex }: LandInfoProps) => {
  const legalColor = getLegalColor(data.legal_status);
  const expansionColor = getExpansionColor(data.expansion_potential);

  return (
    <div className="space-y-6">
      {/* Thông tin cơ bản lô đất */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Thông tin lô đất
          </h2>
          <Badge
            variant="outline"
            className={clsx(
              "border rounded-md px-3 py-1 text-sm font-medium",
              legalColor.bg,
              legalColor.text,
              legalColor.border
            )}
          >
            {data.legal_status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Diện tích */}
            <div className="flex items-center space-x-3">
              <Ruler className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Diện tích</p>
                <p className="font-medium">{data.area} m²</p>
              </div>
            </div>
            {/* Số thửa đất */}
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Số thửa đất</p>
                <p className="font-medium">{data.lot_number}</p>
              </div>
            </div>
            {/* Hình dạng thửa đất */}
            <div className="flex items-center space-x-3">
              <Home className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Hình dạng thửa đất</p>
                <p className="font-medium">{data.shape_description}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {/* Hướng cửa chính */}
            <div className="flex items-center space-x-3">
              <Compass className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Hướng cửa chính</p>
                <p className="font-medium">{data.door_orientation}</p>
              </div>
            </div>
            {/* Địa chỉ đầy đủ */}
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Địa chỉ đầy đủ</p>
                <p className="font-medium">{data.address}</p>
              </div>
            </div>
            {/* Loại đất */}
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Loại đất</p>
                <p className="font-medium">{data.land_type}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* MiniMap hiển thị vị trí và ranh giới thửa đất */}
      <div className="mt-8">
        <MiniMap landIndex={landIndex} />
      </div>
      {/* Phân tích tiềm năng */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-5 flex items-center">
          <span className="mr-2">🔍</span>Phân tích tiềm năng
        </h3>
        <div className="space-y-4">
          {/* Khả năng mở rộng (nở hậu) */}
          <div className="p-4 rounded-lg mb-2" style={{ background: '#e3edff' }}>
            <div className="flex items-center">
              <Landmark className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-semibold mr-2">Khả năng mở rộng:</span>
              <span className="text-green-700 font-medium">
                {data.expansion_potential ? '✔️ Có thể mở rộng (nở hậu)' : '❌ Không thể mở rộng'}
              </span>
            </div>
          </div>
          {/* Số phòng tối đa */}
          <div className="p-4 rounded-lg mb-2" style={{ background: '#e6faea' }}>
            <div className="flex items-center">
              <Home className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-semibold mr-2">Chia tối đa:</span>
              <span className="text-gray-700 font-medium">
                {data.max_rooms} phòng (dựa trên diện tích {data.area} m²)
              </span>
            </div>
          </div>
          {/* Đường trước nhà */}
          <div className="p-4 rounded-lg mb-2" style={{ background: '#fff4e3' }}>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-semibold mr-2">Đường trước nhà:</span>
              <span className="text-gray-700 font-medium">
                Rộng {data.width_road}m (Đường lớn)
              </span>
            </div>
          </div>
        </div>
      </Card>
      {/* Tiện ích xung quanh */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-5 flex items-center">
          <span className="mr-2">🏢</span>Tiện ích xung quanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.nearby_facilities.map((facility, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-gray-50 rounded-lg text-sm"
            >
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span>{facility}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LandInfo;
