import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, InputNumber, Popconfirm } from 'antd';
import { TagOutlined, FileTextOutlined, CalendarOutlined, PoundOutlined, NumberOutlined, AlignLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import Swal from 'sweetalert2';
import '../styles/AdminPanel.css'; // Import the CSS file
import ProductManagementPage from './ProductManagementPage'; // Đảm bảo import này vẫn ở đó

const { Option } = Select;

export default function VoucherPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();
  const [vouchers, setVouchers] = useState([]);
  // Dữ liệu giả định cho voucher
  useEffect(() => {
    fetch('http://localhost:8080/api/voucher')
      .then(response => response.json())
      .then(data => setVouchers(data))
      .catch(error => console.error('Lỗi khi gọi API kích thước:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã Voucher', dataIndex: 'maVoucher', key: 'maVoucher' },
    { title: 'Tên Voucher', dataIndex: 'tenVoucher', key: 'tenVoucher' },
    { title: 'Loại Voucher', dataIndex: 'loaiVoucher', key: 'loaiVoucher' },
    { title: 'Mô Tả', dataIndex: 'moTa', key: 'moTa' },
    { title: 'Số Lượng', dataIndex: 'soLuong', key: 'soLuong' },
    { title: 'Giá Trị', dataIndex: 'giaTri', key: 'giaTri' },
    { title: 'Đơn Tối Thiểu', dataIndex: 'donToiThieu', key: 'donToiThieu' },
    { title: 'Ngày Bắt Đầu', dataIndex: 'ngayBatDau', key: 'ngayBatDau' },
    { title: 'Ngày Kết Thúc', dataIndex: 'ngayKetThuc', key: 'ngayKetThuc' },
    { title: 'Ngày Tạo', dataIndex: 'ngayTao', key: 'ngayTao' },
    { title: 'Trạng Thái', dataIndex: 'trangThai', key: 'trangThai' },
    
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
      ngayBatDau: voucher.ngayBatDau ? moment(voucher.ngayBatDau) : null,
      ngayKetThuc: voucher.ngayKetThuc ? moment(voucher.ngayKetThuc) : null,
      ngayTao: voucher.ngayTao ? moment(voucher.ngayTao) : null,
    });
    showModal();
  };

  const onFinish = (values) => {
    // Đảm bảo đúng định dạng dữ liệu gửi lên
    const dataSend = {
      ...values,
      trangThai: Number(values.trangThai),
      soLuong: Number(values.soLuong),
      giaTri: Number(values.giaTri),
      donToiThieu: Number(values.donToiThieu),
      ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('YYYY-MM-DDTHH:mm:ss') : null,
      ngayKetThuc: values.ngayKetThuc ? values.ngayKetThuc.format('YYYY-MM-DDTHH:mm:ss') : null,
    };
    if (editingVoucher) {
      // Sửa
      fetch(`http://localhost:8080/api/voucher/update/${editingVoucher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dataSend, id: editingVoucher.id }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Cập nhật thất bại');
          return response.json();
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành thành công',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          fetch('http://localhost:8080/api/voucher')
            .then(res => res.json())
            .then(data => setVouchers(data));
        })
        .catch(error => {
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thất bại',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          console.error(error);
        });
    } else {
      // Thêm mới
      fetch('http://localhost:8080/api/voucher/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend),
      })
        .then(response => {
          if (!response.ok) throw new Error('Thêm mới thất bại');
          return response.json();
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Thêm thành công',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          fetch('http://localhost:8080/api/voucher')
            .then(res => res.json())
            .then(data => setVouchers(data));
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Thêm thất bại',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            width: 250
          });
          console.error(error);
        });
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
          initialValues={{ loaiVoucher: 'Giảm giá %', trangThai: 1 }}
        >
          {editingVoucher && (
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            name="maVoucher"
            label="Mã Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Voucher!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Voucher" />
          </Form.Item>
          <Form.Item
            name="tenVoucher"
            label="Tên Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Voucher!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Voucher" />
          </Form.Item>
          <Form.Item
            name="loaiVoucher"
            label="Loại Voucher"
            rules={[{ required: true, message: 'Vui lòng chọn Loại Voucher!' }]}
          >
            <Select prefix={<TagOutlined />} placeholder="Chọn Loại Voucher">
              <Option value="Giảm giá số tiền">Giảm giá số tiền</Option>
              <Option value="Giảm giá %">Giảm giá %</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="moTa"
            label="Mô Tả"
          >
            <Input.TextArea prefix={<AlignLeftOutlined />} placeholder="Mô Tả Voucher" />
          </Form.Item>
          <Form.Item
            name="soLuong"
            label="Số Lượng"
            rules={[{ required: true, message: 'Vui lòng nhập Số Lượng!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} prefix={<NumberOutlined />} placeholder="Số Lượng" />
          </Form.Item>
          <Form.Item
            name="giaTri"
            label="Giá Trị"
            rules={[{ required: true, message: 'Vui lòng nhập Giá Trị!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\s?|(,*)/g, '')} prefix={<PoundOutlined />} placeholder="Giá Trị" />
          </Form.Item>
          <Form.Item
            name="ngayBatDau"
            label="Ngày Bắt Đầu"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Bắt Đầu!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" prefix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item
            name="ngayKetThuc"
            label="Ngày Kết Thúc"
            rules={[{ required: true, message: 'Vui lòng chọn Ngày Kết Thúc!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" prefix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value={1}>Đang hoạt động</Option>
              <Option value={0}>Tạm ngưng</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="donToiThieu"
            label="Đơn Tối Thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập Đơn Tối Thiểu!' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="Đơn Tối Thiểu"
            />
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