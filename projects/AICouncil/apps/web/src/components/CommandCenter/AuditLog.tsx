import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Spin, DatePicker } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';

export const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/commander/audit/logs?limit=100');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
    setLoading(false);
  };

  const columns = [
    { 
      title: 'Timestamp', 
      dataIndex: 'timestamp', 
      key: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString(),
      width: 180
    },
    { title: 'Actor', dataIndex: 'actor', key: 'actor', width: 120 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 150 },
    { title: 'Resource', dataIndex: 'resource_type', key: 'resource_type', width: 120 },
    { title: 'Details', dataIndex: ['details', 'description'], key: 'details', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <Space>
          <Button size="small">View</Button>
        </Space>
      )
    }
  ];

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="Filters" type="inner">
          <Space wrap>
            <Input.Search 
              placeholder="Search logs..." 
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Select placeholder="Filter by actor" style={{ width: 150 }} />
            <Select placeholder="Filter by action" style={{ width: 150 }} />
            <DatePicker.RangePicker />
            <Button type="primary" icon={<DownloadOutlined />}>Export</Button>
          </Space>
        </Card>

        <Card title={`Audit Logs (${logs.length})`}>
          <Table 
            columns={columns} 
            dataSource={logs} 
            rowKey="log_id"
            pagination={{ pageSize: 20 }}
            size="small"
          />
        </Card>
      </Space>
    </Spin>
  );
};

export default AuditLog;
