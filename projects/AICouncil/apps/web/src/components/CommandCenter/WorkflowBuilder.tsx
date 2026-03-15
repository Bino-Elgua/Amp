import React, { useState } from 'react';
import { Card, Button, Table, Space, Modal, Form, Input, Spin, Row, Col } from 'antd';
import { PlusOutlined, PlayCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const WorkflowBuilder: React.FC = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/commander/marketplace/workflows');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
    setLoading(false);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Steps', dataIndex: 'steps', key: 'steps', render: (steps: any) => steps?.length || 0 },
    { title: 'Status', dataIndex: 'enabled', key: 'enabled', render: (enabled: boolean) => enabled ? '✓ Enabled' : '✗ Disabled' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<PlayCircleOutlined />}>Execute</Button>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
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
            <Card>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{workflows.length}</div>
              <div style={{ color: '#666' }}>Total Workflows</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{workflows.filter((w: any) => w.enabled).length}</div>
              <div style={{ color: '#666' }}>Enabled</div>
            </Card>
          </Col>
        </Row>

        <Card title="Workflow Management">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} style={{ marginBottom: '16px' }}>
            Create Workflow
          </Button>
          <Table columns={columns} dataSource={workflows} rowKey="workflow_id" pagination={{ pageSize: 10 }} size="small" />
        </Card>

        <Modal
          title="Create Workflow"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Workflow Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Spin>
  );
};

export default WorkflowBuilder;
