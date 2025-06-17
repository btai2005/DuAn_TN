import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Popconfirm } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, KeyOutlined, CalendarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../styles/AdminPanel.css'; // Import the CSS file

const { Option } = Select;

export default function KhachHangPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu giả định cho khách hàng
  const [customers] = useState([
    {
      ID: '1',
      MaKhachHang: 'KH001',
      TenKhachHang: 'Nguyễn Văn C',
      Email: 'vanc@example.com',
      NgaySinh: '1995-03-10',
      GioiTinh: 'Nam',
      DiaChi: '789 Đường XYZ, Quận 5',
      SoDienThoai: '0901234567',
      MatKhau: '****',
      TrangThai: 'Đang hoạt động',
      NgayTao: '2023-10-25',
      NguoiTao: 'Admin',
      NgaySua: '2023-10-25',
      NguoiSua: 'Admin',
    },
    {
      ID: '2',
      MaKhachHang: 'KH002',
      TenKhachHang: 'Lê Thị D',
      Email: 'thid@example.com',
      NgaySinh: '1988-07-22',
      GioiTinh: 'Nữ',
      DiaChi: '101 Đường PQR, Quận 10',
      SoDienThoai: '0908765432',
      MatKhau: '****',
      TrangThai: 'Tạm ngưng',
      NgayTao: '2023-10-26',
      NguoiTao: 'Admin',
      NgaySua: '2023-10-26',
      NguoiSua: 'Admin',
    },
  ]);

  const columns = [
    { title: 'Mã KH', dataIndex: 'MaKhachHang', key: 'MaKhachHang' },
    { title: 'Tên KH', dataIndex: 'TenKhachHang', key: 'TenKhachHang' },
    { title: 'Email', dataIndex: 'Email', key: 'Email' },
    { title: 'SĐT', dataIndex: 'SoDienThoai', key: 'SoDienThoai' },
    { title: 'Ngày Sinh', dataIndex: 'NgaySinh', key: 'NgaySinh' },
    { title: 'Giới Tính', dataIndex: 'GioiTinh', key: 'GioiTinh' },
    { title: 'Địa Chỉ', dataIndex: 'DiaChi', key: 'DiaChi' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    { title: 'Ngày Tạo', dataIndex: 'NgayTao', key: 'NgayTao' },
    { title: 'Người Tạo', dataIndex: 'NguoiTao', key: 'NguoiTao' },
    { title: 'Ngày Sửa', dataIndex: 'NgaySua', key: 'NgaySua' },
    { title: 'Người Sửa', dataIndex: 'NguoiSua', key: 'NguoiSua' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khách hàng này?"
            onConfirm={() => message.info(`Bạn đã click Xóa khách hàng ${record.MaKhachHang}`)}
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
    setEditingCustomer(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    showModal();
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      NgaySinh: customer.NgaySinh ? moment(customer.NgaySinh) : null,
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingCustomer) {
      message.success('Cập nhật khách hàng thành công (chỉ giao diện)!');
    } else {
      message.success('Thêm khách hàng thành công (chỉ giao diện)!');
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Khách Hàng</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Khách Hàng Mới</Button>
      </div>
      <Table dataSource={customers} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingCustomer ? "Sửa Khách Hàng" : "Thêm Khách Hàng"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Ẩn footer mặc định của Modal
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ GioiTinh: 'Nam', TrangThai: 'Đang hoạt động' }}
        >
          <Form.Item
            name="MaKhachHang"
            label="Mã Khách Hàng"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Khách Hàng!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Mã Khách Hàng" />
          </Form.Item>
          <Form.Item
            name="TenKhachHang"
            label="Tên Khách Hàng"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Khách Hàng!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên Khách Hàng" />
          </Form.Item>
          <Form.Item
            name="Email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="SoDienThoai"
            label="Số Điện Thoại"
            rules={[{ required: true, message: 'Vui lòng nhập Số Điện Thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số Điện Thoại" />
          </Form.Item>
          <Form.Item
            name="NgaySinh"
            label="Ngày Sinh"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Sinh!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" prefix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item
            name="GioiTinh"
            label="Giới Tính"
            rules={[{ required: true, message: 'Vui lòng chọn Giới Tính!' }]}
          >
            <Select prefix={<QuestionCircleOutlined />} placeholder="Chọn Giới Tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="DiaChi"
            label="Địa Chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập Địa Chỉ!' }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Địa Chỉ" />
          </Form.Item>
          <Form.Item
            name="MatKhau"
            label="Mật Khẩu"
            rules={[{ required: !editingCustomer, message: 'Vui lòng nhập Mật Khẩu!' }]} // Yêu cầu khi thêm mới, không yêu cầu khi sửa
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Mật Khẩu" />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value="Đang hoạt động">Đang hoạt động</Option>
              <Option value="Tạm ngưng">Tạm ngưng</Option>
              <Option value="Khóa">Khóa</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCustomer ? "Cập Nhật" : "Thêm Mới"}
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