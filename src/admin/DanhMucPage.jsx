import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function DanhMucPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [danhMucs, setDanhMucs] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/api/danh-muc/getAll')
      .then(response => response.json())
      .then(data => setDanhMucs(data))
      .catch(error => console.error('Lỗi khi gọi API kích thước:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Danh Mục', dataIndex: 'tenDanhMuc', key: 'tenDanhMuc' },
    { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => message.info(`Bạn đã click Xóa danh mục ${record.MaDanhMuc}`)}
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
      tenDanhMuc: item.tenDanhMuc
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      // Cập nhật
      fetch(`http://localhost:8080/api/danh-muc/update/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          tenDanhMuc: values.tenDanhMuc,
          trangThai: Number(values.trangThai)
        }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Cập nhật thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Cập nhật thành công!', duration: 2 });
          fetch('http://localhost:8080/api/danh-muc/getAll')
            .then(res => res.json())
            .then(data => setDanhMucs(data));
        })
        .catch(error => {
          message.error('Cập nhật thất bại!');
          console.error(error);
        });
    } else {
      // Thêm mới
      fetch('http://localhost:8080/api/danh-muc/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenDanhMuc: values.tenDanhMuc,
          trangThai: Number(values.trangThai)
        }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Thêm mới thất bại');
          return response.json();
        })
        .then(data => {
          message.success({ content: 'Thêm mới thành công!', duration: 2 });
          fetch('http://localhost:8080/api/danh-muc/getAll')
            .then(res => res.json())
            .then(data => setDanhMucs(data));
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
        <h2 className="page-title">Quản lý Danh Mục</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Danh Mục Mới</Button>
      </div>
      <Table dataSource={danhMucs} columns={columns} rowKey="id" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Danh Mục" : "Thêm Danh Mục"}
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
            name="tenDanhMuc"
            label="Tên Danh Mục"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Danh Mục!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Danh Mục" />
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