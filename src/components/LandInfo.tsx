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
    <div className="space-y-8">
      {/* Thông tin cơ bản lô đất */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 border-2 border-blue-300 shadow-xl rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-blue-700 flex items-center gap-3">
            <FileText className="h-9 w-9 text-blue-500" />
            Thông tin lô đất
          </h2>
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 border-green-300 rounded-xl px-4 py-2 text-base font-semibold shadow-sm"
          >
            {data.legal_status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          {/* Cột trái */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Ruler className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">Diện tích</div>
                <div className="font-extrabold text-blue-900 text-lg">{data.area} m²</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">Số thửa đất</div>
                <div className="font-extrabold text-blue-900 text-lg">{data.lot_number}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">Hình dạng thửa đất</div>
                <div className="font-extrabold text-blue-900 text-lg">{data.shape_description}</div>
              </div>
            </div>
          </div>
          {/* Cột phải */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">Hướng cửa chính</div>
                <div className="font-extrabold text-blue-900 text-lg">{data.door_orientation}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">Địa chỉ đầy đủ</div>
                <div className="font-extrabold text-blue-900 text-lg">{data.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">Loại đất</div>
                <div className="font-extrabold text-blue-900 text-lg">{data.land_type}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* MiniMap hiển thị vị trí và ranh giới thửa đất */}
      <Card className="p-4 bg-gradient-to-br from-green-50 via-white to-green-100 border-2 border-green-200 shadow-xl rounded-2xl mt-2 min-h-[440px]">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-green-800">
          <MapPin className="h-6 w-6 text-green-500" />
          Vị trí và ranh giới
        </h3>
        <MiniMap landIndex={landIndex} height={366} simple />
        <p className="text-xs text-gray-500 mt-2">
          * Click vào bản đồ để thêm marker. Bật/tắt các lớp: nền, quy hoạch, ranh giới, vị trí.
        </p>
      </Card>
      {/* Phân tích tiềm năng */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 via-white to-purple-100 border-2 border-purple-200 shadow-xl rounded-2xl">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-purple-800">
          <Landmark className="h-6 w-6 text-purple-500" />
          Phân tích tiềm năng
        </h3>
        <div className="space-y-4">
          {/* Khả năng mở rộng (nở hậu) */}
          <div className="p-4 rounded-lg mb-2 bg-green-100 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Khả năng mở rộng:</span>
            <span className="text-green-700 font-bold">
              {data.expansion_potential ? '✔️ Có thể mở rộng (nở hậu)' : '❌ Không thể mở rộng'}
            </span>
          </div>
          {/* Số phòng tối đa */}
          <div className="p-4 rounded-lg mb-2 bg-blue-100 flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Chia tối đa:</span>
            <span className="text-blue-700 font-bold">
              {data.max_rooms} phòng (dựa trên diện tích {data.area} m²)
            </span>
          </div>
          {/* Đường trước nhà */}
          <div className="p-4 rounded-lg mb-2 bg-yellow-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Đường trước nhà:</span>
            <span className="text-yellow-700 font-bold">
              Rộng {data.width_road}m (Đường lớn)
            </span>
          </div>
        </div>
      </Card>
      {/* Tiện ích xung quanh */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 border-2 border-gray-200 shadow-xl rounded-2xl">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-800">
          <Building className="h-6 w-6 text-gray-500" />
          Tiện ích xung quanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.nearby_facilities.map((facility, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-white rounded-lg text-sm border border-gray-200 shadow-sm gap-2"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{facility}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LandInfo;
