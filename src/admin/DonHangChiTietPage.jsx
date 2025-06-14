import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { ShoppingCartOutlined, TagOutlined, EuroOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function DonHangChiTietPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu giả định cho các dropdown (khóa ngoại)
  const [donHangData, setDonHangData] = useState([
    { id: 'DH001', name: 'Đơn hàng DH001' },
    { id: 'DH002', name: 'Đơn hàng DH002' },
  ]);
  const [sanPhamChiTietData, setSanPhamChiTietData] = useState([
    { id: 'CT001', name: 'SP chi tiết CT001 (Áo thun Nike - S - Đỏ)' },
    { id: 'CT002', name: 'SP chi tiết CT002 (Áo thun Nike - M - Xanh)' },
    { id: 'CT003', name: 'SP chi tiết CT003 (Quần jean Adidas - S - Xanh)' },
  ]);

  // Dữ liệu giả định cho đơn hàng chi tiết
  const [data, setData] = useState([
    {
      ID: '1',
      MaDonHangChiTiet: 'DHCT001',
      ID_DonHang: 'DH001',
      ID_BanPhamChiTiet: 'CT001',
      SoLuong: 2,
      Gia: 200000,
      ThanhTien: 400000,
    },
    {
      ID: '2',
      MaDonHangChiTiet: 'DHCT002',
      ID_DonHang: 'DH001',
      ID_BanPhamChiTiet: 'CT002',
      SoLuong: 1,
      Gia: 200000,
      ThanhTien: 200000,
    },
    {
      ID: '3',
      MaDonHangChiTiet: 'DHCT003',
      ID_DonHang: 'DH002',
      ID_BanPhamChiTiet: 'CT003',
      SoLuong: 1,
      Gia: 350000,
      ThanhTien: 350000,
    },
  ]);

  const columns = [
    { title: 'Mã ĐH Chi Tiết', dataIndex: 'MaDonHangChiTiet', key: 'MaDonHangChiTiet' },
    {
      title: 'Đơn Hàng',
      key: 'ID_DonHang',
      render: (_, record) => (
        donHangData.find(dh => dh.id === record.ID_DonHang)?.name || 'N/A'
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
    { title: 'Thành Tiền', dataIndex: 'ThanhTien', key: 'ThanhTien' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => message.info(`Bạn đã click Xóa chi tiết đơn hàng ${record.MaDonHangChiTiet}`)}
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
        <h1 className="page-title">Quản lý Chi Tiết Đơn Hàng</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Chi Tiết Đơn Hàng Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Chi Tiết Đơn Hàng" : "Thêm Chi Tiết Đơn Hàng"}
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
            name="MaDonHangChiTiet"
            label="Mã Đơn Hàng Chi Tiết"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Đơn Hàng Chi Tiết!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Đơn Hàng Chi Tiết" />
          </Form.Item>
          <Form.Item
            name="ID_DonHang"
            label="Đơn Hàng"
            rules={[{ required: true, message: 'Vui lòng chọn Đơn Hàng!' }]}
          >
            <Select placeholder="Chọn Đơn Hàng">
              {donHangData.map(item => (
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
            <Input type="number" prefix={<ShoppingCartOutlined />} placeholder="Số Lượng" />
          </Form.Item>
          <Form.Item
            name="Gia"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập Giá!' }]}
          >
            <Input type="number" prefix={<EuroOutlined />} placeholder="Giá" />
          </Form.Item>
          <Form.Item
            name="ThanhTien"
            label="Thành Tiền"
            rules={[{ required: true, message: 'Vui lòng nhập Thành Tiền!' }]}
          >
            <Input type="number" prefix={<EuroOutlined />} placeholder="Thành Tiền" />
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