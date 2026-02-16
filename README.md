# XPM Structure Diagram Generator

Dynamic structure diagrams for Xero Practice Manager client groups. Visualises the relationships between companies, trusts, individuals, partnerships, and funds within a client group.

## Features

- **ODataLink Integration** — Connects to your Xero Practice Manager data via [ODataLink](https://odatalink.com/) OData feeds
- **Client Group Search** — Find and select any client group from your practice
- **Dynamic Diagrams** — Interactive, draggable structure diagrams with automatic hierarchical layout
- **Entity Shapes**:
  - **Squares** = Companies
  - **Triangles** = Trusts
  - **Circles** = Individuals / Sole Traders
  - **Diamonds** = Partnerships
  - **Hexagons** = Funds (SMSF, etc.)
- **Relationship Labels** — Shows Director Of, Shareholder Of, Trustee Of, Beneficiary Of, etc. with share percentages
- **Export to PowerPoint** — Downloads a `.pptx` file with shapes, entity details, and relationships
- **Export to PDF** — Downloads a `.pdf` file with the full structure diagram and legend
- **Vertical / Horizontal Layout** — Toggle between top-down and left-right diagram orientations
- **Demo Mode** — Try the app with sample data (Smith Family Group, Johnson Holdings, Williams Investment)

## Getting Started

```bash
npm install
npm run dev
```

### Connecting to ODataLink

1. Sign in to [odatalink.com](https://odatalink.com/) and set up a model for your Xero Practice Manager data file
2. Include the `Clients` and `ClientsGroups` endpoints in your model
3. Copy the OData Feed URL — it has the format: `https://server/account-code/model-code/data-file-code/`
4. Enter the server URL, account code, model code, and data file code in the connection settings
5. If using Basic Authentication, enter your username and password

### Using Demo Data

Click "Use Demo Data" on the connection screen to explore the app with sample Australian accounting practice data.

## Tech Stack

- **React 19** + TypeScript + Vite
- **@xyflow/react** (ReactFlow) — Interactive diagram rendering
- **dagre** — Automatic hierarchical graph layout
- **pptxgenjs** — PowerPoint file generation
- **jspdf** — PDF file generation
