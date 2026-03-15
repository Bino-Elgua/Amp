import React from 'react';
import { Layout, Button, Space, Dropdown, Menu, Badge, Avatar } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  RefreshOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Header } = Layout;

interface CommandCenterHeaderProps {
  onRefresh: () => void;
}

export const CommandCenterHeader: React.FC<CommandCenterHeaderProps> = ({ onRefresh }) => {
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
        AICouncil Command Center
      </div>

      <Space size="large">
        <Button
          type="text"
          icon={<RefreshOutlined />}
          onClick={onRefresh}
          title="Refresh"
        />

        <Badge count={3}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: '18px' }}
          />
        </Badge>

        <Dropdown menu={{ items: Object.entries(userMenu.props.children).map((item: any) => ({
          key: item.props.key,
          label: item.props.children,
          icon: item.props.icon
        })) }}>
          <Avatar
            style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default CommandCenterHeader;
