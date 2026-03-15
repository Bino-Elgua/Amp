import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, InputNumber, Button, Table, Space, Modal, Row, Col,
  Spin, Badge, Select, Empty, Divider, List
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';

export const OperationsPanel: React.FC = () => {
  const [form] = Form.useForm();
  const [sessions, setSessions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, agentsRes] = await Promise.all([
        fetch('/api/commander/council/sessions'),
        fetch('/api/commander/council/agents')
      ]);
      const sessionsData = await sessionsRes.json();
      const agentsData = await agentsRes.json();
      setSessions(sessionsData.sessions || []);
      setAgents(agentsData.agents || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const handleDeliberate = async (values: any) => {
    try {
      const response = await fetch('/api/commander/council/deliberate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: values.question,
          agent_count: values.agentCount || 3,
          temperature: values.temperature || 0.7,
          max_tokens: values.maxTokens || 2000,
          rag_enabled: values.ragEnabled || false
        })
      });
      const data = await response.json();
      Modal.success({
        title: 'Deliberation Started',
        content: `Session ID: ${data.session_id}`
      });
      form.resetFields();
      loadData();
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'Failed to start deliberation'
      });
    }
  };

  const handlePauseSession = async (sessionId: string) => {
    try {
      await fetch(`/api/commander/council/session/${sessionId}/pause`, { method: 'PATCH' });
      Modal.success({ title: 'Session Paused' });
      loadData();
    } catch (error) {
      Modal.error({ title: 'Error', content: 'Failed to pause session' });
    }
  };

  const handleResumeSession = async (sessionId: string) => {
    try {
      await fetch(`/api/commander/council/session/${sessionId}/resume`, { method: 'PATCH' });
      Modal.success({ title: 'Session Resumed' });
      loadData();
    } catch (error) {
      Modal.error({ title: 'Error', content: 'Failed to resume session' });
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    Modal.confirm({
      title: 'Cancel Session?',
      content: 'This will stop the deliberation and cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      onOk: async () => {
        try {
          await fetch(`/api/commander/council/session/${sessionId}`, { method: 'DELETE' });
          Modal.success({ title: 'Session Cancelled' });
          loadData();
        } catch (error) {
          Modal.error({ title: 'Error' });
        }
      }
    });
  };

  const sessionColumns = [
    {
      title: 'Session ID',
      dataIndex: 'session_id',
      key: 'session_id',
      width: 150,
      render: (text: string) => <code style={{ fontSize: '12px' }}>{text.slice(0, 8)}...</code>
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: 250,
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors: any = {
          active: 'processing',
          paused: 'warning',
          completed: 'success',
          cancelled: 'error'
        };
        return <Badge status={statusColors[status]} text={status.toUpperCase()} />;
      }
    },
    {
      title: 'Consensus',
      dataIndex: 'consensus_score',
      key: 'consensus_score',
      render: (score: number) => `${(score * 100).toFixed(1)}%`
    },
    {
      title: 'Agents',
      dataIndex: 'agent_count',
      key: 'agent_count'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedSession(record)}
          >
            View
          </Button>
          {record.status === 'active' && (
            <Button
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handlePauseSession(record.session_id)}
            >
              Pause
            </Button>
          )}
          {record.status === 'paused' && (
            <Button
              size="small"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleResumeSession(record.session_id)}
            >
              Resume
            </Button>
          )}
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleCancelSession(record.session_id)}
          >
            Cancel
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Trigger New Deliberation */}
        <Card title="Trigger New Deliberation" type="inner">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleDeliberate}
          >
            <Form.Item
              label="Question"
              name="question"
              rules={[{ required: true, message: 'Please enter a question' }]}
            >
              <Input.TextArea rows={3} placeholder="Enter the question for council deliberation..." />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Number of Agents"
                  name="agentCount"
                  initialValue={3}
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Temperature"
                  name="temperature"
                  initialValue={0.7}
                >
                  <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Max Tokens"
                  name="maxTokens"
                  initialValue={2000}
                >
                  <InputNumber min={100} max={4000} step={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                <PlayCircleOutlined /> Start Deliberation
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Divider />

        {/* Active Sessions */}
        <Card title={`Active Sessions (${sessions.length})`} type="inner">
          {sessions.length > 0 ? (
            <Table
              columns={sessionColumns}
              dataSource={sessions}
              rowKey="session_id"
              pagination={{ pageSize: 10 }}
              size="small"
            />
          ) : (
            <Empty description="No active sessions" />
          )}
        </Card>

        {/* Agents List */}
        <Card title={`Available Agents (${agents.length})`} type="inner">
          <List
            dataSource={agents}
            renderItem={(agent: any) => (
              <List.Item>
                <List.Item.Meta
                  title={agent.name}
                  description={`Role: ${agent.role} | Model: ${agent.model}`}
                />
                <Badge
                  status={agent.enabled ? 'success' : 'error'}
                  text={agent.enabled ? 'Enabled' : 'Disabled'}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Session Details Modal */}
        {selectedSession && (
          <Modal
            title="Session Details"
            open={!!selectedSession}
            onCancel={() => setSelectedSession(null)}
            width={800}
            footer={null}
          >
            <Divider>Question</Divider>
            <p>{selectedSession.question}</p>

            <Divider>Consensus Score</Divider>
            <p>{(selectedSession.consensus_score * 100).toFixed(2)}%</p>

            <Divider>Agent Votes</Divider>
            <List
              dataSource={selectedSession.votes || []}
              renderItem={(vote: any, index: number) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={`Agent ${index + 1}`}
                    description={`Vote: ${vote.vote} | Confidence: ${vote.confidence || 'N/A'}`}
                  />
                </List.Item>
              )}
            />
          </Modal>
        )}
      </Space>
    </Spin>
  );
};

export default OperationsPanel;
