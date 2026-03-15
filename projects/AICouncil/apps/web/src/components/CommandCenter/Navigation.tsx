import React from 'react';
import { Menu } from 'antd';
import {
  ControlOutlined,
  FileTextOutlined,
  RobotOutlined,
  UserOutlined,
  BarChartOutlined,
  AuditOutlined,
  SettingOutlined,
  HomeOutlined
} from '@ant-design/icons';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Dashboard'
    },
    {
      type: 'divider'
    },
    {
      key: 'operations',
      icon: <ControlOutlined />,
      label: 'Council Operations'
    },
    {
      key: 'rag',
      icon: <FileTextOutlined />,
      label: 'RAG Management'
    },
    {
      key: 'agents',
      icon: <RobotOutlined />,
      label: 'Agent Marketplace'
    },
    {
      type: 'divider'
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users & Tenants'
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics'
    },
    {
      key: 'audit',
      icon: <AuditOutlined />,
      label: 'Audit Logs'
    },
    {
      type: 'divider'
    },
    {
      key: 'workflows',
      icon: <>⚙️</>,
      label: 'Workflows'
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: 'System Admin'
    }
  ];

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '0 16px',
        marginBottom: '16px'
      }}>
        ⚡ Command Center
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeTab]}
        onClick={(e) => onTabChange(e.key)}
        items={menuItems}
      />
    </div>
  );
};

export default Navigation;
