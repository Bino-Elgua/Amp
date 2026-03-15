import React, { useState } from 'react';
import { Card, Upload, Table, Button, Space, Modal, Spin, Empty, Tabs, Row, Col, Statistic } from 'antd';
import { DeleteOutlined, DownloadOutlined, SyncOutlined, PlusOutlined } from '@ant-design/icons';

export const RAGManager: React.FC = () => {
  const [documents, setDocuments] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    loadRAGData();
  }, []);

  const loadRAGData = async () => {
    setLoading(true);
    try {
      const [docsRes, colRes] = await Promise.all([
        fetch('/api/commander/rag/documents'),
        fetch('/api/commander/rag/collections')
      ]);
      setDocuments((await docsRes.json()).documents || []);
      setCollections((await colRes.json()).collections || []);
    } catch (error) {
      console.error('Failed to load RAG data:', error);
    }
    setLoading(false);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/commander/rag/documents', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      Modal.success({ title: 'Document Uploaded', content: `ID: ${data.doc_id}` });
      loadRAGData();
    } catch (error) {
      Modal.error({ title: 'Upload Failed' });
    }
    return false;
  };

  const docColumns = [
    { title: 'Filename', dataIndex: 'filename', key: 'filename' },
    { title: 'Type', dataIndex: 'file_type', key: 'file_type' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Chunks', dataIndex: 'chunks', key: 'chunks' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<SyncOutlined />}>Reindex</Button>
          <Button size="small" icon={<DeleteOutlined />} danger>Delete</Button>
        </Space>
      )
    }
  ];

  const collectionColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Documents', dataIndex: 'document_count', key: 'document_count' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<SyncOutlined />}>Sync</Button>
          <Button size="small" icon={<DeleteOutlined />} danger>Delete</Button>
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: 'documents',
      label: 'Documents',
      children: (
        <Spin spinning={loading}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="Upload New Document" type="inner">
              <Upload
                beforeUpload={handleUpload}
                accept=".pdf,.txt,.md"
              >
                <Button icon={<PlusOutlined />}>Select Document</Button>
              </Upload>
            </Card>
            <Table columns={docColumns} dataSource={documents} rowKey="doc_id" pagination={{ pageSize: 10 }} />
          </Space>
        </Spin>
      )
    },
    {
      key: 'collections',
      label: 'Collections',
      children: (
        <Spin spinning={loading}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="Vector Collections" type="inner">
              <Table columns={collectionColumns} dataSource={collections} rowKey="collection_id" pagination={{ pageSize: 10 }} />
            </Card>
          </Space>
        </Spin>
      )
    }
  ];

  return (
    <Card>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Total Documents" value={documents.length} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Collections" value={collections.length} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title="Indexed" value={documents.filter((d: any) => d.status === 'indexed').length} />
        </Col>
      </Row>
      <Tabs items={tabItems} />
    </Card>
  );
};

export default RAGManager;
