import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Spin, Row, Col, Card, Statistic, Button, Modal, Form, Input, Select, Space } from 'antd';
import {
  ControlOutlined,
  FileTextOutlined,
  RobotOutlined,
  UserOutlined,
  BarChartOutlined,
  AuditOutlined,
  SettingOutlined,
  PlusOutlined,
  RefreshOutlined
} from '@ant-design/icons';

import CommandCenterHeader from '../components/CommandCenter/Header';
import Navigation from '../components/CommandCenter/Navigation';
import OperationsPanel from '../components/CommandCenter/OperationsPanel';
import RAGManager from '../components/CommandCenter/RAGManager';
import AgentMarketplace from '../components/CommandCenter/AgentMarketplace';
import UserManagement from '../components/CommandCenter/UserManagement';
import AnalyticsDash from '../components/CommandCenter/AnalyticsDash';
import AuditLog from '../components/CommandCenter/AuditLog';
import WorkflowBuilder from '../components/CommandCenter/WorkflowBuilder';

const { Sider, Content } = Layout;

export const CommandCenter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('operations');
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeAgents: 0,
    documentsIndexed: 0,
    activeUsers: 0
  });

  useEffect(() => {
    loadSystemHealth();
    const interval = setInterval(loadSystemHealth, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    try {
      const response = await fetch('/api/commander/system/health');
      const data = await response.json();
      setSystemHealth(data);
    } catch (error) {
      console.error('Failed to load system health:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'operations':
        return <OperationsPanel />;
      case 'rag':
        return <RAGManager />;
      case 'agents':
        return <AgentMarketplace />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <AnalyticsDash />;
      case 'audit':
        return <AuditLog />;
      case 'workflows':
        return <WorkflowBuilder />;
      case 'system':
        return <SystemAdmin />;
      default:
        return <OperationsPanel />;
    }
  };

  const tabItems = [
    {
      key: 'operations',
      label: <><ControlOutlined /> Operations</>,
      children: null
    },
    {
      key: 'rag',
      label: <><FileTextOutlined /> RAG Management</>,
      children: null
    },
    {
      key: 'agents',
      label: <><RobotOutlined /> Agent Marketplace</>,
      children: null
    },
    {
      key: 'users',
      label: <><UserOutlined /> Users & Tenants</>,
      children: null
    },
    {
      key: 'analytics',
      label: <><BarChartOutlined /> Analytics</>,
      children: null
    },
    {
      key: 'audit',
      label: <><AuditOutlined /> Audit Logs</>,
      children: null
    },
    {
      key: 'workflows',
      label: <>⚙️ Workflows</>,
      children: null
    },
    {
      key: 'system',
      label: <><SettingOutlined /> System</>,
      children: null
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={250}
      >
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </Sider>

      <Layout>
        <CommandCenterHeader onRefresh={loadSystemHealth} />
        
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          {systemHealth && (
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="System Status"
                    value={systemHealth.status}
                    valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Active Services"
                    value={7}
                    suffix="/ 7"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Uptime"
                    value={Math.floor((systemHealth.uptime_seconds || 0) / 3600)}
                    suffix="h"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="API Version"
                    value="2.0.0"
                  />
                </Card>
              </Col>
            </Row>
          )}

          <Card style={{ background: '#fff', borderRadius: '8px' }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              tabBarExtraContent={
                <Space>
                  <Button 
                    type="primary" 
                    icon={<RefreshOutlined />}
                    onClick={loadSystemHealth}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                </Space>
              }
            />
            
            <div style={{ marginTop: '24px' }}>
              {renderTabContent()}
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

// System Admin Component
const SystemAdmin: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    setLoading(true);
    try {
      const [configRes, healthRes] = await Promise.all([
        fetch('/api/commander/system/config'),
        fetch('/api/commander/system/health')
      ]);
      setConfig(await configRes.json());
      setHealth(await healthRes.json());
    } catch (error) {
      console.error('Failed to load system info:', error);
    }
    setLoading(false);
  };

  const triggerBackup = async () => {
    try {
      const response = await fetch('/api/commander/system/backup', { method: 'POST' });
      const data = await response.json();
      Modal.success({
        title: 'Backup Started',
        content: `Backup ${data.backup_id} initiated successfully`
      });
    } catch (error) {
      Modal.error({
        title: 'Backup Failed',
        content: 'Failed to start backup'
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="System Configuration">
          <Form layout="vertical">
            <Form.Item label="Log Level">
              <Input value="INFO" readOnly />
            </Form.Item>
            <Form.Item label="Max Workers">
              <Input value="4" type="number" />
            </Form.Item>
            <Form.Item label="Timeout (seconds)">
              <Input value="30" type="number" />
            </Form.Item>
            <Button type="primary">Save Configuration</Button>
          </Form>
        </Card>

        <Card title="Backup & Restore">
          <Space>
            <Button type="primary" onClick={triggerBackup}>
              Trigger Backup Now
            </Button>
            <Button>List Backups</Button>
            <Button danger>Restore from Backup</Button>
          </Space>
        </Card>

        {health && (
          <Card title="System Health Details">
            <Row gutter={16}>
              {Object.entries(health.databases || {}).map(([key, value]: any) => (
                <Col xs={24} sm={12} key={key}>
                  <Card size="small">
                    <Statistic
                      title={key.toUpperCase()}
                      value={value.status}
                      valueStyle={{
                        color: value.status === 'connected' ? '#52c41a' : '#ff7875'
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </Space>
    </Spin>
  );
};

export default CommandCenter;
