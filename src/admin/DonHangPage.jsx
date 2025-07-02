import React, { useState, useEffect } from 'react';

const DonHangPage = () => {
  const [activeTab, setActiveTab] = useState('POS'); // 'POS' hoặc 'ONLINE'
  const [ordersPOS, setOrdersPOS] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chiTietSanPham, setChiTietSanPham] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState('');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch danh sách sản phẩm chi tiết khi mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/san-pham-chi-tiet/getAll');
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch danh sách khách hàng khi mount
  useEffect(() => {
    fetch('http://localhost:8080/api/khachhang')
      .then(res => res.json())
      .then(data => setCustomers(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (activeTab === 'POS') {
      fetchOrdersPOS();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchOrdersPOS = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/donhang/getAllHoanThanh');
      if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu đơn hàng POS');
      const data = await res.json();
      setOrdersPOS(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const fetchChiTietSanPham = async (orderId) => {
    setLoadingDetail(true);
    setErrorDetail('');
    try {
      const res = await fetch(`http://localhost:8080/api/donhangchitiet/don-hang/${orderId}`);
      if (!res.ok) throw new Error('Lỗi khi lấy chi tiết hóa đơn');
      let data = await res.json();
      // Join thêm tên, màu, size từ products
      data = data.map(item => {
        const prod = products.find(p => p.id === item.idSanPhamChiTiet);
        return {
          ...item,
          tenSanPham: prod?.tenSanPham || '-',
          mauSac: prod?.mauSac || '-',
          kichThuoc: prod?.kichThuoc || '-',
        };
      });
      setChiTietSanPham(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorDetail(err.message || 'Lỗi khi lấy chi tiết hóa đơn');
      setChiTietSanPham([]);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    if (Array.isArray(order.donHangChiTiets) && order.donHangChiTiets.length > 0) {
      // Join với products nếu có
      const data = order.donHangChiTiets.map(item => {
        const prod = products.find(p => p.id === item.idSanPhamChiTiet);
        return {
          ...item,
          tenSanPham: prod?.tenSanPham || '-',
          mauSac: prod?.mauSac || '-',
          kichThuoc: prod?.kichThuoc || '-',
        };
      });
      setChiTietSanPham(data);
    } else {
      fetchChiTietSanPham(order.id);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
    setChiTietSanPham([]);
    setErrorDetail('');
  };

  const getTenKhachHang = (id) => {
    if (!id) return 'Khách vãng lai';
    const kh = customers.find(c => c.id === id || c.id === Number(id));
    return kh?.tenKhachHang || 'Khách vãng lai';
  };

  const renderOrders = (orders) => (
    <table style={{ width: '100%', marginTop: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(25,118,210,0.08)', overflow: 'hidden' }}>
      <thead>
        <tr style={{ background: '#e3f0ff', color: '#1976d2', fontWeight: 700 }}>
          <th style={{ padding: 12 }}>Mã đơn</th>
          <th style={{ padding: 12 }}>Nhân viên</th>
          <th style={{ padding: 12 }}>Khách hàng</th>
          <th style={{ padding: 12 }}>Ngày mua</th>
          <th style={{ padding: 12 }}>Tổng tiền</th>
          <th style={{ padding: 12 }}>Trạng thái</th>
          <th style={{ padding: 12 }}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 24 }}>Không có đơn hàng nào</td></tr>
        ) : (
          orders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid #e3e8ee', fontSize: 16 }}>
              <td style={{ padding: 12, textAlign: 'center', fontWeight: 600 }}>#{order.id}</td>
              <td style={{ padding: 12 }}>{order.tenNhanVien || '-'}</td>
              <td style={{ padding: 12 }}>{getTenKhachHang(order.idkhachHang)}</td>
              <td style={{ padding: 12 }}>{order.ngayMua || '-'}</td>
              <td style={{ padding: 12, color: '#1976d2', fontWeight: 700 }}>{order.tongTien?.toLocaleString()} đ</td>
              <td style={{ padding: 12 }}>
                <span style={{
                  background: order.trangThai === 1 ? '#43b244' : '#ff9800',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '4px 14px',
                  fontWeight: 600,
                  fontSize: 15
                }}>{order.trangThai === 1 ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
              </td>
              <td style={{ padding: 12 }}>
                <button style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }} onClick={() => handleShowDetail(order)}>
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const renderDetailModal = () => {
    if (!showDetailModal || !selectedOrder) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ background: '#fff', borderRadius: 12, minWidth: 400, maxWidth: 800, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
          <h3 style={{ color: '#1976d2', marginBottom: 18 }}>Chi tiết sản phẩm trong hóa đơn #{selectedOrder.id}</h3>
          {loadingDetail ? (
            <div style={{ color: '#1976d2', padding: 24, textAlign: 'center' }}>Đang tải chi tiết sản phẩm...</div>
          ) : errorDetail ? (
            <div style={{ color: 'red', padding: 24, textAlign: 'center' }}>{errorDetail}</div>
          ) : Array.isArray(chiTietSanPham) && chiTietSanPham.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e3f0ff' }}>
                  <th style={{ padding: 8 }}>Tên</th>
                  <th style={{ padding: 8 }}>Màu</th>
                  <th style={{ padding: 8 }}>Size</th>
                  <th style={{ padding: 8 }}>Giá</th>
                  <th style={{ padding: 8 }}>SL</th>
                  <th style={{ padding: 8 }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {chiTietSanPham.map((sp, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8 }}>{sp.tenSanPham || '-'}</td>
                    <td style={{ padding: 8 }}>{sp.mauSac || '-'}</td>
                    <td style={{ padding: 8 }}>{sp.kichThuoc || '-'}</td>
                    <td style={{ padding: 8 }}>{sp.gia?.toLocaleString() || '-'}</td>
                    <td style={{ padding: 8 }}>{sp.soLuong || '-'}</td>
                    <td style={{ padding: 8 }}>{sp.thanhTien?.toLocaleString() || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: '#888', fontStyle: 'italic', margin: '24px 0' }}>Không có sản phẩm trong hóa đơn này.</div>
          )}
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <button onClick={handleCloseDetail} style={{ padding: '8px 24px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Đóng</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: '#f6f8fa' }}>
      <h2 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 24, letterSpacing: 1 }}>Quản lý đơn hàng</h2>
      <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
        <button
          style={{
            flex: 1,
            padding: '14px 0',
            border: 'none',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 0,
            background: activeTab === 'POS' ? '#1976d2' : '#e3f0ff',
            color: activeTab === 'POS' ? '#fff' : '#1976d2',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: activeTab === 'POS' ? '0 4px 16px rgba(25,118,210,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('POS')}
        >
          <span role="img" aria-label="pos">🧾</span> Đơn hàng POS
        </button>
        <button
          style={{
            flex: 1,
            padding: '14px 0',
            border: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 16,
            background: activeTab === 'ONLINE' ? '#1976d2' : '#e3f0ff',
            color: activeTab === 'ONLINE' ? '#fff' : '#1976d2',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: activeTab === 'ONLINE' ? '0 4px 16px rgba(25,118,210,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('ONLINE')}
        >
          <span role="img" aria-label="online">🌐</span> Đơn hàng Online
        </button>
      </div>
      <div style={{ background: '#fff', borderRadius: '0 0 16px 16px', boxShadow: '0 2px 8px rgba(25,118,210,0.04)', padding: 0, minHeight: 320 }}>
        {activeTab === 'POS' && (
          loading ? <div style={{ padding: 32, textAlign: 'center', color: '#1976d2' }}>Đang tải dữ liệu...</div>
          : error ? <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>{error}</div>
          : renderOrders(ordersPOS)
        )}
        {activeTab === 'ONLINE' && (
          <div style={{ color: '#888', textAlign: 'center', padding: 48, fontStyle: 'italic' }}>
            Chức năng Đơn hàng Online sẽ cập nhật sau.
          </div>
        )}
      </div>
      {renderDetailModal()}
    </div>
  );
};

export default DonHangPage;