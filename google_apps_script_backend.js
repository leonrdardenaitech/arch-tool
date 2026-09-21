/**
 * =========================================================================
 * ANERGI.IO CONSULTATION & INTAKE GOOGLE APPS SCRIPT BACKEND
 * =========================================================================
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. Open Google Sheets (https://sheets.new) and name the spreadsheet: "Anergi Consultation Leads"
 * 2. Click Extensions > Apps Script
 * 3. Replace all default code with the contents of this file.
 * 4. Click Save (disk icon).
 * 5. Click Deploy > New deployment.
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Description: "Anergi Consultation Webhook v1"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (crucial for web forms to submit without Google login)
 * 8. Click Deploy.
 * 9. Copy the generated "Web App URL" (e.g., https://script.google.com/macros/s/.../exec).
 * 10. Paste the Web App URL into contact.html (variable GOOGLE_APPS_SCRIPT_URL).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = getOrCreateLeadsSheet();
    var data;

    // Parse incoming JSON or form-encoded payload
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var timestamp = data.submittedAt || new Date().toISOString();
    var fullName = data.fullName || 'Unknown';
    var email = data.email || 'No email provided';
    var companyDomain = data.companyDomain || 'N/A';
    var assessmentScope = data.assessmentScope || 'Consultation Intake';
    var appointmentSlot = data.appointmentSlot || 'Not Specified';
    var status = 'Pending Confirmation';

    // Append to Google Sheet
    sheet.appendRow([
      timestamp,
      fullName,
      email,
      companyDomain,
      assessmentScope,
      appointmentSlot,
      status
    ]);

    // Optional: Send Instant Email Alert to Architect / Leadership
    try {
      var recipientEmail = "leonrdarden@gmail.com";
      var subject = "🚨 New Anergi Consultation Request: " + companyDomain + " (" + fullName + ")";
      var body = "A new enterprise consultation request has been submitted on Anergi.io:\n\n" +
                 "• Contact: " + fullName + "\n" +
                 "• Email: " + email + "\n" +
                 "• Company Domain: " + companyDomain + "\n" +
                 "• Desired Scope: " + assessmentScope + "\n" +
                 "• Requested Slot: " + appointmentSlot + "\n" +
                 "• Submitted At: " + timestamp + "\n\n" +
                 "Log into Google Sheets to review and confirm the appointment.";
      
      MailApp.sendEmail(recipientEmail, subject, body);
    } catch (mailErr) {
      Logger.log("Email notification failed: " + mailErr.toString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Consultation successfully recorded',
        domain: companyDomain
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'online',
      service: 'Anergi.io Consultation Webhook Service',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper to get or create the Consultation_Leads sheet with formatted headers
 */
function getOrCreateLeadsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "Consultation_Leads";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [
      "Timestamp",
      "Full Name",
      "Corporate Email",
      "Target Company Domain",
      "Assessment Scope",
      "Appointment Slot",
      "Status"
    ];
    
    sheet.appendRow(headers);
    
    // Style headers
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0284c7");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (var i = 1; i <= headers.length; i++) {
      sheet.setColumnWidth(i, 180);
    }
  }

  return sheet;
}
