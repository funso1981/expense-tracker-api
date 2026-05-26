# Cloud-Native Three-Tier Expense Tracker Application

A secure, fully decoupled, three-tier cloud application architecture built to demonstrate modern DevOps automation, zero-trust network security, and managed identity configurations within Microsoft Azure.

## 🗼 Architectural Overview

This project bypasses traditional monolithic design patterns by breaking the workload down into three decoupled tiers that scale independently and communicate securely over the web.

* **Presentation Tier:** A responsive Single Page Application (SPA) built using React and Vite, compiled down to static assets and deployed via automated pipelines.
* **Application Logic Tier:** A Node.js and Express REST API hosted within a managed Linux container environment on Azure App Service.
* **Data Tier:** A relational cloud database managed via Azure SQL Database cluster.

---

## 🎓 AZ-104 Cloud Architecture Highlights

This project serves as a practical implementation blueprint for core domains tested within the **AZ-104: Microsoft Azure Administrator** certification. 

### 1. Network Perimeter Security & Firewalls
* **Theory Applied:** Zero-Trust Network Isolation.
* **Implementation:** The Azure SQL Database instance is completely isolated from the public internet. Access control lists (ACLs) and internal service network exceptions were manually engineered to lower the perimeter drawbridge exclusively for traffic originating from the backend App Service instance.

### 2. Runtime Environment Variable Injection
* **Theory Applied:** Twelve-Factor App Methodology (Separation of config from code).
* **Implementation:** Sensitive production connection configurations, hostnames, and listener ports are abstractly decoupled from the source code repository. Values are securely injected into the application's runtime container environment memory using the Azure App Service configuration fabric.

### 3. Cross-Origin Resource Sharing (CORS) Governance
* **Theory Applied:** Same-Origin Browser Security.
* **Implementation:** Engineered explicitly to prevent unauthorized external cross-domain scripting attacks by configuring targeted CORS access headers on the API gateway layer, securely whitelisting only the verified frontend origin.

### 4. Git-Backed Continuous Deployment (CI/CD)
* **Theory Applied:** Infrastructure Automation and Source Control Integration.
* **Implementation:** Connected directly to GitHub Actions pipelines. Code pushes to the `main` branch trigger automated runners to run dependency trees, build production-optimized builds, and securely ship incremental updates directly to Azure compute cells.

---

## 🛠️ Tech Stack & Services Used

* **Frontend Framework:** React.js, Vite, Tailwind CSS
* **Backend Runtime:** Node.js, Express.js
* **Database Engine:** Microsoft Azure SQL Server, Tedious Driver
* **Cloud Hosting Compute:** Azure App Services (Linux Environment)
* **Secrets & Keys Management:** Environment Configuration Variable Maps
* **CI/CD Pipelines:** GitHub Actions workflows

---

## 🚀 Live Production Endpoints

* **Frontend Web Application UI:** `https://expense-tracker-react-funso.azurewebsites.net`
* **Backend API Health Check Resource:** `https://expense-tracker-api-funso.azurewebsites.net/api/expenses`

---

## 🔧 Local Development & Installation

To run this project locally for debugging or feature development:

1. Clone the repository:
   bash
   git clone [https://github.com/your-username/expense-tracker-api-Funso.git](https://github.com

2. Install dependencies: 
   bash
   npm install

3. Establish a local .env configuration file in the project root:
   PORT=3000
   DB_SERVER=your-local-or-dev-server
   DB_DATABASE=expense-tracker-db
   DB_USER=sqladmin
   DB_PASSWORD=your-password
4. Fire up the local development loop:
   npm run dev

---

## 🚀 Step 2: Push It Live to GitHub

Once you paste this in, change the placeholder text strings (like `<your-frontend-subdomain>` and the repository URL) to match your real URLs. 

Then, save the file, go to your terminal, and push it up to GitHub using your Git sequence:

```bash
git add README.md
git commit -m "docs: add comprehensive project README with AZ-104 architectural breakdowns"
git push origin main