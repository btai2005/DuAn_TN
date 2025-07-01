import React, { useState } from 'react';

const DonHangPage = () => {
  const [activeTab, setActiveTab] = useState('POS'); // 'POS' hoặc 'ONLINE'

  // Dữ liệu mẫu, sau này sẽ thay bằng API
  const ordersPOS = [
    { id: 1, ten: 'Đơn POS 1', tongTien: 1000000, trangThai: 'Đã thanh toán' },
    { id: 2, ten: 'Đơn POS 2', tongTien: 500000, trangThai: 'Chờ thanh toán' },
  ];
  const ordersOnline = [
    { id: 3, ten: 'Đơn Online 1', tongTien: 2000000, trangThai: 'Đã thanh toán' },
    { id: 4, ten: 'Đơn Online 2', tongTien: 1500000, trangThai: 'Chờ xác nhận' },
  ];

  const renderOrders = (orders) => (
    <table style={{ width: '100%', marginTop: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(25,118,210,0.08)', overflow: 'hidden' }}>
      <thead>
        <tr style={{ background: '#e3f0ff', color: '#1976d2', fontWeight: 700 }}>
          <th style={{ padding: 12 }}>Mã đơn</th>
          <th style={{ padding: 12 }}>Tên đơn</th>
          <th style={{ padding: 12 }}>Tổng tiền</th>
          <th style={{ padding: 12 }}>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id} style={{ borderBottom: '1px solid #e3e8ee', fontSize: 16 }}>
            <td style={{ padding: 12, textAlign: 'center', fontWeight: 600 }}>#{order.id}</td>
            <td style={{ padding: 12 }}>{order.ten}</td>
            <td style={{ padding: 12, color: '#1976d2', fontWeight: 700 }}>{order.tongTien.toLocaleString()} đ</td>
            <td style={{ padding: 12 }}>
              <span style={{
                background: order.trangThai.includes('Đã') ? '#43b244' : '#ff9800',
                color: '#fff',
                borderRadius: 8,
                padding: '4px 14px',
                fontWeight: 600,
                fontSize: 15
              }}>{order.trangThai}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: '#f6f8fa' }}>
      <h2 style={{ color: '#1976d2', fontWeight: 800, marginBottom: 24, letterSpacing: 1 }}>Quản lý đơn hàng</h2>
      <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
        <button
          style={{
            flex: 1,
            padding: '14px 0',
            border: 'none',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 0,
            background: activeTab === 'POS' ? '#1976d2' : '#e3f0ff',
            color: activeTab === 'POS' ? '#fff' : '#1976d2',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: activeTab === 'POS' ? '0 4px 16px rgba(25,118,210,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('POS')}
        >
          <span role="img" aria-label="pos">🧾</span> Đơn hàng POS
        </button>
        <button
          style={{
            flex: 1,
            padding: '14px 0',
            border: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 16,
            background: activeTab === 'ONLINE' ? '#1976d2' : '#e3f0ff',
            color: activeTab === 'ONLINE' ? '#fff' : '#1976d2',
            fontWeight: 700,
            fontSize: 18,
            boxShadow: activeTab === 'ONLINE' ? '0 4px 16px rgba(25,118,210,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('ONLINE')}
        >
          <span role="img" aria-label="online">🌐</span> Đơn hàng Online
        </button>
      </div>
      <div style={{ background: '#fff', borderRadius: '0 0 16px 16px', boxShadow: '0 2px 8px rgba(25,118,210,0.04)', padding: 0, minHeight: 320 }}>
        {activeTab === 'POS' ? renderOrders(ordersPOS) : renderOrders(ordersOnline)}
      </div>
    </div>
  );
};

export default DonHangPage; 