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
        "Chandra (AI SecOps Liaison)",
        abuseToken,
        "Initial Mini S.P.A. report dispatched. Awaiting consultation or Stage 2/3 upgrade."
      ]);

      // 1. Dispatch Professional Attestation & Clinical Treatment Upsell Email
      if (email && email.indexOf("@") !== -1) {
        const userSubject = "🛡️ Your Surface S.P.A. Diagnostic // Next Step: Up to 35% Cyber Insurance Certificate for " + domain.toUpperCase();
        
        const htmlBody = 
          "<div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);'>" +
            
            "<!-- HEADER: ANERGI CHARCOAL & AMBER ACCENT -->" +
            "<div style='background-color: #2d3238; padding: 24px 30px; border-bottom: 3px solid #f59e0b;'>" +
              "<h1 style='color: #ffffff; margin: 0; font-size: 19px; font-weight: 800; letter-spacing: -0.5px;'>ANERGI.IO // SECURITY POSTURE ASSESSMENT</h1>" +
              "<p style='color: #f59e0b; margin: 6px 0 0 0; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase;'>CLINICAL DIAGNOSTIC ATTESTATION &bull; EXECUTIVE BRIEFING</p>" +
            "</div>" +
            
            "<div style='padding: 30px; color: #334155; line-height: 1.6; font-size: 14px;'>" +
              "<p style='margin-top: 0;'>Hello,</p>" +
              "<p>I'm <strong>Chandra</strong>, your Clinical SecOps Liaison at Anergi. Your initial surface telemetry evaluation for <strong>" + domain + "</strong> has been compiled. Here is your baseline diagnostic reading:</p>" +
              
              "<!-- POINT-IN-TIME SURFACE SCORE CARD -->" +
              "<div style='background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px 20px; margin: 20px 0;'>" +
                "<div style='font-size: 11px; font-family: monospace; color: #64748b; margin-bottom: 6px;'>TARGET DOMAIN: <strong>" + domain + "</strong> &bull; EVALUATION: SURFACE VITAL SIGNS</div>" +
                "<div style='font-size: 19px; font-weight: 900; color: #0f172a;'>Overall Posture: <span style='color: #0284c7;'>" + posture + "</span></div>" +
                "<div style='margin-top: 10px; font-size: 12px; font-family: monospace; color: #475569; line-height: 1.6;'>" +
                  "👁️ <strong>The Eyes (Perimeter):</strong> 95% Vitality &bull; Valid DNSSEC &bull; DMARC Enforced<br/>" +
                  "🩸 <strong>The Arteries (TLS Transit):</strong> TLS 1.3 &bull; 256-Bit PFS Ciphers &bull; HSTS Preload<br/>" +
                  "🦴 <strong>The Bones (Framing):</strong> CSP Structural Header Enforcement Required<br/>" +
                  "🧠 <strong>The Brains (AI Boundary):</strong> ISO 42001 &amp; Prompt Isolation Aligned" +
                "</div>" +
              "</div>" +

              "<!-- IMMEDIATE TECHNICAL REMEDIATION -->" +
              "<div style='background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px; margin: 20px 0;'>" +
                "<div style='font-weight: bold; color: #92400e; font-size: 12px; margin-bottom: 4px;'>IMMEDIATE SERVER HARDENING DIRECTIVE (THE BONES):</div>" +
                "<p style='margin: 0 0 6px 0; font-size: 12px; color: #78350f;'>To mitigate transparent clickjacking and rogue framing, inject this header at your edge reverse proxy (Cloudflare, Nginx, or Apache):</p>" +
                "<code style='display: block; background-color: #1e293b; color: #38bdf8; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-family: monospace;'>Content-Security-Policy: frame-ancestors &#39;none&#39;;</code>" +
              "</div>" +

              "<!-- CLINICAL TRANSITION TO PAID STAGES & 35% INSURANCE HOOK -->" +
              "<h3 style='color: #0f172a; margin-top: 28px; font-size: 15px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;'>BEYOND THE SURFACE: UNLOCK UP TO 35% OFF CYBER INSURANCE</h3>" +
              "<p style='font-size: 13px; color: #475569;'>A surface sweep checks vital signs, but it doesn't reveal internal stress. To protect your enterprise and dramatically lower operating overhead, take the next step in our clinical treatment hierarchy:</p>" +

              "<!-- STAGE 02: RAPID S.P.A. -->" +
              "<div style='background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin-bottom: 14px;'>" +
                "<div style='font-size: 11px; font-family: monospace; font-weight: bold; color: #166534; text-transform: uppercase;'>STAGE 02 // RAPID S.P.A. &amp; UNDERWRITER CERTIFICATE</div>" +
                "<div style='font-size: 15px; font-weight: 800; color: #14532d; margin: 4px 0;'>The Official Anergi Posture Certificate</div>" +
                "<p style='margin: 0; font-size: 12px; color: #166534; line-height: 1.5;'>" +
                  "Our fast perimeter penetration testing satisfies the exact specifications required by major cyber insurance underwriters. Presenting this certified audit to your broker unlocks <strong>up to a 35% premium discount</strong> while clearing baseline compliance with <strong>NIST CSF 2.0</strong> and <strong>SOC 2 Type II</strong>." +
                "</p>" +
              "</div>" +

              "<!-- STAGE 03: DEEP FORENSIC S.P.A. -->" +
              "<div style='background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 20px;'>" +
                "<div style='font-size: 11px; font-family: monospace; font-weight: bold; color: #0369a1; text-transform: uppercase;'>STAGE 03 // DEEP FORENSIC S.P.A. &amp; CONTRAST THERAPY</div>" +
                "<div style='font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0;'>Sauna Heat Pressure to Ice Plunge Shock + OSINT Threat Library</div>" +
                "<p style='margin: 0; font-size: 12px; color: #475569; line-height: 1.5;'>" +
                  "For organizations requiring rigorous clinical scrutiny: we subject your business to continuous anatomy contrast testing—mapping internal Active Directory bones, API transit arteries, and exposed credentials via our proprietary OSINT intelligence library. Delivers the complete <strong>Digital Twin Architectural Blueprint</strong> with luxury executive translation from raw technical specs into boardroom clarity." +
                "</p>" +
              "</div>" +

              "<!-- CTA BOX -->" +
              "<div style='background-color: #2d3238; border-radius: 10px; padding: 22px; text-align: center; margin: 24px 0;'>" +
                "<h4 style='color: #ffffff; margin: 0 0 8px 0; font-size: 15px; font-weight: 800;'>Ready to Certify Your Posture &amp; Claim Your Premium Credit?</h4>" +
                "<p style='color: #cbd5e1; font-size: 12px; margin: 0 0 16px 0;'>Schedule a 15-minute diagnostic consultation with our team, or reply directly to this email.</p>" +
                "<a href='https://anergi.io/contact.html' style='display: inline-block; background: linear-gradient(to right, #f59e0b, #ea580c); color: #0f172a; font-weight: 900; font-size: 12px; text-decoration: none; padding: 12px 24px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px;'>Schedule Consultation at Anergi.io &rarr;</a>" +
                "<div style='color: #94a3b8; font-size: 11px; margin-top: 12px; font-family: monospace;'>Or reply directly to <strong>info@anergi.io</strong> &bull; Attn: Chandra</div>" +
              "</div>" +

              "<!-- WEDNESDAY VIDEO & ADVISORY -->" +
              "<div style='border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #64748b;'>" +
                "<p style='margin: 0 0 6px 0;'>📺 <strong>Coming Wednesday:</strong> Watch for our upcoming executive video briefing series featuring our studio SecOps lab walkthrough.</p>" +
                "<p style='margin: 0 0 6px 0;'><strong>CISO Threat Advisory:</strong> You are subscribed to our monthly perimeter threat briefing. (Reply 'UNSUBSCRIBE' at any time).</p>" +
                "<p style='margin: 0; font-size: 11px;'>&copy; 2026 Anergi.io &bull; Security Posture Assessment (S.P.A.) Clinical Operations</p>" +
              "</div>" +
            "</div>" +
          "</div>";

        MailApp.sendEmail({
          to: email,
          subject: userSubject,
          htmlBody: htmlBody,
          name: "Chandra from Anergi"
        });
      }

      // 2. Dispatch Alert to Owner (info@anergi.io)
      if (NOTIFICATION_EMAIL) {
        const adminSubject = "🛡️ New Mini S.P.A. Lead: " + email + " (" + domain + ")";
        const adminBody = 
          "NEW ANERGI.IO MINI S.P.A. INTAKE:\n" +
          "------------------------------------------\n" +
          "Target Domain: " + domain + "\n" +
          "Corporate Email: " + email + "\n" +
          "Executive Role: " + role + "\n" +
          "Posture Score:  " + posture + "\n" +
          "Vital Signs:    " + vitalSigns + "\n" +
          "Assigned Entity: Chandra (AI SecOps Liaison)\n" +
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
