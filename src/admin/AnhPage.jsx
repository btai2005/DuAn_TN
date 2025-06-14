import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { PictureOutlined, TagOutlined, LinkOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function AnhPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([
    {
      ID: '1',
      MaAnh: 'IMG001',
      url: 'https://example.com/image1.jpg',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '2',
      MaAnh: 'IMG002',
      url: 'https://example.com/image2.jpg',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '3',
      MaAnh: 'IMG003',
      url: 'https://example.com/image3.jpg',
      TrangThai: 'Không hoạt động',
    },
  ]);

  const columns = [
    { title: 'Mã Ảnh', dataIndex: 'MaAnh', key: 'MaAnh' },
    { title: 'URL Ảnh', dataIndex: 'url', key: 'url',
      render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
    },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
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
        <h2 className="page-title">Quản lý Ảnh</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Ảnh Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Ảnh" : "Thêm Ảnh"}
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
            name="MaAnh"
            label="Mã Ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Ảnh!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Ảnh" />
          </Form.Item>
          <Form.Item
            name="url"
            label="URL Ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập URL Ảnh!' }, { type: 'url', message: 'URL không hợp lệ!' }]}
          >
            <Input prefix={<LinkOutlined />} placeholder="URL Ảnh" />
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