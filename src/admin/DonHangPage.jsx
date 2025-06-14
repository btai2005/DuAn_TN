import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Popconfirm } from 'antd';
import { ShoppingCartOutlined, UserOutlined, TagOutlined, HomeOutlined, EuroOutlined, NotificationOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function DonHangPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu giả định cho các dropdown (khóa ngoại)
  const [nhanVienData, setNhanVienData] = useState([
    { id: 'NV001', name: 'Nguyễn Văn A' },
    { id: 'NV002', name: 'Trần Thị B' },
  ]);
  const [khachHangData, setKhachHangData] = useState([
    { id: 'KH001', name: 'Nguyễn Văn C' },
    { id: 'KH002', name: 'Lê Thị D' },
  ]);
  const [voucherData, setVoucherData] = useState([
    { id: 'VC001', name: 'Giảm 10K' },
    { id: 'VC002', name: 'Miễn phí vận chuyển' },
  ]);

  // Dữ liệu giả định cho đơn hàng
  const [data, setData] = useState([
    {
      ID: '1',
      MaDonHang: 'DH001',
      ID_NhanVien: 'NV001',
      ID_KhachHang: 'KH001',
      ID_Voucher: 'VC001',
      LoaiDonHang: 'Online',
      NgayTao: '2023-10-27',
      TrangThai: 'Đang xử lý',
      TongTien: 500000,
      TongTienGiamGia: 50000,
      NgayMua: '2023-10-27',
      DiaChiGiaoHang: '123 Đường ABC, Quận 1',
      SoDienThoaiGiaoHang: '0900111222',
      EmailGiaoHang: 'customer1@example.com',
      TenNguoiNhan: 'Nguyễn Văn C',
    },
    {
      ID: '2',
      MaDonHang: 'DH002',
      ID_NhanVien: 'NV002',
      ID_KhachHang: 'KH002',
      ID_Voucher: null,
      LoaiDonHang: 'Tại cửa hàng',
      NgayTao: '2023-10-26',
      TrangThai: 'Đã hoàn thành',
      TongTien: 300000,
      TongTienGiamGia: 0,
      NgayMua: '2023-10-26',
      DiaChiGiaoHang: '456 Đường XYZ, Quận 3',
      SoDienThoaiGiaoHang: '0900333444',
      EmailGiaoHang: 'customer2@example.com',
      TenNguoiNhan: 'Lê Thị D',
    },
  ]);

  const columns = [
    { title: 'Mã ĐH', dataIndex: 'MaDonHang', key: 'MaDonHang' },
    {
      title: 'Nhân Viên',
      key: 'ID_NhanVien',
      render: (_, record) => (
        nhanVienData.find(nv => nv.id === record.ID_NhanVien)?.name || 'N/A'
      ),
    },
    {
      title: 'Khách Hàng',
      key: 'ID_KhachHang',
      render: (_, record) => (
        khachHangData.find(kh => kh.id === record.ID_KhachHang)?.name || 'N/A'
      ),
    },
    {
      title: 'Voucher',
      key: 'ID_Voucher',
      render: (_, record) => (
        record.ID_Voucher ? (voucherData.find(vc => vc.id === record.ID_Voucher)?.name || 'N/A') : 'Không có'
      ),
    },
    { title: 'Loại Đơn Hàng', dataIndex: 'LoaiDonHang', key: 'LoaiDonHang' },
    { title: 'Ngày Tạo', dataIndex: 'NgayTao', key: 'NgayTao' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    { title: 'Tổng Tiền', dataIndex: 'TongTien', key: 'TongTien' },
    { title: 'Giảm Giá', dataIndex: 'TongTienGiamGia', key: 'TongTienGiamGia' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => message.info(`Bạn đã click Xóa đơn hàng ${record.MaDonHang}`)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="danger">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    showModal();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      NgayTao: item.NgayTao ? moment(item.NgayTao) : null,
      NgayMua: item.NgayMua ? moment(item.NgayMua) : null,
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      message.success('Cập nhật đơn hàng thành công (chỉ giao diện)!');
    } else {
      message.success('Thêm đơn hàng thành công (chỉ giao diện)!');
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Đơn Hàng</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Đơn Hàng Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ LoaiDonHang: 'Online', TrangThai: 'Đang xử lý' }}
        >
          <Form.Item
            name="MaDonHang"
            label="Mã Đơn Hàng"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Đơn Hàng!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Đơn Hàng" />
          </Form.Item>
          <Form.Item
            name="ID_NhanVien"
            label="Nhân Viên Lập Đơn"
            rules={[{ required: true, message: 'Vui lòng chọn Nhân Viên!' }]}
          >
            <Select placeholder="Chọn Nhân Viên">
              {nhanVienData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ID_KhachHang"
            label="Khách Hàng"
            rules={[{ required: true, message: 'Vui lòng chọn Khách Hàng!' }]}
          >
            <Select placeholder="Chọn Khách Hàng">
              {khachHangData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ID_Voucher"
            label="Voucher"
          >
            <Select allowClear placeholder="Chọn Voucher (Không bắt buộc)">
              {voucherData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="LoaiDonHang"
            label="Loại Đơn Hàng"
            rules={[{ required: true, message: 'Vui lòng chọn Loại Đơn Hàng!' }]}
          >
            <Select placeholder="Chọn Loại Đơn Hàng">
              <Option value="Online">Online</Option>
              <Option value="Tại cửa hàng">Tại cửa hàng</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="NgayTao"
            label="Ngày Tạo"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Tạo!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Đang giao">Đang giao</Option>
              <Option value="Đã hoàn thành">Đã hoàn thành</Option>
              <Option value="Đã hủy">Đã hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="TongTien"
            label="Tổng Tiền"
            rules={[{ required: true, message: 'Vui lòng nhập Tổng Tiền!' }]}
          >
            <Input type="number" prefix={<EuroOutlined />} placeholder="Tổng Tiền" />
          </Form.Item>
          <Form.Item
            name="TongTienGiamGia"
            label="Tổng Tiền Giảm Giá"
          >
            <Input type="number" prefix={<EuroOutlined />} placeholder="Tổng Tiền Giảm Giá" />
          </Form.Item>
          <Form.Item
            name="NgayMua"
            label="Ngày Mua Hàng"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Mua Hàng!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="DiaChiGiaoHang"
            label="Địa Chỉ Giao Hàng"
            rules={[{ required: true, message: 'Vui lòng nhập Địa Chỉ Giao Hàng!' }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Địa Chỉ Giao Hàng" />
          </Form.Item>
          <Form.Item
            name="SoDienThoaiGiaoHang"
            label="Số Điện Thoại Giao Hàng"
            rules={[{ required: true, message: 'Vui lòng nhập Số Điện Thoại Giao Hàng!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số Điện Thoại Giao Hàng" />
          </Form.Item>
          <Form.Item
            name="EmailGiaoHang"
            label="Email Giao Hàng"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email Giao Hàng" />
          </Form.Item>
          <Form.Item
            name="TenNguoiNhan"
            label="Tên Người Nhận"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Người Nhận!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên Người Nhận" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingItem ? "Cập Nhật" : "Thêm Mới"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 