import React, { useState, useEffect } from 'react';
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
  const [khachHangs, setKhachHangs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/khachhang')
      .then(response => response.json())
      .then(data => setKhachHangs(data))
      .catch(error => console.error('Lỗi khi gọi API kích thước:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên KH', dataIndex: 'tenKhachHang', key: 'tenKhachHang' },
    { title: 'email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai' },
    { title: 'Ngày Sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    {
      title: 'Giới Tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      render: value => value ? 'Nam' : 'Nữ'
    },
    { title: 'Địa Chỉ', dataIndex: 'diaChi', key: 'diaChi' },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: value => value ? 'Đang hoạt động' : 'Tạm ngưng'
    },
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
      ngaySinh: customer.ngaySinh ? moment(customer.ngaySinh) : null,
      gioiTinh: customer.gioiTinh === true || customer.gioiTinh === 1 ? 'Nam' : 'Nữ',
      trangThai: customer.trangThai ? 1 : 0,
    });
    showModal();
  };

  const onFinish = (values) => {
    // Map giá trị đúng với backend
    const dataSend = {
      ...values,
      tenKhachHang: values.tenKhachHang,
      email: values.email,
      soDienThoai: values.soDienThoai,
      ngaySinh: values.ngaySinh ? values.ngaySinh.toISOString() : null,
      gioiTinh: values.gioiTinh === 'Nam' ? true : false,
      diaChi: values.diaChi,
      trangThai: values.trangThai === 1 ? true : false,
      maThongBao: null,
      thoiGianThongBao: null,
    };
    console.log('Dữ liệu gửi lên:', dataSend);
    if (editingCustomer) {
      // Sửa
      fetch(`http://localhost:8080/api/khachhang/update/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dataSend, id: editingCustomer.id }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Cập nhật thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Cập nhật khách hàng thành công!', duration: 2 });
          fetch('http://localhost:8080/api/khachhang')
            .then(res => res.json())
            .then(data => setKhachHangs(data));
        })
        .catch(error => {
          message.error('Cập nhật thất bại!');
          console.error(error);
        });
    } else {
      // Thêm mới
      fetch('http://localhost:8080/api/khachhang/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend),
      })
        .then(response => {
          if (!response.ok) throw new Error('Thêm mới thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Thêm khách hàng thành công!', duration: 2 });
          fetch('http://localhost:8080/api/khachhang')
            .then(res => res.json())
            .then(data => setKhachHangs(data));
        })
        .catch(error => {
          message.error('Thêm mới thất bại!');
          console.error(error);
        });
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Khách Hàng</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Khách Hàng Mới</Button>
      </div>
      <Table dataSource={khachHangs} columns={columns} rowKey="id" pagination={false} />

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
          initialValues={{ gioiTinh: 'Nam', trangThai: 1 }}
        >
          {editingCustomer && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="tenKhachHang"
            label="Tên Khách Hàng"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Khách Hàng!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên Khách Hàng" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập Email hợp lệ!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="soDienThoai"
            label="Số Điện Thoại"
            rules={[{ required: true, message: 'Vui lòng nhập Số Điện Thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số Điện Thoại" />
          </Form.Item>
          <Form.Item
            name="ngaySinh"
            label="Ngày Sinh"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Sinh!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" prefix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item
            name="gioiTinh"
            label="Giới Tính"
            rules={[{ required: true, message: 'Vui lòng chọn Giới Tính!' }]}
          >
            <Select prefix={<QuestionCircleOutlined />} placeholder="Chọn Giới Tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="diaChi"
            label="Địa Chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập Địa Chỉ!' }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Địa Chỉ" />
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value={1}>Đang hoạt động</Option>
              <Option value={0}>Tạm ngưng</Option>
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