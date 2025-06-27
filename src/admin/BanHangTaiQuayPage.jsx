import React, { useState } from "react";
import "../styles/SalePage.css";

const BanHangTaiQuayPage = () => {
  // State tạm thời cho giao diện tĩnh
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [voucher, setVoucher] = useState("");
  const [payment, setPayment] = useState({ method: "Tiền mặt", given: "" });

  // Dữ liệu mẫu sản phẩm
  const products = [
    { id: 1, name: "Áo Thun Nam", price: 200000, image: "https://via.placeholder.com/60", stock: 10 },
    { id: 2, name: "Quần Short", price: 150000, image: "https://via.placeholder.com/60", stock: 5 },
    { id: 3, name: "Giày Thể Thao", price: 500000, image: "https://via.placeholder.com/60", stock: 3 },
  ];

  // Tổng tiền tạm tính
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="banhang-container">
      {/* Tìm kiếm & chọn sản phẩm */}
      <div className="product-search-section">
        <h2>Bán hàng tại quầy</h2>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Danh sách sản phẩm */}
      <div className="product-list-section">
        <h3>Danh sách sản phẩm</h3>
        <div className="product-list">
          {products
            .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
            .map(product => (
              <div key={product.id} className="product-item">
                <img src={product.image} alt={product.name} />
                <div>{product.name}</div>
                <div>Giá: {product.price.toLocaleString()}đ</div>
                <div>Tồn kho: {product.stock}</div>
                <button disabled>Thêm vào giỏ</button>
              </div>
            ))}
        </div>
      </div>

      {/* Giỏ hàng */}
      <div className="cart-section">
        <h3>Giỏ hàng</h3>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SL</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr><td colSpan="5">Chưa có sản phẩm nào</td></tr>
            ) : (
              cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()}đ</td>
                  <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                  <td><button disabled>Xóa</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="cart-summary">
          <div>Tạm tính: <b>{total.toLocaleString()}đ</b></div>
          <div>
            Mã giảm giá: <input type="text" value={voucher} onChange={e => setVoucher(e.target.value)} disabled />
            <button disabled>Áp dụng</button>
          </div>
          <div>Tổng thanh toán: <b>{total.toLocaleString()}đ</b></div>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="customer-section">
        <h3>Thông tin khách hàng</h3>
        <input type="text" placeholder="Tên khách hàng" value={customer.name} disabled />
        <input type="text" placeholder="Số điện thoại" value={customer.phone} disabled />
        <input type="email" placeholder="Email" value={customer.email} disabled />
        <input type="text" placeholder="Địa chỉ" value={customer.address} disabled />
      </div>

      {/* Thanh toán */}
      <div className="payment-section">
        <h3>Thanh toán</h3>
        <div>
          Phương thức thanh toán:
          <select value={payment.method} disabled>
            <option>Tiền mặt</option>
            <option>Chuyển khoản</option>
            <option>Thẻ</option>
          </select>
        </div>
        <div>
          Khách đưa: <input type="number" value={payment.given} disabled />
        </div>
        <div>Tiền thối lại: <b>0đ</b></div>
        <button disabled>Xác nhận & In hóa đơn</button>
      </div>
    </div>
  );
};

export default BanHangTaiQuayPage; 