import React from 'react';
import { Carousel, Row, Col, Card, Button, Typography, Divider } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const bannerImages = [
  'https://via.placeholder.com/1200x350/FF6347/FFFFFF?text=GiayDep+Moi+Nhat', // Placeholder for new shoe banner
  'https://via.placeholder.com/1200x350/4682B4/FFFFFF?text=Bo+Suu+Tap+Giay+The+Thao' // Placeholder for new shoe banner
];

const allProducts = [
  { id: 1, name: 'Giày Thể Thao Nike Air Max', price: 2000000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Nike+Air+Max', isNew: true, isOnSale: false },
  { id: 2, name: 'Giày Chạy Bộ Adidas Ultra Boost', price: 2500000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Adidas+Ultra+Boost', isNew: true, isOnSale: false },
  { id: 3, name: 'Giày Thời Trang Puma RS-X', price: 1800000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Puma+RS-X', isNew: false, isOnSale: true, discount: '10%' },
  { id: 4, name: 'Giày Bóng Rổ Nike Jordan', price: 3200000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Nike+Jordan', isNew: false, isOnSale: false },
  { id: 5, name: 'Giày Sneaker Adidas Stan Smith', price: 2100000, oldPrice: 2500000, img: 'https://via.placeholder.com/300x200?text=Adidas+Stan+Smith', isNew: false, isOnSale: true, discount: '15%' },
  { id: 6, name: 'Giày Da Lộn Puma Suede', price: 1500000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Puma+Suede', isNew: true, isOnSale: false },
  { id: 7, name: 'Giày Cao Gót Nữ Thanh Lịch', price: 950000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Giay+Cao+Got', isNew: true, isOnSale: false },
  { id: 8, name: 'Giày Lười Nam Công Sở', price: 1200000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Giay+Loi+Nam', isNew: false, isOnSale: true, discount: '20%' },
  { id: 9, name: 'Giày Boot Nữ Cá Tính', price: 1800000, oldPrice: null, img: 'https://via.placeholder.com/300x200?text=Giay+Boot+Nu', isNew: false, isOnSale: false },
];

const featuredProducts = allProducts.slice(0, 3);
const newArrivals = allProducts.filter(p => p.isNew).slice(0, 3);
const onSaleProducts = allProducts.filter(p => p.isOnSale).slice(0, 3);

const categories = [
  { name: 'Giày Thể Thao', img: 'https://via.placeholder.com/150x100?text=The+Thao' },
  { name: 'Giày Chạy Bộ', img: 'https://via.placeholder.com/150x100?text=Chay+Bo' },
  { name: 'Giày Thời Trang', img: 'https://via.placeholder.com/150x100?text=Thoi+Trang' },
  { name: 'Giày Công Sở', img: 'https://via.placeholder.com/150x100?text=Cong+So' },
  { name: 'Giày Cao Gót', img: 'https://via.placeholder.com/150x100?text=Cao+Got' },
  { name: 'Giày Sandal', img: 'https://via.placeholder.com/150x100?text=Sandal' },
];

function ProductCard({ product }) {
  return (
    <Card
      hoverable
      cover={<img alt={product.name} src={product.img} style={{ height: '200px', objectFit: 'cover' }} />}
    >
      <Card.Meta
        title={product.name}
        description={
          <>
            <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>Giá: {product.price.toLocaleString()}đ</span>
            {product.oldPrice && <span style={{ textDecoration: 'line-through', marginLeft: '10px', color: '#999' }}>{product.oldPrice.toLocaleString()}đ</span>}
            {product.discount && <span style={{ marginLeft: '10px', color: '#2ecc71', fontWeight: 'bold' }}>-{product.discount}</span>}
          </>
        }
      />
      <Link to={`/products/${product.id}`}>
        <Button type="primary" style={{ marginTop: 10 }} block>Xem chi tiết</Button>
      </Link>
    </Card>
  );
}

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <Carousel autoplay>
        {bannerImages.map((img, idx) => (
          <div key={idx}>
            <img src={img} alt="banner" style={{ width: '100%', height: 400, objectFit: 'cover' }} />
          </div>
        ))}
      </Carousel>

      <Divider orientation="left">Sản phẩm nổi bật</Divider>
      <Row gutter={[16, 16]}>
        {featuredProducts.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      <Divider orientation="left">Sản phẩm mới về</Divider>
      <Row gutter={[16, 16]}>
        {newArrivals.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      <Divider orientation="left">Giày đang giảm giá</Divider>
      <Row gutter={[16, 16]}>
        {onSaleProducts.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      <Divider orientation="left">Khám phá theo danh mục</Divider>
      <Row gutter={[16, 16]} justify="center">
        {categories.map((category, idx) => (
          <Col key={idx} xs={12} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
            <Card
              hoverable
              cover={<img alt={category.name} src={category.img} style={{ height: '100px', objectFit: 'cover' }} />}
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
  );
}

export default Home; 