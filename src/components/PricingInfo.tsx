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
} from "lucide-react";

interface PricingInfoProps {
  data: PricingInfoType;
}

const PricingInfo = ({ data }: PricingInfoProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200" style={{ height: 290 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-green-600" />
          Ước tính giá trị
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Giá/m²</p>
              <p className="text-2xl font-bold text-green-600">
                {formatVND(data.estimated_price_per_m2)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Tổng giá trị ước tính</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatVND(data.total_estimated_price)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">Tốc độ thanh khoản</p>
              </div>
              <p className="text-lg font-semibold">
                {data.liquidity_days} ngày
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">TB căn tương tự</p>
              </div>
              <p className="text-lg font-semibold">
                {formatVND(data.similar_properties_avg)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 flex flex-col justify-center" style={{ height: 445 }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Xu hướng giá 6 tháng gần đây
        </h3>
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.price_trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" dy={10} />
                <YAxis
                  tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`} dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "6px",
                    borderColor: "#10b981",
                  }}
                  formatter={(value: number) => [formatVND(value), "Giá/m²"]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6" style={{ minHeight: 297 }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Giao dịch gần đây
        </h3>

        <div className="space-y-4">
          {data.nearby_transactions.map((transaction, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {transaction.address}
                  </h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(transaction.date).toLocaleDateString("vi-VN")}
                    </span>
                    <span>{transaction.area} m²</span>
                    <span>{transaction.distance_m}m</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {formatVND(transaction.price)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatVND(transaction.price_per_m2)}/m²
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-amber-50 border-amber-200">
        <h3 className="text-lg font-semibold mb-3 text-amber-800">
          Lưu ý quan trọng
        </h3>
        <ul className="text-sm text-amber-700 space-y-2">
          <li>
            • Giá ước tính dựa trên các giao dịch gần đây và đặc điểm thửa đất
          </li>
          <li>
            • Giá thực tế có thể dao động ±10-20% tùy vào tình trạng pháp lý
          </li>
          <li>• Nên tham khảo ý kiến chuyên gia trước khi đưa ra quyết định</li>
          <li>• Thông tin chỉ mang tính chất tham khảo</li>
        </ul>
      </Card>
    </div>
  );
};

export default PricingInfo;
