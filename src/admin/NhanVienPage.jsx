import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Popconfirm } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined, KeyOutlined, CalendarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../styles/AdminPanel.css'; // Import the CSS file

const { Option } = Select;

export default function NhanVienPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  const [nhanViens, setNhanViens] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/nhanvien')
      .then(response => response.json())
      .then(data => setNhanViens(data))
      .catch(error => console.error('Lỗi khi gọi API kích thước:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên NV', dataIndex: 'tenNhanVien', key: 'tenNhanVien' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
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
      title: 'Vai Trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      render: value => value ? 'Quản lý' : 'Nhân viên'
    },
    { title: 'CCCD', dataIndex: 'cccd', key: 'cccd', render: value => value || '' },
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
      ngaySinh: employee.ngaySinh ? moment(employee.ngaySinh) : null,
      gioiTinh: employee.gioiTinh === true || employee.gioiTinh === 1 ? 'Nam' : 'Nữ',
      vaiTro: employee.vaiTro ? 'Quản lý' : 'Nhân viên',
      trangThai: employee.trangThai ? 1 : 0,
      cccd: employee.cccd || '',
    });
    showModal();
  };

  const onFinish = (values) => {
    // Map giá trị đúng với backend
    const dataSend = {
      ...values,
      tenNhanVien: values.tenNhanVien,
      email: values.email,
      soDienThoai: values.soDienThoai,
      ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
      gioiTinh: values.gioiTinh === 'Nam' ? 1 : 0,
      diaChi: values.diaChi,
      vaiTro: values.vaiTro === 'Quản lý' ? true : false,
      cccd: values.cccd,
      trangThai: Number(values.trangThai),
      matKhau: values.matKhau,
    };
    if (editingEmployee) {
      // Sửa
      fetch(`http://localhost:8080/api/nhanvien/update/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dataSend, id: editingEmployee.id }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Cập nhật thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Cập nhật nhân viên thành công!', duration: 2 });
          fetch('http://localhost:8080/api/nhanvien')
            .then(res => res.json())
            .then(data => setNhanViens(data));
        })
        .catch(error => {
          message.error('Cập nhật thất bại!');
          console.error(error);
        });
    } else {
      // Thêm mới
      fetch('http://localhost:8080/api/nhanvien/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend),
      })
        .then(response => {
          if (!response.ok) throw new Error('Thêm mới thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Thêm nhân viên thành công!', duration: 2 });
          fetch('http://localhost:8080/api/nhanvien')
            .then(res => res.json())
            .then(data => setNhanViens(data));
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
        <h1 className="page-title">Quản lý Nhân Viên</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Nhân Viên Mới</Button>
      </div>
      <Table dataSource={nhanViens} columns={columns} rowKey="id" pagination={false} />

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
          initialValues={{ gioiTinh: 'Nam', vaiTro: 'Nhân viên', trangThai: 1 }}
        >
          {editingEmployee && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="tenNhanVien"
            label="Tên Nhân Viên"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Nhân Viên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên Nhân Viên" />
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
            name="vaiTro"
            label="Vai Trò"
            rules={[{ required: true, message: 'Vui lòng chọn Vai Trò!' }]}
          >
            <Select prefix={<UserOutlined />} placeholder="Chọn Vai Trò">
              <Option value="Quản lý">Quản lý</Option>
              <Option value="Nhân viên">Nhân viên</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cccd"
            label="CCCD"
          >
            <Input prefix={<IdcardOutlined />} placeholder="CCCD" />
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
          {!editingEmployee && (
            <Form.Item
              name="matKhau"
              label="Mật Khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập Mật Khẩu!' }]}
            >
              <Input.Password prefix={<KeyOutlined />} placeholder="Mật Khẩu" />
            </Form.Item>
          )}
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