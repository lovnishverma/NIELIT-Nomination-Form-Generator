# NIELIT Nomination Form Generator (ARVR + BDDS)

Flask web app for bulk nomination form generation from a Google Form CSV export.  
Upload one CSV → get one ZIP containing all filled `.docx` files.

---

## Architecture: 2 Templates for 6 Form Types

| Template file | Covers |
|---|---|
| `docxtemplates/GOT_Nomination_Form.docx` | ARVR_BASIC, ARVR_ADVANCED, BDDS_BASIC, BDDS_ADVANCED |
| `docxtemplates/Bootcamp_Nomination_Form.docx` | ARVR_BOOTCAMP, BDDS_BOOTCAMP |

Domain-specific fields (`{Domain}`, `{Course_Name}`, `{Course_Level}`, `{Program_Type}`, `{Form_Title}`) are injected **automatically** per row — so one template handles all ARVR and BDDS variants without any manual editing.

---

## Placeholder Reference

### Auto-injected per form type (no CSV column needed)

| Placeholder | Example value |
|---|---|
| `{Domain}` | Augmented and Virtual Reality (AR & VR) |
| `{Course_Name}` | GOT – AR & VR (Basic) |
| `{Course_Level}` | Basic / Advanced / Bootcamp |
| `{Technology}` | Augmented and Virtual Reality |
| `{Program_Type}` | GOT (Government of Tomorrow) |
| `{Form_Title}` | ARVR GOT-Basic Nomination Form |
| `{Today_Date}` | 20-05-2026 |

### From CSV columns (match placeholder name exactly)

Use `{ColumnName}` or `<<ColumnName>>` inside your `.docx` template.

Common fields: `{Name}`, `{Designation}`, `{Organisation}`, `{DOB}`, `{Gender}`, `{Aadhar}`, `{Contact_Number}`, `{Email}`, `{Department}`, `{Date_of_Training}`, `{Resource_Centre_Name}`, `{Native_State}`, `{District}`, `{Highest_Qualification}`, `{Status}`, `{Beneficiary_Category}`.

### Auto-computed composite fields

| Placeholder | Built from |
|---|---|
| `{Organisation_Department}` | Organisation + Department |
| `{Contact_Number_Email}` | Contact_Number + Email |
| `{Institute_Address_Contact_Email}` | Institute_Address + Institute_Contact + Institute_Email |
| `{Educational_Qualifications}` | Edu1_Year/Degree/University … Edu5_* |
| `{Research_Technical_Experience}` | Exp1_Year/Area_of_Expertise/Centre … Exp5_* |
| `{Applicant_Name}` | Name or Candidate_Name |
| `{Gov_ID_Number}` | Aadhar |

---

## CSV Column Guide

### Minimum required columns

```csv
Form_Type,Name
ARVR_BASIC,Amit Kumar
```

OR

```csv
Track,Level,Name
ARVR,Basic,Amit Kumar
BDDS,Bootcamp,Arjun Rao
```

### Form_Type accepted values

| Value in CSV | Resolves to |
|---|---|
| ARVR_Basic, ARVR_GOT_Basic | ARVR_BASIC |
| ARVR_Advanced, ARVR_GOT_Advanced | ARVR_ADVANCED |
| ARVR_Bootcamp, ARVR_Boot_Camp, ARVR_GOT_Bootcamp | ARVR_BOOTCAMP |
| BDDS_Basic, BDDS_GOT_Basic | BDDS_BASIC |
| BDDS_Advanced, BDDS_GOT_Advanced | BDDS_ADVANCED |
| BDDS_Bootcamp, BDDS_Boot_Camp, BDDS_GOT_Bootcamp | BDDS_BOOTCAMP |

### Column aliases (auto-mapped)

| CSV header | Maps to |
|---|---|
| AADHAR_NO, AADHAAR_NO, AADHAAR_NUMBER | Aadhar |
| MOBILE_NUMBER, PHONE_NUMBER | Contact_Number |
| EMAIL_ID, E_MAIL | Email |

---

## Project Structure

```
project_fsp/
├── app.py
├── README.md
├── requirements.txt
├── sample_master.csv
├── data.csv
├── app_errors.log
├── templates/
│   └── index.html
├── docxtemplates/             ← place BOTH templates here
│   ├── GOT_Nomination_Form.docx
│   └── Bootcamp_Nomination_Form.docx
└── scripts/
    └── inject_placeholders.py  ← standalone testing tool
```

---

## Setup

```bash
pip install -r requirements.txt
python app.py
```

Open: http://127.0.0.1:5000

---

## Testing Without the Web App

```bash
# List all placeholders in a template
python scripts/inject_placeholders.py \
    --template docxtemplates/GOT_Nomination_Form.docx \
    --csv sample_master.csv --row 0 --list

# Fill and output a test document
python scripts/inject_placeholders.py \
    --csv sample_master.csv --row 0 --out test_out.docx

# Pass data manually
python scripts/inject_placeholders.py \
    --template docxtemplates/Bootcamp_Nomination_Form.docx \
    --data "Name=Amit Kumar" "Form_Type=ARVR_BOOTCAMP" "Organisation=NIELIT"
```

---

## Building Your DOCX Templates

Inside your `.docx` template, use placeholders anywhere:

- In paragraphs: `{Name}`, `{Domain}`, `{Course_Name}` …
- Inside table cells: same syntax
- In headers/footers: same syntax

**Supported formats:** `{FieldName}` and `<<FieldName>>`

The app handles placeholders split across multiple runs (common when typing in Word).

---

## Error Handling

- Bad rows are skipped; valid rows still generate.
- All errors logged to `app_errors.log` with row number.
- Partial success shows a warning flash with count.
- If 0 rows succeed, no ZIP is sent and an error is shown.

---

## Tech Stack

Python · Flask · Pandas · python-docx · zipfile · io.BytesIO
