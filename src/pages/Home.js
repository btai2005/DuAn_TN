import React from 'react';
import { Row, Col, Card, Typography, Divider, Button, Tag, Space, Rate } from 'antd';
import { Link } from 'react-router-dom';
// import Header from '../components/Header'; // Không cần import Header ở đây
import HeroSection from '../components/HeroSection';
// import Footer from '../components/Footer'; // Không cần import Footer ở đây

const { Title, Text } = Typography;

// Dữ liệu mẫu cho sản phẩm nổi bật
const featuredProducts = [
  {
    id: 1,
    name: 'Giày adidas Campus 2 Nam - Đỏ',
    brand: 'Adidas',
    price: 2190000,
    originalPrice: 2500000,
    image: 'https://via.placeholder.com/300x200?text=Adidas+Campus+Red',
    isNew: true,
    isHotSale: true,
    discountPercentage: 12,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Giày Nike Court Vision Low Nam - Đen Trắng',
    brand: 'Nike',
    price: 2290000,
    originalPrice: 2579000,
    image: 'https://via.placeholder.com/300x200?text=Nike+Court+Vision',
    isNew: true,
    isHotSale: true,
    discountPercentage: 11,
    rating: 4,
  },
  {
    id: 3,
    name: 'Giày Nike Run Defy Nam - Đen Trắng',
    brand: 'Nike',
    price: 1890000,
    originalPrice: 2000000,
    image: 'https://via.placeholder.com/300x200?text=Nike+Run+Defy',
    isNew: true,
    isHotSale: true,
    discountPercentage: 6,
    rating: 5,
  },
  {
    id: 4,
    name: 'Giày Nike Vomero 18 Nam - Trắng Xám',
    brand: 'Nike',
    price: 4190000,
    originalPrice: 4700000,
    image: 'https://via.placeholder.com/300x200?text=Nike+Vomero+White',
    isNew: true,
    isHotSale: true,
    discountPercentage: 11,
    rating: 4.5,
  },
  {
    id: 5,
    name: 'Giày Nike Vomero 18 Nữ - Đen Trắng',
    brand: 'Nike',
    price: 4190000,
    originalPrice: 4700000,
    image: 'https://via.placeholder.com/300x200?text=Nike+Vomero+Black',
    isNew: true,
    isHotSale: true,
    discountPercentage: 11,
    rating: 4,
  },
];

// Dữ liệu mẫu cho sản phẩm mới về (có thể trùng với sản phẩm nổi bật, hoặc lấy từ nguồn khác)
const newArrivals = [
  {
    id: 6,
    name: 'Giày Adidas Grand Court SE Nam - Trắng',
    brand: 'Adidas',
    price: 1390000,
    originalPrice: 2049000,
    image: 'https://via.placeholder.com/300x200?text=Adidas+Grand+Court',
    isNew: true,
    isHotSale: true,
    discountPercentage: 32,
    rating: 4,
  },
  {
    id: 7,
    name: 'Giày Adidas Forum Low Nam - Trắng',
    brand: 'Adidas',
    price: 1990000,
    originalPrice: 2359000,
    image: 'https://via.placeholder.com/300x200?text=Adidas+Forum+Low',
    isNew: true,
    isHotSale: true,
    discountPercentage: 15,
    rating: 4.5,
  },
  {
    id: 8,
    name: 'Giày Adidas Ultraboost 5.0 DNA Nữ - Hồng',
    brand: 'Adidas',
    price: 3390000,
    originalPrice: 3900000,
    image: 'https://via.placeholder.com/300x200?text=Adidas+Ultraboost+Pink',
    isNew: true,
    isExclusive: true,
    discountPercentage: 13,
    rating: 5,
  },
  {
    id: 9,
    name: "Giày Nike Air Force 1 Low '07 Nữ - Trắng",
    brand: 'Nike',
    price: 2500000,
    originalPrice: 2900000,
    image: 'https://via.placeholder.com/300x200?text=Nike+AF1+White',
    isNew: true,
    isHotSale: true,
    discountPercentage: 13,
    rating: 4,
  },
];

// Dữ liệu mẫu cho sản phẩm giảm giá
const onSaleProducts = [
  {
    id: 10,
    name: 'Giày Nike ZoomX Invincible Run Flyknit 3 - Đen',
    brand: 'Nike',
    price: 3500000,
    originalPrice: 4200000,
    image: 'https://via.placeholder.com/300x200?text=Nike+Invincible',
    isNew: false,
    isHotSale: true,
    discountPercentage: 16,
    rating: 4.5,
  },
  {
    id: 11,
    name: 'Giày Adidas NMD R1 Nam - Xám',
    brand: 'Adidas',
    price: 2000000,
    originalPrice: 2500000,
    image: 'https://via.placeholder.com/300x200?text=Adidas+NMD',
    isNew: false,
    isHotSale: true,
    discountPercentage: 20,
    rating: 4,
  },
];

