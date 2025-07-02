import React, { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Card, CardHeader, CardContent, Chip, Box
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Swal from 'sweetalert2';

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



  // State cho thông tin khách hàng và voucher
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');


  // State cho danh sách voucher và voucher đã chọn
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState("");

  // State cho danh sách khách hàng và khách hàng đã chọn
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // State cho modal thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('TIEN_MAT');

  // Thêm state cho thông báo voucher
  const [voucherMessage, setVoucherMessage] = useState('');

  // Thêm state cho thông báo khách hàng
  const [customerMessage, setCustomerMessage] = useState('');

  // Load danh sách voucher khi mount
  useEffect(() => {
    fetch('http://localhost:8080/api/voucher')
      .then(res => res.json())
      .then(data => setVouchers(data || []));
  }, []);

  // Load danh sách khách hàng khi mount
  useEffect(() => {
    fetch('http://localhost:8080/api/khachhang')
      .then(res => res.json())
      .then(data => setCustomers(data || []));
  }, []);

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
    if (!orderId) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng chọn hoặc tạo hóa đơn trước!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1800,
        width: 250
      });
      return;
    }
    if (!selectedProduct) return;
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
      Swal.fire({
        icon: 'success',
        title: 'Thêm sản phẩm thành công',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        width: 250
      });
    } catch (err) {
      setAddError(err.message || 'Lỗi không xác định');
    } finally {
      setAddLoading(false);
    }
  };

  // Hàm sửa số lượng sản phẩm trong hóa đơn tạm (có xác nhận)
  const handleShowEditModal = async (idx) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn sửa sản phẩm này không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#d33',
    });
    if (result.isConfirmed) {
      setEditIdx(idx);
      setEditQty(Number(cart[idx]?.quantity || 1));
      setEditError('');
      setShowEditModal(true);
      
    }
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
      Swal.fire({
        icon: 'success',
        title: 'Sửa sản phẩm thành công',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        width: 250
      });
    } catch (err) {
      setEditError('Lỗi khi cập nhật số lượng!');
    } finally {
      setEditLoading(false);
    }
  };

  // Hàm xóa sản phẩm khỏi hóa đơn tạm (có xác nhận)
  const handleRemoveFromCart = async (idx) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#d33',
    });
    if (result.isConfirmed) {
      if (!orderId || !cart[idx]) return;
      try {
        const res = await fetch(`http://localhost:8080/api/donhangchitiet/delete/${cart[idx].id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Lỗi khi xóa sản phẩm khỏi hóa đơn');
        await fetchCartFromBE(orderId);
        await fetchProductsFromBE();
        Swal.fire({
        icon: 'success',
        title: 'Xóa Sản Phẩm Thành Công',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        width: 250
      });
      } catch (err) {
        // Có thể hiện alert lỗi nếu muốn
      }
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

  // Hàm tạo hóa đơn mới (có xác nhận)
  const handleCreateOrder = async () => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn tạo hóa đơn mới không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#d33',
      width: 300,
      customClass: {
        popup: 'swal2-custom-popup'
      }
    });
    if (!result.isConfirmed) return;
    setOrderLoading(true);
    setOrderError('');
    try {
      const res = await fetch('http://localhost:8080/api/donhang/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loaiDonHang: 'Bán hàng tại quầy', trangThai: 0 }),
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
      const res = await fetch('http://localhost:8080/api/donhang/chuahoanthanh');
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

  // Hàm thêm khách hàng và tạo hóa đơn mới
  const addCustomerAndCreateOrder = async (e) => {
    if (e) e.stopPropagation();
    // Nếu tất cả các trường đều rỗng => khách lẻ
    if (!customerName && !customerEmail && !customerPhone) {
      // Tạo hóa đơn không có idKhachHang (khách lẻ)
      handleCreateOrder();
      return;
    }
    // Nếu đã nhập thông tin khách hàng (ít nhất 1 trường)
    const customerBody = {
      tenKhachHang: customerName,
      email: customerEmail,
      ngaySinh: "",
      gioiTinh: "",
      diaChi: "",
      soDienThoai: customerPhone,
      trangThai: "",
      maThongBao: null,
      thoiGianThongBao: null
    };
    try {
      const res = await fetch('http://localhost:8080/api/khachhang/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerBody)
      });
      if (!res.ok) throw new Error('Lỗi khi thêm khách hàng!');
      const customer = await res.json();
      const customerId = customer.id;
      // Tạo hóa đơn với idKhachHang
      setOrderLoading(true);
      setOrderError('');
      const resOrder = await fetch('http://localhost:8080/api/donhang/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idKhachHang: customerId, loaiDonHang: 'Bán hàng tại quầy', trangThai: 0 })
      });
      if (!resOrder.ok) throw new Error('Lỗi khi tạo hóa đơn!');
      const order = await resOrder.json();
      setOrderId(order.id);
      await fetchOrders();
    } catch (err) {
      setOrderError(err.message || 'Lỗi không xác định');
    } finally {
      setOrderLoading(false);
    }
  };

  // Reset form thông tin khách hàng và voucher khi chọn hóa đơn khác hoặc tạo mới
  useEffect(() => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setSelectedVoucherId('');
  }, [orderId]);

  // Hàm mở modal thanh toán
  const handleOpenPaymentModal = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Không thể thanh toán khi hóa đơn chưa có sản phẩm!',
        showConfirmButton: false,
        timer: 1800,
        width: 350
      });
      return;
    }
    setPaymentAmount(0);
    setPaymentMethod('TIEN_MAT');
    setShowPaymentModal(true);
  };

  // Hàm xác nhận thanh toán (gọi API cập nhật tổng tiền và trạng thái)
  const handleConfirmPayment = async () => {
    if (!orderId) return;
    try {
      const payload = {
        tongTien: total,
        idkhachHang: selectedCustomerId || null,
        tenKhachHang: !selectedCustomerId && customerName ? customerName : null,
        email: !selectedCustomerId && customerEmail ? customerEmail : null,
        soDienThoai: !selectedCustomerId && customerPhone ? customerPhone : null
      };
      const res = await fetch(`http://localhost:8080/api/xacnhanthanhtoan/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Lỗi khi xác nhận thanh toán');
      setShowPaymentModal(false);
      // Hiển thị thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Thanh toán thành công',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        width: 250
      });
      await fetchOrders();
      // RESET trạng thái hóa đơn tạm
      setOrderId(null);
      setCart([]);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setSelectedVoucherId('');
      setPaymentAmount(0);
    } catch (err) {
      alert(err.message || 'Lỗi khi xác nhận thanh toán!');
    }
  };

  // Khi orderId thay đổi, fetch lại thông tin đơn hàng để set lại selectedVoucherId và selectedCustomerId
  useEffect(() => {
    if (!orderId) return;
    fetch(`http://localhost:8080/api/donhang/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedVoucherId(data.idgiamGia || '');
        setSelectedCustomerId(data.idkhachHang || '');
        // Lấy thông tin khách hàng từ danh sách customers
        const kh = customers.find(c => c.id === Number(data.idkhachHang));
        if (kh) {
          setCustomerName(kh.tenKhachHang || '');
          setCustomerEmail(kh.email || '');
          setCustomerPhone(kh.soDienThoai || '');
        } else {
          setCustomerName('');
          setCustomerEmail('');
          setCustomerPhone('');
        }
      });
  }, [orderId, customers]);

  // Thay thế hàm chọn voucher
  const handleVoucherChange = async (e) => {
    const voucherId = e.target.value;
    setSelectedVoucherId(voucherId);
    setVoucherMessage('');

    if (!orderId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/update-voucher/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idgiamGia: voucherId ? Number(voucherId) : null })
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật voucher cho hóa đơn');
      setVoucherMessage(voucherId ? 'Áp dụng voucher thành công!' : 'Đã bỏ chọn voucher!');
    } catch (err) {
      setVoucherMessage(err.message || 'Lỗi khi áp dụng voucher!');
    }
  };

  // Hàm xử lý khi chọn khách hàng
  const handleCustomerChange = async (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    setCustomerMessage('');

    // Cập nhật thông tin form
    const kh = customers.find(c => c.id === Number(customerId));
    if (kh) {
      setCustomerName(kh.tenKhachHang || '');
      setCustomerEmail(kh.email || '');
      setCustomerPhone(kh.soDienThoai || '');
    } else {
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
    }

    if (!orderId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/update-khachhang/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idkhachHang: customerId ? Number(customerId) : null })
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật khách hàng cho hóa đơn');
      setCustomerMessage(customerId ? 'Chọn khách hàng thành công!' : 'Đã chuyển về khách lẻ!');
      await fetchOrders();
    } catch (err) {
      setCustomerMessage(err.message || 'Lỗi khi cập nhật khách hàng!');
    }
  };

  // Tự động ẩn thông báo voucher sau 2.5 giây
  useEffect(() => {
    if (voucherMessage) {
      const timer = setTimeout(() => setVoucherMessage(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [voucherMessage]);

  // Tự động ẩn thông báo khách hàng sau 2.5 giây
  useEffect(() => {
    if (customerMessage) {
      const timer = setTimeout(() => setCustomerMessage(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [customerMessage]);

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
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#e3f0ff' }}>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Màu</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Tồn kho</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Avatar
                        src={product.images ? `http://localhost:8080/images/${product.images.split(',')[0]}` : '/logo192.png'}
                        alt={product.tenSanPham}
                        sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: '#f6f8fa' }}
                        variant="rounded"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{product.tenSanPham}</TableCell>
                    <TableCell>{product.mauSac}</TableCell>
                    <TableCell>{product.kichThuoc}</TableCell>
                    <TableCell align="center">{product.soLuong}</TableCell>
                    <TableCell sx={{ color: '#1976d2', fontWeight: 700 }}>{product.giaBan?.toLocaleString()} đ</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddShoppingCartIcon />}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: 15,
                          opacity: product.soLuong > 0 ? 1 : 0.5
                        }}
                        onClick={() => handleShowQtyModal(product)}
                        disabled={product.soLuong <= 0}
                      >
                        {product.soLuong > 0 ? 'Thêm vào hóa đơn' : 'Hết hàng'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      {/* PHẦN DƯỚI: 2 bảng hóa đơn */}
      <div style={{ flex: 1, padding: 24, background: '#f6f8fa' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Card hóa đơn chờ */}
          <Card sx={{ flex: '0 0 38%', minWidth: 400, maxWidth: 540, borderRadius: 3, boxShadow: 3, minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                <Box
                  sx={{
                    color: '#1976d2',
                    letterSpacing: 1,
                    fontSize: 18,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1
                  }}
                >
                  <Box sx={{ fontSize: '15px', fontWeight: 'bold' }}>
                    HÓA ĐƠN CHỜ
                  </Box>


                </Box>
                {orderId && (
                  <Chip
                    label={`Mã HĐ: #${orderId}`}
                    color="info"
                    sx={{ fontWeight: 300, fontSize: 12, ml: 2 }}
                  />
                )}
              </Box>
              <Button
  variant="contained"
  color="primary"
  sx={{
    fontWeight: 600,
    borderRadius: 2,
    padding: '4px 12px',      // giảm padding ngang & dọc
    fontSize: 13,             // giảm kích thước chữ
    ml: 2,
    boxShadow: 1,
    minWidth: 'unset',        // xóa minWidth mặc định (MUI Button có minWidth 64px)
  }}
  onClick={addCustomerAndCreateOrder}
>
  + Tạo hóa đơn
</Button>
            </Box>
            <CardContent sx={{ pt: 1, pb: 2, px: 2, maxHeight: collapsed ? 0 : '70vh', overflowY: collapsed ? 'hidden' : 'auto', transition: 'max-height 0.3s cubic-bezier(.4,2,.6,1)' }}>
              {ordersLoading ? (
                <div style={{ color: '#1976d2', padding: 16, textAlign: 'center' }}>Đang tải...</div>
              ) : ordersError ? (
                <div style={{ color: 'red', padding: 16, textAlign: 'center' }}>{ordersError}</div>
              ) : (
                orders.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, padding: 24 }}>
                    <div style={{ fontSize: 54, color: '#e3f0ff', marginBottom: 12 }}>🧾</div>
                    <div style={{ color: '#888', fontSize: 16, marginBottom: 16, textAlign: 'center' }}>Chưa có hóa đơn chờ nào.<br/>Hãy tạo hóa đơn mới để bắt đầu bán hàng!</div>
                    <Button variant="contained" color="primary" sx={{ fontWeight: 600, borderRadius: 2, padding: '8px 20px', fontSize: 16, boxShadow: 1 }} onClick={handleCreateOrder}>Tạo hóa đơn mới</Button>
                  </div>
                ) : (
                  <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, mt: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: '#e3f0ff' }}>
                          <TableCell>Mã HĐ</TableCell>
                          <TableCell>Ngày tạo</TableCell>
                          <TableCell align="right">Tổng tiền</TableCell>
                          <TableCell>Khách</TableCell>
                          <TableCell>Trạng thái</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map(order => (
                          <TableRow key={order.id} hover selected={orderId === order.id} onClick={() => handleSelectOrder(order)}
                            sx={{ cursor: 'pointer', background: orderId === order.id ? '#e3f0ff' : undefined }}>
                            <TableCell sx={{ fontWeight: 600 }}>#{order.id}</TableCell>
                            <TableCell>{order.ngayTao || ''}</TableCell>
                            <TableCell align="right">{order.tongTien?.toLocaleString() || 0} đ</TableCell>
                            <TableCell>{order.idkhachHang ? `#${order.idkhachHang}` : ''}</TableCell>
                            <TableCell>
                              {order.trangThai === 0 ? (
                                <Chip label="Chờ thanh toán" color="warning" size="small" />
                              ) : order.trangThai === 1 ? (
                                <Chip label="Đã thanh toán" color="success" size="small" />
                              ) : (
                                <Chip label={order.trangThai} color="default" size="small" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={orderId === order.id ? 'contained' : 'outlined'}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 600, borderRadius: 2, px: 2 }}
                                disabled={orderId === order.id}
                              >
                                {orderId === order.id ? 'Đang thao tác' : 'Chọn'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )
              )}
            </CardContent>
          </Card>
          {/* Card hóa đơn tạm */}
          <Card sx={{ flex: '1 1 65%', borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CardHeader
              title={<span style={{ color: '#1976d2', letterSpacing: 1, fontSize: 20, fontWeight: 700 }}>HÓA ĐƠN TẠM</span>}
              sx={{ pb: 0, pt: 2, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2, maxHeight: collapsedCart ? 0 : 600, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(.4,2,.6,1)', display: 'flex', flexDirection: 'column', height: 600 }}>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ background: '#f6f8fa', borderRadius: 2, padding: 16, marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  {/* Dropdown chọn khách hàng */}
                  <select
                    value={selectedCustomerId || ''}
                    onChange={handleCustomerChange}
                    style={{ flex: '1 1 180px', padding: 8, borderRadius: 6, border: '1px solid #1976d2', fontSize: 15 }}
                    disabled={!orderId}
                  >
                    <option value=''>-- Chọn khách hàng --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.tenKhachHang} ({c.soDienThoai})
                      </option>
                    ))}
                  </select>
                  <input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ flex: '1 1 180px', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
                    disabled={!orderId}
                     placeholder="Nhập tên khách hàng"
                  />
                  <input
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    style={{ flex: '1 1 180px', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
                    disabled={!orderId}
                     placeholder="Nhập email khách"
                  />
                  <input
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    style={{ flex: '1 1 140px', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
                    disabled={!orderId}
                     placeholder="Nhập số điện thoại"
                  />
                  <select
                    value={selectedVoucherId || ''}
                    onChange={handleVoucherChange}
                    style={{ flex: '1 1 180px', padding: 8, borderRadius: 6, border: '1px solid #1976d2', fontSize: 15 }}
                    disabled={!orderId}
                  >
                    <option value="">-- Chọn voucher --</option>
                    {vouchers.map(v => (
                      <option key={v.id} value={v.id}>{v.tenVoucher}</option>
                    ))}
                  </select>
                  {voucherMessage && (
                    <div style={{ color: voucherMessage.includes('thành công') ? '#43b244' : 'red', marginTop: 4, fontWeight: 500 }}>
                      {voucherMessage}
                    </div>
                  )}
                  {customerMessage && (
                    <div style={{ color: customerMessage.includes('thành công') ? '#43b244' : 'red', marginTop: 4, fontWeight: 500 }}>
                      {customerMessage}
                    </div>
                  )}
                </div>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: '#e3f0ff' }}>
                        <TableCell>Tên</TableCell>
                        <TableCell>Màu</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>SL</TableCell>
                        <TableCell>Thành tiền</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.length === 0 ? (
                        <TableRow><TableCell colSpan={7} align="center" sx={{ color: '#888' }}>Chưa có sản phẩm nào</TableCell></TableRow>
                      ) : (
                        cart.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.tenSanPham}</TableCell>
                            <TableCell>{item.mauSac}</TableCell>
                            <TableCell>{item.kichThuoc}</TableCell>
                            <TableCell>{item.giaBan?.toLocaleString()}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{(item.giaBan * item.quantity).toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant="outlined" color="primary" size="small" sx={{ mr: 1, fontWeight: 600 }} onClick={() => handleShowEditModal(idx)}>Sửa</Button>
                              <Button variant="contained" color="error" size="small" sx={{ fontWeight: 600 }} onClick={() => handleRemoveFromCart(idx)}>Xóa</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* Nút thanh toán và tổng tiền luôn ở dưới, cùng một hàng */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 24px 0 0' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1976d2' }}>
                    Tổng tiền: {total.toLocaleString()} đ
                  </div>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 2, padding: '10px 28px', fontWeight: 700, fontSize: 18, boxShadow: 1 }}
                    onClick={handleOpenPaymentModal}
                    disabled={!orderId}
                  >
                    Thanh toán
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {orderError && <div style={{ color: 'red', marginBottom: 12 }}>{orderError}</div>}
      {/* Modal chọn số lượng khi thêm sản phẩm */}
      <Dialog open={showQtyModal && !!selectedProduct} onClose={() => setShowQtyModal(false)}>
        <DialogTitle>
          Chọn số lượng cho <span style={{ color: '#1976d2' }}>{selectedProduct?.tenSanPham}</span>
        </DialogTitle>
        <DialogContent>
          <TextField
            type="number"
            label="Số lượng"
            variant="outlined"
            fullWidth
            value={Number(qty)}
            onChange={e => setQty(Number(e.target.value))}
            inputProps={{ min: 1, max: selectedProduct?.soLuong }}
            sx={{ mt: 2 }}
            disabled={!orderId}
          />
          {addError && <Alert severity="error" sx={{ mt: 2 }}>{addError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddToOrder} variant="contained" color="primary" disabled={qty < 1 || qty > selectedProduct?.soLuong}>
            Xác nhận
          </Button>
          <Button onClick={() => setShowQtyModal(false)} variant="outlined" color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal sửa số lượng sản phẩm trong hóa đơn tạm */}
      <Dialog open={showEditModal && editIdx !== null && cart[editIdx]} onClose={() => setShowEditModal(false)}>
        <DialogTitle>
          Sửa số lượng cho <span style={{ color: '#1976d2' }}>{cart[editIdx]?.tenSanPham}</span>
        </DialogTitle>
        <DialogContent>
          <TextField
            type="number"
            label="Số lượng"
            variant="outlined"
            fullWidth
            value={Number(editQty)}
            onChange={e => setEditQty(Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ mt: 2 }}
            disabled={!orderId}
          />
          {editError && <Alert severity="error" sx={{ mt: 2 }}>{editError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditQty} variant="contained" color="primary" disabled={editQty < 1}>
            Xác nhận
          </Button>
          <Button onClick={() => setShowEditModal(false)} variant="outlined" color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal thanh toán */}
      <Dialog open={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        <DialogTitle>Thanh toán</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: 8, width: '100%' }}>
            <b>Số tiền cần thanh toán:</b> <span style={{ color: '#1976d2', fontSize: 18, fontWeight: 700 }}>{total.toLocaleString()} đ</span>
          </div>
          <TextField
            type="number"
            label="Số tiền khách đưa"
            variant="outlined"
            fullWidth
            value={paymentAmount}
            onChange={e => setPaymentAmount(Number(e.target.value))}
            inputProps={{ min: 0 }}
            sx={{ mb: 2 }}
            disabled={!orderId}
          />
          <div style={{ marginBottom: 8, width: '100%' }}>
            <b>Phương thức thanh toán:</b>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <Button
                variant={paymentMethod === 'TIEN_MAT' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setPaymentMethod('TIEN_MAT')}
              >Tiền mặt</Button>
              <Button
                variant={paymentMethod === 'CHUYEN_KHOAN' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setPaymentMethod('CHUYEN_KHOAN')}
              >Chuyển khoản</Button>
            </div>
          </div>
          <div style={{ marginBottom: 8, width: '100%' }}>
            {paymentAmount < total ? (
              <Alert severity="warning">Khách thanh toán thiếu: {(total - paymentAmount).toLocaleString()} đ</Alert>
            ) : (
              <Alert severity="success">Tiền thừa trả khách: {(paymentAmount - total).toLocaleString()} đ</Alert>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmPayment}
            variant="contained"
            color="success"
            disabled={paymentAmount < total}
          >
            Xác nhận thanh toán
          </Button>
          <Button
            onClick={() => setShowPaymentModal(false)}
            variant="outlined"
            color="primary"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {/* Thêm Snackbar/Alert cho thông báo */}
      <Snackbar open={!!voucherMessage} autoHideDuration={2500} onClose={() => setVoucherMessage('')}>
        <Alert onClose={() => setVoucherMessage('')} severity={voucherMessage.includes('thành công') ? 'success' : 'error'}>
          {voucherMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={!!customerMessage} autoHideDuration={2500} onClose={() => setCustomerMessage('')}>
        <Alert onClose={() => setCustomerMessage('')} severity={customerMessage.includes('thành công') ? 'success' : 'error'}>
          {customerMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BanHangTaiQuayPage; 