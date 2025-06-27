import React from 'react';
import { Table, Button, InputNumber, Typography, Form, Input, message } from 'antd';

const { Title } = Typography;

// Dữ liệu mẫu giỏ hàng
const cartData = [
  { key: 1, name: 'Nike Air Max', price: 2000000, quantity: 1 },
  { key: 2, name: 'Adidas Ultra Boost', price: 2500000, quantity: 2 }
];

function Cart() {
  const columns = [
    { title: 'Sản phẩm', dataIndex: 'name' },
    { title: 'Giá', dataIndex: 'price', render: (price) => price.toLocaleString() + 'đ' },
    { title: 'Số lượng', dataIndex: 'quantity', render: (text, record) => (
      <InputNumber min={1} defaultValue={record.quantity} />
    ) },
    { title: 'Thành tiền', render: (text, record) => (record.price * record.quantity).toLocaleString() + 'đ' },
    { title: '', render: () => <Button danger>Xóa</Button> }
  ];

  const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    message.success('Thông tin khách hàng đã được gửi!');
    alert(`Thông tin khách hàng:\nHọ tên: ${values.name}\nSố điện thoại: ${values.phone}\nEmail: ${values.email}\nĐịa chỉ: ${values.address}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Giỏ hàng</Title>
      <Table dataSource={cartData} columns={columns} pagination={false} />
      <div style={{ maxWidth: 400, margin: '32px 0 0 0' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Nhập địa chỉ nhận hàng" />
          </Form.Item>
          <Form.Item>
            <Title level={4}>Tổng tiền: {total.toLocaleString()}đ</Title>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
              Thanh toán
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Cart; 