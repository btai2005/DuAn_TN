import React from 'react';
import { Form, Input, Button, Typography, Divider } from 'antd';

const { Title } = Typography;

function Login() {
  const onFinish = (values) => {
    // Xử lý đăng nhập ở đây
    alert('Đăng nhập thành công!');
  }; 

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <Title level={2}>Đăng nhập</Title>
      <Divider />
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}> 
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> 
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login; 