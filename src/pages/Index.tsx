import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/SearchForm";
import LandInfo from "@/components/LandInfo";
import PricingInfo from "@/components/PricingInfo";
import { mockLands } from "@/services/landData";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import MiniMap from "@/components/MiniMap";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const fuse = new Fuse(mockLands, {
  keys: ["landInfo.address"],
  threshold: 0.4,
});

const defaultLandInfo = mockLands[0].landInfo;

const Index = () => {
  const [step, setStep] = useState<'search' | 'form' | 'result'>('search');
  const [searchedAddress, setSearchedAddress] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedLandIndex, setSelectedLandIndex] = useState<number | null>(null);
  const [editedLandInfo, setEditedLandInfo] = useState<any>(null);

  const handleSearch = (address: string) => {
    setSearchedAddress(address);
    setShowResults(true);
    // Sử dụng Fuse để tìm kiếm gần đúng
    const results = fuse.search(address);
    if (results.length > 0) {
      setSelectedLandIndex(results[0].refIndex ?? 0);
      setEditedLandInfo({ ...mockLands[results[0].refIndex].landInfo });
    } else {
      setSelectedLandIndex(0);
      setEditedLandInfo({ ...defaultLandInfo });
    }
    setStep('form');
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setSearchedAddress("");
    setSelectedLandIndex(null);
    setStep('search');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEditedLandInfo((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('result');
  };

  // Nếu có search, lọc danh sách lô đất phù hợp
  const filteredLands = searchedAddress
    ? fuse.search(searchedAddress).map(r => mockLands[r.refIndex])
    : mockLands;

  // Nếu chưa chọn lô nào, mặc định chọn lô đầu tiên trong filteredLands
  const landIndex =
    selectedLandIndex !== null && selectedLandIndex >= 0
      ? selectedLandIndex
      : filteredLands.length > 0
      ? mockLands.findIndex((l) => l === filteredLands[0])
      : -1;

  const selectedLand = mockLands[landIndex];

  if (step === 'search') return <SearchForm onSearch={handleSearch} />;

  if (step === 'form' && editedLandInfo) {
    // Danh sách tiện ích mẫu
    const facilityOptions = [
      "Trường tiểu học An Lạc",
      "Bệnh viện Quận 5",
      "Chợ An Đông",
      "Ngân hàng Vietcombank",
      "Công viên",
      "Siêu thị",
      "Trường học",
      "Bệnh viện",
      "Chợ",
      "Ngân hàng",
      "Trung tâm thương mại"
    ];
    // Các tiện ích đã chọn
    const selectedFacilities = editedLandInfo.nearby_facilities || [];
    // Thêm tiện ích custom
    const customFacilities = selectedFacilities.filter((f: string) => !facilityOptions.includes(f));

    const handleFacilityChange = (facility: string) => {
      setEditedLandInfo((prev: any) => {
        const arr = prev.nearby_facilities || [];
        if (arr.includes(facility)) {
          return { ...prev, nearby_facilities: arr.filter((f: string) => f !== facility) };
        } else {
          return { ...prev, nearby_facilities: [...arr, facility] };
        }
      });
    };
    const handleCustomFacilitiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
      // Giữ lại các tiện ích đã chọn từ options, cộng thêm custom
      setEditedLandInfo((prev: any) => ({
        ...prev,
        nearby_facilities: [
          ...facilityOptions.filter(f => prev.nearby_facilities?.includes(f)),
          ...lines.filter(l => !facilityOptions.includes(l))
        ]
      }));
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Điền thông tin lô đất</h2>
          <form className="space-y-8" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                <Input name="address" value={editedLandInfo.address} onChange={handleFormChange} required className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Diện tích (m²)</label>
                <Input name="area" type="number" value={editedLandInfo.area} onChange={handleFormChange} required className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hình dạng thửa đất</label>
                <Input name="shape_description" value={editedLandInfo.shape_description} onChange={handleFormChange} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Loại đất</label>
                <Input name="land_type" value={editedLandInfo.land_type} onChange={handleFormChange} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mặt tiền đường (m)</label>
                <Input name="width_road" type="number" value={editedLandInfo.width_road} onChange={handleFormChange} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Có nở hậu không?</label>
                <select name="is_tail_expanded" value={editedLandInfo.is_tail_expanded ? 'true' : 'false'} onChange={e => setEditedLandInfo((prev: any) => ({ ...prev, is_tail_expanded: e.target.value === 'true' }))} className="w-full border rounded-lg px-2 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số thửa đất</label>
                <Input name="lot_number" value={editedLandInfo.lot_number} onChange={handleFormChange} required className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hướng cửa chính</label>
                <Input name="door_orientation" value={editedLandInfo.door_orientation} onChange={handleFormChange} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tình trạng pháp lý</label>
                <Input name="legal_status" value={editedLandInfo.legal_status} onChange={handleFormChange} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số phòng tối đa</label>
                <Input name="max_rooms" type="number" value={editedLandInfo.max_rooms} onChange={handleFormChange} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tiềm năng mở rộng</label>
                <select name="expansion_potential" value={editedLandInfo.expansion_potential ? 'true' : 'false'} onChange={e => setEditedLandInfo((prev: any) => ({ ...prev, expansion_potential: e.target.value === 'true' }))} className="w-full border rounded-lg px-2 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 shadow-inner">
              <label className="block text-base font-semibold text-blue-700 mb-2">Tiện ích xung quanh</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {facilityOptions.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 rounded px-2 py-1 transition">
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      className="accent-blue-600 w-4 h-4 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-sm text-gray-700">{facility}</span>
                  </label>
                ))}
              </div>
              <label className="block text-xs text-gray-500 mb-1 mt-2">Tiện ích khác (mỗi dòng 1 tiện ích):</label>
              <textarea
                name="custom_nearby_facilities"
                value={customFacilities.join('\n')}
                onChange={handleCustomFacilitiesChange}
                className="w-full border rounded-lg px-2 py-2 min-h-[40px] focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Nhập thêm tiện ích khác..."
              />
            </div>
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={handleBackToSearch} className="rounded-lg px-6 py-2">Quay lại</Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 text-lg rounded-lg px-8 py-2 shadow-lg">Định giá</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  if (step === 'result' && editedLandInfo) {
    // Hiển thị kết quả định giá với dữ liệu vừa nhập
    const customLand = { ...selectedLand, landInfo: editedLandInfo };
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBackToSearch}>
                <ArrowLeft className="h-4 w-4" />
                <span>Tìm kiếm mới</span>
              </Button>
              <div className="text-center flex-1 max-w-2xl mx-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Thông tin và định giá bất động sản
                </h1>
                <p className="text-sm text-gray-600 mt-1">📍 {editedLandInfo.address}</p>
              </div>
              <div className="w-24"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div>
              <LandInfo data={editedLandInfo} landIndex={landIndex} />
            </div>
            <div>
              <PricingInfo data={selectedLand.pricingInfo} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
