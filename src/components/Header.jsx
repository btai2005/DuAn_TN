import React from 'react';
import { Layout, Menu, Input, Button, Badge, Space, Dropdown } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { SearchOutlined, ShoppingCartOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const menuItems = [
  { key: 'home', label: <Link to="/home">Trang chủ</Link> },
  { key: 'products', label: <Link to="/products">Sản phẩm</Link> },
  { key: 'blog', label: <Link to="/blog">Tin tức</Link> },
  { key: 'contact', label: <Link to="/contact">Liên hệ</Link> },
];

const userMenuItems = [
  {
    key: 'profile',
    label: 'Thông tin cá nhân',
  },
  {
    key: 'order-history',
    label: (
      <span>
        <Link to="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>Đơn hàng của tôi</Link>
      </span>
    ),
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
      background: '#f5f5f5',
      padding: '0 30px',
      boxShadow: '0 2px 8px rgba(121, 106, 193, 0.96)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '100px',
      lineHeight: '100px',
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
            style={{ height: '100px' }}
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
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: 'transparent',
            height: '100%',
            lineHeight: '100px',
          }}
        />

        {/* Thêm menu thương hiệu */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginLeft: '32px' }}>
          <a href="/products?brand=Nike" style={{ color: '#222', fontWeight: 700, textDecoration: 'none', fontSize: '18px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#1677ff'} onMouseOut={e => e.target.style.color = '#222'}>Nike</a>
          <a href="/products?brand=Adidas" style={{ color: '#222', fontWeight: 700, textDecoration: 'none', fontSize: '18px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#1677ff'} onMouseOut={e => e.target.style.color = '#222'}>Adidas</a>
          <a href="/products?brand=Puma" style={{ color: '#222', fontWeight: 700, textDecoration: 'none', fontSize: '18px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#1677ff'} onMouseOut={e => e.target.style.color = '#222'}>Puma</a>
        </div>

        {/* Phần tìm kiếm và giỏ hàng */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', height: '100%', gap: '10px' }}>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            style={{ width: 250 }}
            enterButton={<SearchOutlined style={{ fontSize: '28px' }} />}
            size="large"
          />

          <Link to="/wishlist">
            <Badge count={5}>
              <Button type="text" icon={<HeartOutlined style={{ fontSize: '28px' }} />} size="large" />
            </Badge>
          </Link>

          <Link to="/cart">
            <Badge count={3}>
              <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '28px' }} />} size="large" />
            </Badge>
          </Link>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button type="text" icon={<UserOutlined style={{ fontSize: '28px' }} />} size="large" />
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
}

export default Header;