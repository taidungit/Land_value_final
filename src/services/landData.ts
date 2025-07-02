export interface LandInfo {
  address: string;
  lot_number: string;
  area: number;
  shape: [number, number][];
  shape_description: string;
  door_orientation: string;
  land_type: string;
  legal_status: string;
  location: {
    lat: number;
    lng: number;
  };
  width_road: number;
  max_rooms: number;
  expansion_potential: boolean;
  nearby_facilities: string[];
}

export interface PricingInfo {
  estimated_price_per_m2: number;
  total_estimated_price: number;
  liquidity_days: number;
  similar_properties_avg: number;
  nearby_transactions: Array<{
    address: string;
    date: string;
    area: number;
    price: number;
    distance_m: number;
    price_per_m2: number;
  }>;
  price_trend: Array<{
    month: string;
    price: number;
  }>;
}

export interface LandAndPricing {
  landInfo: LandInfo;
  pricingInfo: PricingInfo;
}

export const mockLands: LandAndPricing[] = [
  {
    landInfo: {
      address: "12 Nguyễn Trãi, Hà Đông, Hà Nội",
      lot_number: "501",
      area: 95,
      shape_description: "Hình chữ nhật",
      shape: [
        [20.9712, 105.7851],
        [20.9712, 105.7857],
        [20.9717, 105.7857],
        [20.9717, 105.7851],
      ],
      door_orientation: "Đông Bắc",
      land_type: "Đất ở đô thị",
      legal_status: "Sổ đỏ đầy đủ",
      location: { lat: 20.97145, lng: 105.7854 },
      width_road: 7,
      max_rooms: 5,
      expansion_potential: true,
      nearby_facilities: [
        "Bệnh viện Đa khoa Hà Đông (1.2km)",
        "Trường THPT Lê Quý Đôn (0.8km)",
        "Chợ Hà Đông (0.5km)",
        "Công viên Hà Đông (1.0km)",
      ],
    },
    pricingInfo: {
      estimated_price_per_m2: 65000000,
      total_estimated_price: 6175000000,
      liquidity_days: 55,
      similar_properties_avg: 63000000,
      nearby_transactions: [
        {
          address: "10 Nguyễn Trãi",
          date: "2024-10-15",
          area: 100,
          price: 6700000000,
          distance_m: 80,
          price_per_m2: 67000000,
        },
        {
          address: "14 Nguyễn Trãi",
          date: "2024-09-20",
          area: 90,
          price: 5850000000,
          distance_m: 60,
          price_per_m2: 65000000,
        },
      ],
      price_trend: [
        { month: "T4/2024", price: 60000000 },
        { month: "T5/2024", price: 62000000 },
        { month: "T6/2024", price: 64000000 },
        { month: "T7/2024", price: 65000000 },
        { month: "T8/2024", price: 67000000 },
        { month: "T9/2024", price: 65000000 },
      ],
    },
  },
  {
    landInfo: {
      address: "25 Quang Trung, Hà Đông, Hà Nội",
      lot_number: "502",
      area: 120,
      shape_description: "Hình vuông",
      shape: [
        [20.9730, 105.7800],
        [20.9730, 105.7807],
        [20.9737, 105.7807],
        [20.9737, 105.7800],
      ],
      door_orientation: "Tây Nam",
      land_type: "Đất thương mại",
      legal_status: "Sổ đỏ đầy đủ",
      location: { lat: 20.97335, lng: 105.78035 },
      width_road: 12,
      max_rooms: 7,
      expansion_potential: false,
      nearby_facilities: [
        "Siêu thị Metro Hà Đông (0.7km)",
        "Trường Đại học Kiến Trúc (1.5km)",
        "Bến xe Yên Nghĩa (2.0km)",
      ],
    },
    pricingInfo: {
      estimated_price_per_m2: 80000000,
      total_estimated_price: 9600000000,
      liquidity_days: 70,
      similar_properties_avg: 78000000,
      nearby_transactions: [
        {
          address: "27 Quang Trung",
          date: "2024-08-10",
          area: 110,
          price: 8800000000,
          distance_m: 50,
          price_per_m2: 80000000,
        },
        {
          address: "23 Quang Trung",
          date: "2024-07-25",
          area: 130,
          price: 10400000000,
          distance_m: 70,
          price_per_m2: 80000000,
        },
      ],
      price_trend: [
        { month: "T4/2024", price: 75000000 },
        { month: "T5/2024", price: 77000000 },
        { month: "T6/2024", price: 79000000 },
        { month: "T7/2024", price: 80000000 },
        { month: "T8/2024", price: 82000000 },
        { month: "T9/2024", price: 80000000 },
      ],
    },
  },
  {
    landInfo: {
      address: "8 Hàng Bông, Hoàn Kiếm, Hà Nội",
      lot_number: "503",
      area: 60,
      shape_description: "Hình tam giác",
      shape: [
        [21.0302, 105.8498],
        [21.0302, 105.8502],
        [21.0305, 105.8500],
      ],
      door_orientation: "Đông Nam",
      land_type: "Đất ở đô thị",
      legal_status: "Sổ đỏ đầy đủ",
      location: { lat: 21.0303, lng: 105.8500 },
      width_road: 5,
      max_rooms: 3,
      expansion_potential: false,
      nearby_facilities: [
        "Hồ Hoàn Kiếm (0.3km)",
        "Nhà hát lớn Hà Nội (1.0km)",
        "Chợ Đồng Xuân (0.7km)",
      ],
    },
    pricingInfo: {
      estimated_price_per_m2: 120000000,
      total_estimated_price: 7200000000,
      liquidity_days: 40,
      similar_properties_avg: 115000000,
      nearby_transactions: [
        {
          address: "10 Hàng Bông",
          date: "2024-09-10",
          area: 65,
          price: 7800000000,
          distance_m: 50,
          price_per_m2: 120000000,
        },
        {
          address: "6 Hàng Bông",
          date: "2024-08-20",
          area: 55,
          price: 6300000000,
          distance_m: 40,
          price_per_m2: 114545454,
        },
      ],
      price_trend: [
        { month: "T4/2024", price: 110000000 },
        { month: "T5/2024", price: 112000000 },
        { month: "T6/2024", price: 115000000 },
        { month: "T7/2024", price: 118000000 },
        { month: "T8/2024", price: 120000000 },
        { month: "T9/2024", price: 120000000 },
      ],
    },
  },
];

export const formatVND = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} tỷ VNĐ`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)} triệu VNĐ`;
  }
  return amount.toLocaleString("vi-VN") + " VNĐ";
};
