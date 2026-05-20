/**
 * ============================================================
 *  NIELIT Bootcamp Nomination Form Creator
 *  Covers: ARVR Bootcamp | BDDS Bootcamp
 *
 *  HOW TO USE:
 *  1. Open script.google.com → New Project → paste this file.
 *  2. Run createBootcampNominationForm().
 *  3. Grant permissions when prompted.
 *  4. The Form URL and linked Sheet URL are logged in
 *     View → Logs (Ctrl+Enter).
 *  5. Export responses: Google Sheets → File → Download → CSV.
 *     Upload that CSV directly to the Flask app.
 * ============================================================
 */

// ── Configuration ────────────────────────────────────────────
var FORM_TITLE       = "NIELIT Bootcamp Nomination Form (ARVR & BDDS)";
var FORM_DESCRIPTION =
  "Future Skills Prime (FSP) — Bootcamp Programme — Nomination Form\n" +
  "Covers: AR & VR Bootcamp | Big Data & Data Science Bootcamp\n\n" +
  "Bootcamps are intensive short-duration programmes open to " +
  "career aspirants, students, and working professionals.\n\n" +
  "Fill all mandatory fields (*). Your response will be used to " +
  "generate an official nomination document.";

// ── Main entry point ─────────────────────────────────────────
function createBootcampNominationForm() {
  var form = FormApp.create(FORM_TITLE);
  form.setDescription(FORM_DESCRIPTION)
      .setCollectEmail(false)
      .setAllowResponseEdits(false)
      .setLimitOneResponsePerUser(false)
      .setProgressBar(true)
      .setShuffleQuestions(false);

  // ── SECTION 1: Bootcamp Programme Details ────────────────
  addSectionHeader(form,
    "Bootcamp Programme Details",
    "Select the Bootcamp domain you are nominating for."
  );

  form.addListItem()
      .setTitle("Track *")
      .setHelpText("Select the technology domain for the Bootcamp.")
      .setChoiceValues(["ARVR", "BDDS"])
      .setRequired(true);

  // Level is fixed as Bootcamp — we add it as a hidden constant
  // so the CSV column 'Level' exists and the Flask app can map it.
  form.addListItem()
      .setTitle("Level *")
      .setHelpText("Programme level (always Bootcamp for this form).")
      .setChoiceValues(["Bootcamp"])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Course Name")
      .setHelpText(
        "Leave blank — auto-filled by the processing app.\n" +
        "Examples: Bootcamp – AR & VR | Bootcamp – Big Data & Data Science"
      )
      .setRequired(false);

  form.addDateItem()
      .setTitle("Course Start Date")
      .setHelpText("Expected start date of the Bootcamp.")
      .setRequired(false)
      .setIncludesYear(true);

  form.addDateItem()
      .setTitle("Date of Training")
      .setHelpText("Scheduled training / nomination date.")
      .setRequired(false)
      .setIncludesYear(true);

  form.addTextItem()
      .setTitle("Resource Centre Name")
      .setHelpText("NIELIT centre conducting the Bootcamp. e.g. NIELIT Chandigarh")
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
    "Organisation / Institution Details",
    "Current employer or institution details. Students fill their college/university."
  );

  form.addTextItem()
      .setTitle("Organisation *")
      .setHelpText("Name of employer, college, or institution.")
      .setRequired(true);

  form.addTextItem()
      .setTitle("Department")
      .setHelpText("Department, branch, or unit.")
      .setRequired(false);

  form.addTextItem()
      .setTitle("Designation *")
      .setHelpText("Job title or academic role. e.g. Student, Analyst, Engineer.")
      .setRequired(true);

  form.addListItem()
      .setTitle("Status *")
      .setHelpText("Current employment or academic status.")
      .setChoiceValues([
        "Pursuing",
        "Passed out",
        "In-service",
        "Retired",
        "Other"
      ])
      .setRequired(true);

  form.addListItem()
      .setTitle("Beneficiary Category *")
      .setHelpText("Select the category that best describes you.")
      .setChoiceValues([
        "Career aspirant/Student",
        "IT Employees",
        "Faculty",
        "Government Employee",
        "Other"
      ])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Organization / Academic Institute")
      .setHelpText("Full name of academic institution (if applicable).")
      .setRequired(false);

  // ── Institute Address block ──────────────────────────────
  addSectionHeader(form,
    "Institute / Office Address",
    "Contact details of the institute or organisation recommending this nomination."
  );

  form.addParagraphTextItem()
      .setTitle("Institute Address")
      .setHelpText("Complete postal address of your institute / organisation.")
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
    "List up to 3 qualifications (most recent first). " +
    "Bootcamp is open to students currently pursuing degrees."
  );

  form.addTextItem()
      .setTitle("Highest Qualification")
      .setHelpText(
        "Your highest completed or ongoing qualification.\n" +
        "e.g. B.Tech CSE (Pursuing), HSC Science (Passed)"
      )
      .setRequired(false);

  for (var i = 1; i <= 3; i++) {
    form.addTextItem()
        .setTitle("Edu" + i + "_Year")
        .setHelpText("Year of passing / enrolment for qualification " + i)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Edu" + i + "_Degree")
        .setHelpText("Degree / programme name for qualification " + i)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Edu" + i + "_University")
        .setHelpText("University / Board / School for qualification " + i)
        .setRequired(false);
  }

  // ── SECTION 6: Technical Experience ─────────────────────
  addSectionHeader(form,
    "Technical / Project Experience",
    "List relevant projects, internships, or work experience (up to 3). " +
    "Leave blank if not applicable."
  );

  for (var j = 1; j <= 3; j++) {
    form.addTextItem()
        .setTitle("Exp" + j + "_Year")
        .setHelpText("Year of experience / project " + j)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Exp" + j + "_Area_of_Expertise")
        .setHelpText("Area / topic / technology for experience " + j)
        .setRequired(false);

    form.addTextItem()
        .setTitle("Exp" + j + "_Centre")
        .setHelpText("Organisation / lab / college for experience " + j)
        .setRequired(false);
  }

  // ── SECTION 7: Previous FSP Participation ───────────────
  addSectionHeader(form,
    "Previous FSP Programme Participation",
    "Declare any prior attendance in NIELIT FSP programmes."
  );

  form.addMultipleChoiceItem()
      .setTitle("Previous FSP Program *")
      .setHelpText("Have you attended any FSP programme before?")
      .setChoiceValues(["Yes", "No"])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Previous FSP Details 1")
      .setHelpText(
        "If Yes — Programme name / Centre / Date\n" +
        "e.g. AI Workshop / MeitY / 2024-11-02"
      )
      .setRequired(false);

  form.addTextItem()
      .setTitle("Previous FSP Details 2")
      .setHelpText("Second prior programme (if any): Programme / Centre / Date")
      .setRequired(false);

  // ── SECTION 8: Recommendation ────────────────────────────
  addSectionHeader(form,
    "Recommendation & Declaration",
    "To be filled and verified by the Head of Department or recommending authority."
  );

  form.addTextItem()
      .setTitle("Head Name Designation Seal")
      .setHelpText(
        "Full name, designation, and office seal of the recommending authority.\n" +
        "e.g. Head of Department, CSE — NIT Trichy"
      )
      .setRequired(false);

  form.addListItem()
      .setTitle("Recommended Status")
      .setChoiceValues(["Recommended", "Not Recommended", "Pending"])
      .setRequired(false);

  form.addTextItem()
      .setTitle("Role")
      .setHelpText(
        "Role of the recommending officer.\n" +
        "e.g. Course Coordinator, Training Officer, HOD"
      )
      .setRequired(false);

  // ── Link to Google Sheet ─────────────────────────────────
  var sheet = SpreadsheetApp.create(FORM_TITLE + " — Responses");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // ── Log output ───────────────────────────────────────────
  Logger.log("=== Bootcamp Form Created ===");
  Logger.log("Form URL (share with nominees): " + form.getPublishedUrl());
  Logger.log("Edit URL (form editor):         " + form.getEditUrl());
  Logger.log("Response Sheet URL:             " + sheet.getUrl());
  Logger.log("");
  Logger.log("Next steps:");
  Logger.log("1. Share the Form URL with Bootcamp nominees.");
  Logger.log("2. When ready, open the Sheet → File → Download → CSV.");
  Logger.log("3. Upload the CSV to the Flask app to generate nomination DOCXs.");
}

// ── Helper: section page break with title + description ──────
function addSectionHeader(form, title, description) {
  form.addPageBreakItem()
      .setTitle(title)
      .setHelpText(description || "");
}
