import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { TagsOutlined, TagOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function ThuongHieuPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([
    {
      ID: '1',
      MaThuongHieu: 'TH001',
      TenThuongHieu: 'Nike',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '2',
      MaThuongHieu: 'TH002',
      TenThuongHieu: 'Adidas',
      TrangThai: 'Đang hoạt động',
    },
    {
      ID: '3',
      MaThuongHieu: 'TH003',
      TenThuongHieu: 'Puma',
      TrangThai: 'Đang hoạt động',
    },
  ]);

  const columns = [
    { title: 'Mã Thương Hiệu', dataIndex: 'MaThuongHieu', key: 'MaThuongHieu' },
    { title: 'Tên Thương Hiệu', dataIndex: 'TenThuongHieu', key: 'TenThuongHieu' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => message.info(`Bạn đã click Xóa thương hiệu ${record.MaThuongHieu}`)}
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
        <h2 className="page-title">Quản lý Thương Hiệu</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Thương Hiệu Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Thương Hiệu" : "Thêm Thương Hiệu"}
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
            name="MaThuongHieu"
            label="Mã Thương Hiệu"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Thương Hiệu!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Thương Hiệu" />
          </Form.Item>
          <Form.Item
            name="TenThuongHieu"
            label="Tên Thương Hiệu"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Thương Hiệu!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Thương Hiệu" />
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