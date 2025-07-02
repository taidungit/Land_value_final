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
      {/* Thông tin lô đất */}
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
            {[
              {
                label: "Địa chỉ",
                value: data.address,
                icon: MapPin,
              },
              {
                label: "Số thửa",
                value: data.lot_number,
                icon: FileText,
              },
              {
                label: "Diện tích",
                value: `${data.area} m²`,
                icon: Ruler,
              },
              {
                label: "Hướng cửa chính",
                value: data.door_orientation,
                icon: Compass,
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Loại đất",
                value: data.land_type,
                icon: Building,
              },
              {
                label: "Hình dạng",
                value: data.shape_description,
                icon: Home,
              },
              {
                label: "Mặt tiền đường",
                value: `${data.width_road}m`,
                icon: TrendingUp,
              },
              {
                label: "Tiềm năng xây dựng",
                value: `Tối đa ${data.max_rooms} phòng`,
                icon: Landmark,
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Phân tích & Đặc điểm */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-5">Phân tích & Đặc điểm</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={clsx(
              "flex items-start p-4 rounded-lg",
              expansionColor.bg
            )}
          >
            <Expand
              className={clsx("h-4 w-4 mr-3 mt-1", expansionColor.icon)}
            />
            <div>
              <h4 className={clsx("font-medium mb-1", expansionColor.title)}>
                Tiềm năng mở rộng
              </h4>
              <p className={clsx("text-sm", expansionColor.text)}>
                {data.expansion_potential
                  ? "Có thể mở rộng"
                  : "Không thể mở rộng"}
              </p>
            </div>
          </div>

          <div
            className={clsx("flex items-start p-4 rounded-lg", legalColor.bg)}
          >
            <Gavel className={`h-5 w-5 mr-3 mt-1 ${legalColor.text}`} />
            <div>
              <h4 className={`font-medium mb-1 ${legalColor.title}`}>
                Pháp lý
              </h4>
              <p className={`text-sm ${legalColor.text}`}>
                {data.legal_status}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tiện ích xung quanh */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-5">Tiện ích xung quanh</h3>
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

      <MiniMap landIndex={landIndex} />
    </div>
  );
};

export default LandInfo;
