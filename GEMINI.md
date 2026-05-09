# Project Instructions: Architectural Asset Synchronization

This file defines the workflow for synchronizing professional assets (Portfolio, LinkedIn data, etc.) using NotebookLM as the primary "Knowledge Brain."

## Project Nodes

### Node: Career Portfolio (Primary)
- **Source:** `darden array`, `command center`
- **Asset:** `/portfolio`, `CaseStudyGrid.jsx`

### Node: Dimensional Hunger (Creative IP)
- **Source:** `dimensional hunger`
- **Scope:** Multi-story production bible, animated musical videos, alternate narratives.
- **Future Integration:** 
  - Dedicated project landing page (e.g., `/hunger` or `/dimensional-hunger`).
  - QR Code Redirect: Custom route to handle watermark traffic (e.g., `/scan` -> `/hunger`).
  - Multimedia assets hosted via Firebase Storage or integrated from YouTube.

## Custom Commands

### `/sync-brain`
**Trigger:** When the user provides new professional information or indicates that NotebookLM has been updated with new "brain" data.

**Data Nodes:**
- **Primary:** `darden array` (Career Bio, LinkedIn Data, Professional Identity)
- **Secondary:** `command center` (Project Metrics, Deployment Logs, Technical Specifications)

**Workflow:**
1. **Query Brain:** Use the `notebook_query` tool to search `darden array` and `command center` for the latest updates.
2. **Analyze Changes:** Compare the retrieved data with current local assets:
   - `src/components/CaseStudyGrid.jsx` (Portfolio CDs)
   - `landing.html` (Branding/Bio)
3. **Propose Update:** Present a concise summary of proposed changes across all platforms.
4. **Execute:** Upon confirmation, perform surgical `replace` calls and run `npm run build && firebase deploy`.

## Standards
- **Formula:** Always maintain the 3-point architectural formula (Problem/Architecture/Impact) for portfolio updates.
- **Privacy:** Never allow personal contact info (Email/Phone) to be synced to public-facing code files.
