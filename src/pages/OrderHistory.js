import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import axios from 'axios';

const { Title } = Typography;

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        let text = 'Hoàn thành';
        
        switch (status) {
          case 'pending':
            color = 'orange';
            text = 'Đang xử lý';
            break;
          case 'processing':
            color = 'blue';
            text = 'Đang giao hàng';
            break;
          case 'cancelled':
            color = 'red';
            text = 'Đã hủy';
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Lịch sử đơn hàng</Title>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

export default OrderHistory; 