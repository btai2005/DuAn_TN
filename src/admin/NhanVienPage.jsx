import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Popconfirm } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined, KeyOutlined, CalendarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../styles/AdminPanel.css'; // Import the CSS file

const { Option } = Select;

export default function NhanVienPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu giả định cho nhân viên
  const [employees, setEmployees] = useState([
    {
      ID: '1',
      MaNhanVien: 'NV001',
      TenNhanVien: 'Nguyễn Văn A',
      Email: 'vana@example.com',
      SoDienThoai: '0987654321',
      NgaySinh: '1990-01-15',
      GioiTinh: 'Nam',
      DiaChi: '123 Đường ABC, Quận 1',
      VaiTro: 'Quản lý',
      MatKhau: '****',
      CCCD: '123456789012',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '2',
      MaNhanVien: 'NV002',
      TenNhanVien: 'Trần Thị B',
      Email: 'thib@example.com',
      SoDienThoai: '0912345678',
      NgaySinh: '1992-05-20',
      GioiTinh: 'Nữ',
      DiaChi: '456 Đường XYZ, Quận 3',
      VaiTro: 'Nhân viên',
      MatKhau: '****',
      CCCD: '234567890123',
      TrangThai: 'Đang hoạt động',
    },
  ]);

  const columns = [
    { title: 'Mã NV', dataIndex: 'MaNhanVien', key: 'MaNhanVien' },
    { title: 'Tên NV', dataIndex: 'TenNhanVien', key: 'TenNhanVien' },
    { title: 'Email', dataIndex: 'Email', key: 'Email' },
    { title: 'SĐT', dataIndex: 'SoDienThoai', key: 'SoDienThoai' },
    { title: 'Ngày Sinh', dataIndex: 'NgaySinh', key: 'NgaySinh' },
    { title: 'Giới Tính', dataIndex: 'GioiTinh', key: 'GioiTinh' },
    { title: 'Địa Chỉ', dataIndex: 'DiaChi', key: 'DiaChi' },
    { title: 'Vai Trò', dataIndex: 'VaiTro', key: 'VaiTro' },
    { title: 'CCCD', dataIndex: 'CCCD', key: 'CCCD' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => message.info(`Bạn đã click Xóa nhân viên ${record.MaNhanVien}`)}
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
    setEditingEmployee(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    showModal();
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      ...employee,
      NgaySinh: employee.NgaySinh ? moment(employee.NgaySinh) : null,
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingEmployee) {
      message.success('Cập nhật nhân viên thành công (chỉ giao diện)!');
    } else {
      message.success('Thêm nhân viên thành công (chỉ giao diện)!');
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Nhân Viên</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Nhân Viên Mới</Button>
      </div>
      <Table dataSource={employees} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingEmployee ? "Sửa Nhân Viên" : "Thêm Nhân Viên"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Ẩn footer mặc định của Modal
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ GioiTinh: 'Nam', VaiTro: 'Nhân viên', TrangThai: 'Đang hoạt động' }}
        >
          <Form.Item
            name="MaNhanVien"
            label="Mã Nhân Viên"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Nhân Viên!' }]
          }>
            <Input prefix={<UserOutlined />} placeholder="Mã Nhân Viên" />
          </Form.Item>
          <Form.Item
            name="TenNhanVien"
            label="Tên Nhân Viên"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Nhân Viên!' }]
          }>
            <Input prefix={<UserOutlined />} placeholder="Tên Nhân Viên" />
          </Form.Item>
          <Form.Item
            name="Email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ!' }]
          }>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="SoDienThoai"
            label="Số Điện Thoại"
            rules={[{ required: true, message: 'Vui lòng nhập Số Điện Thoại!' }]
          }>
            <Input prefix={<PhoneOutlined />} placeholder="Số Điện Thoại" />
          </Form.Item>
          <Form.Item
            name="NgaySinh"
            label="Ngày Sinh"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Sinh!' }]
          }>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" prefix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item
            name="GioiTinh"
            label="Giới Tính"
            rules={[{ required: true, message: 'Vui lòng chọn Giới Tính!' }]
          }>
            <Select prefix={<QuestionCircleOutlined />} placeholder="Chọn Giới Tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="DiaChi"
            label="Địa Chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập Địa Chỉ!' }]
          }>
            <Input prefix={<HomeOutlined />} placeholder="Địa Chỉ" />
          </Form.Item>
          <Form.Item
            name="VaiTro"
            label="Vai Trò"
            rules={[{ required: true, message: 'Vui lòng chọn Vai Trò!' }]
          }>
            <Select prefix={<UserOutlined />} placeholder="Chọn Vai Trò">
              <Option value="Quản lý">Quản lý</Option>
              <Option value="Nhân viên">Nhân viên</Option>
              <Option value="Kế toán">Kế toán</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="MatKhau"
            label="Mật Khẩu"
            rules={[{ required: !editingEmployee, message: 'Vui lòng nhập Mật Khẩu!' }]} // Yêu cầu khi thêm mới, không yêu cầu khi sửa
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Mật Khẩu" />
          </Form.Item>
          <Form.Item
            name="CCCD"
            label="CCCD"
            rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]
          }>
            <Input prefix={<IdcardOutlined />} placeholder="CCCD" />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]
          }>
            <Select placeholder="Chọn Trạng Thái">
              <Option value="Đang hoạt động">Đang hoạt động</Option>
              <Option value="Tạm ngưng">Tạm ngưng</Option>
              <Option value="Đã nghỉ việc">Đã nghỉ việc</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingEmployee ? "Cập Nhật" : "Thêm Mới"}
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