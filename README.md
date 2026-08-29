# BIS Standards RAG Assistant

**AI-Powered Intelligent Assistant for Indian Standards and BIS Services**

> Smart automation for compliance with Indian Bureau of Standards (BIS) — using Retrieval-Augmented Generation (RAG) to make 10,000+ BIS standards accessible in seconds.

![Status](https://img.shields.io/badge/Status-Active%20Development-blue)
![Team](https://img.shields.io/badge/Team-6%20Developers-green)
![Timeline](https://img.shields.io/badge/Timeline-36%20Hour%20Hackathon-orange)
![SIH2024](https://img.shields.io/badge/SIH-Smart%20India%20Hackathon-red)

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Team & Role Assignments](#team--role-assignments)
- [Implementation Plan](#implementation-plan)
- [Step-by-Step Build Sequence](#step-by-step-build-sequence)
- [Setup & Installation](#setup--installation)
- [Git Strategy](#git-strategy)
- [API Overview](#api-overview)
- [Demo Script Summary](#demo-script-summary)
- [FAQ](#faq)

---

## Problem Statement

India has **10,000+ BIS standards** covering manufacturing, food safety, construction, automotive, and pharmaceuticals. 500,000+ registered factories struggle to identify which standards apply to them — compliance audits are slow, error-prone, and often based on outdated versions of standards. Language access is also a barrier for Hindi-speaking factory workers.

**Estimated impact:** ~₹500 crore/year wasted in unnecessary audit time across Indian industry.

---

## Solution Overview

**BIS RAG Assistant** is an AI-powered compliance co-pilot that:

1. **Retrieves** relevant BIS standards using hybrid (semantic + keyword) search
2. **Augments** retrieval with Claude for context-aware answers
3. **Generates** accurate, cited responses with direct links to standard sections

### Core Capabilities
- 🔍 Smart natural-language search with citations
- ✅ Automated compliance checking against product specs
- 📊 Standard version comparison (e.g., IS XXXX:2015 vs 2018)
- 📥 PDF/CSV export for audit documentation
- 🌐 English + Hindi support
- 👤 Query history & bookmarks
- ⚙️ Admin dashboard for standards management

---

## Key Features

| Tier | Hours | Features |
|------|-------|----------|
| **MVP (Tier 1)** | 0–12 | Citations, search history/bookmarks, EN/HI support, auto-complete |
| **High-Impact (Tier 2)** | 12–24 | Compliance checker, PDF/CSV export, standard comparison, sector filtering |
| **Polish (Tier 3)** | 24–32 | Admin dashboard, batch CSV upload, conversation modes, dark mode |
| **Stretch Goals** | If time | Document upload chat, AI-generated checklists, predictive guidance |

---

## Tech Stack

**Backend:** FastAPI (Python 3.11), PostgreSQL, Pinecone/Weaviate, Claude 3.5 Sonnet, sentence-transformers, Redis, reportlab, Docker + AWS EC2

**Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, Zustand, Axios, custom i18n layer, S3 + CloudFront

**DevOps:** Docker Compose, AWS (EC2, RDS, S3, CloudWatch), GitHub Actions, shell-script IaC

---

## Team & Role Assignments

| # | Member | Role | Core Responsibility | Key Deliverable |
|---|--------|------|----------------------|------------------|
| 1 | **Member 1** | Project Lead | Vision, coordination, timeline enforcement, presentation | 10-min demo + Q&A handling |
| 2 | **Member 2** | RAG/ML Architect | Retrieval pipeline, embeddings, Claude prompt engineering, compliance-check logic | 95%+ accurate RAG system, <2.5s latency |
| 3 | **Member 3** | Backend Engineer | FastAPI routes, PostgreSQL schema, caching, PDF/CSV export | Working REST API + Dockerized backend |
| 4 | **Member 4** | Frontend Engineer | React/TS UI, chat interface, i18n toggle, responsive design | Production-quality web app |
| 5 | **Member 5** | Data & Domain Specialist | Standards curation (15–20 BIS docs), test query set, accuracy validation | Curated dataset + 95%+ validation report |
| 6 | **Member 6** | DevOps & Demo Manager | Cloud infra, CI/CD, monitoring, load testing, demo fallback prep | Stable AWS deployment + successful live demo |

> Replace "Member N" with actual names once assigned.

---

## Implementation Plan

### Phase 0 — Pre-Hackathon Prep
- Create GitHub repo, add all collaborators, set branch protection on `main`
- Install: Python 3.11+, Node 18+, Docker, AWS CLI, `psql`
- Get API keys ready: Anthropic (Claude), Pinecone/Weaviate, AWS
- Person 5 pre-selects the 15–20 BIS standards to use in advance

### Phase 1 — Foundation (Hours 0–6)
Set up environments, scaffolds, and infra. Person 5 begins data curation.
**Exit criteria:** `feature/data` merges to `develop` (standards JSON + first test queries ready).

### Phase 2 — Core Build (Hours 6–18)
Build the RAG pipeline, backend API, and frontend shell in parallel, using an agreed API contract so nothing blocks.
**Exit criteria:** `feature/backend` merges to `develop` (real endpoints, real RAG answers).

### Phase 3 — Integration (Hours 18–24)
Connect frontend to live backend. Merge RAG + frontend branches. Layer in compliance checker, i18n, and export features.
**Exit criteria:** End-to-end query → answer → citation flow works, plus compliance/export/Hindi toggle functional.

### Phase 4 — Harden & Deploy (Hours 24–32)
Feature freeze at Hour 28 — bug fixes only. Fix hallucinations, optimize latency, deploy to AWS, prep fallback responses.
**Exit criteria:** Live on AWS, Go/No-Go decision made at Hour 32.

### Phase 5 — Demo Readiness (Hours 32–36)
Full dry run on the demo machine, verify equipment, brief the team on Q&A talking points.
**Exit criteria:** Hour 36 — demo delivered.

---

## Step-by-Step Build Sequence

### Before the hackathon
1. Create GitHub repo, add all 6 members as collaborators
2. Install required tools on every machine
3. Get all API keys ready in advance
4. Person 5 pre-picks the 15–20 BIS standards to use

### Step 1 — Setup (Hours 0–2)
5. Create all Git branches (`main`, `develop`, 4 core `feature/*`)
6. Everyone sets up local dev environments
7. Person 6 sets up AWS + Postgres/Redis via Docker Compose
8. Person 1 runs kickoff sync — confirm roles, priorities, standup time

### Step 2 — Parallel build starts (Hours 2–6)
9. Person 5 extracts standards into JSON + drafts test queries
10. Person 2 downloads embedding model, sets up Pinecone index
11. Person 3 scaffolds FastAPI app + designs DB schema
12. Person 4 sets up React + Vite + Tailwind, builds component shells
13. Person 6 keeps infra running for everyone

### Step 3 — Data ready, dev continues (Hours 6–12)
14. Person 5 merges `feature/data` into `develop`
15. Person 2 embeds/indexes standards, builds retrieval logic
16. Person 3 keeps building API endpoints
17. Person 4 builds the chat UI and sidebar
18. Persons 3 & 4 lock the API response JSON contract early

### Step 4 — Backend and RAG mature (Hours 12–18)
19. Person 2 finishes the core RAG pipeline (retrieval → Claude → cited answer)
20. Person 3 merges `feature/backend` into `develop`
21. Person 5 runs validation queries, logs RAG failures
22. Person 6 live-tests Pinecone + Postgres together

### Step 5 — Integrate everything (Hours 18–20)
23. Person 4 connects frontend to the real backend API
24. Person 2 merges `feature/rag`; Person 4 merges `feature/frontend`
25. Test full flow end-to-end: question → cited answer
26. Person 1 starts demo practice with what's working

### Step 6 — High-impact features (Hours 20–24)
27. Person 2 + 5 build and merge the compliance checker
28. Person 4 + 2 build and merge Hindi/English toggle
29. Person 3 + 4 build and merge PDF/CSV export
30. Team tests these features together for conflicts

### Step 7 — Polish and bug fixes (Hours 24–28)
31. Person 2 fixes hallucinations/slow responses
32. Person 3 adds error handling and validation
33. Person 4 fixes UI bugs, ensures mobile responsiveness
34. Person 6 runs load tests, sets up monitoring
35. **Hour 28: feature freeze — bug fixes only**

### Step 8 — Deploy and prepare (Hours 28–32)
36. Person 6 deploys backend (EC2) and frontend (S3)
37. Team tests the live deployed version, not localhost
38. Person 5 finalizes accuracy report (target 95%+)
39. Prepare fallback/pre-recorded answers for demo-day internet issues
40. **Hour 32: Go / No-Go decision**

### Step 9 — Demo prep (Hours 32–34)
41. Set up demo machine, test projector/audio/internet
42. Full live dry run of the demo script
43. Brief team on likely judge questions and who answers what

### Step 10 — Demo (Hours 34–36)
44. Present the 10-minute demo
45. Handle Q&A
46. Done 🎉

---

## Setup & Installation

### Prerequisites
```bash
- Git
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL client (psql)
- AWS account (free tier)
```

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/yourteam/bis-rag-assistant.git
cd bis-rag-assistant

# 2. Setup backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# 3. Setup frontend
cd ../frontend
npm install

# 4. Start services
cd ..
docker-compose up -d
cd backend && uvicorn main:app --reload   # Terminal 1
cd frontend && npm run dev                # Terminal 2

# 5. Test
curl http://localhost:8000/docs
open http://localhost:5173
```

---

## Git Strategy

**Protected branches:** `main` (production demo), `develop` (integration)

**Core feature branches:** `feature/rag`, `feature/backend`, `feature/frontend`, `feature/data`

**Cross-cutting branches:** `feature/compliance-checker`, `feature/i18n`, `feature/export`, `feature/admin-dashboard`

**Rule:** Never merge your own PR. Target <1 hour review time during the hackathon.

```bash
# Setup your feature branch
git checkout -b feature/my-feature develop
git push -u origin feature/my-feature

# Daily push
git add .
git commit -m "Feat: [description]"
git push

# Before merging
git fetch origin
git rebase origin/develop
git push -f origin feature/my-feature
```

---

## API Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/query` | POST | Ask a natural-language question, get a cited answer |
| `/api/v1/compliance-check` | POST | Check product specs against a standard |
| `/api/v1/history/{session_id}` | GET | Retrieve query history |
| `/api/v1/history/{query_id}/bookmark` | POST | Bookmark a query |
| `/api/v1/export/{query_id}` | POST | Export a query result as PDF/CSV |
| `/api/v1/standards` | GET | List available standards |
| `/api/v1/standards/{id}/compare` | POST | Compare two versions of a standard |

Full docs available at `http://localhost:8000/docs` (Swagger UI).

---

## Demo Script Summary

10-minute flow: problem statement → simple Q&A query with citation → compliance check demo → Hindi language toggle → PDF export → standard version comparison → impact slide → Q&A.

Fallback plan if live demo fails: switch to pre-recorded/cached responses, note that production runs on live Claude.

---

## FAQ

**Can it handle all 10,000 BIS standards?**
MVP covers 15–20 key standards. Scaling to the full library requires a distributed vector DB, hybrid search with reranking, and version-controlled indexing — planned as post-hackathon work.

**What if Claude hallucinates?**
Every answer is cited to source. Validated against a 50+ query test set with a 95%+ accuracy target; hallucinations get added to negative examples and fixed via prompt/retrieval tuning.

**Is this available for public use?**
Not yet — post-hackathon, the team plans to pitch BIS for production deployment, legal review, and full-library scaling.

---

## License

Built for **Smart India Hackathon 2024**. Post-competition use requires approval from SIH organizers & BIS.

---

**Status:** 🚀 In Development
**Next Milestone:** Hour 36 — Judging
