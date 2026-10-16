# Zosto --- Smart Inventory Management

Zosto is a web-based inventory management project designed to help small
shops organize products, monitor stock and expiry dates, and access
useful shop-management tools from one dashboard.

> **Project status:** The frontend dashboard and its module pages are
> being developed. Authentication and user-profile APIs are configured
> separately from the inventory UI. Some screens may still use sample
> data or placeholder interactions while backend integration is
> completed.

## Table of Contents

-   [Highlights](#highlights)
-   [Technology Stack](#technology-stack)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [Running the Application](#running-the-application)
-   [Application Modules](#application-modules)
-   [Deployment Overview](#deployment-overview)
-   [Security Notes](#security-notes)
-   [Current Limitations](#current-limitations)
-   [Contributing](#contributing)

## Highlights

-   Dashboard layout with inventory summaries and shop-management
    sections.
-   Firebase Authentication for account registration and sign-in.
-   User profiles for shopkeepers and delivery agents.
-   Inventory interface with product-management controls.
-   Expiry tracking interface with search, category/status filters, date
    sorting, and expiry-status indicators.
-   Dedicated pages for stock exchange, orders, sales analytics, AI
    suggestions, customers, suppliers, profile, and settings.
-   Express API connected to MongoDB Atlas for user-profile data.
-   Responsive React interface intended for desktop and smaller screens.

## Technology Stack

  Area                               Technology
  ---------------------------------- -------------------------
  Frontend                           React, Vite, JavaScript
  Routing                            React Router
  UI components                      Material UI icons
  Backend                            Node.js, Express
  Database                           MongoDB Atlas, Mongoose
  Authentication                     Firebase Authentication
  Server-side Firebase integration   Firebase Admin SDK
  Frontend hosting                   Netlify
  Backend hosting                    Render
  Source control                     Git and GitHub

## Project Structure

The project is organized with the React frontend at the repository root
and the backend in a separate `backend/` directory.

``` text
zosto/
├── public/
├── src/
│   ├── firebase/
│   │   └── firebase.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Inventory.jsx
│   │   ├── Inventory.css
│   │   ├── Expiry.jsx
│   │   ├── Expiry.css
│   │   ├── StockExchange.jsx
│   │   ├── StockExchange.css
│   │   ├── Orders.jsx
│   │   ├── Orders.css
│   │   ├── SalesAnalysis.jsx
│   │   ├── SalesAnalysis.css
│   │   ├── AiSuggestions.jsx
│   │   ├── AiSuggestions.css
│   │   ├── Customer.jsx
│   │   ├── Customer.css
│   │   ├── Suppliers.jsx
│   │   ├── Suppliers.css
│   │   ├── Profile.jsx
│   │   ├── Profile.css
│   │   ├── Settings.jsx
│   │   ├── Settings.css
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ChangeLocation.jsx
│   ├── App.jsx
│   └── ...
├── backend/
│   ├── server.js
│   └── ...
├── package.json
└── README.md
```

*The tree above highlights the main files and may not list every project
file.*

## Getting Started

### Prerequisites

Install the following before running the project:

-   Node.js (a current LTS release is recommended)
-   npm
-   A Firebase project with Authentication configured
-   A MongoDB Atlas database for backend profile data

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd zosto
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository URL.

### 2. Install frontend dependencies

From the project root:

``` bash
npm install
```

### 3. Configure Firebase

Create or use a Firebase project and enable the sign-in methods used by
the application, such as email/password and Google sign-in if enabled in
your UI.

Configure the Firebase client settings using the project's existing
`src/firebase/firebase.js` setup. Do not commit private credentials or
service-account files.

### 4. Configure the backend

``` bash
cd backend
npm install
```

Create a backend environment configuration for the variables your server
expects. At minimum, the deployed backend uses a MongoDB connection
string and Firebase Admin credentials. Keep these values private and
configure them through your local environment or hosting provider's
secret settings.

Return to the repository root when you want to run the frontend.

## Environment Variables

### Frontend

Set the following variable in your local frontend environment and in
Netlify:

``` env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to the base URL of your deployed
backend, for example:

``` env
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Use the actual backend URL assigned to your service. Do not add `/api`
to the base URL. Restart the Vite server after changing local
environment variables, and trigger a new Netlify build after changing
deployment variables.

### Backend

The backend requires configuration for the database and Firebase Admin
SDK. The exact variable names depend on the implementation in
`backend/server.js`; commonly, the project uses a MongoDB URI and a
secure Firebase service-account configuration.

-   Keep `.env` files and service-account JSON files out of public
    repositories.
-   Never put Firebase Admin credentials in frontend variables.
-   Do not paste secrets into issues, chat messages, or screenshots.
-   Configure production secrets in Render's environment/secret
    settings.

## Running the Application

Open two terminals.

**Terminal 1 --- backend**

``` bash
cd backend
npm install
npm start
```

The backend start command should match the script defined in
`backend/package.json`. The current deployment is configured to start
the server with Node.js.

**Terminal 2 --- frontend**

From the repository root:

``` bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal, commonly
`http://localhost:5173`.

## Application Modules

  -----------------------------------------------------------------------
  Module                              Purpose
  ----------------------------------- -----------------------------------
  Dashboard                           Overview of stock, expiry alerts,
                                      sales summaries, and shortcuts

  My Inventory                        Product and stock-management
                                      interface

  Expiry Alerts                       Search and filter products by
                                      category/status, sort expiry dates,
                                      and review expiry risk

  Stock Exchange                      Interface for exploring
                                      stock-exchange opportunities

  Orders                              Order-management interface

  Sales Analytics                     Sales reporting and visual analysis
                                      interface

  AI Suggestions                      Interface for inventory suggestions

  Customers                           Customer information interface

  Suppliers                           Supplier information interface

  Profile                             User profile details

  Settings                            Application preferences

  Change Location                     Shop-location workflow
  -----------------------------------------------------------------------

The available controls and persistence depend on the current
implementation of each module. Check the relevant page component and API
integration before assuming a feature is connected to live data.

## Deployment Overview

The intended deployment is split into two services:

1.  **Frontend:** React/Vite application hosted on Netlify.
2.  **Backend:** Express API hosted on Render, connected to MongoDB
    Atlas.

Before deploying frontend changes:

1.  Confirm the application builds locally.
2.  Check that `VITE_API_URL` points to the deployed backend.
3.  Commit and push the changes to GitHub.
4.  Confirm the Netlify deployment succeeds.
5.  Test authentication and API requests in the browser's Network tab.

Before deploying backend changes:

1.  Confirm the server starts locally.
2.  Set the required environment variables and secrets in Render.
3.  Deploy the latest code.
4.  Review Render logs and test the API endpoints.

## Security Notes

-   Firebase Authentication manages user sign-in.
-   Server-side routes that require authentication should verify
    Firebase ID tokens with the Firebase Admin SDK.
-   Validate incoming request data on the backend.
-   Restrict database access and keep MongoDB credentials private.
-   Use HTTPS for deployed services.
-   Do not trust user roles or IDs supplied by the browser without
    server-side verification.

## Current Limitations

-   Some dashboard figures, charts, notifications, and product lists may
    be demonstration data.
-   Some module buttons may display placeholder messages until their
    workflows are implemented.
-   Inventory and expiry screens may use local React state; data may not
    persist after a refresh unless connected to a backend endpoint.
-   The README describes the current project structure and intended
    architecture, not a guarantee that every module is fully integrated.

Update this section as features become connected to live APIs and
persistent storage.

## Contributing

1.  Create a branch for your change.
2.  Keep UI changes consistent with the existing Zosto dashboard.
3.  Test the affected route and its interactions.
4.  Avoid committing credentials, `.env` files, or service-account keys.
5.  Submit a pull request with a short description of the change.

## License

No license has been specified yet. Add a `LICENSE` file and update this
section before distributing the project for reuse.
