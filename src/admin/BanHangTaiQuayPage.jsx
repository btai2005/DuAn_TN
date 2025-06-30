import React, { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';

const BanHangTaiQuayPage = () => {
  // State mẫu cho UI demo
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [voucher, setVoucher] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // State cho sản phẩm
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State cho tìm kiếm
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // State cho hóa đơn
  const [orderId, setOrderId] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  // State cho modal chọn số lượng khi thêm
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // State cho modal sửa số lượng
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // State cho danh sách hóa đơn chờ
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // State thu gọn/mở rộng bảng hóa đơn chờ
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed(c => !c);

  // State thu gọn/mở rộng hóa đơn tạm
  const [collapsedCart, setCollapsedCart] = useState(false);
  const toggleCollapseCart = () => setCollapsedCart(c => !c);

  // State thu gọn/xổ danh sách sản phẩm
  const [showAllProducts, setShowAllProducts] = useState(false);
  const PRODUCTS_PER_ROW = 4;
  const ROWS_SHOWN = 2;
  const MAX_PRODUCTS_SHOWN = PRODUCTS_PER_ROW * ROWS_SHOWN;

  // Demo khách hàng
  const customers = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Khách lẻ' },
  ];

  // Fetch sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:8080/api/san-pham-chi-tiet/getAll');
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lấy lại danh sách sản phẩm trong hóa đơn từ BE
  const fetchCartFromBE = async (orderId) => {
    if (!orderId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/donhangchitiet/don-hang/${orderId}`);
      if (!res.ok) throw new Error('Lỗi khi lấy chi tiết hóa đơn');
      const data = await res.json();
      // Join thêm tên sản phẩm, màu, size từ products
      const cartWithInfo = data.map(item => {
        const prod = products.find(p => p.id === item.idSanPhamChiTiet);
        return {
          ...item,
          tenSanPham: prod?.tenSanPham || '',
          mauSac: prod?.mauSac || '',
          kichThuoc: prod?.kichThuoc || '',
          giaBan: item.gia,
          quantity: item.soLuong,
        };
      });
      setCart(cartWithInfo);
    } catch (err) {
      setCart([]);
    }
  };

  // Sau khi tạo hóa đơn, hoặc khi orderId thay đổi, load lại cart
  useEffect(() => {
    if (orderId) fetchCartFromBE(orderId);
    // eslint-disable-next-line
  }, [orderId, products]);

  // Hàm lấy lại danh sách sản phẩm từ BE
  const fetchProductsFromBE = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/san-pham-chi-tiet/getAll');
      if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm sản phẩm vào hóa đơn
  const handleAddToOrder = async () => {
    if (!orderId || !selectedProduct) return;
    if (qty < 1 || qty > selectedProduct.soLuong) {
      setAddError('Số lượng không hợp lệ!');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const body = {
        idDonHang: orderId,
        idSanPhamChiTiet: selectedProduct.id,
        soLuong: qty,
        gia: selectedProduct.giaBan,
        thanhTien: selectedProduct.giaBan * qty,
      };
      const res = await fetch('http://localhost:8080/api/donhangchitiet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Lỗi khi thêm sản phẩm vào hóa đơn');
      setShowQtyModal(false);
      await fetchCartFromBE(orderId);
      await fetchProductsFromBE();
    } catch (err) {
      setAddError(err.message || 'Lỗi không xác định');
    } finally {
      setAddLoading(false);
    }
  };

  // Mở modal sửa số lượng
  const handleShowEditModal = (idx) => {
    setEditIdx(idx);
    setEditQty(cart[idx].quantity);
    setEditError('');
    setShowEditModal(true);
  };

  // Gọi API sửa số lượng
  const handleEditQty = async () => {
    const item = cart[editIdx];
    if (!item || editQty < 1) {
      setEditError('Số lượng không hợp lệ!');
      return;
    }
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`http://localhost:8080/api/donhangchitiet/update/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soLuong: editQty,
          thanhTien: item.giaBan * editQty,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setEditError(errData.message || 'Lỗi khi cập nhật số lượng!');
        setEditLoading(false);
        return;
      }
      setShowEditModal(false);
      await fetchCartFromBE(orderId);
      await fetchProductsFromBE();
    } catch (err) {
      setEditError('Lỗi khi cập nhật số lượng!');
    } finally {
      setEditLoading(false);
    }
  };

  // Gọi API xóa sản phẩm khỏi hóa đơn
  const handleRemoveFromCart = async (idx) => {
    const item = cart[idx];
    if (!item) return;
    try {
      await fetch(`http://localhost:8080/api/donhangchitiet/delete/${item.id}`, {
        method: 'DELETE',
      });
      await fetchCartFromBE(orderId);
      await fetchProductsFromBE();
    } catch (err) {
      alert('Lỗi khi xóa sản phẩm khỏi hóa đơn!');
    }
  };

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.giaBan * item.quantity, 0);

  // Lọc sản phẩm theo tên
  const filteredProducts = products.filter(p =>
    p.tenSanPham.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm mở modal chọn số lượng khi bấm Thêm vào hóa đơn
  const handleShowQtyModal = (product) => {
    console.log('Chọn sản phẩm:', product);
    setSelectedProduct(product);
    setQty(1);
    setAddError('');
    setShowQtyModal(true);
  };

  // Hàm tạo hóa đơn mới
  const handleCreateOrder = async () => {
    setOrderLoading(true);
    setOrderError('');
    try {
      const res = await fetch('http://localhost:8080/api/donhang/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Lỗi khi tạo hóa đơn');
      const data = await res.json();
      setOrderId(data.id);
      await fetchOrders();
    } catch (err) {
      setOrderError(err.message || 'Lỗi không xác định');
    } finally {
      setOrderLoading(false);
    }
  };

  // Lấy danh sách hóa đơn chờ (tạm thời lấy tất cả đơn hàng)
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const res = await fetch('http://localhost:8080/api/donhang');
      if (!res.ok) throw new Error('Lỗi khi lấy danh sách hóa đơn');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrdersError(err.message || 'Lỗi không xác định');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Khi chọn hóa đơn chờ để thao tác tiếp
  const handleSelectOrder = (order) => {
    setOrderId(order.id);
  };

  useEffect(() => {
    console.log('products:', products);
    console.log('filteredProducts:', filteredProducts);
    console.log('loading:', loading, 'error:', error);
  }, [products, filteredProducts, loading, error]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f6f8fa' }}>
      {/* PHẦN TRÊN: Thanh tìm kiếm + danh sách sản phẩm */}
      <div
        style={{
          flex: 2,
          minHeight: 400,
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '24px 24px 0 24px',
        }}
      >
        {/* Thanh tìm kiếm sản phẩm */}
        <div className="product-toolbar" style={{ marginBottom: 18 }}>
          <div className="toolbar-row">
            <input className="search-input" placeholder="Tìm kiếm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {/* Danh sách sản phẩm (table) */}
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#1976d2' }}>Đang tải sản phẩm...</div>
        ) : error ? (
          <div style={{ color: 'red', padding: 24 }}>{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 32 }}>Không có sản phẩm phù hợp</div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(25,118,210,0.08)',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: '#e3f0ff', color: '#1976d2', fontWeight: 700 }}>
                <th style={{ padding: 10 }}>Ảnh</th>
                <th style={{ padding: 10 }}>Tên sản phẩm</th>
                <th style={{ padding: 10 }}>Màu</th>
                <th style={{ padding: 10 }}>Size</th>
                <th style={{ padding: 10 }}>Tồn kho</th>
                <th style={{ padding: 10 }}>Giá</th>
                <th style={{ padding: 10 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e3e8ee', fontSize: 16 }}>
                  <td style={{ textAlign: 'center', padding: 8 }}>
                    <img
                      src={product.image || '/logo192.png'}
                      alt={product.tenSanPham}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, background: '#f6f8fa' }}
                      onError={e => e.target.src = '/logo192.png'}
                    />
                  </td>
                  <td style={{ fontWeight: 600, padding: 8 }}>{product.tenSanPham}</td>
                  <td style={{ padding: 8 }}>{product.mauSac}</td>
                  <td style={{ padding: 8 }}>{product.kichThuoc}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>{product.soLuong}</td>
                  <td style={{ padding: 8, color: '#1976d2', fontWeight: 700 }}>{product.giaBan?.toLocaleString()} đ</td>
                  <td style={{ padding: 8 }}>
                    <button
                      className="btn blue"
                      style={{
                        borderRadius: 8,
                        padding: '6px 16px',
                        background: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: product.soLuong > 0 ? 'pointer' : 'not-allowed',
                        opacity: product.soLuong > 0 ? 1 : 0.5,
                      }}
                      onClick={() => handleShowQtyModal(product)}
                      disabled={product.soLuong <= 0}
                      title={product.soLuong <= 0 ? 'Hết hàng' : ''}
                    >
                      {product.soLuong > 0 ? 'Thêm vào hóa đơn' : 'Hết hàng'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* PHẦN DƯỚI: 2 bảng hóa đơn */}
      <div style={{ flex: 1, padding: 24, background: '#f6f8fa' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Card hóa đơn chờ */}
          <div style={{ flex: '0 0 38%', minWidth: 400, maxWidth: 540, background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(25,118,210,0.08)', padding: 0, border: '1px solid #e3e8ee', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
            {/* Thanh tiêu đề có nút thu gọn/mở rộng và nút tạo hóa đơn */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 12px 20px', userSelect: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={toggleCollapse}>
                <h3 style={{ margin: 0, color: '#1976d2', letterSpacing: 1, fontSize: 20, fontWeight: 700 }}>DANH SÁCH HÓA ĐƠN CHỜ</h3>
                <span style={{ fontSize: 22, color: '#1976d2', transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {orderId && (
                  <span style={{
                    background: '#e3f0ff',
                    color: '#1976d2',
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: 16,
                    boxShadow: '0 2px 8px rgba(25,118,210,0.08)'
                  }}>
                    Mã HĐ: #{orderId}
                  </span>
                )}
                <button
                  className="btn blue"
                  style={{
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: '6px 18px',
                    fontSize: 15,
                    background: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    marginLeft: 12,
                    boxShadow: '0 2px 8px rgba(25,118,210,0.08)'
                  }}
                  onClick={e => { e.stopPropagation(); handleCreateOrder(); }}
                >
                  + Tạo hóa đơn
                </button>
              </div>
            </div>
            {/* Nội dung bảng, có hiệu ứng thu gọn/mở rộng */}
            <div style={{
              maxHeight: collapsed ? 0 : '70vh',
              overflowY: collapsed ? 'hidden' : 'auto',
              transition: 'max-height 0.3s cubic-bezier(.4,2,.6,1)',
              padding: collapsed ? 0 : '0 20px 20px 20px'
            }}>
              {ordersLoading ? (
                <div style={{ color: '#1976d2', padding: 16, textAlign: 'center' }}>Đang tải...</div>
              ) : ordersError ? (
                <div style={{ color: 'red', padding: 16, textAlign: 'center' }}>{ordersError}</div>
              ) : (
                orders.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, padding: 24 }}>
                    <div style={{ fontSize: 54, color: '#e3f0ff', marginBottom: 12 }}>🧾</div>
                    <div style={{ color: '#888', fontSize: 16, marginBottom: 16, textAlign: 'center' }}>Chưa có hóa đơn chờ nào.<br/>Hãy tạo hóa đơn mới để bắt đầu bán hàng!</div>
                    <button className="btn blue" style={{ fontWeight: 600, borderRadius: 8, padding: '8px 20px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }} onClick={handleCreateOrder}>Tạo hóa đơn mới</button>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 14, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }}>
                    <thead>
                      <tr style={{ background: '#e3f0ff', color: '#1976d2' }}>
                        <th style={{ padding: 8, borderBottom: '1px solid #e3e8ee' }}>Mã HĐ</th>
                        <th style={{ padding: 8, borderBottom: '1px solid #e3e8ee' }}>Ngày tạo</th>
                        <th style={{ padding: 8, borderBottom: '1px solid #e3e8ee' }}>Tổng tiền</th>
                        <th style={{ padding: 8, borderBottom: '1px solid #e3e8ee' }}>Khách</th>
                        <th style={{ padding: 8, borderBottom: '1px solid #e3e8ee' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} style={{ background: orderId === order.id ? '#e3f0ff' : undefined, cursor: 'pointer', transition: 'background 0.2s' }}
                          onClick={() => handleSelectOrder(order)}
                          onMouseOver={e => e.currentTarget.style.background = '#f0f7ff'}
                          onMouseOut={e => e.currentTarget.style.background = orderId === order.id ? '#e3f0ff' : ''}
                        >
                          <td style={{ padding: 8, textAlign: 'center', fontWeight: 600 }}>#{order.id}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>{order.ngayTao || ''}</td>
                          <td style={{ padding: 8, textAlign: 'right', fontWeight: 500 }}>{order.tongTien?.toLocaleString() || 0} đ</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>{order.idkhachHang ? `#${order.idkhachHang}` : ''}</td>
                          <td style={{ padding: 8, textAlign: 'center' }}>
                            <button className="btn blue" style={{ fontWeight: 600, borderRadius: 8, padding: '4px 12px', background: orderId === order.id ? '#1976d2' : '#fff', color: orderId === order.id ? '#fff' : '#1976d2', border: '1px solid #1976d2', transition: 'all 0.2s' }} disabled={orderId === order.id}>
                              {orderId === order.id ? 'Đang thao tác' : 'Chọn'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
          {/* Card hóa đơn tạm */}
          <div style={{ flex: '1 1 65%', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Card hóa đơn tạm thu gọn/mở rộng */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 12px 24px', cursor: 'pointer', userSelect: 'none' }} onClick={toggleCollapseCart}>
              <h3 style={{ margin: 0, color: '#1976d2', letterSpacing: 1, fontSize: 20, fontWeight: 700 }}>HÓA ĐƠN TẠM</h3>
              <span style={{ fontSize: 22, color: '#1976d2', transition: 'transform 0.2s', transform: collapsedCart ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
            </div>
            {/* Nội dung hóa đơn tạm, có hiệu ứng thu gọn/mở rộng */}
            <div style={{ maxHeight: collapsedCart ? 0 : 600, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(.4,2,.6,1)', padding: collapsedCart ? 0 : '0 24px 24px 24px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#e3f0ff' }}>
                    <th>Tên</th>
                    <th>Màu</th>
                    <th>Size</th>
                    <th>Giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>Chưa có sản phẩm nào</td></tr>
                  ) : (
                    cart.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.tenSanPham}</td>
                        <td>{item.mauSac}</td>
                        <td>{item.kichThuoc}</td>
                        <td>{item.giaBan?.toLocaleString()}</td>
                        <td>{item.quantity}</td>
                        <td>{(item.giaBan * item.quantity).toLocaleString()}</td>
                        <td style={{ display: 'flex', gap: 8 }}>
                          <button className="btn" style={{ background: '#1976d2', color: '#fff', fontWeight: 600 }} onClick={() => handleShowEditModal(idx)}>Sửa</button>
                          <button className="btn red" onClick={() => handleRemoveFromCart(idx)}>Xóa</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: 12, fontWeight: 700, fontSize: 18, color: '#1976d2' }}>
                Tổng tiền: {total.toLocaleString()} đ
              </div>
            </div>
          </div>
        </div>
      </div>
      {orderError && <div style={{ color: 'red', marginBottom: 12 }}>{orderError}</div>}
      {/* Modal chọn số lượng khi thêm sản phẩm */}
      {showQtyModal && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            minWidth: 320,
            boxShadow: '0 8px 32px rgba(25,118,210,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h3 style={{ marginBottom: 16 }}>Chọn số lượng cho <span style={{ color: '#1976d2' }}>{selectedProduct.tenSanPham}</span></h3>
            <input
              type="number"
              min={1}
              max={selectedProduct.soLuong}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              style={{ fontSize: 18, padding: 8, width: 100, textAlign: 'center', marginBottom: 16, borderRadius: 6, border: '1px solid #1976d2' }}
            />
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <button
                onClick={handleAddToOrder}
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                disabled={qty < 1 || qty > selectedProduct.soLuong}
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowQtyModal(false)}
                style={{ background: '#eee', color: '#1976d2', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
              >
                Hủy
              </button>
            </div>
            {addError && <div style={{ color: 'red', marginTop: 12 }}>{addError}</div>}
          </div>
        </div>
      )}
      {/* Modal sửa số lượng sản phẩm trong hóa đơn tạm */}
      {showEditModal && editIdx !== null && cart[editIdx] && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            minWidth: 320,
            boxShadow: '0 8px 32px rgba(25,118,210,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h3 style={{ marginBottom: 16 }}>
              Sửa số lượng cho <span style={{ color: '#1976d2' }}>{cart[editIdx].tenSanPham}</span>
            </h3>
            <input
              type="number"
              min={1}
              value={editQty}
              onChange={e => setEditQty(Number(e.target.value))}
              style={{ fontSize: 18, padding: 8, width: 100, textAlign: 'center', marginBottom: 16, borderRadius: 6, border: '1px solid #1976d2' }}
            />
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <button
                onClick={handleEditQty}
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                disabled={editQty < 1}
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: '#eee', color: '#1976d2', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
              >
                Hủy
              </button>
            </div>
            {editError && <div style={{ color: 'red', marginTop: 12 }}>{editError}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BanHangTaiQuayPage; 