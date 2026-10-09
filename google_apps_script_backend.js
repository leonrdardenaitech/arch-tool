/**
 * =========================================================================
 * ANERGI.IO MASTER OPERATIONS HUB - INTAKE WEBHOOK RECEIVER
 * =========================================================================
 * 
 * Google Sheet: Anergi.io - Master Operations Hub
 * Sheet URL: https://docs.google.com/spreadsheets/d/1upMVnAbHQWeJFPsoesvTj_xutROxBnZ16sm4vfFaeKI/edit?usp=sharing
 * Webhook URL: https://script.google.com/macros/s/AKfycbz8hiPcGHVL9Uk4UHTscm2ZXpVJf0vzP3kvMd9RRAxUbRH6ERwqKmaPeb7PzOIQSEUfUg/exec
 * 
 * Target Tabs:
 * 1. "Leads & Bookings" (Contact Form, Calendar Bookings, Chatbot)
 * 2. "Mini S.P.A. PDF Signups" (Automated PDF Email Dispatches & Threat Briefing Leads)
 * 
 * Alert Recipient: info@anergi.io
 */

const LEADS_SHEET_NAME = "Leads & Bookings";
const PDF_SHEET_NAME = "Mini S.P.A. PDF Signups";
const NOTIFICATION_EMAIL = "info@anergi.io";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Parse URL-encoded form data or JSON
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

    // =========================================================================
    // ROUTE 1: MINI S.P.A. PDF DISPATCH & NEWSLETTER SIGNUP
    // =========================================================================
    if (source === "Mini S.P.A. PDF Gateway" || data.type === "mini_spa_pdf") {
      let pdfSheet = ss.getSheetByName(PDF_SHEET_NAME);
      if (!pdfSheet) {
        pdfSheet = ss.insertSheet(PDF_SHEET_NAME);
        pdfSheet.appendRow([
          "Timestamp",
          "Corporate Work Email",
          "Target Domain",
          "Executive Role",
          "Posture Rating",
          "Vital Signs Telemetry",
          "Newsletter Status",
          "Delivery Status",
          "Assigned Lead Entity",
          "Anti-Abuse Token",
          "Follow-up Notes"
        ]);
        pdfSheet.setFrozenRows(1);
      }

      const email = (data.corporate_email || data.email || "").toString().toLowerCase().trim();
      const domain = (data.target_domain || data.domain || "N/A").toString().toLowerCase().trim();
      const role = data.executive_role || data.role || "Executive Leadership";
      const posture = data.posture_grade || "GRADE A (Low Attack Surface)";
      const vitalSigns = typeof data.vital_signs === "object" 
        ? JSON.stringify(data.vital_signs) 
        : (data.vital_signs || "Eyes: 95% | Arteries: TLS 1.3 | Bones: Enforced | Brain: Audit Ready");
      const abuseToken = data.abuse_token || ("TOK-" + Utilities.getUuid().substring(0, 8));

      // HIDDEN ANTI-ABUSE LOGIC (Check past 24 hours for duplicate email/domain)
      let isRateLimited = false;
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const rows = pdfSheet.getDataRange().getValues();

      for (let i = 1; i < rows.length; i++) {
        const rowDate = new Date(rows[i][0]);
        const rowEmail = (rows[i][1] || "").toString().toLowerCase().trim();
        const rowDomain = (rows[i][2] || "").toString().toLowerCase().trim();

        if ((rowEmail === email || rowDomain === domain) && rowDate > last24h) {
          isRateLimited = true;
          break;
        }
      }

      if (isRateLimited) {
        // Record rate-limited attempt without sending redundant email
        pdfSheet.appendRow([
          timestamp,
          email,
          domain,
          role,
          posture,
          vitalSigns,
          "Already Subscribed",
          "Rate Limited (Within 24h Cooldown)",
          "DIRECTOR R.E.P. / SecOps Lead",
          abuseToken,
          "Duplicate request intercepted by Anti-Abuse engine."
        ]);

        return ContentService
          .createTextOutput(JSON.stringify({ 
            status: "rate_limited", 
            message: "An assessment for this domain/email was already dispatched in the active 24-hour cycle." 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Valid New Lead: Append to Sheet
      pdfSheet.appendRow([
        timestamp,
        email,
        domain,
        role,
        posture,
        vitalSigns,
        "Subscribed (CISO Threat Briefing)",
        "Dispatched via Email",
        "DIRECTOR R.E.P. / SecOps Lead",
        abuseToken,
        "Initial Mini S.P.A. PDF report dispatched. Awaiting conversational reply or consultation booking."
      ]);

      // 1. Dispatch Professional Attestation & Remediation Email to the Corporate User
      if (email && email.indexOf("@") !== -1) {
        const userSubject = "🛡️ Anergi Mini S.P.A. Executive Attestation & Remediation Roadmap // " + domain.toUpperCase();
        
        const htmlBody = 
          "<div style='font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>" +
            "<div style='background-color: #2d3238; padding: 24px 30px; border-bottom: 3px solid #f59e0b;'>" +
              "<h1 style='color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;'>ANERGI ALLIANCE // EXECUTIVE S.P.A.</h1>" +
              "<p style='color: #f59e0b; margin: 6px 0 0 0; font-size: 12px; font-family: monospace; font-weight: bold;'>OFFICIAL PERIMETER ATTESTATION & REMEDIATION DOSSIER</p>" +
            "</div>" +
            
            "<div style='padding: 30px; color: #334155; line-height: 1.6; font-size: 14px;'>" +
              "<p>Dear " + role + ",</p>" +
              "<p>Thank you for requesting an executive evaluation for <strong>" + domain + "</strong>. Your Mini S.P.A. surface attestation and unredacted remediation directives have been compiled below.</p>" +
              
              "<div style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;'>" +
                "<div style='font-size: 11px; font-family: monospace; color: #64748b; margin-bottom: 6px;'>ASSESSMENT SUMMARY // " + timestamp.toUTCString() + "</div>" +
                "<div style='font-size: 18px; font-weight: bold; color: #0f172a;'>Overall Posture: <span style='color: #0284c7;'>" + posture + "</span></div>" +
                "<div style='margin-top: 8px; font-size: 12px; font-family: monospace; color: #475569;'>" + vitalSigns + "</div>" +
              "</div>" +

              "<h3 style='color: #0f172a; margin-top: 24px; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;'>UNREDACTED CLINICAL REMEDIATION DIRECTIVES</h3>" +
              
              "<div style='margin-bottom: 16px;'>" +
                "<strong style='color: #0f172a;'>1. The Bones // Structural Framing & Clickjacking Defense:</strong>" +
                "<p style='margin: 4px 0 8px 0; font-size: 13px;'>Inject the following header directive into your reverse-proxy (Nginx, Cloudflare, or Apache) to enforce strict UI framing compliance:</p>" +
                "<pre style='background-color: #1e293b; color: #38bdf8; padding: 10px; border-radius: 6px; font-size: 12px; overflow-x: auto;'>Content-Security-Policy: frame-ancestors &#39;none&#39;;</pre>" +
              "</div>" +

              "<div style='margin-bottom: 16px;'>" +
                "<strong style='color: #0f172a;'>2. The Eyes // DNS & Perimeter Zone Hygiene:</strong>" +
                "<p style='margin: 4px 0; font-size: 13px;'>Implement automated weekly DNS zone diff tracking to verify orphaned subdomains and maintain <code>p=reject</code> DMARC alignment.</p>" +
              "</div>" +

              "<div style='margin-bottom: 16px;'>" +
                "<strong style='color: #0f172a;'>3. The Arteries // Transport Encryption & PFS Hygiene:</strong>" +
                "<p style='margin: 4px 0; font-size: 13px;'>Strictly enforce TLS 1.3 with <code>TLS_AES_128_GCM_SHA256</code> cipher handshake suites. Enforce HSTS preload with <code>max-age=31536000; includeSubDomains; preload</code>.</p>" +
              "</div>" +

              "<div style='margin-bottom: 24px;'>" +
                "<strong style='color: #0f172a;'>4. The Brains // AI Governance & Model Risk Isolation:</strong>" +
                "<p style='margin: 4px 0; font-size: 13px;'>Ensure AI model endpoints adhere to ISO 42001 and EU AI Act Category II controls via isolated reverse-proxy prompt diodes.</p>" +
              "</div>" +

              "<div style='background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 18px; margin: 24px 0; border-radius: 0 8px 8px 0;'>" +
                "<h4 style='color: #1e40af; margin: 0 0 6px 0; font-size: 14px;'>CONVERSE WITH OUR SECOPS ALLIANCE TEAM</h4>" +
                "<p style='margin: 0; font-size: 13px; color: #1e3a8a;'>" +
                  "Need step-by-step guidance implementing these directives, or require a formal Underwriter Evidence Dossier for cyber insurance discounts? " +
                  "<strong>Simply reply directly to this email</strong> to converse with <strong>DIRECTOR R.E.P.</strong> and our lead SecOps architecture team." +
                "</p>" +
              "</div>" +

              "<div style='border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #64748b;'>" +
                "<p style='margin: 0 0 6px 0;'><strong>Newsletter & Threat Advisory:</strong> You have been enrolled in our monthly CISO Threat Intelligence Briefing covering active perimeter threat telemetry and underwriter discount benchmarks. You may reply 'UNSUBSCRIBE' at any time to opt out.</p>" +
                "<p style='margin: 0;'>&copy; 2026 Anergi.io &bull; Ricochet Ephemeral Protocol (R.E.P.) &bull; Confidential Executive Briefing</p>" +
              "</div>" +
            "</div>" +
          "</div>";

        MailApp.sendEmail({
          to: email,
          subject: userSubject,
          htmlBody: htmlBody,
          name: "Anergi SecOps Alliance"
        });
      }

      // 2. Dispatch Alert to Owner (info@anergi.io)
      if (NOTIFICATION_EMAIL) {
        const adminSubject = "🛡️ New Mini S.P.A. PDF Dispatch: " + email + " (" + domain + ")";
        const adminBody = 
          "NEW ANERGI.IO MINI S.P.A. SIGNUP & DISPATCH:\n" +
          "------------------------------------------\n" +
          "Target Domain: " + domain + "\n" +
          "Corporate Email: " + email + "\n" +
          "Executive Role: " + role + "\n" +
          "Posture Score:  " + posture + "\n" +
          "Vital Signs:    " + vitalSigns + "\n" +
          "Newsletter:     Enrolled (Monthly Briefing)\n" +
          "Anti-Abuse ID:  " + abuseToken + "\n" +
          "Timestamp:      " + timestamp.toUTCString() + "\n" +
          "------------------------------------------\n\n" +
          "Open Master Sheet: https://docs.google.com/spreadsheets/d/1upMVnAbHQWeJFPsoesvTj_xutROxBnZ16sm4vfFaeKI/edit";

        MailApp.sendEmail(NOTIFICATION_EMAIL, adminSubject, adminBody, {
          name: "Anergi.io Dispatch"
        });
      }

      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: "success", 
          message: "Executive assessment dispatched via email and recorded to Master Operations Hub", 
          domain: domain,
          email: email
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // ROUTE 2: CONTACT INTAKE FORM, CALENDAR BOOKINGS, & CHATBOT
    // =========================================================================
    let leadsSheet = ss.getSheetByName(LEADS_SHEET_NAME);
    if (!leadsSheet) {
      leadsSheet = ss.insertSheet(LEADS_SHEET_NAME);
      leadsSheet.appendRow([
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
      leadsSheet.setFrozenRows(1);
    }

    const fullName = data.full_name || data.name || data.fullName || "N/A";
    const email = (data.corporate_email || data.email || "N/A").toString().toLowerCase().trim();
    const domain = (data.target_domain || data.domain || data.companyDomain || "N/A").toString().toLowerCase().trim();
    const scope = data.assessment_scope || data.scope || data.assessmentScope || "Mini S.P.A. Surface Audit Review (Free)";
    const windowSlot = data.selected_window || data.appointment_time || data.appointmentSlot || "Pending Confirmation";
    const notes = data.notes || "";

    leadsSheet.appendRow([
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
  return ContentService.createTextOutput("Anergi.io Webhook Active. Ready for Leads & Mini S.P.A. Dispatches.");
}
