


```markdown
# Zepnest Service Request Application

### Developer Submission Details
- **Student/Intern Name:** Setty Mojesh
- 

---

## 1. Project Architecture Overview
Zepnest is a secure, single-page full-stack service request tracking platform tailored for seamless asynchronous communications. 
- **Frontend Core:** React 18 built via the Vite compilation pipeline utilizing functional hooks for uniform state tracking.
- **UI Architecture:** Styled natively with Tailwind CSS v3 for fluid, responsive grid rendering.
- **Backend Infrastructure:** Python 3 FastAPI asynchronous framework processing high-performance RESTful routing layers.
- **Data Persistence ORM:** MySQL relational storage layer mapped gracefully via SQLAlchemy Object Relational Mapping.
- **Authentication Engine:** Stateless JSON Web Tokens (JWT) using `python-jose` and protected cryptographic hashing wrappers.

---

## 2. Directory Layout Architecture
Ensure your local project directory structure conforms to the tracking format below before attempting execution or zipping the package:

```text
zepnest_project/
│
├── backend/                  # FastAPI Application Domain
│   ├── database.py           # Engine initialization & session context
│   ├── models.py             # Declarative database mapping entities
│   ├── schemas.py            # Pydantic structural validation contracts
│   ├── main.py               # Core application routing, middleware & auth
│   └── venv/                 # Isolated Python dependencies (Exclude from ZIP)
│
├── zepnest-frontend/         # React Application Domain
│   ├── src/                  # App components (App.jsx, Auth.jsx, Dashboard.jsx)
│   ├── index.html            # Core entry point page
│   ├── tailwind.config.js    # Utility compiler settings
│   └── node_modules/         # Node local dependencies (Exclude from ZIP)
│
├── schema.sql                # Declarative database entry script
└── README.md                 # Complete system documentation

```




## 3. Step-by-Step System Execution

Follow these modular setup checkpoints sequentially to start the full-stack pipeline.

### Step A: Database Initialization (MySQL)

1. Ensure your local MySQL server instance is online.
2. Run your terminal/command prompt and feed the structural data script directly into your database engine:
```bash
mysql -u root -p < schema.sql

```


3. Open `backend/database.py` and modify the database connection credentials array with your local instance database configurations:
```python
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:YOUR_ACTUAL_PASSWORD@127.0.0.1/zepnest_db"

```



### Step B: Backend Server Launch (FastAPI)

Open a fresh integrated terminal workspace inside VS Code and run the following commands sequentially:

```bash
# 1. Step completely inside the backend module context
cd backend

# 2. Activate the pre-configured Python virtual isolation workspace (Crucial Step)
# For Windows PowerShell / Command Prompt:
.\venv\Scripts\activate

# For macOS / Linux Terminal:
source venv/bin/activate

# 3. VERIFICATION CHECK: Confirm the terminal string shows a leading "(venv)" tag.

# 4. Initialize the asynchronous server instance with automatic hot-reloading active
uvicorn main:app --reload

```

The engine will start up successfully on `http://127.0.0.1:8000`.

### Step C: Frontend User Interface Launch (React)

Open a second, separate terminal window tab inside VS Code and execute the compilation scripts:

```bash
# 1. Step into the frontend application interface module context
cd zepnest-frontend

# 2. Compile and link external package modules locally (Only required on initialization)
npm install

# 3. Spin up the localized Vite real-time compilation engine
npm run dev

```

The responsive graphic interface will load automatically on `http://localhost:5173`.

---

## 4. Interactive Sandbox Documentation (Swagger UI)

FastAPI auto-generates interactive sandbox routing layouts out of the box. To map database relationships, perform authorization overrides, or monitor backend JSON objects independently of the frontend UI, open your browser and navigate to:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## 5. Architectural Troubleshooting Framework

* **"uvicorn is not recognized..." Error:** This happens when attempting to spin up the server without engaging the virtual environment tool first. Always guarantee your active terminal line is prepended by the `(venv)` tag by executing `.\venv\Scripts\activate` inside the `backend` folder first.
* **"Network Failure: Failed to fetch" Error:** Windows routing loops occasionally isolate localhost from resolving correctly. Both the frontend authentication matrix and dashboard architecture are hardwired to process directly through the absolute hardware fallback address loopback `127.0.0.1` to avoid this issue completely.
* **CORS Preflight Declines:** System routing boundaries are managed via custom FastAPI middleware configurations allowing full payload interaction natively across the local development port `5173`.

```

```
