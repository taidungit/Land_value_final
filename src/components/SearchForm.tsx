import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";
import { mockLands } from "@/services/landData";
import Fuse from "fuse.js";

interface SearchFormProps {
  onSearch: (address: string) => void;
}

const fuse = new Fuse(mockLands, {
  keys: ["landInfo.address"],
  threshold: 0.4,
});

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    if (value.length > 0) {
      const results = fuse.search(value).slice(0, 5); // lấy tối đa 5 gợi ý
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (address: string) => {
    setAddress(address);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
      setShowSuggestions(false);
    }
  };

  const handleQuickSearch = (quickAddress: string) => {
    setAddress(quickAddress);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(quickAddress);
  };

  const quickSearches = mockLands.map((land) => land.landInfo.address);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Thông tin và định giá đất
          </h1>
          <p className="text-xl text-gray-600 mx-auto w-fit whitespace-nowrap">
            Tra cứu thông tin chi tiết và ước tính giá trị đất đai Việt Nam
          </p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Nhập địa chỉ đất cần tra cứu..."
                value={address}
                onChange={handleChange}
                className="pl-10 h-14 text-lg border-2 border-gray-200 focus:border-blue-500"
                autoComplete="off"
                onFocus={() => address && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 max-h-60 overflow-y-auto"
                  style={{ top: '100%' }}
                >
                  {suggestions.map((s) => (
                    <li
                      key={s.refIndex}
                      onMouseDown={() => handleSelect(s.item.landInfo.address)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                    >
                      {s.item.landInfo.address}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={!address.trim()}
            >
              <Search className="mr-2 h-5 w-5" />
              Tra cứu thông tin
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">
              Hoặc thử các địa chỉ mẫu:
            </p>
            <div className="space-y-2">
              {quickSearches.map((quickAddress, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(quickAddress)}
                  className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-3 rounded-lg transition-colors"
                >
                  📍 {quickAddress}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SearchForm;
