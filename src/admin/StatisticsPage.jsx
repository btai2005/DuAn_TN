import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Space, Divider, Select } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // 'month', 'week', 'day'

  // Dữ liệu giả định cho các số liệu thống kê theo tháng/tuần/ngày
  const statisticsData = {
    month: {
      totalRevenue: { value: 112893000, description: 'Doanh thu tháng này' },
      totalOrders: { value: 1128, description: 'Tổng Đơn Hàng tháng này' },
      newCustomers: { value: 93, description: 'Khách Hàng Mới tháng này' },
      productsSold: { value: 2000, description: 'Sản Phẩm Đã Bán tháng này' },
    },
    week: {
      totalRevenue: { value: 25000000, description: 'Doanh thu tuần này' },
      totalOrders: { value: 250, description: 'Tổng Đơn Hàng tuần này' },
      newCustomers: { value: 20, description: 'Khách Hàng Mới tuần này' },
      productsSold: { value: 450, description: 'Sản Phẩm Đã Bán tuần này' },
    },
    day: {
      totalRevenue: { value: 3500000, description: 'Doanh thu hôm nay' },
      totalOrders: { value: 30, description: 'Tổng Đơn Hàng hôm nay' },
      newCustomers: { value: 5, description: 'Khách Hàng Mới hôm nay' },
      productsSold: { value: 80, description: 'Sản Phẩm Đã Bán hôm nay' },
    },
  };

  const currentStats = statisticsData[selectedPeriod];

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <Title className="page-title" level={2}>Thống Kê Tổng Quan</Title>
        <Space>
          <Select defaultValue="month" style={{ width: 120 }} onChange={handlePeriodChange}>
            <Option value="month">Theo Tháng</Option>
            <Option value="week">Theo Tuần</Option>
            <Option value="day">Theo Ngày</Option>
          </Select>
        </Space>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={currentStats.totalRevenue.description}
              value={currentStats.totalRevenue.value}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={currentStats.totalOrders.description}
              value={currentStats.totalOrders.value}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={currentStats.newCustomers.description}
              value={currentStats.newCustomers.value}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={currentStats.productsSold.description}
              value={currentStats.productsSold.value}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Thống Kê Chi Tiết</Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Doanh Thu Hàng Tháng">
            {/* Biểu đồ doanh thu sẽ được thêm vào đây */}
            <p>Biểu đồ doanh thu theo tháng...</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Sản Phẩm Bán Chạy Nhất">
            {/* Danh sách sản phẩm bán chạy sẽ được thêm vào đây */}
            <p>Top sản phẩm bán chạy...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default StatisticsPage; 