import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Upload } from 'antd';
import { ShoppingOutlined, TagOutlined, UploadOutlined } from '@ant-design/icons';
import '../styles/AdminPanel.css';
import useMauSacStore from './stores/mauSacStore';

const { Option } = Select;

export default function SanPhamPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Trạng thái cho modal thêm màu sắc nhanh
  const [isAddMauSacModalVisible, setIsAddMauSacModalVisible] = useState(false);
  const [addMauSacForm] = Form.useForm();

  // Dữ liệu giả định cho các dropdown (khóa ngoại)
  const [thuongHieuData] = useState([
    { id: 'TH001', name: 'Nike' },
    { id: 'TH002', name: 'Adidas' },
    { id: 'TH003', name: 'Puma' },
  ]);
  const [xuatXuData] = useState([
    { id: 'XX001', name: 'Việt Nam' },
    { id: 'XX002', name: 'Trung Quốc' },
  ]);
  const [danhMucData] = useState([
    { id: 'DM001', name: 'Áo' },
    { id: 'DM002', name: 'Quần' },
  ]);
  const [khuyenMaiData] = useState([
    { id: 'KM001', name: 'Giảm 10%' },
    { id: 'KM002', name: 'Freeship' },
  ]);
  const [kichThuocData] = useState([
    { id: 'KT001', name: 'S' },
    { id: 'KT002', name: 'M' },
  ]);
  
  // Sử dụng dữ liệu màu sắc từ store
  const { mauSacData, addMauSac } = useMauSacStore();

  // Dữ liệu giả định cho sản phẩm
  const [data] = useState([
    {
      ID: '1',
      MaSanPham: 'SP001',
      TenSanPham: 'Áo thun Nike',
      ID_ThuongHieu: 'TH001',
      ID_XuatXu: 'XX001',
      ID_DanhMuc: 'DM001',
      TrangThai: 'Đang kinh doanh',
      ID_KhuyenMai: 'KM001',
      chiTiet: [
        { MaSanPhamChiTiet: 'CT001', SoLuong: 100, GiaBan: 200000, GiaGiamGia: 180000, ID_Size: 'KT001', ID_MauSac: 'MS001', Images: ['url1', 'url2'] },
        { MaSanPhamChiTiet: 'CT002', SoLuong: 50, GiaBan: 200000, GiaGiamGia: 0, ID_Size: 'KT002', ID_MauSac: 'MS002', Images: ['url3'] },
      ],
    },
    {
      ID: '2',
      MaSanPham: 'SP002',
      TenSanPham: 'Quần jean Adidas',
      ID_ThuongHieu: 'TH002',
      ID_XuatXu: 'XX002',
      ID_DanhMuc: 'DM002',
      TrangThai: 'Ngừng kinh doanh',
      ID_KhuyenMai: 'KM002',
      chiTiet: [
        { MaSanPhamChiTiet: 'CT003', SoLuong: 70, GiaBan: 350000, GiaGiamGia: 300000, ID_Size: 'KT001', ID_MauSac: 'MS002', Images: ['url4'] },
      ],
    },
  ]);

  const columns = [
    { title: 'Mã SP', dataIndex: 'MaSanPham', key: 'MaSanPham' },
    { title: 'Tên SP', dataIndex: 'TenSanPham', key: 'TenSanPham' },
    {
      title: 'Thương Hiệu',
      key: 'ID_ThuongHieu',
      render: (_, record) => (
        thuongHieuData.find(th => th.id === record.ID_ThuongHieu)?.name || 'N/A'
      ),
    },
    {
      title: 'Xuất Xứ',
      key: 'ID_XuatXu',
      render: (_, record) => (
        xuatXuData.find(xx => xx.id === record.ID_XuatXu)?.name || 'N/A'
      ),
    },
    {
      title: 'Danh Mục',
      key: 'ID_DanhMuc',
      render: (_, record) => (
        danhMucData.find(dm => dm.id === record.ID_DanhMuc)?.name || 'N/A'
      ),
    },
    { title: 'Trạng Thái', dataIndex: 'TrangThai', key: 'TrangThai' },
    {
      title: 'Khuyến Mãi',
      key: 'ID_KhuyenMai',
      render: (_, record) => (
        khuyenMaiData.find(km => km.id === record.ID_KhuyenMai)?.name || 'N/A'
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => message.info(`Bạn đã click Xóa sản phẩm ${record.MaSanPham}`)}
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
    });
    showModal();
  };

  const onFinish = (values) => {
    if (editingItem) {
      message.success('Cập nhật sản phẩm thành công (chỉ giao diện)!');
    } else {
      message.success('Thêm sản phẩm thành công (chỉ giao diện)!');
    }
    handleCancel();
  };

  // Cấu hình upload ảnh
  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // Trong phần modal thêm màu sắc nhanh
  const handleAddMauSac = (values) => {
    const newID = `MS${String(mauSacData.length + 1).padStart(3, '0')}`;
    const newItem = { ID: newID, MaMauSac: newID, ...values, TrangThai: 'Đang hoạt động' };
    addMauSac(newItem);
    message.success('Thêm màu sắc thành công!');
    addMauSacForm.resetFields();
    setIsAddMauSacModalVisible(false);

    // Tự động chọn màu sắc mới trong form sản phẩm nếu đang ở chế độ thêm/sửa chi tiết
    const chiTietList = form.getFieldValue('chiTiet') || [];
    if (chiTietList.length > 0) {
      const lastChiTiet = chiTietList[chiTietList.length - 1];
      form.setFieldsValue({
        chiTiet: [
          ...chiTietList.slice(0, -1),
          { ...lastChiTiet, ID_MauSac: newItem.ID }
        ]
      });
    }
  };

  return (
    <div className="admin-content-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý Sản Phẩm</h1>
        <Button type="primary" onClick={handleAdd}>Thêm Sản Phẩm Mới</Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="ID" pagination={false} />

      <Modal
        title={editingItem ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ TrangThai: 'Đang hoạt động' }}
        >
          <Form.Item
            name="MaSanPham"
            label="Mã Sản Phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Sản Phẩm!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Sản Phẩm" />
          </Form.Item>
          <Form.Item
            name="TenSanPham"
            label="Tên Sản Phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Sản Phẩm!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Sản Phẩm" />
          </Form.Item>
          <Form.Item
            name="ID_ThuongHieu"
            label="Thương Hiệu"
            rules={[{ required: true, message: 'Vui lòng chọn Thương Hiệu!' }]}
          >
            <Select placeholder="Chọn Thương Hiệu">
              {thuongHieuData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ID_XuatXu"
            label="Xuất Xứ"
            rules={[{ required: true, message: 'Vui lòng chọn Xuất Xứ!' }]}
          >
            <Select placeholder="Chọn Xuất Xứ">
              {xuatXuData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ID_DanhMuc"
            label="Danh Mục"
            rules={[{ required: true, message: 'Vui lòng chọn Danh Mục!' }]}
          >
            <Select placeholder="Chọn Danh Mục">
              {danhMucData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="TrangThai"
            label="Trạng Thái"
            rules={[{ required: true, message: 'Vui lòng chọn Trạng Thái!' }]}
          >
            <Select placeholder="Chọn Trạng Thái">
              <Option value="Đang kinh doanh">Đang kinh doanh</Option>
              <Option value="Ngừng kinh doanh">Ngừng kinh doanh</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ID_KhuyenMai"
            label="Khuyến Mãi"
          >
            <Select allowClear placeholder="Chọn Khuyến Mãi (Không bắt buộc)">
              {khuyenMaiData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Phần thêm/sửa Chi tiết sản phẩm (ví dụ: kích thước, màu sắc, số lượng, giá) */}
          <h3>Chi Tiết Sản Phẩm</h3>
          <Form.List name="chiTiet">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'MaSanPhamChiTiet']}
                      fieldKey={[fieldKey, 'MaSanPhamChiTiet']}
                      rules={[{ required: true, message: 'Missing Mã Chi Tiết SP' }]}
                    >
                      <Input placeholder="Mã Chi Tiết SP" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'ID_Size']}
                      fieldKey={[fieldKey, 'ID_Size']}
                      rules={[{ required: true, message: 'Missing Kích Thước' }]}
                    >
                      <Select placeholder="Kích Thước" style={{ width: 120 }}>
                        {kichThuocData.map(item => (
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'ID_MauSac']}
                      fieldKey={[fieldKey, 'ID_MauSac']}
                      rules={[{ required: true, message: 'Missing Màu Sắc' }]}
                    >
                      <Select placeholder="Màu Sắc" style={{ width: 120 }}>
                        {mauSacData.map(item => (
                          <Option key={item.ID} value={item.ID}>{item.TenMauSac}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'SoLuong']}
                      fieldKey={[fieldKey, 'SoLuong']}
                      rules={[{ required: true, message: 'Missing Số Lượng' }]}
                    >
                      <Input type="number" placeholder="Số Lượng" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'GiaBan']}
                      fieldKey={[fieldKey, 'GiaBan']}
                      rules={[{ required: true, message: 'Missing Giá Bán' }]}
                    >
                      <Input type="number" placeholder="Giá Bán" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'GiaGiamGia']}
                      fieldKey={[fieldKey, 'GiaGiamGia']}
                    >
                      <Input type="number" placeholder="Giá Giảm Giá (Không bắt buộc)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'Images']}
                      fieldKey={[fieldKey, 'Images']}
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      }}
                    >
                      <Upload {...props} listType="picture-card">
                        <Button icon={<UploadOutlined />}>Upload Ảnh</Button>
                      </Upload>
                    </Form.Item>
                    <Button type="danger" onClick={() => remove(name)}>Xóa</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<ShoppingOutlined />}>
                    Thêm Chi Tiết Sản Phẩm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

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

      {/* Modal thêm màu sắc nhanh */}
      <Modal
        title="Thêm Màu Sắc Mới"
        visible={isAddMauSacModalVisible}
        onCancel={() => {
          setIsAddMauSacModalVisible(false);
          addMauSacForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={addMauSacForm}
          layout="vertical"
          onFinish={handleAddMauSac}
          initialValues={{ TrangThai: 'Đang hoạt động' }}
        >
          <Form.Item
            name="MaMauSac"
            label="Mã Màu Sắc"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Màu Sắc!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Mã Màu Sắc" />
          </Form.Item>
          <Form.Item
            name="TenMauSac"
            label="Tên Màu Sắc"
            rules={[{ required: true, message: 'Vui lòng nhập Tên Màu Sắc!' }]}
          >
            <Input prefix={<TagOutlined />} placeholder="Tên Màu Sắc" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm Màu Mới
            </Button>
            <Button onClick={() => {
              setIsAddMauSacModalVisible(false);
              addMauSacForm.resetFields();
            }} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 