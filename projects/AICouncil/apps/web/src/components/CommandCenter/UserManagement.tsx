import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Spin, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, tenantsRes] = await Promise.all([
        fetch('/api/commander/users'),
        fetch('/api/commander/tenants')
      ]);
      setUsers((await usersRes.json()).users || []);
      setTenants((await tenantsRes.json()).tenants || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const userColumns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      )
    }
  ];

  const tenantColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Organization', dataIndex: 'organization', key: 'organization' },
    { title: 'Data Residency', dataIndex: 'data_residency', key: 'data_residency' },
    { title: 'Users', dataIndex: 'user_count', key: 'user_count' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: 'users',
      label: 'Users',
      children: (
        <Spin spinning={loading}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Add User
            </Button>
            <Table columns={userColumns} dataSource={users} rowKey="user_id" pagination={{ pageSize: 10 }} />
          </Space>
        </Spin>
      )
    },
    {
      key: 'tenants',
      label: 'Tenants',
      children: (
        <Spin spinning={loading}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" icon={<PlusOutlined />}>
              Create Tenant
            </Button>
            <Table columns={tenantColumns} dataSource={tenants} rowKey="tenant_id" pagination={{ pageSize: 10 }} />
          </Space>
        </Spin>
      )
    }
  ];

  return (
    <Spin spinning={loading}>
      <Card>
        <Tabs items={tabItems} />

        <Modal title="Create User" open={modalOpen} onCancel={() => setModalOpen(false)}>
          <Form form={form} layout="vertical">
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Role" name="role" initialValue="user">
              <Select options={[
                { label: 'User', value: 'user' },
                { label: 'Admin', value: 'admin' }
              ]} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Spin>
  );
};

export default UserManagement;
