# 🚀 CASSANDRA DEPLOYMENT GUIDE

Complete deployment strategies for all environments.

---

## 1. LOCAL DEVELOPMENT

### Single Command Startup
```bash
docker-compose up -d
npm start
```

### Verify All Services
```bash
npm run health:check
```

### Access Points
- Oracle API: `http://localhost:4000`
- Dashboard: `http://localhost:3000`
- Qdrant: `http://localhost:6333`
- Redis: `localhost:6379`
- Ollama: `http://localhost:11434`

---

## 2. KUBERNETES DEPLOYMENT

### Prerequisites
```bash
kubectl create namespace cassandra
kubectl create secret generic cassandra-env --from-file=.env -n cassandra
```

### Deploy
```bash
kubectl apply -f k8s/
```

### Manifest Files

**cassandra-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cassandra-oracle
  namespace: cassandra
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cassandra
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      containers:
      - name: cassandra
        image: cassandra-oracle:latest
        ports:
        - containerPort: 4000
        envFrom:
        - secretRef:
            name: cassandra-env
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**cassandra-service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: cassandra-oracle
  namespace: cassandra
spec:
  selector:
    app: cassandra
  ports:
  - protocol: TCP
    port: 80
    targetPort: 4000
  type: LoadBalancer
```

---

## 3. PRODUCTION DEPLOYMENT

### Requirements
- Kubernetes cluster (EKS, GKE, AKS)
- Qdrant vector DB (managed or self-hosted)
- PostgreSQL for state persistence
- Redis cluster
- Ollama inference cluster (optional)

### High Availability Setup

```yaml
# StatefulSet for consistency
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: cassandra-oracle
  namespace: cassandra
spec:
  serviceName: cassandra
  replicas: 5
  selector:
    matchLabels:
      app: cassandra
  template:
    metadata:
      labels:
        app: cassandra
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - cassandra
            topologyKey: kubernetes.io/hostname
      containers:
      - name: cassandra-oracle
        image: cassandra-oracle:latest
        volumeMounts:
        - name: persistent-state
          mountPath: /cassandra/data
        env:
        - name: QDRANT_URL
          value: "qdrant.cassandra.svc.cluster.local:6333"
        - name: REDIS_URL
          value: "redis-cluster.cassandra.svc.cluster.local:6379"
  volumeClaimTemplates:
  - metadata:
      name: persistent-state
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
```

### Auto-scaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cassandra-hpa
  namespace: cassandra
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: StatefulSet
    name: cassandra-oracle
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 4. CLOUD PROVIDER DEPLOYMENT

### AWS ECS
```bash
# Create task definition
aws ecs register-task-definition \
  --cli-input-json file://cassandra-task.json

# Create service
aws ecs create-service \
  --cluster cassandra \
  --service-name cassandra-oracle \
  --task-definition cassandra \
  --desired-count 3 \
  --launch-type FARGATE
```

### Google Cloud Run
```bash
gcloud run deploy cassandra-oracle \
  --image gcr.io/project/cassandra:latest \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --set-env-vars "ORACLE_MODE=production"
```

### Azure Container Instances
```bash
az container create \
  --resource-group cassandra \
  --name cassandra-oracle \
  --image cassandra-oracle:latest \
  --cpu 2 \
  --memory 2 \
  --port 4000 \
  --environment-variables ORACLE_MODE=production
```

---

## 5. MULTI-REGION DEPLOYMENT

### Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   US-East   │     │   EU-West   │     │  Asia-Pac   │
│  (Primary)  │     │ (Secondary) │     │  (Tertiary) │
├─────────────┤     ├─────────────┤     ├─────────────┤
│  Cassandra  │────→│  Cassandra  │────→│  Cassandra  │
│   Replica   │ ←────│   Replica   │ ←────│   Replica   │
└─────────────┘     └─────────────┘     └─────────────┘
       ↓                   ↓                   ↓
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Qdrant    │     │   Qdrant    │     │   Qdrant    │
│   Vector    │     │   Vector    │     │   Vector    │
│     DB      │     │     DB      │     │     DB      │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Deployment Script
```bash
#!/bin/bash

