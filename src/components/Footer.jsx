import React from 'react';
import { Layout, Row, Col, Typography, Input, Button, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, FacebookOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const footerLinks = {
  'Về Chúng Tôi': [
    { label: 'Giới thiệu', link: '/about' },
    { label: 'Tuyển dụng', link: '/careers' },
    { label: 'Liên hệ', link: '/contact' },
  ],
  'Chính Sách': [
    { label: 'Chính sách bảo mật', link: '/privacy' },
    { label: 'Điều khoản sử dụng', link: '/terms' },
    { label: 'Chính sách đổi trả', link: '/return-policy' },
  ],
  'Hỗ Trợ': [
    { label: 'FAQ', link: '/faq' },
    { label: 'Vận chuyển', link: '/shipping' },
    { label: 'Bảo hành', link: '/warranty' },
  ],
};

function Footer() {
  return (
    <AntFooter style={{ 
      background: '#001529',
      color: '#fff',
      padding: '60px 50px 20px'
    }}>
      <Row gutter={[40, 40]}>
        {/* Thông tin liên hệ */}
        <Col xs={24} md={8}>
          <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>
            Thông Tin Liên Hệ
          </Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              <Text style={{ color: '#fff' }}>
                123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
              </Text>
            </div>
            <div>
              <PhoneOutlined style={{ marginRight: '8px' }} />
              <Text style={{ color: '#fff' }}>0123 456 789</Text>
            </div>
            <div>
              <MailOutlined style={{ marginRight: '8px' }} />
              <Text style={{ color: '#fff' }}>contact@shoestore.com</Text>
            </div>
          </Space>
        </Col>

        {/* Menu links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <Col xs={24} md={4} key={title}>
            <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>
              {title}
            </Title>
            <Space direction="vertical" size="middle">
              {links.map(link => (
                <Link 
                  key={link.label} 
                  to={link.link}
                  style={{ color: '#fff', display: 'block' }}
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>
        ))}

        {/* Đăng ký nhận tin */}
        <Col xs={24} md={8}>
          <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>
            Đăng Ký Nhận Tin
          </Title>
          <Text style={{ color: '#fff', display: 'block', marginBottom: '16px' }}>
            Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt
          </Text>
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="Email của bạn" />
            <Button type="primary">Đăng ký</Button>
          </Space.Compact>
        </Col>
      </Row>

      <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Social media và copyright */}
      <Row justify="space-between" align="middle">
        <Col>
          <Text style={{ color: '#fff' }}>
            © 2024 ShoeStore. Tất cả quyền được bảo lưu.
          </Text>
        </Col>
        <Col>
          <Space size="large">
            <Link to="#" style={{ color: '#fff' }}>
              <FacebookOutlined style={{ fontSize: '24px' }} />
            </Link>
            <Link to="#" style={{ color: '#fff' }}>
              <InstagramOutlined style={{ fontSize: '24px' }} />
            </Link>
            <Link to="#" style={{ color: '#fff' }}>
              <YoutubeOutlined style={{ fontSize: '24px' }} />
            </Link>
          </Space>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer; 