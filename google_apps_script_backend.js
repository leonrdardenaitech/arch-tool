/**
 * =========================================================================
 * ANERGI.IO MASTER OPERATIONS HUB - INTAKE WEBHOOK RECEIVER
 * =========================================================================
 * 
 * Google Sheet: Anergi.io - Master Operations Hub
 * Sheet URL: https://docs.google.com/spreadsheets/d/1upMVnAbHQWeJFPsoesvTj_xutROxBnZ16sm4vfFaeKI/edit?usp=sharing
 * Webhook URL: https://script.google.com/macros/s/AKfycbz8hiPcGHVL9Uk4UHTscm2ZXpVJf0vzP3kvMd9RRAxUbRH6ERwqKmaPeb7PzOIQSEUfUg/exec
 * Target Tab: "Leads & Bookings"
 * Alert Recipient: info@anergi.io
 *
 * Routes inbound prospect consultations from:
 * 1. anergi.io/contact (Contact Intake Form & Calendar)
 * 2. On-site Chatbot / Interactive AI Bot
 */

const SHEET_NAME = "Leads & Bookings";
const NOTIFICATION_EMAIL = "info@anergi.io";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create sheet tab and headers if not yet created
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Source",
        "Full Name",
        "Corporate Work Email",
        "Target Company Domain",
        "Desired Assessment Scope",
        "Selected Window",
        "Status",
        "Notes & Next Steps"
      ]);
    }

    // Parse URL-encoded form data or JSON (from chatbot or web form)
    let data = {};
    if (e && e.postData && e.postData.type && e.postData.type.indexOf("application/json") !== -1) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = {};
      }
    } else if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const timestamp = new Date();
    const source = data.source || "Contacts Page";
    const fullName = data.full_name || data.name || data.fullName || "N/A";
    const email = data.corporate_email || data.email || "N/A";
    const domain = data.target_domain || data.domain || data.companyDomain || "N/A";
    const scope = data.assessment_scope || data.scope || data.assessmentScope || "Mini S.P.A. Surface Audit Review (Free)";
    const windowSlot = data.selected_window || data.appointment_time || data.appointmentSlot || "Pending Confirmation";
    const notes = data.notes || "";

    // Append lead row to spreadsheet
    sheet.appendRow([
      timestamp,
      source,
      fullName,
      email,
      domain,
      scope,
      windowSlot,
      "New",
      notes
    ]);

    // Dispatch email alert to owner (info@anergi.io)
    if (NOTIFICATION_EMAIL) {
      const subject = "🛡️ New Anergi Lead: " + fullName + " (" + domain + ")";
      const body = 
        "NEW ANERGI.IO INTAKE / APPOINTMENT:\n" +
        "------------------------------------------\n" +
        "Source:     " + source + "\n" +
        "Name:       " + fullName + "\n" +
        "Email:      " + email + "\n" +
        "Domain:     " + domain + "\n" +
        "Scope:      " + scope + "\n" +
        "Window:     " + windowSlot + "\n" +
        "Notes:      " + notes + "\n" +
        "------------------------------------------\n\n" +
        "Open Master Sheet: https://docs.google.com/spreadsheets/d/1upMVnAbHQWeJFPsoesvTj_xutROxBnZ16sm4vfFaeKI/edit";

      MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body, {
        name: "Anergi.io Dispatch"
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Lead recorded", domain: domain }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Anergi.io Webhook Active.");
}