# Deploy to multiple regions
for region in us-east-1 eu-west-1 ap-southeast-1; do
  echo "Deploying to $region..."
  
  kubectl config use-context $region
  kubectl apply -f k8s/ --namespace cassandra
  
  # Wait for deployment
  kubectl rollout status deployment/cassandra-oracle \
    --namespace cassandra \
    --timeout=5m
done

# Setup replication
kubectl exec -n cassandra cassandra-oracle-0 -- \
  npm run setup:replication
```

---

## 6. MONITORING & OBSERVABILITY

### Prometheus Metrics
```yaml
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: cassandra-oracle
  namespace: cassandra
spec:
  selector:
    matchLabels:
      app: cassandra
  endpoints:
  - port: metrics
    interval: 30s
```

### Logging Stack
```bash
# ELK Stack
kubectl apply -f logging/elasticsearch.yaml
kubectl apply -f logging/logstash.yaml
kubectl apply -f logging/kibana.yaml

# Or cloud native
aws logs create-log-group --log-group-name /cassandra/oracle
```

### Alerting
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: cassandra-alerts
spec:
  groups:
  - name: cassandra
    rules:
    - alert: HighErrorRate
      expr: rate(cassandra_errors_total[5m]) > 0.05
      for: 10m
      annotations:
        summary: "High error rate in Cassandra Oracle"
    
    - alert: PredictionAccuracyDown
      expr: cassandra_prediction_accuracy < 0.70
      for: 1h
      annotations:
        summary: "Prediction accuracy below threshold"
    
    - alert: DeploymentFailure
      expr: cassandra_deployment_failures_total > 0
      for: 5m
      annotations:
        summary: "Recent deployment failure detected"
```

---

## 7. BACKUP & DISASTER RECOVERY

### Backup Strategy
```bash
#!/bin/bash

# Daily backup
BACKUP_DIR="/backups/cassandra-$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup vector DB
pg_dump cassandra_state > $BACKUP_DIR/state.sql

# Backup oracle memory
cp /cassandra/data/oracle-memory.json $BACKUP_DIR/

# Upload to S3
aws s3 sync $BACKUP_DIR s3://cassandra-backups/$(date +%Y/%m/%d)/

# Cleanup old backups (30 days)
find /backups -type d -mtime +30 -exec rm -rf {} \;
```

### Recovery Procedure
```bash
#!/bin/bash

# Restore from backup
BACKUP_DATE=$1

aws s3 sync s3://cassandra-backups/$BACKUP_DATE /tmp/restore/

psql cassandra_state < /tmp/restore/state.sql
cp /tmp/restore/oracle-memory.json /cassandra/data/

kubectl rollout restart deployment/cassandra-oracle -n cassandra
```

---

## 8. GITOPS DEPLOYMENT

### Using ArgoCD
```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Create Application
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cassandra-oracle
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/yourusername/cassandra
    targetRevision: main
    path: k8s/
  destination:
    server: https://kubernetes.default.svc
    namespace: cassandra
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF
```

---

## 9. COST OPTIMIZATION

### Resource Limits
```yaml
resources:
  requests:
    memory: "256Mi"  # Start small
    cpu: "250m"
  limits:
    memory: "1Gi"    # Cap at 1GB
    cpu: "1000m"
```

### Spot Instances
```yaml
affinity:
  nodeAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      preference:
        matchExpressions:
        - key: spot
          operator: In
          values:
          - "true"
```

---

## 10. SECURITY HARDENING

### RBAC
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: cassandra-oracle
  namespace: cassandra
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list", "watch"]
```

### Network Policy
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cassandra-network-policy
  namespace: cassandra
spec:
  podSelector:
    matchLabels:
      app: cassandra
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: cassandra
    ports:
    - protocol: TCP
      port: 4000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: qdrant
    ports:
    - protocol: TCP
      port: 6333
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Secrets created
- [ ] Database initialized
- [ ] Vector DB setup
- [ ] Health checks passing
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] RBAC configured
- [ ] Network policies applied
- [ ] SSL/TLS enabled
- [ ] Load balancer configured
- [ ] Auto-scaling enabled

---

Ready to deploy? Start with: `docker-compose up -d`

🚀
