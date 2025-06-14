import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Popconfirm } from 'antd';
import { GiftOutlined, TagOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../styles/AdminPanel.css';

const { Option } = Select;

export default function KhuyenMaiPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [data, setData] = useState([
    {
      ID: '1',
      MaKhuyenMai: 'KM001',
      TenKhuyenMai: 'Giảm giá Black Friday',
      LoaiKhuyenMai: 'Phần trăm',
      MoTa: 'Giảm 20% cho tất cả sản phẩm',
      GiaTri: 20,
      NgayBatDau: '2023-11-20',
      NgayKetThuc: '2023-11-27',
      TrangThai: 'Đang hoạt động',
      DonToiThieu: 100000,
    },
    {
      ID: '2',
      MaKhuyenMai: 'KM002',
      TenKhuyenMai: 'Miễn phí vận chuyển',
      LoaiKhuyenMai: 'Miễn phí vận chuyển',
      MoTa: 'Miễn phí vận chuyển cho đơn hàng trên 500K',
      GiaTri: 0,
      NgayBatDau: '2023-11-01',
      NgayKetThuc: '2023-11-30',
      TrangThai: 'Đang hoạt động',
      DonToiThieu: 500000,
    },
  ]);

  const columns = [
    { title: 'Mã KM', dataIndex: 'MaKhuyenMai', key: 'MaKhuyenMai' },
    { title: 'Tên KM', dataIndex: 'TenKhuyenMai', key: 'TenKhuyenMai' },
    { title: 'Loại KM', dataIndex: 'LoaiKhuyenMai', key: 'LoaiKhuyenMai' },
    { title: 'Mô Tả', dataIndex: 'MoTa', key: 'MoTa' },
    { title: 'Giá Trị', dataIndex: 'GiaTri', key: 'GiaTri' },
    { title: 'Ngày Bắt Đầu', dataIndex: 'NgayBatDau', key: 'NgayBatDau' },
    { title: 'Ngày Kết Thúc', dataIndex: 'NgayKetThuc', key: 'NgayKetThuc' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    { title: 'Đơn Tối Thiểu', dataIndex: 'DonToiThieu', key: 'DonToiThieu' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khuyến mãi này?"
            onConfirm={() => message.info(`Bạn đã click Xóa khuyến mãi ${record.MaKhuyenMai}`)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="danger">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    showModal();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      NgayBatDau: item.NgayBatDau ? moment(item.NgayBatDau) : null,
      NgayKetThuc: item.NgayKetThuc ? moment(item.NgayKetThuc) : null,
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      message.success('Cập nhật khuyến mãi thành công (chỉ giao diện)!');
    } else {
      message.success('Thêm khuyến mãi thành công (chỉ giao diện)!');
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Khuyến Mãi</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Khuyến Mãi Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ LoaiKhuyenMai: 'Phần trăm', TrangThai: 'Đang hoạt động' }}
        >
          <Form.Item
            name="MaKhuyenMai"
            label="Mã Khuyến Mãi"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Khuyến Mãi!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Khuyến Mãi" />
          </Form.Item>
          <Form.Item
            name="TenKhuyenMai"
            label="Tên Khuyến Mãi"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Khuyến Mãi!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Khuyến Mãi" />
          </Form.Item>
          <Form.Item
            name="LoaiKhuyenMai"
            label="Loại Khuyến Mãi"
            rules={[{ required: true, message: 'Vui lòng chọn Loại Khuyến Mãi!' }]}
          >
            <Select placeholder="Chọn Loại Khuyến Mãi">
              <Option value="Phần trăm">Phần trăm</Option>
              <Option value="Số tiền">Số tiền</Option>
              <Option value="Miễn phí vận chuyển">Miễn phí vận chuyển</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="MoTa"
            label="Mô Tả"
          >
            <Input.TextArea rows={2} placeholder="Mô tả khuyến mãi" />
          </Form.Item>
          <Form.Item
            name="GiaTri"
            label="Giá Trị (Phần trăm hoặc số tiền)"
            rules={[{ required: true, message: 'Vui lòng nhập Giá Trị!' }]}
          >
            <Input type="number" prefix={<TagOutlined />} placeholder="Giá Trị" />
          </Form.Item>
          <Form.Item
            name="NgayBatDau"
            label="Ngày Bắt Đầu"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Bắt Đầu!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="NgayKetThuc"
            label="Ngày Kết Thúc"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Kết Thúc!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value="Đang hoạt động">Đang hoạt động</Option>
              <Option value="Ngừng hoạt động">Ngừng hoạt động</Option>
              <Option value="Hết hạn">Hết hạn</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="DonToiThieu"
            label="Đơn Tối Thiểu Áp Dụng"
          >
            <Input type="number" prefix={<TagOutlined />} placeholder="Đơn Tối Thiểu (Không bắt buộc)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingItem ? "Cập Nhật" : "Thêm Mới"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 