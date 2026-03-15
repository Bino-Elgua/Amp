import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, Spin, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

export const AgentMarketplace: React.FC = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/commander/marketplace/agents');
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
    setLoading(false);
  };

  const handleCreateAgent = async (values: any) => {
    try {
      const response = await fetch('/api/commander/marketplace/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      Modal.success({ title: 'Agent Created', content: `ID: ${data.agent_id}` });
      setModalOpen(false);
      form.resetFields();
      loadAgents();
    } catch (error) {
      Modal.error({ title: 'Creation Failed' });
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Role', dataIndex: 'role', key: 'role', width: 120 },
    { title: 'Model', dataIndex: 'model', key: 'model', width: 120 },
    { title: 'Status', dataIndex: 'enabled', key: 'enabled', render: (enabled: boolean) => enabled ? '✓ Enabled' : '✗ Disabled' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
          <Button size="small" icon={<CopyOutlined />}>Clone</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Total Agents" value={agents.length} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Enabled" value={agents.filter((a: any) => a.enabled).length} />
          </Col>
        </Row>

        <Card title="Agent Marketplace">
          <Space style={{ marginBottom: '16px' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Create New Agent
            </Button>
          </Space>
          <Table columns={columns} dataSource={agents} rowKey="agent_id" pagination={{ pageSize: 10 }} size="small" />
        </Card>

        <Modal
          title="Create New Agent"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateAgent}>
            <Form.Item label="Agent Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Role" name="role" rules={[{ required: true }]}>
              <Select options={[
                { label: 'Logic', value: 'logic' },
                { label: 'Ethics', value: 'ethics' },
                { label: 'Risk Assessment', value: 'risk_assessment' },
                { label: 'Creative', value: 'creative' },
                { label: 'Technical', value: 'technical' }
              ]} />
            </Form.Item>
            <Form.Item label="Model" name="model" initialValue="gpt-4">
              <Select options={[
                { label: 'GPT-4', value: 'gpt-4' },
                { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
                { label: 'Claude', value: 'claude' }
              ]} />
            </Form.Item>
            <Form.Item label="System Prompt" name="system_prompt" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Spin>
  );
};

export default AgentMarketplace;
