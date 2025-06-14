import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { ShoppingOutlined, TagOutlined, DollarOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function GioHangChiTietPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu giả định cho các dropdown (khóa ngoại)
  const [gioHangData, setGioHangData] = useState([
    { id: 'GH001', name: 'Giỏ hàng KH001' },
    { id: 'GH002', name: 'Giỏ hàng KH002' },
  ]);
  const [sanPhamChiTietData, setSanPhamChiTietData] = useState([
    { id: 'CT001', name: 'SP chi tiết CT001 (Áo thun Nike - S - Đỏ)' },
    { id: 'CT002', name: 'SP chi tiết CT002 (Áo thun Nike - M - Xanh)' },
  ]);

  // Dữ liệu giả định cho chi tiết giỏ hàng
  const [data, setData] = useState([
    {
      ID: '1',
      MaGioHangChiTiet: 'GHCT001',
      ID_GioHang: 'GH001',
      ID_BanPhamChiTiet: 'CT001',
      SoLuong: 1,
      Gia: 200000,
    },
    {
      ID: '2',
      MaGioHangChiTiet: 'GHCT002',
      ID_GioHang: 'GH001',
      ID_BanPhamChiTiet: 'CT002',
      SoLuong: 1,
      Gia: 200000,
    },
    {
      ID: '3',
      MaGioHangChiTiet: 'GHCT003',
      ID_GioHang: 'GH002',
      ID_BanPhamChiTiet: 'CT001',
      SoLuong: 3,
      Gia: 180000,
    },
  ]);

  const columns = [
    { title: 'Mã GH Chi Tiết', dataIndex: 'MaGioHangChiTiet', key: 'MaGioHangChiTiet' },
    {
      title: 'Giỏ Hàng',
      key: 'ID_GioHang',
      render: (_, record) => (
        gioHangData.find(gh => gh.id === record.ID_GioHang)?.name || 'N/A'
      ),
    },
    {
      title: 'Sản Phẩm Chi Tiết',
      key: 'ID_BanPhamChiTiet',
      render: (_, record) => (
        sanPhamChiTietData.find(spct => spct.id === record.ID_BanPhamChiTiet)?.name || 'N/A'
      ),
    },
    { title: 'Số Lượng', dataIndex: 'SoLuong', key: 'SoLuong' },
    { title: 'Giá', dataIndex: 'Gia', key: 'Gia' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => message.info(`Bạn đã click Xóa chi tiết giỏ hàng ${record.MaGioHangChiTiet}`)}
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
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      message.success('Cập nhật thành công (chỉ giao diện)!');
    } else {
      message.success('Thêm mới thành công (chỉ giao diện)!');
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Chi Tiết Giỏ Hàng</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Chi Tiết Giỏ Hàng Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Chi Tiết Giỏ Hàng" : "Thêm Chi Tiết Giỏ Hàng"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="MaGioHangChiTiet"
            label="Mã Chi Tiết Giỏ Hàng"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Chi Tiết Giỏ Hàng!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Chi Tiết Giỏ Hàng" />
          </Form.Item>
          <Form.Item
            name="ID_GioHang"
            label="Giỏ Hàng"
            rules={[{ required: true, message: 'Vui lòng chọn Giỏ Hàng!' }]}
          >
            <Select placeholder="Chọn Giỏ Hàng">
              {gioHangData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ID_BanPhamChiTiet"
            label="Sản Phẩm Chi Tiết"
            rules={[{ required: true, message: 'Vui lòng chọn Sản Phẩm Chi Tiết!' }]}
          >
            <Select placeholder="Chọn Sản Phẩm Chi Tiết">
              {sanPhamChiTietData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="SoLuong"
            label="Số Lượng"
            rules={[{ required: true, message: 'Vui lòng nhập Số Lượng!' }]}
          >
            <Input type="number" prefix={<ShoppingOutlined />} placeholder="Số Lượng" />
          </Form.Item>
          <Form.Item
            name="Gia"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập Giá!' }]}
          >
            <Input type="number" prefix={<DollarOutlined />} placeholder="Giá" />
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