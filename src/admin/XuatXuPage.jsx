import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { GlobalOutlined, TagOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function XuatXuPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([
    {
      ID: '1',
      MaXuatXu: 'XX001',
      TenXuatXu: 'Việt Nam',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '2',
      MaXuatXu: 'XX002',
      TenXuatXu: 'Trung Quốc',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '3',
      MaXuatXu: 'XX003',
      TenXuatXu: 'Thái Lan',
      TrangThai: 'Đang hoạt động',
    },
  ]);

  const columns = [
    { title: 'Mã Xuất Xứ', dataIndex: 'MaXuatXu', key: 'MaXuatXu' },
    { title: 'Tên Xuất Xứ', dataIndex: 'TenXuatXu', key: 'TenXuatXu' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => message.info(`Bạn đã click Xóa xuất xứ ${record.MaXuatXu}`)}
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
        <h2 className="page-title">Quản lý Xuất Xứ</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Xuất Xứ Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Xuất Xứ" : "Thêm Xuất Xứ"}
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
            name="MaXuatXu"
            label="Mã Xuất Xứ"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Xuất Xứ!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Xuất Xứ" />
          </Form.Item>
          <Form.Item
            name="TenXuatXu"
            label="Tên Xuất Xứ"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Xuất Xứ!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Xuất Xứ" />
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