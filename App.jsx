import React, { useState } from "react";

const menuItems = [
  { label: "Sản Phẩm", key: "sanpham" },
  { label: "Thuộc Tính", key: "thuoctinh" },
  { label: "Voucher", key: "voucher" },
  { label: "Khuyến Mãi", key: "khuyenmai" },
  { label: "Nhân Viên", key: "nhanvien" },
  { label: "Khách Hàng", key: "khachhang" },
];

export default function App() {
  const [selectedKey, setSelectedKey] = useState("sanpham");

  const renderContent = () => {
    switch (selectedKey) {
      case "sanpham":
        return <div>Quản lý Sản Phẩm</div>;
      case "thuoctinh":
        return <div>Quản lý Thuộc Tính</div>;
      case "voucher":
        return <div>Quản lý Voucher</div>;
      case "khuyenmai":
        return <div>Quản lý Khuyến Mãi</div>;
      case "nhanvien":
        return <div>Quản lý Nhân Viên</div>;
      case "khachhang":
        return <div>Quản lý Khách Hàng</div>;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: 220, background: "#f5f5f5", padding: 20 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li
              key={item.key}
              style={{
                margin: "16px 0",
                fontWeight: selectedKey === item.key ? "bold" : "normal",
                cursor: "pointer",
                color: selectedKey === item.key ? "#1976d2" : "#333",
                background: selectedKey === item.key ? "#e3f2fd" : "transparent",
                borderRadius: 6,
                padding: "8px 12px",
                transition: "all 0.2s",
              }}
              onClick={() => setSelectedKey(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
      <main style={{ flex: 1, padding: 32 }}>{renderContent()}</main>
    </div>
  );
} 