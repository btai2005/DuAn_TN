import React from 'react';
import { Table, Button, InputNumber, Typography } from 'antd';

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

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Giỏ hàng</Title>
      <Table dataSource={cartData} columns={columns} pagination={false} />
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <Title level={4}>Tổng tiền: {total.toLocaleString()}đ</Title>
        <Button type="primary" size="large">Thanh toán</Button>
      </div>
    </div>
  );
}

export default Cart; 