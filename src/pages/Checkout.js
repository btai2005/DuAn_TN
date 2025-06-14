import React from 'react';
import { Form, Input, Button, Select, Typography, Divider } from 'antd';

const { Title } = Typography;
const { Option } = Select;

function Checkout() {
  const onFinish = (values) => {
    // Xử lý đặt hàng ở đây
    alert('Đặt hàng thành công!');
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Title level={2}>Thanh toán</Title>
      <Divider />
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ nhận hàng" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Phương thức thanh toán" name="payment" rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}> 
          <Select placeholder="Chọn phương thức">
            <Option value="cod">Thanh toán khi nhận hàng</Option>
            <Option value="bank">Chuyển khoản ngân hàng</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
            Xác nhận đặt hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Checkout; 