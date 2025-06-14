import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Button } from 'antd';
import {
  ShoppingOutlined,
  TagsOutlined,
  GiftOutlined,
  UserOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  CameraOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import '../styles/AdminPanel.css';
import NhanVienPage from './NhanVienPage';
import VoucherPage from './VoucherPage';
import SanPhamPage from './SanPhamPage';
import KhachHangPage from './KhachHangPage';
import ThuocTinhPage from './ThuocTinhPage';
import AnhPage from './AnhPage';
import DonHangPage from './DonHangPage';
import KhuyenMaiPage from './KhuyenMaiPage';
import GioHangChiTietPage from './GioHangChiTietPage';
import DonHangChiTietPage from './DonHangChiTietPage';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

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
      key: 'images',
      icon: <CameraOutlined />,
      label: 'Ảnh',
      onClick: () => navigate('/admin-panel/images'),
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn Hàng',
      onClick: () => navigate('/admin-panel/orders'),
    },
    {
      key: 'order-details',
      icon: <ShoppingCartOutlined />,
      label: 'Chi Tiết Đơn Hàng',
      onClick: () => navigate('/admin-panel/order-details'),
    },
    {
      key: 'cart-details',
      icon: <ShoppingCartOutlined />,
      label: 'Chi Tiết Giỏ Hàng',
      onClick: () => navigate('/admin-panel/cart-details'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={250}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#001529', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
          {collapsed ? 'ADM' : 'Admin Panel'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname.split('/')[2] || 'products']}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 24, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
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
          <Title level={3} style={{ margin: 0, marginLeft: 16 }}>Bảng điều khiển quản trị</Title>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
          <Routes>
            <Route index element={<SanPhamPage />} />
            <Route path="products" element={<SanPhamPage />} />
            <Route path="staff" element={<NhanVienPage />} />
            <Route path="vouchers" element={<VoucherPage />} />
            <Route path="customers" element={<KhachHangPage />} />
            <Route path="attributes/*" element={<ThuocTinhPage />} />
            <Route path="images" element={<AnhPage />} />
            <Route path="orders" element={<DonHangPage />} />
            <Route path="order-details" element={<DonHangChiTietPage />} />
            <Route path="promotions" element={<KhuyenMaiPage />} />
            <Route path="cart-details" element={<GioHangChiTietPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminPanel; 