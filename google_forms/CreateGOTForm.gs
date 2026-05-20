/**
 * ============================================================
 *  NIELIT GOT Nomination Form Creator
 *  Covers: ARVR GOT-Basic, ARVR GOT-Advanced,
 *          BDDS GOT-Basic, BDDS GOT-Advanced
 *
 *  HOW TO USE:
 *  1. Open script.google.com → New Project → paste this file.
 *  2. Run createGOTNominationForm().
 *  3. Grant permissions when prompted.
 *  4. The Form URL and linked Sheet URL are logged in
 *     View → Logs (Ctrl+Enter).
 *  5. Export responses: Google Sheets → File → Download → CSV.
 *     Upload that CSV directly to the Flask app.
 * ============================================================
 */

// ── Configuration ────────────────────────────────────────────
var FORM_TITLE       = "NIELIT GOT Nomination Form (ARVR & BDDS)";
var FORM_DESCRIPTION =
  "Government of Tomorrow (GOT) Programme — Nomination Form\n" +
  "Covers: AR & VR | Big Data & Data Science\n" +
  "Levels: Basic | Advanced\n\n" +
  "Fill all mandatory fields (*). Your response will be used to " +
  "generate an official nomination document.";

// ── Main entry point ─────────────────────────────────────────
function createGOTNominationForm() {
  var form = FormApp.create(FORM_TITLE);
  form.setDescription(FORM_DESCRIPTION)
      .setCollectEmail(false)
      .setAllowResponseEdits(false)
      .setLimitOneResponsePerUser(false)
      .setProgressBar(true)
      .setShuffleQuestions(false);

  // ── Hidden / auto-filled fields ──────────────────────────
  // Form_Type is derived by the Flask app from Track + Level,
  // but we also add it explicitly so the CSV is unambiguous.

  // ── SECTION 1: Programme Details ────────────────────────
  addSectionHeader(form,
    "Programme Details",
    "Select the domain and level you are nominating for."
  );

  form.addListItem()
      .setTitle("Track *")
      .setHelpText("Select the technology domain.")
      .setChoiceValues(["ARVR", "BDDS"])
      .setRequired(true);

  form.addListItem()
      .setTitle("Level *")
      .setHelpText("Select the programme level.")
      .setChoiceValues(["Basic", "Advanced"])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Course Name")
      .setHelpText(
        "Leave blank — auto-filled based on Track + Level.\n" +
        "Examples: GOT – AR & VR (Basic) | GOT – Big Data & Data Science (Advanced)"
      )
      .setRequired(false);

  form.addDateItem()
      .setTitle("Course Start Date")
      .setHelpText("Expected start date of the training programme.")
      .setRequired(false)
      .setIncludesYear(true);

  form.addDateItem()
      .setTitle("Date of Training")
      .setHelpText("Scheduled date of training / nomination date.")
      .setRequired(false)
      .setIncludesYear(true);

  form.addTextItem()
      .setTitle("Resource Centre Name")
      .setHelpText("e.g. NIELIT Chandigarh")
      .setRequired(false);

  // ── SECTION 2: Applicant Personal Details ────────────────
  addSectionHeader(form,
    "Applicant Personal Details",
    "Provide accurate personal information as per government ID."
  );

  form.addListItem()
      .setTitle("Title *")
      .setChoiceValues(["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Name *")
      .setHelpText("Full name as on government-issued ID.")
      .setRequired(true);

  form.addDateItem()
      .setTitle("DOB *")
      .setHelpText("Date of Birth.")
      .setRequired(true)
      .setIncludesYear(true);

  form.addMultipleChoiceItem()
      .setTitle("Gender *")
      .setChoiceValues(["M", "F", "Other", "Prefer not to say"])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Aadhar")
      .setHelpText("12-digit Aadhaar number (optional but recommended).")
      .setRequired(false)
      .setValidation(
        FormApp.createTextValidation()
          .requireNumberBetween(100000000000, 999999999999)
          .build()
      );

  form.addTextItem()
      .setTitle("Native State")
      .setRequired(false);

  form.addTextItem()
      .setTitle("District")
      .setRequired(false);

  // ── SECTION 3: Contact Details ───────────────────────────
  addSectionHeader(form,
    "Contact Details",
    "Provide working contact details for correspondence."
  );

  form.addTextItem()
      .setTitle("Contact Number *")
      .setHelpText("10-digit mobile number.")
      .setRequired(true)
      .setValidation(
        FormApp.createTextValidation()
          .requireNumberBetween(6000000000, 9999999999)
          .build()
      );

  form.addTextItem()
      .setTitle("Email *")
      .setHelpText("Official or personal e-mail address.")
      .setRequired(true)
      .setValidation(
        FormApp.createTextValidation()
          .requireTextIsEmail()
          .build()
      );

  // ── SECTION 4: Organisation / Institute Details ──────────
  addSectionHeader(form,
    "Organisation / Institute Details",
    "Details of the applicant's current employer or institution."
  );

  form.addTextItem()
      .setTitle("Organisation *")
      .setHelpText("Name of employer / organisation.")
      .setRequired(true);

  form.addTextItem()
      .setTitle("Department")
      .setHelpText("Department or unit within the organisation.")
      .setRequired(false);

  form.addTextItem()
      .setTitle("Designation *")
      .setHelpText("Current job title / designation.")
      .setRequired(true);

  form.addListItem()
      .setTitle("Status *")
      .setHelpText("Current employment / academic status.")
      .setChoiceValues([
        "In-service",
        "Passed out",
        "Pursuing",
        "Retired",
        "Other"
      ])
      .setRequired(true);

  form.addListItem()
      .setTitle("Beneficiary Category *")
      .setChoiceValues([
        "IT Employees",
        "Career aspirant/Student",
        "Faculty",
        "Government Employee",
        "Other"
      ])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Organization / Academic Institute")
      .setHelpText("Full name of the academic institution (if applicable).")
      .setRequired(false);

  // ── Institute address block ──────────────────────────────
  addSectionHeader(form,
    "Institute / Office Address",
    "Contact details of the institute or office recommending this nomination."
  );

  form.addParagraphTextItem()
      .setTitle("Institute Address")
      .setHelpText("Complete postal address.")
      .setRequired(false);

  form.addTextItem()
      .setTitle("Institute Contact")
      .setHelpText("STD/ISD phone number of the institute.")
      .setRequired(false);

  form.addTextItem()
      .setTitle("Institute Email")
      .setHelpText("Official e-mail of the institute.")
      .setRequired(false)
      .setValidation(
        FormApp.createTextValidation()
          .requireTextIsEmail()
          .build()
      );

  // ── SECTION 5: Qualifications ────────────────────────────
  addSectionHeader(form,
    "Educational Qualifications",
    "List up to 3 qualifications (most recent first)."
  );

  form.addTextItem()
      .setTitle("Highest Qualification")
      .setHelpText("e.g. B.Tech CSE, M.Sc Data Science")
      .setRequired(false);

  for (var i = 1; i <= 3; i++) {
    form.addTextItem()
        .setTitle("Edu" + i + "_Year")
        .setHelpText("Year of passing for qualification " + i)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Edu" + i + "_Degree")
        .setHelpText("Degree / qualification name " + i)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Edu" + i + "_University")
        .setHelpText("University / Board for qualification " + i)
        .setRequired(false);
  }

  // ── SECTION 6: Research / Technical Experience ───────────
  addSectionHeader(form,
    "Research / Technical Experience",
    "List up to 3 relevant experiences (most recent first)."
  );

  for (var j = 1; j <= 3; j++) {
    form.addTextItem()
        .setTitle("Exp" + j + "_Year")
        .setHelpText("Year of experience " + j)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Exp" + j + "_Area_of_Expertise")
        .setHelpText("Area / topic for experience " + j)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Exp" + j + "_Centre")
        .setHelpText("Organisation / centre for experience " + j)
        .setRequired(false);
  }

  // ── SECTION 7: Previous FSP Participation ───────────────
  addSectionHeader(form,
    "Previous FSP Programme Participation",
    "Declare any prior participation in NIELIT FSP programmes."
  );

  form.addMultipleChoiceItem()
      .setTitle("Previous FSP Program *")
      .setHelpText("Have you attended any FSP programme before?")
      .setChoiceValues(["Yes", "No"])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Previous FSP Details 1")
      .setHelpText(
        "If Yes: Programme name / Centre / Date  (e.g. Cyber Security Bootcamp / NIELIT / 2025-09-12)"
      )
      .setRequired(false);

  form.addTextItem()
      .setTitle("Previous FSP Details 2")
      .setHelpText("Second prior programme (if any): Programme / Centre / Date")
      .setRequired(false);

  // ── SECTION 8: Recommendation ────────────────────────────
  addSectionHeader(form,
    "Recommendation & Declaration",
    "To be filled by the recommending officer / head of department."
  );

  form.addTextItem()
      .setTitle("Head Name Designation Seal")
      .setHelpText(
        "Full name, designation, and office seal of the recommending authority.\n" +
        "e.g. Director, NIELIT Chandigarh"
      )
      .setRequired(false);

  form.addListItem()
      .setTitle("Recommended Status")
      .setChoiceValues(["Recommended", "Not Recommended", "Pending"])
      .setRequired(false);

  form.addTextItem()
      .setTitle("Role")
      .setHelpText("Role of the nominating officer (e.g. Co-Lead, Course Coordinator).")
      .setRequired(false);

  // ── Link to Google Sheet ─────────────────────────────────
  var sheet = SpreadsheetApp.create(FORM_TITLE + " — Responses");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // ── Rename the response sheet column headers to match CSV ─
  // (responses land in Sheet1 automatically; column order follows question order)

  // ── Log output ───────────────────────────────────────────
  Logger.log("=== GOT Form Created ===");
  Logger.log("Form URL (share with nominees): " + form.getPublishedUrl());
  Logger.log("Edit URL (form editor):         " + form.getEditUrl());
  Logger.log("Response Sheet URL:             " + sheet.getUrl());
  Logger.log("");
  Logger.log("Next steps:");
  Logger.log("1. Share the Form URL with nominees.");
  Logger.log("2. When ready, open the Sheet → File → Download → CSV.");
  Logger.log("3. Upload the CSV to the Flask app to generate nomination DOCXs.");
}

// ── Helper: section page break with title + description ──────
function addSectionHeader(form, title, description) {
  form.addPageBreakItem()
      .setTitle(title)
      .setHelpText(description || "");
}
