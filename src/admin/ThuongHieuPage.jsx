import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function ThuongHieuPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [thuongHieus, setThuongHieus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/thuong-hieu/getAll')
      .then(response => response.json())
      .then(data => setThuongHieus(data))
      .catch(error => console.error('Lỗi khi gọi API kích thước:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Thương Hiệu', dataIndex: 'tenThuongHieu', key: 'tenThuongHieu' },
    { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
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
      tenThuongHieu: item.tenThuongHieu
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      // Cập nhật
      fetch(`http://localhost:8080/api/thuong-hieu/update/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          tenThuongHieu: values.tenThuongHieu,
          trangThai: Number(values.trangThai)
        }),
      })
        .then(response => {
          Swal.fire({
            icon: 'error',
            title: 'Sửa thất bại',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          return response.json();
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Sửa thành công',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          fetch('http://localhost:8080/api/thuong-hieu/getAll')
            .then(res => res.json())
            .then(data => setThuongHieus(data));
        })
        .catch(error => {
          message.error('Cập nhật thất bại!');
          console.error(error);
        });
    } else {
      // Thêm mới
      fetch('http://localhost:8080/api/thuong-hieu/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenThuongHieu: values.tenThuongHieu,
          trangThai: Number(values.trangThai)
        }),
      })
        .then(response => {
          Swal.fire({
            icon: 'error',
            title: 'Thêm thất bại',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          return response.json();
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Thêm thành công',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          fetch('http://localhost:8080/api/thuong-hieu/getAll')
            .then(res => res.json())
            .then(data => setThuongHieus(data));
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
        <h2 className="page-title">Quản lý Thương Hiệu</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Thương Hiệu Mới</Button>
      </div>
      <Table dataSource={thuongHieus} columns={columns} rowKey="id" pagination={false} />

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
          initialValues={{ trangThai: 1 }}
        >
          {editingItem && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="tenThuongHieu"
            label="Tên Thương Hiệu"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Thương Hiệu!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Thương Hiệu" />
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