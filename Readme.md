# ⚡️ Event-Driven CQRS Microservices System

A high-performance, distributed **CQRS (Command Query Responsibility Segregation)** system built with:

- 🐘 PostgreSQL for transactional (write-side) operations
- 🍃 MongoDB for query (read-side) projection
- 🚀 Apache Kafka for event propagation with append-only logs
- 🧱 Node.js (TypeScript) microservices for **Gateway**, **Mutation**, and **Query**
- ✅ Robust E2E test suite to verify correctness and performance under load

---

## 📁 Folder Structure

```

.
├── e2e-tests       # End-to-end tests simulating load and verifying data integrity
├── gateway         # API Gateway (proxy) for routing queries and commands
├── mutation        # Command-side service (writes to PostgreSQL and emits events)
├── query           # Query-side service (projects events into MongoDB)
└── docker-compose  # Supporting services: PostgreSQL, MongoDB, Kafka

```

---

## 🧠 Architecture Overview

### 🏛 CQRS + Event Sourcing Design

This application follows CQRS + Event Sourcing with **Kafka as the event log**. Here's how the flow works:

```

Client → Gateway → Mutation Service → PostgreSQL + Kafka → Query Service → MongoDB

````

### 📤 Mutation Service (Write Side)

- Writes users, products, and orders to **PostgreSQL**
- Publishes domain events to **Kafka**
- Topics: `USER-CREATED`, `PRODUCT-CREATED`, `ORDER-CREATED`, etc.

### 📥 Query Service (Read Side)

- Consumes Kafka events and updates **MongoDB projections**
- Keeps a checkpoint (`lastProcessedTimestamp`) for sync status
- Avoids double-processing using `processedEvent` table

### 🔁 Gateway

- Routes `GET` requests to the **Query Service**
- Routes all other HTTP methods to the **Mutation Service**
- Gracefully handles service restarts and scaling using `cluster`

---

## ⚙️ Tech Stack

| Component       | Technology         |
|----------------|--------------------|
| Backend        | Node.js + Express  |
| Messaging      | Apache Kafka       |
| Query DB       | MongoDB            |
| Command DB     | PostgreSQL         |
| ORM (Write)    | Prisma             |
| Testing        | Jest + Axios       |
| Observability  | Morgan (logging)   |
| Kafka UI       | [Kafka UI](https://github.com/provectus/kafka-ui) |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Adityaadpandey/cqrs.git
cd cqrs
````

### 2. Start the infrastructure

Make sure Docker is installed, then:

```bash
docker-compose up -d
```

This will launch:

* Kafka on `localhost:9094`
* PostgreSQL on `localhost:5432`
* MongoDB on `localhost:27017`
* Kafka UI at [http://localhost:8080](http://localhost:8080)
* Mongo Express at [http://localhost:8081](http://localhost:8081)

### 3. Install dependencies

For each service:

```bash
cd gateway && pnpm install
cd ../mutation && pnpm install
cd ../query && pnpm install
```

### 4. Run services

In separate terminals:

```bash
# Gateway
cd gateway
pnpm run dev

# Mutation Service
cd mutation
npx prisma generate
pnpm run dev

# Query Service
cd query
pnpm run dev
```

### 5. Run E2E tests

After all services are up and running:

```bash
cd e2e-tests
pnpm install
pnpm test
```

---

## 📊 Performance Stats

| Test                | Volume      | Duration    | Notes                           |
| ------------------- | ----------- | ----------- | ------------------------------- |
| Users Created       | 300,000     | \~500 sec   | Random delay: 0–50ms            |
| Products Created    | 300,000     | \~450 sec   | Random delay: 0–50ms            |
| Orders Created      | 300,000     | \~800 sec   | Serial creation, delay: 0–150ms |
| Query Verifications | 100 of each | \~10–20 sec | Delay between reads: 20–30ms    |

> 🧪 Each entity is verified through the **Query Service** to ensure proper Kafka propagation and projection consistency.

---

## ✅ Features

* ✅ **Event-driven communication** via Kafka
* ✅ **Append-only log** design with deduplication
* ✅ **CQRS separation** of write and read models
* ✅ **Horizontal scalability** using Node.js cluster
* ✅ **Health checks** and graceful shutdowns
* ✅ **E2E testing** with over 1.8 million records processed in \~500 seconds
* ✅ **Sync status API**: `/sync-status` on the Query service

---

## 📡 Monitoring

* Kafka UI: [http://localhost:8080](http://localhost:8080)
* Mongo Express: [http://localhost:8081](http://localhost:8081)
* Query sync status: `GET /sync-status`

---

## 🛠 Future Enhancements

* Add **event replay** and **snapshotting**
* Implement **event versioning**
* Introduce **auth / RBAC**
* Improve **Kafka partitioning strategy**
* Use **MongoDB Change Streams** for real-time reactive queries

---

## 🧪 Example Kafka Event

```json
{
  "type": "ORDER-CREATED",
  "version": 1,
  "traceId": "a1b2c3d4",
  "timestamp": "2025-08-27T12:34:56.000Z",
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "items": [
      { "productId": "product-uuid", "quantity": 3 }
    ],
    "price": 90
  }
}
```

---

## 🧾 License

MIT License © 2025 – \[Aditya Pandey]

---

## 🤝 Contributing

Pull requests welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

Have questions or want to contribute?
Reach out via [issues](https://github.com/Adityaadpandey/cqrs/issues) or start a discussion!

---
