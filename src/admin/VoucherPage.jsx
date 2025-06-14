import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, InputNumber, Popconfirm } from 'antd';
import { TagOutlined, FileTextOutlined, CalendarOutlined, PoundOutlined, NumberOutlined, AlignLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../styles/AdminPanel.css'; // Import the CSS file
import ProductManagementPage from './ProductManagementPage'; // Đảm bảo import này vẫn ở đó

const { Option } = Select;

export default function VoucherPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu giả định cho voucher
  const [vouchers, setVouchers] = useState([
    {
      ID: '1',
      MaVoucher: 'VC001',
      TenVoucher: 'Giảm giá 10% cho đơn hàng đầu tiên',
      LoaiVoucher: 'Phần trăm',
      MoTa: 'Áp dụng cho khách hàng mới.',
      SoLuong: 100,
      GiaTri: 10,
      NgayBatDau: '2023-01-01',
      NgayKetThuc: '2023-12-31',
      NgayTao: '2022-12-01',
      TrangThai: 'Đang hoạt động',
      DonToiThieu: 100000,
    },
    {
      ID: '2',
      MaVoucher: 'VC002',
      TenVoucher: 'Giảm giá 50k cho đơn hàng trên 500k',
      LoaiVoucher: 'Số tiền',
      MoTa: 'Áp dụng cho mọi đơn hàng.',
      SoLuong: 50,
      GiaTri: 50000,
      NgayBatDau: '2023-03-01',
      NgayKetThuc: '2023-09-30',
      NgayTao: '2023-02-15',
      TrangThai: 'Tạm ngưng',
      DonToiThieu: 500000,
    },
  ]);

  const columns = [
    { title: 'Mã Voucher', dataIndex: 'MaVoucher', key: 'MaVoucher' },
    { title: 'Tên Voucher', dataIndex: 'TenVoucher', key: 'TenVoucher' },
    { title: 'Loại Voucher', dataIndex: 'LoaiVoucher', key: 'LoaiVoucher' },
    { title: 'Mô Tả', dataIndex: 'MoTa', key: 'MoTa' },
    { title: 'Số Lượng', dataIndex: 'SoLuong', key: 'SoLuong' },
    { title: 'Giá Trị', dataIndex: 'GiaTri', key: 'GiaTri' },
    { title: 'Ngày Bắt Đầu', dataIndex: 'NgayBatDau', key: 'NgayBatDau' },
    { title: 'Ngày Kết Thúc', dataIndex: 'NgayKetThuc', key: 'NgayKetThuc' },
    { title: 'Ngày Tạo', dataIndex: 'NgayTao', key: 'NgayTao' },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    { title: 'Đơn Tối Thiểu', dataIndex: 'DonToiThieu', key: 'DonToiThieu' },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa voucher này?"
            onConfirm={() => message.info(`Bạn đã click Xóa voucher ${record.MaVoucher}`)}
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
    setEditingVoucher(null);
    form.resetFields();
  };

  const handleAdd = () => {
    setEditingVoucher(null);
    form.resetFields();
    showModal();
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    form.setFieldsValue({
      ...voucher,
      NgayBatDau: voucher.NgayBatDau ? moment(voucher.NgayBatDau) : null,
      NgayKetThuc: voucher.NgayKetThuc ? moment(voucher.NgayKetThuc) : null,
      NgayTao: voucher.NgayTao ? moment(voucher.NgayTao) : null,
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingVoucher) {
      message.success('Cập nhật voucher thành công (chỉ giao diện)!');
    } else {
      message.success('Thêm voucher thành công (chỉ giao diện)!');
    }
    handleCancel();
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Voucher</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Voucher Mới</Button>
      </div>
      <Table dataSource={vouchers} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingVoucher ? "Sửa Voucher" : "Thêm Voucher"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Ẩn footer mặc định của Modal
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ LoaiVoucher: 'Phần trăm', TrangThai: 'Đang hoạt động' }}
        >
          <Form.Item
            name="MaVoucher"
            label="Mã Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Voucher!' }]
          }>
            <Input prefix={<TagOutlined />} placeholder="Mã Voucher" />
          </Form.Item>
          <Form.Item
            name="TenVoucher"
            label="Tên Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Voucher!' }]
          }>
            <Input prefix={<TagOutlined />} placeholder="Tên Voucher" />
          </Form.Item>
          <Form.Item
            name="LoaiVoucher"
            label="Loại Voucher"
            rules={[{ required: true, message: 'Vui lòng chọn Loại Voucher!' }]
          }>
            <Select prefix={<TagOutlined />} placeholder="Chọn Loại Voucher">
              <Option value="Phần trăm">Phần trăm</Option>
              <Option value="Số tiền">Số tiền</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="MoTa"
            label="Mô Tả"
          >
            <Input.TextArea prefix={<AlignLeftOutlined />} placeholder="Mô Tả Voucher" />
          </Form.Item>
          <Form.Item
            name="SoLuong"
            label="Số Lượng"
            rules={[{ required: true, message: 'Vui lòng nhập Số Lượng!' }]
          }>
            <InputNumber min={1} style={{ width: '100%' }} prefix={<NumberOutlined />} placeholder="Số Lượng" />
          </Form.Item>
          <Form.Item
            name="GiaTri"
            label="Giá Trị"
            rules={[{ required: true, message: 'Vui lòng nhập Giá Trị!' }]
          }>
            <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\s?|(,*)/g, '')} prefix={<PoundOutlined />} placeholder="Giá Trị" />
          </Form.Item>
          <Form.Item
            name="NgayBatDau"
            label="Ngày Bắt Đầu"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Bắt Đầu!' }]
          }>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" prefix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item
            name="NgayKetThuc"
            label="Ngày Kết Thúc"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Kết Thúc!' }]
          }>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" prefix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]
          }>
            <Select placeholder="Chọn Trạng Thái">
              <Option value="Đang hoạt động">Đang hoạt động</Option>
              <Option value="Hết hạn">Hết hạn</Option>
              <Option value="Tạm ngưng">Tạm ngưng</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="DonToiThieu"
            label="Đơn Tối Thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập Đơn Tối Thiểu!' }]
          }>
            <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\s?|(,*)/g, '')} prefix={<PoundOutlined />} placeholder="Đơn Tối Thiểu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingVoucher ? "Cập Nhật" : "Thêm Mới"}
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