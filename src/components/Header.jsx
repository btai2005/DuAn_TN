import React from 'react';
import { Layout, Menu, Input, Button, Badge, Space, Avatar, Dropdown } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const menuItems = [
  { key: 'home', label: <Link to="/home">Trang chủ</Link> },
  { key: 'products', label: <Link to="/products">Sản phẩm</Link> },
  { key: 'sale', label: <Link to="/sale">Khuyến mãi</Link> },
  { key: 'blog', label: <Link to="/blog">Tin tức</Link> },
  { key: 'orders', label: <Link to="/orders">Lịch sử đơn hàng</Link> },
  { key: 'contact', label: <Link to="/contact">Liên hệ</Link> },
];

const userMenuItems = [
  {
    key: 'profile',
    label: 'Thông tin cá nhân',
  },
  {
    key: 'orders',
    label: 'Đơn hàng của tôi',
  },
  {
    key: 'wishlist',
    label: 'Sản phẩm yêu thích',
  },
  {
    key: 'logout',
    label: 'Đăng xuất',
  },
];

function Header() {
  const location = useLocation();
  const selectedKey = menuItems.find(item => location.pathname.startsWith('/' + item.key))?.key || 'home';

  return (
    <AntHeader style={{ 
      background: '#ECEFF1',
      padding: '0 15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '48px',
      lineHeight: '48px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
      }}>
        {/* Logo */}
        <Link to="/home" style={{ marginRight: '10px' }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ height: '24px' }}
          />
        </Link>

        {/* Menu chính */}
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ 
            flex: 1,
            borderBottom: 'none',
            fontSize: '13px',
            fontWeight: '500',
            backgroundColor: 'transparent',
            height: '100%',
            lineHeight: '48px',
          }}
        />

        {/* Phần tìm kiếm và giỏ hàng */}
        <Space size="small" style={{ alignItems: 'center', marginLeft: '10px' }}>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            style={{ width: 150 }}
            enterButton={<SearchOutlined style={{ fontSize: '14px' }} />}
            size="small"
          />
          
          <Link to="/wishlist">
            <Badge count={5}>
              <Button type="text" icon={<HeartOutlined style={{ fontSize: '18px' }} />} size="small" />
            </Badge>
          </Link>

          <Link to="/cart">
            <Badge count={3}>
              <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '18px' }} />} size="small" />
            </Badge>
          </Link>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button type="text" icon={<UserOutlined style={{ fontSize: '18px' }} />} size="small" />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
}

export default Header; 