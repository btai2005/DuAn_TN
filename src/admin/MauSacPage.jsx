import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';
import useMauSacStore from './stores/mauSacStore';

const { Option } = Select;

export default function MauSacPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const { mauSacData, addMauSac, updateMauSac, deleteMauSac } = useMauSacStore();

  const columns = [
    { title: 'Mã Màu Sắc', dataIndex: 'MaMauSac', key: 'MaMauSac' },
    { title: 'Tên Màu Sắc', dataIndex: 'TenMauSac', key: 'TenMauSac' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => {
              deleteMauSac(record.ID);
              message.success('Xóa thành công!');
            }}
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
      const updatedItem = { ...editingItem, ...values };
      updateMauSac(updatedItem);
      message.success('Cập nhật thành công!');
    } else {
      const newID = `MS${String(mauSacData.length + 1).padStart(3, '0')}`;
      const newItem = { ID: newID, MaMauSac: newID, ...values };
      addMauSac(newItem);
      message.success('Thêm mới thành công!');
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h2 className="page-title">Quản lý Màu Sắc</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Màu Sắc Mới</Button>
      </div>
      <Table dataSource={mauSacData} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Màu Sắc" : "Thêm Màu Sắc"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ TrangThai: 'Đang hoạt động' }}
        >
          <Form.Item
            name="MaMauSac"
            label="Mã Màu Sắc"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Màu Sắc!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Màu Sắc" />
          </Form.Item>
          <Form.Item
            name="TenMauSac"
            label="Tên Màu Sắc"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Màu Sắc!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Màu Sắc" />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value="Đang hoạt động">Đang hoạt động</Option>
              <Option value="Không hoạt động">Không hoạt động</Option>
            </Select>
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