import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/SalePage.css';

const SalePage = () => {
  const saleProducts = [
    {
      id: 1,
      name: 'Sản phẩm 1',
      originalPrice: '1.000.000đ',
      salePrice: '800.000đ',
      discount: '20%',
      image: 'https://via.placeholder.com/200'
    },
    {
      id: 2,
      name: 'Sản phẩm 2',
      originalPrice: '2.000.000đ',
      salePrice: '1.500.000đ',
      discount: '25%',
      image: 'https://via.placeholder.com/200'
    },
    {
      id: 3,
      name: 'Sản phẩm 3',
      originalPrice: '3.000.000đ',
      salePrice: '2.100.000đ',
      discount: '30%',
      image: 'https://via.placeholder.com/200'
    }
  ];

  return (
    <Container className="sale-page py-5">
      <h1 className="text-center mb-4">Khuyến Mãi Hấp Dẫn</h1>
      <div className="sale-banner mb-5">
        <img 
          src="https://via.placeholder.com/1200x300" 
          alt="Banner khuyến mãi" 
          className="img-fluid rounded"
        />
      </div>
      
      <Row>
        {saleProducts.map((product) => (
          <Col key={product.id} md={4} className="mb-4">
            <Card className="h-100 sale-card">
              <div className="discount-badge">{product.discount}</div>
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <div className="price-info">
                  <span className="original-price">{product.originalPrice}</span>
                  <span className="sale-price">{product.salePrice}</span>
                </div>
                <button className="btn btn-primary w-100 mt-3">Mua Ngay</button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SalePage; 