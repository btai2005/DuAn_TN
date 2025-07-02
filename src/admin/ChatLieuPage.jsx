import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm } from 'antd';
import Swal from 'sweetalert2';
import '../styles/AdminPanel.css';
import { message } from 'antd';

const { Option } = Select;

export default function ChatLieuPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [chatLieus, setChatLieus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/chat-lieu/getAll')
      .then(response => response.json())
      .then(data => setChatLieus(data))
      .catch(error => console.error('Lỗi khi gọi API chất liệu:', error));
  }, []);

  const columns = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Tên Chất Liệu', dataIndex: 'tenChatLieu', key: 'tenChatLieu' },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (value) => value === 1 ? 'Đang hoạt động' : 'Không hoạt động'
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => message.info(`Bạn đã click Xóa chất liệu ${record.MaChatLieu}`)}
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
    console.log('ITEM SỬA:', item);
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      updateKichThuoc(editingItem.id, values);
    } else {
      const { id, ...dataToSend } = values;
      dataToSend.trangThai = Number(dataToSend.trangThai);
      console.log('DỮ LIỆU GỬI LÊN:', dataToSend);
      fetch('http://localhost:8080/api/chat-lieu/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
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
          fetch('http://localhost:8080/api/chat-lieu/getAll')
            .then(res => res.json())
            .then(data => setChatLieus(data));
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

  const updateKichThuoc = (id, values) => {
    fetch(`http://localhost:8080/api/chat-lieu/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
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
        fetch('http://localhost:8080/api/chat-lieu/getAll')
          .then(res => res.json())
          .then(data => setChatLieus(data));
      })
      .catch(error => {
        Swal.fire({
          icon: 'success',
          title: 'Sửa thất bại',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          width: 250
        });
        console.error(error);
      });
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h2 className="page-title">Quản lý Chất Liệu</h2>
        <Button type="primary" onClick={handleAdd}>Thêm Chất Liệu Mới</Button>
      </div>
      <Table dataSource={chatLieus} columns={columns} rowKey="id" pagination={false} />
      
      <Modal
        title={editingItem ? "Sửa Chất Liệu" : "Thêm Chất Liệu"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ trangThai: 'Đang hoạt động' }}
        >
          <Form.Item name="id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item name="tenChatLieu" label="Tên Chất Liệu">
            <Input />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng Thái">
            <Select>
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
      <Button onClick={() => message.success('Test thông báo!')}>Test</Button>

    </div>
  );
} 