import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';
import useMauSacStore from './stores/mauSacStore';

const { Option } = Select;

export default function MauSacPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [mauSacs, setMauSacs] = useState([]);

  const { mauSacData, addMauSac, updateMauSac, deleteMauSac } = useMauSacStore();

  useEffect(() => {
    fetch('http://localhost:8080/api/mau-sac/getAll')
      .then(response => response.json())
      .then(data => {
        console.log('DATA MAU SAC:', data);
        setMauSacs(data);
      })
      .catch(error => console.error('Lỗi khi gọi API màu sắc:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Màu Sắc', dataIndex: 'tenMauSac', key: 'tenMauSac' },
    { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => {
              deleteMauSac(record.id);
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
      tenMauSac: item.tenMauSac
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      fetch(`http://localhost:8080/api/mau-sac/update/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          tenMauSac: values.tenMauSac,
          trangThai: Number(values.trangThai)
        }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Cập nhật thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Cập nhật thành công!', duration: 2 });
          fetch('http://localhost:8080/api/mau-sac/getAll')
            .then(res => res.json())
            .then(data => setMauSacs(data));
        })
        .catch(error => {
          message.error('Cập nhật thất bại!');
          console.error(error);
        });
    } else {
      fetch('http://localhost:8080/api/mau-sac/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenMauSac: values.tenMauSac,
          trangThai: Number(values.trangThai)
        }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Thêm mới thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Thêm mới thành công!', duration: 2 });
          fetch('http://localhost:8080/api/mau-sac/getAll')
            .then(res => res.json())
            .then(data => setMauSacs(data));
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
        <h2 className="page-title">Quản lý Màu Sắc</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Màu Sắc Mới</Button>
      </div>
      <Table dataSource={mauSacs} columns={columns} rowKey="id" pagination={false} />

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
          initialValues={{ trangThai: 1 }}
        >
          {editingItem && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="tenMauSac"
            label="Tên Màu Sắc"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Màu Sắc!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Màu Sắc" />
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value={1}>Đang hoạt động</Option>
              <Option value={0}>Không hoạt động</Option>
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