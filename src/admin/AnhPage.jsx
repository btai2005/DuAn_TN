import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

export default function AnhPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu giả định cho ảnh
  const [data] = useState([
    {
      ID: '1',
      MaAnh: 'A001',
      TenAnh: 'Ảnh sản phẩm 1',
      DuongDan: '/images/product1.jpg',
      MoTa: 'Ảnh sản phẩm Nike Air Max',
    },
    {
      ID: '2',
      MaAnh: 'A002',
      TenAnh: 'Ảnh sản phẩm 2',
      DuongDan: '/images/product2.jpg',
      MoTa: 'Ảnh sản phẩm Adidas Ultra Boost',
    },
  ]);

  const columns = [
    { title: 'Mã Ảnh', dataIndex: 'MaAnh', key: 'MaAnh' },
    { title: 'Tên Ảnh', dataIndex: 'TenAnh', key: 'TenAnh' },
    { 
      title: 'Ảnh', 
      key: 'DuongDan',
      render: (_, record) => (
        <img src={record.DuongDan} alt={record.TenAnh} style={{ width: 100, height: 100, objectFit: 'cover' }} />
      )
    },
    { title: 'Mô Tả', dataIndex: 'MoTa', key: 'MoTa' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ảnh này?"
            onConfirm={() => message.info(`Bạn đã click Xóa ảnh ${record.MaAnh}`)}
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
        <h1 className="page-title">Quản lý Ảnh</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Ảnh Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Ảnh" : "Thêm Ảnh Mới"}
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
            name="MaAnh"
            label="Mã Ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Ảnh!' }]}
          >
            <Input prefix={<CameraOutlined />} placeholder="Mã Ảnh" />
          </Form.Item>
          <Form.Item
            name="TenAnh"
            label="Tên Ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Ảnh!' }]}
          >
            <Input placeholder="Tên Ảnh" />
          </Form.Item>
          <Form.Item
            name="DuongDan"
            label="Đường Dẫn Ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập Đường Dẫn Ảnh!' }]}
          >
            <Input placeholder="Đường Dẫn Ảnh" />
          </Form.Item>
          <Form.Item
            name="MoTa"
            label="Mô Tả"
          >
            <Input.TextArea placeholder="Mô Tả" />
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