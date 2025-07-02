import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  TagsOutlined,
  GiftOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import SanPhamPage from './SanPhamPage';
import NhanVienPage from './NhanVienPage';
import VoucherPage from './VoucherPage';
import KhachHangPage from './KhachHangPage';
import ThuocTinhPage from './ThuocTinhPage';
import DonHangPage from './DonHangPage';
import StatisticsPage from './StatisticsPage';
import BanHangTaiQuayPage from './BanHangTaiQuayPage';
import '../styles/AdminPanel.css';

const { Header, Sider, Content } = Layout;

function AdminPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Sản Phẩm',
      onClick: () => navigate('/admin-panel/products'),
    },
    {
      key: 'attributes',
      icon: <TagsOutlined />,
      label: 'Thuộc Tính',
      onClick: () => navigate('/admin-panel/attributes'),
    },
    {
      key: 'vouchers',
      icon: <GiftOutlined />,
      label: 'Voucher',
      onClick: () => navigate('/admin-panel/vouchers'),
    },
    {
      key: 'promotions',
      icon: <TagsOutlined />,
      label: 'Khuyến Mãi',
      onClick: () => navigate('/admin-panel/promotions'),
    },
    {
      key: 'staff',
      icon: <TeamOutlined />,
      label: 'Nhân Viên',
      onClick: () => navigate('/admin-panel/staff'),
    },
    {
      key: 'customers',
      icon: <CustomerServiceOutlined />,
      label: 'Khách Hàng',
      onClick: () => navigate('/admin-panel/customers'),
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn Hàng',
      onClick: () => navigate('/admin-panel/orders'),
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: 'Thống Kê',
      onClick: () => navigate('/admin-panel/statistics'),
    },
    {
      key: 'banhang',
      icon: <ShoppingCartOutlined />,
      label: 'Bán hàng tại quầy',
      onClick: () => navigate('/admin-panel/banhang'),
    },
  ];

  const getSelectedKey = () => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    // Nếu đường dẫn là /admin-panel, đặt mặc định là products
    if (lastPart === 'admin-panel') {
      return 'products';
    }
    return lastPart;
  };

  const { token: { colorBgContainer } } = theme.useToken();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 100,
          overflow: 'auto',
        }}
        width={200}
      >
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="sidebar-title">Admin Panel</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h2 style={{ margin: 0, marginLeft: 16 }}>Bảng điều khiển quản trị</h2>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', minHeight: '100vh', overflow: 'auto' }}>
          <Routes>
            <Route index element={<SanPhamPage />} />
            <Route path="products" element={<SanPhamPage />} />
            <Route path="staff" element={<NhanVienPage />} />
            <Route path="vouchers" element={<VoucherPage />} />
            <Route path="customers" element={<KhachHangPage />} />
            <Route path="attributes/*" element={<ThuocTinhPage />} />
            <Route path="orders" element={<DonHangPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="banhang" element={<BanHangTaiQuayPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminPanel; 