# GeoTrust AI — Trading Address Verification

> **Hackathon Project** — An enterprise-grade investigation platform that detects ghost addresses, shell companies, and spatial contradictions in business registrations using AI-powered rule-based verification.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend — Spring Boot API](#backend--spring-boot-api)
  - [Data Model](#data-model)
  - [REST API Endpoints](#rest-api-endpoints)
  - [Verification Rules Engine](#verification-rules-engine)
  - [Demo Cases](#demo-cases)
  - [Running the Backend](#running-the-backend)
- [Frontend — Authentication System](#frontend--authentication-system)
  - [Design System](#design-system)
  - [Login Flow](#login-flow)
  - [Sign Up Flow](#sign-up-flow)
  - [Demo Credentials](#demo-credentials)
  - [Running the Frontend](#running-the-frontend)
- [Authentication Flow](#authentication-flow)
- [Investigator Roles](#investigator-roles)
- [Security & Trust Indicators](#security--trust-indicators)
- [Disclaimer](#disclaimer)

---

## Overview

**GeoTrust AI** is a FinTech investigation platform designed to verify the physical authenticity of business trading addresses. Compliance teams, risk analysts, and financial investigators use this workspace to cross-reference a business's claimed industry, physical size (sq ft), and geographic coordinates against known registration data to identify fraudulent entities.

It answers one critical question:

> *Does this business actually exist at this address, in the industry it claims to operate in?*

---

## Problem Statement

Financial fraud often begins with a fake or misrepresented business address. Common fraud patterns include:

| Pattern | Description |
|---|---|
| **Ghost Address** | A business with zero or near-zero physical footprint claiming to operate a large enterprise |
| **Shell Company** | A company registered in one industry but physically inconsistent with that industry's spatial requirements |
| **Asset Overstatement** | A business claiming more physical space than it is legally registered for |
| **Industry Mismatch** | A business claiming an industry that doesn't match its registered classification |
| **Invalid Coordinates** | A business submission with null or zero-value GPS coordinates |

GeoTrust AI automates the detection of all these patterns through a rule-based scoring engine.

---

## Key Features

- Address Credibility Scoring — Automatic 0-100 trust score for each business
- Spatial Contradiction Detection — Identifies impossible combinations (e.g., Heavy Manufacturing in 150 sq ft)
- Live Evaluation API — POST endpoint to evaluate any business in real-time
- Enterprise Authentication — Investigator login + 4-step investigator registration
- Multi-Role Access Model — Role-based access for Investigators, Analysts, and Admins
- 10 Pre-loaded Demo Cases — Credible, Ghost, and Shared Workspace scenarios
- Session Management — Frontend investigator session with org, role, and ID tracking

---

## Architecture

```
+----------------------------------------------------------+
|                     GeoTrust AI                          |
+------------------------+---------------------------------+
|     Frontend           |          Backend                |
|  (HTML5 + Vanilla JS)  |   (Spring Boot 3.2 + Java 17)  |
|                        |                                 |
|  +------------------+  |  +---------------------------+  |
|  |  login.html      |  |  |  ApiController.java       |  |
|  |  signup.html     |<-+->|  GET /api/cases           |  |
|  |  dashboard.html  |  |  |  GET /api/evaluate/{id}   |  |
|  +------------------+  |  |  POST /api/evaluate-live  |  |
|                        |  +---------------------------+  |
|  +------------------+  |  +---------------------------+  |
|  |  session.js      |  |  |  BusinessProfile.java     |  |
|  |  auth.js         |  |  |  (JPA Entity)             |  |
|  |  signup.js       |  |  +---------------------------+  |
|  +------------------+  |  +---------------------------+  |
|                        |  |  H2 In-Memory Database    |  |
|                        |  |  10 Demo Cases Loaded     |  |
|                        |  +---------------------------+  |
+------------------------+---------------------------------+
```

---

## Tech Stack

### Backend
| Component | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2.0 |
| Database | H2 (in-memory) |
| ORM | Spring Data JPA / Hibernate |
| Build Tool | Apache Maven 3.9.6 |
| Extra | Lombok |

### Frontend
| Component | Technology |
|---|---|
| Structure | HTML5 |
| Styling | Vanilla CSS3 (Neumorphism Design System) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Inter (Google Fonts) |
| No Framework | React / Vue / Angular — NOT used |

---

## Project Structure

```
hyna-fintech/
|
+-- pom.xml                          # Maven build configuration
+-- apache-maven-3.9.6/              # Bundled Maven binary
|
+-- src/
|   +-- main/
|   |   +-- java/com/geotrust/
|   |   |   +-- GeoTrustApplication.java          # Spring Boot entry point
|   |   |   +-- controller/
|   |   |   |   +-- ApiController.java            # REST API + rule engine
|   |   |   +-- model/
|   |   |   |   +-- BusinessProfile.java          # JPA entity (core data model)
|   |   |   +-- repository/
|   |   |   |   +-- BusinessProfileRepository.java # JPA repository interface
|   |   |   +-- service/
|   |   |       +-- DataLoader.java               # Seeds 10 demo cases on startup
|   |   +-- resources/
|   |       +-- application.properties            # H2 datasource config
|   |       +-- mock_data.json                    # Reference data file
|   +-- data/                                     # Additional data resources
|
+-- frontend/
    +-- auth/
    |   +-- login.html                # Login page
    |   +-- signup.html               # Multi-step registration page
    +-- css/
    |   +-- neumorphism.css           # Core design tokens & neumorphic utilities
    |   +-- auth.css                  # Authentication layout & component styles
    +-- js/
    |   +-- auth.js                   # Login validation & demo authentication
    |   +-- signup.js                 # Multi-step form control & validation
    |   +-- session.js                # SessionStorage manager
    +-- data/
    |   +-- demo-users.js             # Frontend demo user credentials
    +-- dashboard.html                # Post-login investigator dashboard
    +-- index.html                    # Main landing / investigation UI
```

---

## Backend — Spring Boot API

### Data Model

**`BusinessProfile`** — the core JPA entity stored in H2:

| Field | Type | Description |
|---|---|---|
| `id` | `Long` | Auto-generated primary key |
| `caseId` | `String` | Human-readable case reference (e.g. CASE-001) |
| `businessName` | `String` | Registered name of the business |
| `claimedIndustry` | `String` | The industry the business claims to operate in |
| `sqFt` | `Integer` | Physical footprint of the business address (sq ft) |
| `latitude` | `Double` | GPS latitude of the claimed address |
| `longitude` | `Double` | GPS longitude of the claimed address |

---

### REST API Endpoints

#### `GET /api/cases`
Returns all loaded business cases from the database.

**Response:**
```json
[
  {
    "id": 1,
    "caseId": "CASE-001",
    "businessName": "Apex Retail",
    "claimedIndustry": "Retail",
    "sqFt": 2500,
    "latitude": 41.88,
    "longitude": -87.62
  }
]
```

---

#### `GET /api/evaluate/{caseId}`
Evaluates a saved case by its case ID and returns a credibility score and explanations.

**Example:** `GET /api/evaluate/CASE-002`

**Response:**
```json
{
  "score": 25,
  "explanations": [
    "CRITICAL: Physical contradiction. Heavy Manufacturing requires significant space, but only 150 sq ft is claimed."
  ]
}
```

---

#### `POST /api/evaluate-live`
Evaluates any business profile submitted in the request body in real-time against the mock registry.

**Request Body:**
```json
{
  "businessName": "hynastudio nagercoil",
  "claimedIndustry": "Tech",
  "sqFt": 500,
  "latitude": 10.94,
  "longitude": 77.96
}
```

**Response:**
```json
{
  "score": 100,
  "explanations": [
    "VERIFIED: Claimed data perfectly matches Government Registry and spatial constraints."
  ]
}
```

---

### Verification Rules Engine

The engine is implemented in `ApiController.java` and applies the following scoring rules:

| Rule | Condition | Score Impact | Severity |
|---|---|---|---|
| Zero Footprint | sqFt == 0 | -90 | CRITICAL |
| Heavy Industry Contradiction | (Manufacturing or Logistics) AND sqFt < 1000 | -75 | CRITICAL |
| Virtual Office / Shared Workspace | (Tech, Finance, or Consulting) AND 0 < sqFt < 300 | -40 | WARNING |
| Asset Overstatement (live only) | Claimed sqFt > 1.5x registered | -50 | CRITICAL |
| Industry Mismatch (live only) | Claimed industry != registered industry | -30 | WARNING |
| Invalid Coordinates (live only) | latitude or longitude is null or 0.0 | -100 | FATAL |
| Registry Not Found (live only) | Business name not in mock registry | Score = 0 | FATAL |

A **score of 100** means fully verified with no contradictions found.

---

### Demo Cases

10 business profiles are seeded automatically on startup by `DataLoader.java`:

| Case ID | Business Name | Industry | Sq Ft | Expected Verdict |
|---|---|---|---|---|
| CASE-001 | Apex Retail | Retail | 2,500 | Credible |
| CASE-002 | Titanium Steel Smelting | Heavy Manufacturing | 150 | Ghost |
| CASE-003 | Global Tech Consultants | Consulting | 450 | Shared Workspace |
| CASE-004 | Omega Logistics | Logistics | 50,000 | Credible |
| CASE-005 | Shell Corp Alpha | Finance | 50 | Ghost |
| CASE-006 | WeWork Chicago | Coworking | 12,000 | Shared Workspace |
| CASE-007 | Phantom Holdings | Real Estate | 0 | Ghost (Zero footprint) |
| CASE-008 | Corner Bodega | Retail | 800 | Credible |
| CASE-009 | Crypto Innovations | Tech | 200 | Shared Workspace |
| CASE-010 | Industrial Smelting Ltd | Heavy Manufacturing | 200 | Ghost |

---

### Running the Backend

**Prerequisites:**
- Java 17 or higher installed and on PATH

**Steps:**

```bash
# Navigate to the project root
cd hyna-fintech

# Run using the bundled Maven wrapper
apache-maven-3.9.6/bin/mvn spring-boot:run

# Or if Maven is globally installed
mvn spring-boot:run
```

The backend will start on **`http://localhost:8080`**.

> H2 Console: `http://localhost:8080/h2-console`
> JDBC URL: `jdbc:h2:mem:geotrustdb` | Username: `sa` | Password: `password`

---

## Frontend — Authentication System

### Design System

The frontend uses a refined **Soft Neumorphism** design tailored for FinTech / investigation tools.

| Token | Value |
|---|---|
| Background | `#EEF3F8` (cool blue-white) |
| Primary | `#2563EB` (professional blue) |
| Text Primary | `#172033` |
| Text Secondary | `#64748B` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Danger | `#DC2626` |

---

### Login Flow

1. Investigator enters their **Investigator ID** (e.g. `INV-001`) or **Work Email**
2. Enters password
3. Frontend validates input — email format check, empty field checks
4. Demo authentication is performed against `demo-users.js`
5. On success — a session is created in `sessionStorage` and the user is redirected to `dashboard.html`
6. On failure — an inline error message is shown beneath the relevant field

---

### Sign Up Flow

A 4-step progressive registration form:

| Step | Title | Fields |
|---|---|---|
| 1 | Investigator Details | Full Name, Work Email, Mobile, Investigator ID, Job Title, Department |
| 2 | Organization Details | Org Name, Org Type, Official Email, License Reference, Address, City, State, Country |
| 3 | Identity Verification | Verification Type, Reference Number, Issuing Authority, Issue Date, Expiry Date |
| 4 | Account Security | Password, Confirm Password, MFA toggle, Policy agreement |

After submission, a **Registration Submitted** confirmation screen is shown with the assigned Investigator ID and pending approval status.

---

### Demo Credentials

| Field | Value |
|---|---|
| Investigator ID | `INV-001` |
| Email | `investigator@geotrust.demo` |
| Password | `demo123` |

> These are demonstration credentials only. No real authentication server is used.

---

### Running the Frontend

The frontend is pure HTML/CSS/JS — no build step needed. Simply serve the `frontend/` directory:

```bash
# Using Python (recommended)
cd hyna-fintech/frontend
python -m http.server 8000
```

Then open in your browser:

| Page | URL |
|---|---|
| Login | http://localhost:8000/auth/login.html |
| Sign Up | http://localhost:8000/auth/signup.html |
| Dashboard | http://localhost:8000/dashboard.html |
| Investigation UI | http://localhost:8000/index.html |

---

## Authentication Flow

```
Investigator opens Login Page
         |
         v
Enter Investigator ID / Email
         |
         v
       Enter Password
         |
         v
  Frontend Validation (auth.js)
         |
         v
  Demo Authentication Check
    (demo-users.js)
         |
    +----+----+
 Success    Failure
    |           |
    v           v
Create        Show Inline
Session       Error Message
(sessionStorage)
    |
    v
Redirect to dashboard.html
(Session: Name, Role, Org, INV ID)
```

---

## Investigator Roles

| Role | Description | Assigned By |
|---|---|---|
| **Investigator** | Default role — runs case evaluations | Organization Admin |
| **Compliance Analyst** | Reviews flagged cases for regulatory compliance | Organization Admin |
| **Risk Analyst** | Assesses financial and operational risk | Organization Admin |
| **Reviewer / Supervisor** | Approves or escalates investigation decisions | Organization Admin |
| **Organization Admin** | Manages investigators and access control | System only — not self-assignable |

> Organization Admin is **not selectable** during registration. It is assigned at the organizational level only.

---

## Security & Trust Indicators

The platform communicates the following trust signals to investigators on the login screen:

- **Role-based access** — Investigators only see what their role permits
- **Organization-controlled access** — Access is provisioned by the investigator's organization
- **Investigation activity tracking** — All investigator actions are traceable
- **Evidence-based assessment** — Verdicts are derived from rule-based evidence, not assumptions

---

## Disclaimer

This is a **hackathon demonstration project**. The verification engine uses rule-based heuristics and mock data — it does not connect to any real government registry, MCA database, satellite imagery API, or financial data provider. No real Aadhaar, PAN, passport, bank credentials, or sensitive documents are processed or stored. All case data and investigator profiles are synthetic and for demonstration purposes only.
