import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  
  Select,
  Input
} from "antd";

import "../styles/AdminPanel.css";
import "../styles/SalePage.css";

const { Option } = Select;

const SanPhamPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    tenSanPham: "",
    idDanhMuc: "",
    idThuongHieu: "",
    idChatLieu: "",
    idXuatXu: "",
    idKhuyenMai: "",
    giaBan: "",
    giaGiamGia: "",
    trangThai: 1,
    imanges: ""
  });
  const [loading, setLoading] = useState(false);

  // Sửa sản phẩm
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editId, setEditId] = useState(null);

  // State cho sản phẩm chi tiết
  const [showChiTietModal, setShowChiTietModal] = useState(false);
  const [chiTietProduct, setChiTietProduct] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [loadingChiTiet, setLoadingChiTiet] = useState(false);

  const [lastAddedProductId, setLastAddedProductId] = useState(null);
  const [mauSacs, setMauSacs] = useState([]);
  const [kichThuocs, setKichThuocs] = useState([]);
  const [spctForm, setSpctForm] = useState({
    idMauSac: "",
    idKichThuoc: "",
    giaBan: "",
    soLuong: ""
  });
  const [spctList, setSpctList] = useState([]);

  const [uploadingImage, setUploadingImage] = useState(false);

  // Thêm state upload cho form sửa
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  // Lấy danh sách sản phẩm
  const fetchProducts = () => {
    axios
      .get("http://localhost:8080/api/san-pham/getAll")
      .then((res) => {
        console.log("Sản phẩm:", res.data);
        setProducts(res.data);
      })
      .catch(() => setProducts([]));
  };
  useEffect(fetchProducts, []);

  // Lấy danh mục
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/danh-muc/getAll")
      .then((res) => {
        console.log("Danh mục:", res.data);
        setCategories(res.data);
      })
      .catch(() => setCategories([]));
  }, []);

  // Lấy thương hiệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/thuong-hieu/getAll")
      .then((res) => {
        console.log("Thương hiệu:", res.data);
        setBrands(res.data);
      })
      .catch(() => setBrands([]));
  }, []);

  // Lấy chất liệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/chat-lieu/getAll")
      .then((res) => setMaterials(res.data))
      .catch(() => setMaterials([]));
  }, []);

  // Lấy xuất xứ
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/xuat-xu/getAll")
      .then((res) => setOrigins(res.data))
      .catch(() => setOrigins([]));
  }, []);

  // Lọc sản phẩm theo tìm kiếm và filter
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.tenSanPham
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory = category ? product.idDanhMuc === category : true;
    const matchBrand = brand ? product.idThuongHieu === brand : true;
    const matchMaterial = material ? product.idChatLieu === material : true;
    return matchSearch && matchCategory && matchBrand && matchMaterial;
  });

  const requiredFields = [
    { key: "tenSanPham", label: "Tên sản phẩm" },
    { key: "danhMuc", label: "Danh mục" },
    { key: "thuongHieu", label: "Thương hiệu" },
    { key: "chatLieu", label: "Chất liệu" },
    { key: "xuatXu", label: "Xuất xứ" },
    // Nếu khuyến mãi là bắt buộc thì thêm vào
  ];

  const findMissingFields = (product) => {
    return requiredFields
      .filter(
        (field) =>
          !product[field.key] ||
          (typeof product[field.key] === "object" &&
            Object.keys(product[field.key]).length === 0)
      )
      .map((field) => field.label);
  };

  // Lấy màu sắc
  useEffect(() => {
    fetch("http://localhost:8080/api/mau-sac/getAll")
      .then(res => res.json())
      .then(data => setMauSacs(data))
      .catch(() => setMauSacs([]));
  }, []);
  // Lấy kích thước
  useEffect(() => {
    fetch("http://localhost:8080/api/kich-thuoc/getAll")
      .then(res => res.json())
      .then(data => setKichThuocs(data))
      .catch(() => setKichThuocs([]));
  }, []);
  // Lấy danh sách sản phẩm chi tiết khi có lastAddedProductId
  useEffect(() => {
    if (lastAddedProductId) {
      fetch(`http://localhost:8080/api/san-pham-chi-tiet/${lastAddedProductId}`)
        .then(res => res.json())
        .then(data => setSpctList(Array.isArray(data) ? data : [data]))
        .catch(() => setSpctList([]));
    }
  }, [lastAddedProductId]);

  // Xử lý thêm sản phẩm
  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log("Giá trị form gửi lên:", addForm);
    const missing = findMissingFields(addForm);
    // if (missing.length > 0) {
    //   alert("Bạn còn thiếu: " + missing.join(", "));
    //   return;
    // }
    const data = {
      tenSanPham: addForm.tenSanPham,
      thuongHieu: {
        id: addForm.idThuongHieu,
      },
      xuatXu: {
        id: addForm.idXuatXu
      },
      khuyenMai: {
        id: addForm.idKhuyenMai
      },
      chatLieu: {
        id: addForm.idChatLieu
      },
      danhMuc: {
        id: addForm.idDanhMuc
      },
      imanges: Array.isArray(addForm.imanges) ? addForm.imanges.join(',') : addForm.imanges
    };
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/san-pham/add", {
        ...data,
        giaBan: Number(addForm.giaBan),
        giaGiamGia: addForm.giaGiamGia ? Number(addForm.giaGiamGia) : 0,
        trangThai: Number(addForm.trangThai),
      });
      setShowAddModal(false);
      setAddForm({
        tenSanPham: "",
        idDanhMuc: "",
        idThuongHieu: "",
        idChatLieu: "",
        idXuatXu: "",
        idKhuyenMai: "",
        giaBan: "",
        giaGiamGia: "",
        trangThai: 1,
        imanges: ""
      });
      fetchProducts();
      alert("Thêm sản phẩm thành công!");
      // Lưu lại id sản phẩm vừa thêm (giả sử BE trả về id trong res.data.id)
      setLastAddedProductId(res.data.id || null);
    } catch (err) {
      alert("Thêm sản phẩm thất bại!");
    }
    setLoading(false);
  };

  const handleAddSpct = async (e) => {
    e.preventDefault();
    // Lấy id sản phẩm gốc: ưu tiên lastAddedProductId nếu có, nếu không thì lấy từ spctProduct
    const productId = lastAddedProductId || (spctProduct && spctProduct.id);
    if (!productId) {
      alert("Không tìm thấy sản phẩm gốc!");
      return;
    }
    if (!spctForm.idMauSac || !spctForm.idKichThuoc || !spctForm.giaBan || !spctForm.soLuong) {
      alert("Vui lòng nhập đầy đủ thông tin biến thể!");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/san-pham-chi-tiet/them/${productId}`,
        {
          idKichThuoc: spctForm.idKichThuoc,
          idMauSac: spctForm.idMauSac,
          soLuong: Number(spctForm.soLuong),
          giaBan: Number(spctForm.giaBan),
        }
      );
      setSpctForm({ idMauSac: "", idKichThuoc: "", giaBan: "", soLuong: "" });
      // Reload lại danh sách biến thể
      fetch(`http://localhost:8080/api/san-pham-chi-tiet/${productId}`)
        .then(res => res.json())
        .then(data => setSpctList(Array.isArray(data) ? data : [data]))
        .catch(() => setSpctList([]));
      alert("Thêm biến thể thành công!");
    } catch (err) {
      alert("Thêm biến thể thất bại! " + (err.response?.data?.message || err.message));
    }
  };

  // Xử lý sửa sản phẩm
  const openEditModal = (product) => {
    console.log(product);
    setEditId(product.id);
    setEditForm({
      tenSanPham: product.tenSanPham || "",
      idDanhMuc: product.danhMuc?.id || "",
      idThuongHieu: product.thuongHieu?.id || "",
      idChatLieu: product.chatLieu?.id || "",
      idXuatXu: product.xuatXu?.id || "",
      idKhuyenMai: product.khuyenMai?.id || "",
      giaBan: product.giaBan || "",
      giaGiamGia: product.giaGiamGia || "",
      trangThai: product.trangThai,
    });
    setShowEditModal(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    console.log("Giá trị form gửi lên:", editForm);
    const missing = findMissingFields(editForm);
    const data = {
      tenSanPham: editForm.tenSanPham,
      thuongHieu: {
        id: editForm.idThuongHieu,
      },
      xuatXu: {
        id: editForm.idXuatXu
      },
      
      chatLieu: {
        id: editForm.idChatLieu
      },
      danhMuc: {
        id: editForm.idDanhMuc
      }
    };
    // if (missing.length > 0) {
    //   alert("Bạn còn thiếu: " + missing.join(", "));
    //   return;
    // }
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/san-pham/${editId}`, {
        ...data,
        giaBan: Number(editForm.giaBan),
        giaGiamGia: editForm.giaGiamGia ? Number(editForm.giaGiamGia) : 0,
        trangThai: Number(editForm.trangThai),
        imanges: editForm.imanges
      });
      setShowEditModal(false);
      setEditId(null);
      setEditForm({});
      fetchProducts();
      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.log("Lỗi cập nhật:", err.response?.data || err.message);
      alert("Cập nhật sản phẩm thất bại!");
    }
    setLoading(false);
  };

  const openChiTietModal = (product) => {
    setChiTietProduct(product);
    setShowChiTietModal(true);
    setLoadingChiTiet(true);
    axios
      .get(`http://localhost:8080/api/san-pham-chi-tiet/${product.id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setChiTietList(data);
      })
      .catch(() => setChiTietList([]))
      .finally(() => setLoadingChiTiet(false));
  };
  const closeChiTietModal = () => {
    setShowChiTietModal(false);
    setChiTietProduct(null);
    setChiTietList([]);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/san-pham/getAll")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA SẢN PHẨM:", data);
        setProducts(data);
      });
  }, []);

  const [khuyenMais, setKhuyenMais] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/khuyenmai")
      .then((res) => setKhuyenMais(res.data))
      .catch(() => setKhuyenMais([]));
  }, []);

  const [showSpctModal, setShowSpctModal] = useState(false);
  const [spctProduct, setSpctProduct] = useState(null); // Sản phẩm đang thêm biến thể

  const openSpctModal = (product) => {
    setSpctProduct(product);
    setShowSpctModal(true);
    setSpctForm({ idMauSac: "", idKichThuoc: "", giaBan: "", soLuong: "" });
    // Lấy danh sách biến thể
    fetch(`http://localhost:8080/api/san-pham-chi-tiet/${product.id}`)
      .then(res => res.json())
      .then(data => setSpctList(Array.isArray(data) ? data : [data]))
      .catch(() => setSpctList([]));
  };
  const closeSpctModal = () => {
    setShowSpctModal(false);
    setSpctProduct(null);
    setSpctList([]);
  };

  // Hàm upload nhiều ảnh
  const handleMultiImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    let uploaded = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      setUploadingImage(true);
      try {
        const res = await fetch('http://localhost:8080/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data && data.fileName) {
          uploaded.push(data.fileName);
        }
      } catch (err) {
        alert('Upload ảnh thất bại!');
      }
      setUploadingImage(false);
    }
    setAddForm(f => ({ ...f, imanges: uploaded }));
  };

  // Hàm upload ảnh cho form sửa
  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingEditImage(true);
    try {
      const res = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data && data.fileName) {
        setEditForm(f => ({ ...f, imanges: data.fileName }));
      } else {
        alert('Upload ảnh thất bại!');
      }
    } catch (err) {
      alert('Upload ảnh thất bại!');
    }
    setUploadingEditImage(false);
  };

  return (
    <div
      className="banhang-container"
      style={{ flexDirection: "column", gap: 24 }}
    >
      {/* Thanh công cụ */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Danh mục</option>
          {categories.map((dm) => (
            <option key={dm.id} value={dm.id}>
              {dm.tenDanhMuc}
            </option>
          ))}
        </select>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Thương hiệu</option>
          {brands.map((th) => (
            <option key={th.id} value={th.id}>
              {th.tenThuongHieu}
            </option>
          ))}
        </select>
        <select value={material} onChange={(e) => setMaterial(e.target.value)}>
          <option value="">Chất liệu</option>
          {materials.map((cl) => (
            <option key={cl.id} value={cl.id}>
              {cl.tenChatLieu}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "8px 16px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 15,
            marginLeft: 8,
          }}
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Modal thêm sản phẩm */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Thêm sản phẩm mới</h2>
            <form
              onSubmit={handleAddProduct}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <Input
                required
                placeholder="Tên sản phẩm"
                value={addForm.tenSanPham}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, tenSanPham: e.target.value }))
                }
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultiImageUpload}
                style={{ marginBottom: 8 }}
              />
              {Array.isArray(addForm.imanges) && addForm.imanges.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {addForm.imanges.map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:8080/images/${img}`}
                      alt={`Ảnh ${idx+1}`}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
                    />
                  ))}
                </div>
              )}
              {!addForm.idDanhMuc && (
                <span style={{ color: "red" }}>Chọn danh mục!</span>
              )}
              <select
                required
                value={addForm.idDanhMuc}
                onChange={(e) =>
                  setAddForm((f) => ({
                    ...f,
                    idDanhMuc: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((dm) => (
                  <option key={dm.id} value={dm.id}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
              </select>
              <select
                required
                value={addForm.idThuongHieu}
                onChange={(e) =>
                  setAddForm((f) => ({
                    ...f,
                    idThuongHieu: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.tenThuongHieu}
                  </option>
                ))}
              </select>
              <select
                required
                value={addForm.idChatLieu}
                onChange={(e) =>
                  setAddForm((f) => ({
                    ...f,
                    idChatLieu: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn chất liệu</option>
                {materials.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.tenChatLieu}
                  </option>
                ))}
              </select>
              <select
                required
                value={addForm.idXuatXu}
                onChange={(e) =>
                  setAddForm((f) => ({
                    ...f,
                    idXuatXu: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn xuất xứ</option>
                {origins.map((xx) => (
                  <option key={xx.id} value={xx.id}>
                    {xx.tenXuatXu}
                  </option>
                ))}
              </select>
              <select
                value={addForm.idKhuyenMai}
                onChange={(e) =>
                  setAddForm((f) => ({
                    ...f,
                    idKhuyenMai: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn khuyến mãi (không bắt buộc)</option>
                {khuyenMais &&
                  khuyenMais.map((km) => (
                    <option key={km.id} value={km.id}>
                      {km.tenKhuyenMai}
                    </option>
                  ))}
              </select>
              <select
                value={addForm.trangThai}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, trangThai: e.target.value }))
                }
              >
                <option value={1}>Đang bán</option>
                <option value={0}>Ngừng bán</option>
              </select>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal sửa sản phẩm */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sửa sản phẩm</h2>
            <form
              onSubmit={handleEditProduct}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <Input
                required
                placeholder="Tên sản phẩm"
                value={editForm.tenSanPham}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, tenSanPham: e.target.value }))
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageUpload}
                style={{ marginBottom: 8 }}
              />
              {uploadingEditImage && <span>Đang upload ảnh...</span>}
              {editForm.imanges && (
                <img
                  src={`http://localhost:8080/images/${editForm.imanges}`}
                  alt={editForm.tenSanPham}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                />
              )}
              {!editForm.idDanhMuc && (
                <span style={{ color: "red" }}>Chọn danh mục!</span>
              )}
              <select
                required
                value={editForm.idDanhMuc}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    idDanhMuc: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn danh mục</option>
                {categories.map((dm) => (
                  <option key={dm.id} value={dm.id}>
                    {dm.tenDanhMuc}
                  </option>
                ))}
              </select>
              <select
                required
                value={editForm.idThuongHieu}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    idThuongHieu: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.tenThuongHieu}
                  </option>
                ))}
              </select>
              <select
                required
                value={editForm.idChatLieu}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    idChatLieu: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn chất liệu</option>
                {materials.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.tenChatLieu}
                  </option>
                ))}
              </select>
              <select
                required
                value={editForm.idXuatXu}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    idXuatXu: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn xuất xứ</option>
                {origins.map((xx) => (
                  <option key={xx.id} value={xx.id}>
                    {xx.tenXuatXu}
                  </option>
                ))}
              </select>
              <select
                value={editForm.idKhuyenMai || ""}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    idKhuyenMai: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Chọn khuyến mãi (không bắt buộc)</option>
                {khuyenMais &&
                  khuyenMais.map((km) => (
                    <option key={km.id} value={km.id}>
                      {km.tenKhuyenMai}
                    </option>
                  ))}
              </select>
              <select
                value={editForm.trangThai}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, trangThai: e.target.value }))
                }
              >
                <option value={1}>Đang bán</option>
                <option value={0}>Ngừng bán</option>
              </select>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sau khi thêm sản phẩm thành công, nếu có lastAddedProductId thì hiển thị form thêm sản phẩm chi tiết */}
      {lastAddedProductId && (
        <div style={{ margin: "32px 0", padding: 16, background: "#f8f9fa", borderRadius: 8 }}>
          <h3>Thêm sản phẩm chi tiết cho sản phẩm vừa tạo</h3>
          <form onSubmit={handleAddSpct} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <select required value={spctForm.idMauSac} onChange={e => setSpctForm(f => ({ ...f, idMauSac: e.target.value }))}>
              <option value="">Chọn màu sắc</option>
              {mauSacs.map(ms => <option key={ms.id} value={ms.id}>{ms.tenMauSac}</option>)}
            </select>
            <select required value={spctForm.idKichThuoc} onChange={e => setSpctForm(f => ({ ...f, idKichThuoc: e.target.value }))}>
              <option value="">Chọn kích thước</option>
              {kichThuocs.map(kt => <option key={kt.id} value={kt.id}>{kt.tenKichThuoc}</option>)}
            </select>
            <input type="number" required placeholder="Giá bán" value={spctForm.giaBan} onChange={e => setSpctForm(f => ({ ...f, giaBan: e.target.value }))} />
            <input type="number" required placeholder="Số lượng" value={spctForm.soLuong} onChange={e => setSpctForm(f => ({ ...f, soLuong: e.target.value }))} />
            <button type="submit" style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, fontSize: 15 }}>Thêm biến thể</button>
          </form>
          <h4 style={{ marginTop: 24 }}>Danh sách sản phẩm chi tiết đã thêm</h4>
          <table className="cart-table" style={{ minWidth: 600, background: "#fff" }}>
            <thead>
              <tr>
                <th>Màu sắc</th>
                <th>Kích thước</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {spctList.length === 0 ? (
                <tr><td colSpan={5}>Chưa có biến thể nào</td></tr>
              ) : (
                spctList.map(ct => (
                  <tr key={ct.id}>
                    <td>{ct.mauSac?.tenMauSac || '-'}</td>
                    <td>{ct.kichThuoc?.tenKichThuoc || '-'}</td>
                    <td>{ct.giaBan?.toLocaleString() || '-'}</td>
                    <td>{ct.soLuong ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Bảng danh sách sản phẩm */}
      <div style={{ overflowX: "auto" }}>
        <table
          className="cart-table"
          style={{ minWidth: 1000, background: "#fff" }}
        >
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Chất liệu</th>
              <th>Xuất xứ</th>
              <th>Khuyến mãi</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <React.Fragment key={product.id}>
                <tr>
                  <td style={{ width: 80, height: 80, textAlign: 'center', verticalAlign: 'middle' }}>
                    <img
                      src={product.imanges ? `http://localhost:8080/images/${(Array.isArray(product.imanges) ? product.imanges[0] : product.imanges.split(',')[0])}` : "https://via.placeholder.com/50"}
                      alt={product.tenSanPham}
                      style={{
                        width: 100,
                        height: 80,
                        borderRadius: 6,
                        objectFit: "cover",
                        display: "block",
                        margin: "auto",
                        background: "#f6f8fa"
                      }}
                      onError={e => {
                        if (!e.target.src.includes("placeholder.com")) {
                          e.target.src = "https://via.placeholder.com/50";
                        }
                      }}
                    />
                  </td>
                  <td>{product.tenSanPham}</td>
                  <td>{product.danhMuc?.tenDanhMuc || "-"}</td>
                  <td>{product.thuongHieu?.tenThuongHieu || "-"}</td>
                  <td>{product.chatLieu?.tenChatLieu || "-"}</td>
                  <td>{product.xuatXu?.tenXuatXu || "-"}</td>
                  <td>{product.khuyenMai?.tenKhuyenMai || "-"}</td>
                  <td>{product.trangThai === 1 ? "Đang bán" : "Ngừng bán"}</td>
                  <td>
                    <button
                      onClick={() => openEditModal(product)}
                      style={{
                        background: "#43a047",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        marginRight: 4,
                        cursor: "pointer",
                        opacity: 0.7,
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      style={{
                        background: "#e53935",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        marginRight: 4,
                        cursor: "pointer",
                        opacity: 0.7,
                      }}
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => openChiTietModal(product)}
                      style={{
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer",
                        opacity: 0.7,
                      }}
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => openSpctModal(product)}
                      style={{
                        background: "#ff9800",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        cursor: "pointer",
                        opacity: 0.7,
                      }}
                    >
                      Thêm biến thể
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm biến thể sản phẩm */}
      {showSpctModal && spctProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thêm biến thể cho: {spctProduct.tenSanPham}</h3>
            <form onSubmit={handleAddSpct} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <select required value={spctForm.idMauSac} onChange={e => setSpctForm(f => ({ ...f, idMauSac: e.target.value }))}>
                <option value="">Chọn màu sắc</option>
                {mauSacs.map(ms => <option key={ms.id} value={ms.id}>{ms.tenMauSac}</option>)}
              </select>
              <select required value={spctForm.idKichThuoc} onChange={e => setSpctForm(f => ({ ...f, idKichThuoc: e.target.value }))}>
                <option value="">Chọn kích thước</option>
                {kichThuocs.map(kt => <option key={kt.id} value={kt.id}>{kt.tenKichThuoc}</option>)}
              </select>
              <input type="number" required placeholder="Giá bán" value={spctForm.giaBan} onChange={e => setSpctForm(f => ({ ...f, giaBan: e.target.value }))} />
              <input type="number" required placeholder="Số lượng" value={spctForm.soLuong} onChange={e => setSpctForm(f => ({ ...f, soLuong: e.target.value }))} />
              <button type="submit" style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, fontSize: 15 }}>Thêm biến thể</button>
              <button type="button" onClick={closeSpctModal} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, fontSize: 15 }}>Đóng</button>
            </form>
            <h4 style={{ marginTop: 24 }}>Danh sách biến thể đã thêm</h4>
            <table className="cart-table" style={{ minWidth: 600, background: "#fff" }}>
              <thead>
                <tr>
                  <th>Màu sắc</th>
                  <th>Kích thước</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {spctList.length === 0 ? (
                  <tr><td colSpan={5}>Chưa có biến thể nào</td></tr>
                ) : (
                  spctList.map(ct => (
                    <tr key={ct.id}>
                      <td>{ct.mauSac?.tenMauSac || '-'}</td>
                      <td>{ct.kichThuoc?.tenKichThuoc || '-'}</td>
                      <td>{ct.giaBan?.toLocaleString() || '-'}</td>
                      <td>{ct.soLuong ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal chi tiết sản phẩm */}
      {showChiTietModal && chiTietProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Danh sách sản phẩm chi tiết của: {chiTietProduct.tenSanPham}</h3>
            {loadingChiTiet ? (
              <div>Đang tải...</div>
            ) : (
              <table className="cart-table" style={{ minWidth: 600, background: "#fff" }}>
                <thead>
                  <tr>
                    <th>Màu sắc</th>
                    <th>Kích thước</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {chiTietList.length === 0 ? (
                    <tr>
                      <td colSpan={5}>Chưa có biến thể nào</td>
                    </tr>
                  ) : (
                    chiTietList.map((ct) => (
                      <tr key={ct.id}>
                        <td>{ct.mauSac?.tenMauSac || "-"}</td>
                        <td>{ct.kichThuoc?.tenKichThuoc || "-"}</td>
                        <td>{ct.giaBan?.toLocaleString() || "-"}</td>
                        <td>{ct.soLuong ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
            <button type="button" onClick={closeChiTietModal} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, fontSize: 15, marginTop: 16 }}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanPhamPage;
