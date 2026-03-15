import React, { useState } from 'react';
import { Card, Row, Col, Statistic, LineChart, BarChart, Spin, Tabs } from 'antd';
import { TrendingUpOutlined, TeamOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';

export const AnalyticsDash: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [trendsRes, agentsRes, costsRes] = await Promise.all([
        fetch('/api/commander/analytics/consensus/trends?days=30'),
        fetch('/api/commander/analytics/agents/ranking'),
        fetch('/api/commander/analytics/costs/summary')
      ]);
      setAnalytics({
        trends: await trendsRes.json(),
        agents: await agentsRes.json(),
        costs: await costsRes.json()
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setLoading(false);
  };

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Spin spinning={loading}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Avg Consensus"
                  value={72}
                  suffix="%"
                  prefix={<TrendingUpOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={42}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Documents"
                  value={1245}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Monthly Cost"
                  value={1234}
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      )
    },
    {
      key: 'consensus',
      label: 'Consensus Trends',
      children: <Card>Consensus trends chart</Card>
    },
    {
      key: 'agents',
      label: 'Agent Performance',
      children: <Card>Agent ranking and performance metrics</Card>
    },
    {
      key: 'costs',
      label: 'Cost Analysis',
      children: (
        <Card>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Statistic title="Current Month" value={1234} prefix="$" />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic title="Projected" value={1400} prefix="$" />
            </Col>
          </Row>
        </Card>
      )
    }
  ];

  return <Tabs items={tabItems} />;
};

export default AnalyticsDash;
