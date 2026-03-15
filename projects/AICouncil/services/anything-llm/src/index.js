/**
 * AnythingLLM RAG Microservice
 * Task 8: Document ingestion and retrieval
 */

const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Configuration
const app = express();
const PORT = process.env.ANYTHINGLLM_PORT || 3001;
const STORAGE_DIR = process.env.STORAGE_DIR || '/data/anythingllm';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory document store (Phase 3: Move to vector DB)
const documents = new Map();
const collections = new Map();

// ============================================
// Health Check
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'anything-llm',
    version: '0.1.0',
  });
});

// ============================================
// Collection Management
// ============================================

/**
 * Create a new document collection
 */
app.post('/api/collections', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Collection name required' });
  }

  const collectionId = uuidv4();
  const collection = {
    id: collectionId,
    name,
    description: description || '',
    createdAt: new Date(),
    documents: [],
  };

  collections.set(collectionId, collection);

  res.status(201).json({
    message: 'Collection created',
    collection,
  });
});

/**
 * List all collections
 */
app.get('/api/collections', (req, res) => {
  const collectionList = Array.from(collections.values());
  res.json({
    collections: collectionList,
    total: collectionList.length,
  });
});

/**
 * Get collection by ID
 */
app.get('/api/collections/:collectionId', (req, res) => {
  const { collectionId } = req.params;
  const collection = collections.get(collectionId);

  if (!collection) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  res.json({ collection });
});

/**
 * Delete collection
 */
app.delete('/api/collections/:collectionId', (req, res) => {
  const { collectionId } = req.params;
  const deleted = collections.delete(collectionId);

  if (!deleted) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  res.json({ message: 'Collection deleted', collectionId });
});

// ============================================
// Document Management
// ============================================

/**
 * Upload document to collection
 */
app.post('/api/collections/:collectionId/documents', (req, res) => {
  const { collectionId } = req.params;
  const { content, filename, metadata } = req.body;

  const collection = collections.get(collectionId);
  if (!collection) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  if (!content || !filename) {
    return res.status(400).json({ error: 'Content and filename required' });
  }

  const documentId = uuidv4();
  const document = {
    id: documentId,
    filename,
    content,
    metadata: metadata || {},
    createdAt: new Date(),
    embedding: null, // Phase 3: Compute embeddings
  };

  documents.set(documentId, document);
  collection.documents.push(documentId);

  res.status(201).json({
    message: 'Document uploaded',
    document,
  });
});

/**
 * List documents in collection
 */
app.get('/api/collections/:collectionId/documents', (req, res) => {
  const { collectionId } = req.params;
  const collection = collections.get(collectionId);

  if (!collection) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  const docs = collection.documents
    .map((docId) => documents.get(docId))
    .filter(Boolean);

  res.json({
    documents: docs,
    total: docs.length,
  });
});

/**
 * Get document by ID
 */
app.get('/api/documents/:documentId', (req, res) => {
  const { documentId } = req.params;
  const doc = documents.get(documentId);

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  res.json({ document: doc });
});

/**
 * Delete document
 */
app.delete('/api/documents/:documentId', (req, res) => {
  const { documentId } = req.params;
  const doc = documents.get(documentId);

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  // Remove from collections
  for (const collection of collections.values()) {
    const index = collection.documents.indexOf(documentId);
    if (index > -1) {
      collection.documents.splice(index, 1);
    }
  }

  documents.delete(documentId);
  res.json({ message: 'Document deleted', documentId });
});

// ============================================
// Retrieval / Search
// ============================================

/**
 * Search documents (semantic search - Phase 3)
 * For now, simple keyword matching
 */
app.post('/api/search', (req, res) => {
  const { query, collectionId, limit = 5 } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }

  let searchDocs = Array.from(documents.values());

  // Filter by collection if specified
  if (collectionId) {
    const collection = collections.get(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    searchDocs = searchDocs.filter((doc) =>
      collection.documents.includes(doc.id)
    );
  }

  // Simple keyword matching (Phase 3: Use embeddings)
  const queryTerms = query.toLowerCase().split(/\s+/);
  const results = searchDocs
    .map((doc) => {
      const contentLower = doc.content.toLowerCase();
      const score = queryTerms.filter((term) =>
        contentLower.includes(term)
      ).length;
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => ({
      ...item.doc,
      relevanceScore: item.score,
    }));

  res.json({
    query,
    results,
    total: results.length,
  });
});

/**
 * Query with context (for Council RAG pipeline)
 * Task 9: RAG-before-Council
 */
app.post('/api/query', (req, res) => {
  const { question, collectionId, context = '' } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question required' });
  }

  // Search for relevant documents
  let searchResults = Array.from(documents.values());

  if (collectionId) {
    const collection = collections.get(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    searchResults = searchResults.filter((doc) =>
      collection.documents.includes(doc.id)
    );
  }

  // Simple keyword search
  const keywords = question.toLowerCase().split(/\s+/);
  const results = searchResults
    .map((doc) => {
      const contentLower = doc.content.toLowerCase();
      const score = keywords.filter((kw) => contentLower.includes(kw)).length;
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.doc);

  // Build augmented prompt
  const augmentedPrompt = [
    context,
    'Relevant documents:',
    ...results.map(
      (doc, i) => `[Doc ${i + 1}] ${doc.filename}\n${doc.content}`
    ),
    '\nQuestion:',
    question,
  ].join('\n\n');

  res.json({
    question,
    augmentedPrompt,
    sources: results.map((doc) => ({
      id: doc.id,
      filename: doc.filename,
      excerpt: doc.content.substring(0, 200),
    })),
  });
});

// ============================================
// Error Handling
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ============================================
// Server
// ============================================

const server = app.listen(PORT, () => {
  console.log(`🧠 AnythingLLM RAG service listening on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Collections: http://localhost:${PORT}/api/collections`);
});

module.exports = server;
