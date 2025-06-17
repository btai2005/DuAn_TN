import React from 'react';
import { Carousel, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const heroSlides = [
  {
    id: 1,
    image: 'banner1.jpg',
    title: 'Bộ Sưu Tập Mới',
    description: 'Khám phá ngay những mẫu giày mới nhất',
    buttonText: 'Mua ngay',
    buttonLink: '/products',
  },
  {
    id: 2,
    image: 'banner2.jpg',
    title: 'Siêu Sale Tháng 4',
    description: 'Giảm giá lên đến 50% cho tất cả sản phẩm',
    buttonText: 'Xem ngay',
    buttonLink: '/sale',
  },
  {
    id: 3,
    image: 'banner3.jpg',
    title: 'Giày Thể Thao Cao Cấp',
    description: 'Chất lượng vượt trội, phong cách độc đáo',
    buttonText: 'Khám phá',
    buttonLink: '/products',
  },
];

function HeroSection() {
  return (
    <div style={{ position: 'relative' }}>
      <Carousel autoplay>
        {heroSlides.map(slide => (
          <div key={slide.id}>
            <div
              style={{
                height: '600px',
                background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10%',
              }}
            >
              <div style={{ color: '#fff', maxWidth: '600px' }}>
                <Title level={1} style={{ color: '#fff', marginBottom: '20px' }}>
                  {slide.title}
                </Title>
                <Paragraph style={{ 
                  fontSize: '18px', 
                  color: '#fff',
                  marginBottom: '30px'
                }}>
                  {slide.description}
                </Paragraph>
                <Link to={slide.buttonLink}>
                  <Button type="primary" size="large">
                    {slide.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Banner nhỏ bên dưới */}
      <div style={{ 
        padding: '40px 10%',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ 
          flex: 1,
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Title level={4}>Miễn phí vận chuyển</Title>
          <Paragraph>Cho đơn hàng từ 500.000đ</Paragraph>
        </div>
        <div style={{ 
          flex: 1,
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Title level={4}>Đổi trả dễ dàng</Title>
          <Paragraph>Trong vòng 30 ngày</Paragraph>
        </div>
        <div style={{ 
          flex: 1,
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Title level={4}>Thanh toán an toàn</Title>
          <Paragraph>Bảo mật thông tin</Paragraph>
        </div>
      </div>
    </div>
  );
}

export default HeroSection; 