import React from 'react';
import { Row, Col, Image, Button, Select, InputNumber, Typography } from 'antd';

const { Option } = Select;
const { Title, Paragraph } = Typography;

// Dữ liệu mẫu sản phẩm
const product = {
  id: 1,
  name: 'Giày Thể Thao Nike Air Max',
  price: 2000000,
  img: 'https://via.placeholder.com/400x300?text=Chi+Tiet+Giay+Nike',
  description: 'Giày Nike Air Max với thiết kế hiện đại, êm ái, phù hợp cho mọi hoạt động thể thao và đi chơi.',
  sizes: [38, 39, 40, 41, 42]
};

function ProductDetail() {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={32}>
        <Col span={10}>
          <Image src={product.img} alt={product.name} />
        </Col>
        <Col span={14}>
          <Title level={2}>{product.name}</Title>
          <Title level={4} type="danger">Giá: {product.price.toLocaleString()}đ</Title>
          <Paragraph>{product.description}</Paragraph>
          <div style={{ margin: '16px 0' }}>
            <span>Chọn size: </span>
            <Select placeholder="Size" style={{ width: 100, marginRight: 16 }}>
              {product.sizes.map(size => (
                <Option value={size} key={size}>{size}</Option>
              ))}
            </Select>
            <span>Số lượng: </span>
            <InputNumber min={1} max={10} defaultValue={1} style={{ width: 80, marginLeft: 8 }} />
          </div>
          <Button type="primary" size="large">Thêm vào giỏ hàng</Button>
        </Col>
      </Row>
    </div>
  );
}

export default ProductDetail; 