// Dữ liệu mẫu cho danh mục
const categories = [
  {
    name: 'Giày thể thao',
    img: 'https://example.com/sports.jpg',
  },
  {
    name: 'Giày chạy bộ',
    img: 'https://example.com/running.jpg',
  },
  {
    name: 'Giày thời trang',
    img: 'https://example.com/fashion.jpg',
  },
  {
    name: 'Giày bóng đá',
    img: 'https://example.com/football.jpg',
  },
  {
    name: 'Giày sneaker',
    img: 'https://example.com/sneaker.jpg',
  },
  {
    name: 'Giày cao gót',
    img: 'https://example.com/heels.jpg',
  },
];

function ProductCard({ product }) {
  const displayPrice = product.originalPrice ? (
    <>
      <Text delete style={{ fontSize: '13px', color: '#999' }}>{product.originalPrice.toLocaleString('vi-VN')}đ</Text>
      <Text strong style={{ color: '#f5222d', marginLeft: '8px' }}>{product.price.toLocaleString('vi-VN')}đ</Text>
    </>
  ) : (
    <Text strong style={{ color: '#333' }}>{product.price.toLocaleString('vi-VN')}đ</Text>
  );

  return (
    <Card
      hoverable
      style={{ width: '100%', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}
      cover={
        <div style={{ position: 'relative', height: 200, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img alt={product.name} src={product.image} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {product.isHotSale && <Tag color="red" style={{ margin: 0, borderRadius: '0 8px 8px 0' }} icon={<span style={{ marginRight: 5 }}>⭐</span>}>SIÊU SALE</Tag>}
            {product.isNew && <Tag color="blue" style={{ margin: 0, borderRadius: '0 8px 8px 0' }} icon={<span style={{ marginRight: 5 }}>✈️</span>}>HÀNG MỚI VỀ</Tag>}
            {product.isExclusive && <Tag color="gold" style={{ margin: 0, borderRadius: '0 8px 8px 0' }} icon={<span style={{ marginRight: 5 }}>✨</span>}>ĐỘC QUYỀN</Tag>}
          </div>

          {product.discountPercentage && (
            <Tag color="red" style={{ position: 'absolute', top: 0, right: 0, borderRadius: '0 0 0 8px', fontSize: '13px', padding: '4px 8px' }}>
              -{product.discountPercentage}%
            </Tag>
          )}
        </div>
      }
      bodyStyle={{ padding: '12px 16px' }}
    >
      <Card.Meta
        title={
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}>{product.brand}</Text>
            <Title level={5} ellipsis={{ rows: 2 }} style={{ margin: '0 0 4px', height: 'auto' }}>{product.name}</Title>
            {displayPrice}
          </div>
        }
      />
      <Link to={`/products/${product.id}`} style={{ display: 'block', marginTop: '12px' }}>
        <Button type="primary" block>Xem chi tiết</Button>
      </Link>
    </Card>
  );
}

function Home() {
  return (
    <div>
      {/* <Header /> */}
      <HeroSection />

      <div style={{ padding: '40px 10%' }}>
        <Divider orientation="left"><Title level={3}>Sản phẩm nổi bật</Title></Divider>
        <Row gutter={[24, 24]}>
          {featuredProducts.map(product => (
            <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        <Divider orientation="left"><Title level={3}>Sản phẩm mới về</Title></Divider>
        <Row gutter={[24, 24]}>
          {newArrivals.map(product => (
            <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        <Divider orientation="left"><Title level={3}>Giày đang giảm giá</Title></Divider>
        <Row gutter={[24, 24]}>
          {onSaleProducts.map(product => (
            <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        <Divider orientation="left"><Title level={3}>Khám phá theo danh mục</Title></Divider>
        <Row gutter={[16, 16]} justify="center">
          {categories.map((category, idx) => (
            <Col key={idx} xs={12} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
              <Card
                hoverable
                cover={<img alt={category.name} src={category.img} style={{ height: 100, objectFit: 'cover' }} />}
              >
                <Card.Meta title={category.name} />
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/products">
            <Button type="primary" size="large">Xem tất cả sản phẩm</Button>
          </Link>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default Home; 