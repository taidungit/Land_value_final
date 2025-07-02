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

const fuse = new Fuse(mockLands, {
  keys: ["landInfo.address"],
  threshold: 0.4,
});

const Index = () => {
  const [searchedAddress, setSearchedAddress] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedLandIndex, setSelectedLandIndex] = useState<number | null>(null);

  const handleSearch = (address: string) => {
    setSearchedAddress(address);
    setShowResults(true);
    // Sử dụng Fuse để tìm kiếm gần đúng
    const results = fuse.search(address);
    if (results.length > 0) {
      setSelectedLandIndex(results[0].refIndex ?? 0);
    } else {
      setSelectedLandIndex(null);
    }
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setSearchedAddress("");
    setSelectedLandIndex(null);
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

  if (!showResults) return <SearchForm onSearch={handleSearch} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
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
              <p className="text-sm text-gray-600 mt-1">📍 {searchedAddress}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedLand ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Cột trái: Thông tin lô đất (bao gồm MiniMap) */}
            <div>
              <LandInfo data={selectedLand.landInfo} landIndex={landIndex} />
            </div>
            {/* Cột phải: Ước tính và giao dịch */}
            <div>
              <PricingInfo data={selectedLand.pricingInfo} />
            </div>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-red-500 text-center text-lg mt-10"
          >
            Không tìm thấy thông tin lô đất.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Index;
