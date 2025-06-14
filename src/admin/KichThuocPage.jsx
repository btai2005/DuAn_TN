import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { BorderOutlined, TagOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function KichThuocPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([
    {
      ID: '1',
      MaKichThuoc: 'KT001',
      TenKichThuoc: 'S',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '2',
      MaKichThuoc: 'KT002',
      TenKichThuoc: 'M',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '3',
      MaKichThuoc: 'KT003',
      TenKichThuoc: 'L',
      TrangThai: 'Đang hoạt động',
    },
  ]);

  const columns = [
    { title: 'Mã Kích Thước', dataIndex: 'MaKichThuoc', key: 'MaKichThuoc' },
    { title: 'Tên Kích Thước', dataIndex: 'TenKichThuoc', key: 'TenKichThuoc' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => message.info(`Bạn đã click Xóa kích thước ${record.MaKichThuoc}`)}
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
        <h2 className="page-title">Quản lý Kích Thước</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Kích Thước Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Kích Thước" : "Thêm Kích Thước"}
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
            name="MaKichThuoc"
            label="Mã Kích Thước"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Kích Thước!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Kích Thước" />
          </Form.Item>
          <Form.Item
            name="TenKichThuoc"
            label="Tên Kích Thước"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Kích Thước!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Kích Thước" />
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