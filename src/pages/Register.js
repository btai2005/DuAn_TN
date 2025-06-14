import React from 'react';
import { Form, Input, Button, Typography, Divider } from 'antd';

const { Title } = Typography;

function Register() {
  const onFinish = (values) => {
    // Xử lý đăng ký ở đây
    alert('Đăng ký thành công!');
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <Title level={2}>Đăng ký</Title>
      <Divider />
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}> 
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> 
          <Input.Password />
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu" name="confirm" dependencies={["password"]} rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Register; 