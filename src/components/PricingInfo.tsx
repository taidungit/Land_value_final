import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingInfo as PricingInfoType, formatVND } from "@/services/landData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  BarChart,
  AlertTriangle,
} from "lucide-react";

interface PricingInfoProps {
  data: PricingInfoType;
}

const PricingInfo = ({ data }: PricingInfoProps) => {
  return (
    <div className="space-y-8">
      <Card className="p-8 bg-gradient-to-br from-green-50 via-blue-50 to-white border-2 border-green-200 shadow-xl rounded-2xl min-h-[334px]">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
          <DollarSign className="h-7 w-7 text-green-600" />
          Ước tính giá trị
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-green-100/80 rounded-xl shadow-sm border border-green-200">
              <p className="text-sm text-gray-500">Giá/m²</p>
              <p className="text-3xl font-extrabold text-green-700 tracking-tight">
                {formatVND(data.estimated_price_per_m2)}
              </p>
            </div>
            <div className="p-4 bg-blue-100/80 rounded-xl shadow-sm border border-blue-200">
              <p className="text-sm text-gray-500">Tổng giá trị ước tính</p>
              <p className="text-3xl font-extrabold text-blue-700 tracking-tight">
                {formatVND(data.total_estimated_price)}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-xl shadow-sm border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-gray-500">Tốc độ thanh khoản</p>
              </div>
              <p className="text-xl font-semibold text-yellow-700">
                {data.liquidity_days} ngày
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl shadow-sm border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart className="h-5 w-5 text-purple-500" />
                <p className="text-sm text-gray-500">TB căn tương tự</p>
              </div>
              <p className="text-xl font-semibold text-purple-700">
                {formatVND(data.similar_properties_avg)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 flex flex-col justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 border-2 border-yellow-200 shadow-xl rounded-2xl h-[464px]">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-800">
          <TrendingUp className="h-6 w-6 text-yellow-500" />
          Xu hướng giá 6 tháng gần đây
        </h3>
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="h-[400px] w-full p-0 m-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.price_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" dy={10} />
                <YAxis
                  tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`} dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fffbe8",
                    borderRadius: "8px",
                    borderColor: "#facc15",
                  }}
                  formatter={(value: number) => [formatVND(value), "Giá/m²"]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#facc15"
                  strokeWidth={4}
                  dot={{ fill: "#facc15", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 border-blue-200 shadow-xl rounded-2xl" style={{ minHeight: 297 }}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-800">
          <MapPin className="h-6 w-6 text-blue-500" />
          Giao dịch gần đây
        </h3>
        <div className="space-y-4">
          {data.nearby_transactions.map((transaction, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 bg-white/80 hover:bg-blue-50 border-blue-200 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900">
                  {transaction.address}
                </h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(transaction.date).toLocaleDateString("vi-VN")}
                  </span>
                  <span>{transaction.area} m²</span>
                  <span>{transaction.distance_m}m</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-lg">
                  {formatVND(transaction.price)}
                </p>
                <p className="text-sm text-blue-400">
                  {formatVND(transaction.price_per_m2)}/m²
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-amber-100 via-white to-amber-50 border-2 border-amber-200 shadow-xl rounded-2xl">
        <h3 className="text-lg font-bold mb-3 text-amber-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Lưu ý quan trọng
        </h3>
        <ul className="text-base text-amber-700 space-y-2 pl-4 list-disc">
          <li>
            Giá ước tính dựa trên các giao dịch gần đây và đặc điểm thửa đất
          </li>
          <li>
            Giá thực tế có thể dao động ±10-20% tùy vào tình trạng pháp lý
          </li>
          <li>Nên tham khảo ý kiến chuyên gia trước khi đưa ra quyết định</li>
          <li>Thông tin chỉ mang tính chất tham khảo</li>
        </ul>
      </Card>
    </div>
  );
};

export default PricingInfo;
