# Google Forms Scripts — NIELIT Nomination Forms

Two Apps Script files to auto-create Google Forms that feed directly
into the Flask nomination-form generator.

---

## Files

| File | Purpose |
|---|---|
| `CreateGOTForm.gs` | Creates the GOT form (ARVR + BDDS · Basic + Advanced) |
| `CreateBootcampForm.gs` | Creates the Bootcamp form (ARVR + BDDS · Bootcamp) |
| `Utils.gs` | Run both at once; fix sheet column headers; debug helpers |

---

## Setup (do this once per form)

### Step 1 — Open Apps Script

Go to [script.google.com](https://script.google.com) → **New project**.

### Step 2 — Add the scripts

For the GOT form:
- Rename the default `Code.gs` to `CreateGOTForm.gs`
- Paste the contents of `CreateGOTForm.gs`
- Add a new file → `Utils.gs` → paste Utils contents

For the Bootcamp form (can be a separate project):
- Repeat with `CreateBootcampForm.gs` + `Utils.gs`

Or use one project with all three files for convenience.

### Step 3 — Run

| What you want | Function to run |
|---|---|
| Create GOT form only | `createGOTNominationForm` |
| Create Bootcamp form only | `createBootcampNominationForm` |
| Create both at once | `createBothForms` (in Utils.gs) |

Click **Run** → grant permissions → check **View → Logs** for the Form URL and Sheet URL.

### Step 4 — Share the form

Copy the **Form URL** from the logs and send it to nominees.

---

## Exporting responses to CSV

1. Open the **Response Sheet URL** from the logs.
2. **File → Download → Comma Separated Values (.csv)**.
3. Upload that CSV to the Flask app.

---

## Column name fix (optional but recommended)

Google Forms puts the question titles as sheet headers. Some have spaces
instead of underscores, which won't match the DOCX placeholders.

To fix this automatically:

1. Open `Utils.gs`.
2. Paste your sheet URLs into `GOT_SHEET_URL` and `BOOTCAMP_SHEET_URL`.
3. Run `fixGOTSheetHeaders()` or `fixBootcampSheetHeaders()`.

This renames the header row so the downloaded CSV has columns like
`Contact_Number`, `Edu1_Year`, `Beneficiary_Category` — exactly what
the Flask app and DOCX templates expect.

---

## Form structure

Both forms are multi-page with these sections:

| Section | Fields |
|---|---|
| Programme Details | Track, Level, Course Name, Dates, Resource Centre |
| Personal Details | Title, Name, DOB, Gender, Aadhar, State, District |
| Contact Details | Contact Number, Email |
| Organisation Details | Organisation, Department, Designation, Status, Beneficiary Category |
| Institute Address | Address, Contact, Email |
| Educational Qualifications | Highest Qualification + Edu1–Edu3 (Year/Degree/University) |
| Technical Experience | Exp1–Exp3 (Year/Area/Centre) |
| Previous FSP | Yes/No + up to 2 details |
| Recommendation | Head Name/Designation/Seal, Recommended Status, Role |

### GOT vs Bootcamp differences

| Feature | GOT Form | Bootcamp Form |
|---|---|---|
| Level choices | Basic, Advanced | Bootcamp (fixed) |
| Status options | In-service first | Pursuing first (student-friendly) |
| Beneficiary order | IT Employees first | Career aspirant/Student first |
| Help text tone | Professional | Student-friendly |

---

## Auto-injected fields (no form question needed)

These are filled automatically by the Flask app based on Track + Level:

- `Domain` — e.g. Augmented and Virtual Reality (AR & VR)
- `Course_Name` — e.g. GOT – AR & VR (Basic)
- `Course_Level` — Basic / Advanced / Bootcamp
- `Program_Type` — GOT or Bootcamp
- `Form_Title` — full form title
- `Today_Date` — today's date
- `Organisation_Department` — built from Organisation + Department
- `Contact_Number_Email` — built from Contact_Number + Email
- `Educational_Qualifications` — built from Edu1–Edu3 rows
- `Research_Technical_Experience` — built from Exp1–Exp3 rows

---

## Validation built into the forms

| Field | Validation |
|---|---|
| Aadhar | Number between 100000000000–999999999999 |
| Contact Number | Number between 6000000000–9999999999 |
| Email | Must be valid email format |
| Institute Email | Must be valid email format |
