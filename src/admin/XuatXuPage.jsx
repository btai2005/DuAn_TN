import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import {TagOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function XuatXuPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [kichThuocs, setKichThuocs] = useState([]);
  const [xuatXus, setXuatXus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/kich-thuoc/getAll')
      .then(response => response.json())
      .then(data => {
        console.log('DATA KICH THUOC:', data);
        setKichThuocs(data);
      })
      .catch(error => console.error('Lỗi khi gọi API kích thước:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/xuat-xu/getAll')
      .then(response => response.json())
      .then(data => setXuatXus(data))
      .catch(error => console.error('Lỗi khi gọi API kích thước:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Xuất Xứ', dataIndex: 'tenXuatXu', key: 'tenXuatXu' },
    { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
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
      tenXuatXu: item.tenXuatXu
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      // Cập nhật
      fetch(`http://localhost:8080/api/xuat-xu/update/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          tenXuatXu: values.tenXuatXu,
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
          fetch('http://localhost:8080/api/xuat-xu/getAll')
            .then(res => res.json())
            .then(data => setXuatXus(data));
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Sửa thất bại',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          console.error(error);
        });
    } else {
      // Thêm mới
      fetch('http://localhost:8080/api/xuat-xu/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenXuatXu: values.tenXuatXu,
          trangThai: Number(values.trangThai)
        }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Thêm mới thất bại');
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
          fetch('http://localhost:8080/api/xuat-xu/getAll')
            .then(res => res.json())
            .then(data => setXuatXus(data));
        })
        .catch(error => {
          Swal.fire({
            icon: 'success',
            title: 'Thêm thất bại',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          console.error(error);
        });
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h2 className="page-title">Quản lý Xuất Xứ</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Xuất Xứ Mới</Button>
      </div>
      <Table dataSource={xuatXus} columns={columns} rowKey="id" pagination={false} />

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
          initialValues={{ trangThai: 1 }}
        >
          {editingItem && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="tenXuatXu"
            label="Tên Xuất Xứ"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Xuất Xứ!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Xuất Xứ" />
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