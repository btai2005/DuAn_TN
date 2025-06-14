import React from 'react';
import { Row, Col, Card, Button, Select, Input } from 'antd';

const { Option } = Select;

// Dữ liệu mẫu sản phẩm
const products = [
  { id: 1, name: 'Giày Thể Thao Nike Air Max', price: 2000000, img: 'https://via.placeholder.com/300x200?text=Nike+Air+Max', brand: 'Nike', color: 'Đen' },
  { id: 2, name: 'Giày Chạy Bộ Adidas Ultra Boost', price: 2500000, img: 'https://via.placeholder.com/300x200?text=Adidas+Ultra+Boost', brand: 'Adidas', color: 'Trắng' },
  { id: 3, name: 'Giày Thời Trang Puma RS-X', price: 1800000, img: 'https://via.placeholder.com/300x200?text=Puma+RS-X', brand: 'Puma', color: 'Đỏ' },
  { id: 4, name: 'Giày Bóng Rổ Nike Jordan', price: 3200000, img: 'https://via.placeholder.com/300x200?text=Nike+Jordan', brand: 'Nike', color: 'Trắng' },
  { id: 5, name: 'Giày Sneaker Adidas Stan Smith', price: 2100000, img: 'https://via.placeholder.com/300x200?text=Adidas+Stan+Smith', brand: 'Adidas', color: 'Đen' },
  { id: 6, name: 'Giày Da Lộn Puma Suede', price: 1500000, img: 'https://via.placeholder.com/300x200?text=Puma+Suede', brand: 'Puma', color: 'Đỏ' },
];

function ProductList() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách sản phẩm</h2>
      <Row gutter={16}>
        <Col span={6}>
          {/* Bộ lọc */}
          <h3>Bộ lọc</h3>
          <Select placeholder="Thương hiệu" style={{ width: '100%', marginBottom: 10 }} allowClear>
            <Option value="Nike">Nike</Option>
            <Option value="Adidas">Adidas</Option>
            <Option value="Puma">Puma</Option>
          </Select>
          <Select placeholder="Màu sắc" style={{ width: '100%', marginBottom: 10 }} allowClear>
            <Option value="Đen">Đen</Option>
            <Option value="Trắng">Trắng</Option>
            <Option value="Đỏ">Đỏ</Option>
          </Select>
          <Input placeholder="Tìm kiếm tên giày..." style={{ width: '100%', marginBottom: 10 }} />
        </Col>
        <Col span={18}>
          <Row gutter={[16, 16]}>
            {products.map(product => (
              <Col span={8} key={product.id}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.img} />}
                >
                  <Card.Meta title={product.name} description={`Giá: ${product.price.toLocaleString()}đ`} />
                  <Button type="primary" style={{ marginTop: 10 }}>Xem chi tiết</Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ProductList; 