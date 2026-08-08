# ATLAS CORE: Garah's Restaurant & Boutique - TPM Strategy

## 1. Project Objective
- **Role:** Technical Product Manager.
- **Goal:** Optimize e-commerce fulfillment and pricing consistency via automated AI pipelines.
- **Target:** Square POS data vs. online storefront pricing.

## 2. The Toolset: V4 Agentic Stack
- **Ingestion:** Gemma 4 WebGPU Browser Agent (Visual Scraper).
- **Orchestration:** Zapier MCP (Jira/Notion Bridge).
- **Brain:** Atlas (Gemini) for pattern recognition and logic routing.

## 3. Automation Pipeline: Jira Service Desk
### Template: [PRICE_BOTTLENECK]
- **Summary:** Discrepancy detected between Square POS and Online Storefront.
- **Priority:** Medium-High.
- **Labels:** `audit`, `pricing`, `automated`.
- **Automated Field Injection:** Item Name, Current POS Price, Online Price, Delta %.

### Template: [FULFILLMENT_LAG]
- **Summary:** Lead time spike detected in order processing.
- **Logic:** Triggered when order timestamp to fulfillment timestamp delta exceeds 24 hours.

## 4. Documentation Strategy: Notion
### Database: Visual Pricing Matrix
- **Columns:** 
  - `Asset_Image` (Gemma 4 Screenshot)
  - `Item_Name`
  - `POS_Value`
  - `Web_Value`
  - `Status` (Synced/Review_Required)
  - `Last_Audit` (Timestamp)

## 5. Gemma 4 Visual Scrape Protocol
- **Trigger:** Scheduled Friday 09:00 EST.
- **Parameters:**
  - Login to Square Dashboard.
  - Navigate to "Items" menu.
  - Capture visual state of pricing table.
  - OCR extraction of text values.
  - Forward sanitized JSON to Zapier MCP endpoint.

*STATUS: TPM Strategy Manifest Locked. Ready for Friday workflow execution.*
