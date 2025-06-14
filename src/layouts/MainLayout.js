import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Button, Space, Avatar, Typography, Badge } from 'antd';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, HeartOutlined, SettingOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  { key: 'home', label: <Link to="/home">Trang chủ</Link> },
  { key: 'products', label: <Link to="/products">Sản phẩm</Link> },
  { key: 'orders', label: <Link to="/orders">Lịch sử đơn hàng</Link> },
  { key: 'admin', label: <Link to="/admin">Quản trị</Link> },
];

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false); // Giả định trạng thái đăng nhập
  const [cartItemCount, setCartItemCount] = useState(3); // Giả định số lượng sản phẩm trong giỏ hàng

  let selectedKey = menuItems.find(item => location.pathname.startsWith('/' + item.key));
  if (!selectedKey && location.pathname === '/home') selectedKey = { key: 'home' };

  const handleLogout = () => {
    setLoggedIn(false);
    // Logic đăng xuất thực tế sẽ ở đây
    navigate('/login');
  };

  const userMenu = (
    <div style={{ padding: '16px', width: '250px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
      <Title level={4} style={{ marginBottom: '4px' }}>Chào mừng đến với eStore</Title>
      <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>Truy cập tài khoản & quản lý đơn hàng</Text>
      <Menu
        selectable={false}
        items={[
          {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
            onClick: () => navigate('/profile'),
          },
          {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: 'My Orders',
            onClick: () => navigate('/orders'),
          },
          {
            key: 'wishlist',
            icon: <HeartOutlined />,
            label: 'My Wishlist',
            onClick: () => navigate('/wishlist'),
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => navigate('/settings'),
          },
        ]}
      />
      <Space direction="vertical" style={{ width: '100%', marginTop: '16px' }}>
        {loggedIn ? (
          <Button type="primary" block onClick={handleLogout} icon={<LogoutOutlined />}>
            Đăng xuất
          </Button>
        ) : (
          <>
            <Button type="primary" block onClick={() => navigate('/login')} icon={<LoginOutlined />}>
              Đăng nhập
            </Button>
            <Button block onClick={() => navigate('/register')} icon={<UserAddOutlined />}>
              Đăng ký
            </Button>
          </>
        )}
      </Space>
    </div>
  );

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey ? selectedKey.key : '']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Space size="middle" style={{ color: '#fff' }}>
          <Badge count={cartItemCount} offset={[0, 0]}>
            <ShoppingCartOutlined
              style={{ fontSize: '24px', cursor: 'pointer', color: 'white' }}
              onClick={() => navigate('/cart')}
            />
          </Badge>
          <Dropdown overlay={userMenu} placement="bottomRight" arrow trigger={['click']}>
            <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer', backgroundColor: '#87d068' }} />
          </Dropdown>
        </Space>
      </Header>
      <Content style={{ minHeight: '90vh', background: '#fff' }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default MainLayout; 