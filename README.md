# NIELIT Nomination Form Generator (ARVR + BDDS)

Flask web app for bulk nomination form generation from a Google Form CSV export.  
Upload one CSV → get one ZIP containing all filled `.docx` files.

Live Demo: https://www.lovnishverma.in/NIELIT-Nomination-Form-Generator/

Sheet Link: https://docs.google.com/spreadsheets/d/1bVzFLDdF8Qd6bGijIg0esO2HruzX8vSWMT86HE3QVpE/edit?usp=sharing

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
| `{Course_Name}` | Bootcamp /GOT – ARVR / BDDS |
| `{Course_Level}` | Basic / Advanced / Bootcamp |
| `{Technology}` | Augmented and Virtual Reality |
| `{Program_Type}` | GOT (Government Official Training) |
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

Here is the complete backend setup to make your custom HTML frontend work. You need to set up the Google Sheet with the exact column headers and then attach the Apps Script to it.

## Deployment (Data Collection)

### Step 1: Set up the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank spreadsheet**.
2. Name it something like **NIELIT Custom Form Responses**.
3. In **Row 1**, copy and paste the following headers exactly as they appear below (start in A1 and go across). These perfectly match the `name` attributes in the final HTML code you have.

**Column Headers (A through AM):**
`Track`, `Level`, `Course_Start_Date`, `Resource_Centre_Name`, `Title`, `Name`, `DOB`, `Gender`, `Contact_Number`, `Email`, `Aadhar`, `Native_State`, `District`, `Organisation`, `Department`, `Designation`, `Status`, `Beneficiary_Category`, `Highest_Qualification`, `Edu1_Year`, `Edu1_Degree`, `Edu1_University`, `Edu2_Year`, `Edu2_Degree`, `Edu2_University`, `Edu3_Year`, `Edu3_Degree`, `Edu3_University`, `Exp1_Year`, `Exp1_Area_of_Expertise`, `Exp1_Centre`, `Exp2_Year`, `Exp2_Area_of_Expertise`, `Exp2_Centre`, `Exp3_Year`, `Exp3_Area_of_Expertise`, `Exp3_Centre`, `Previous_FSP_Program`, `Previous_FSP_Details_1`

*(Note: If a user selects "Bootcamp", the script will automatically leave the Edu1-3 and Exp1-3 columns perfectly blank in the sheet).*

### Step 2: Add the Google Apps Script

1. In your Google Sheet, click on **Extensions > Apps Script** from the top menu.
2. Delete any code in the editor (e.g., `function myFunction() {}`).
3. Paste the following complete code block into the editor:

```javascript
function doPost(e) {
  try {
    // Open the active sheet where responses will be saved
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data sent from your custom HTML frontend
    var data = JSON.parse(e.postData.contents);
    
    // Get the headers from Row 1 of your sheet
    var lastCol = sheet.getLastColumn();
    // Ensure we don't fail if the sheet is empty
    if (lastCol === 0) {
      throw new Error("Sheet has no headers. Please add headers to Row 1.");
    }
    
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var newRow = [];
    
    // Loop through the headers and map the incoming data
    for (var i = 0; i < headers.length; i++) {
      var headerName = headers[i].trim();
      
      // If the header exists in our submitted data, push it. Otherwise, push a blank string.
      if (data.hasOwnProperty(headerName)) {
        newRow.push(data[headerName]);
      } else {
        newRow.push(""); 
      }
    }
    
    // Append the compiled row to the bottom of the sheet
    sheet.appendRow(newRow);
    
    // Return a success response to the frontend
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Return an error response if something breaks
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required to handle CORS (Cross-Origin Resource Sharing) requests from your HTML file
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

```

4. Click the **Save** icon (the floppy disk) and name the project (e.g., "NIELIT Form Backend").

### Step 3: Deploy to get your Web App URL

1. In the top right corner of the Apps Script editor, click the blue **Deploy** button and select **New deployment**.
2. Click the **gear icon** ⚙️ next to "Select type" and choose **Web app**.
3. Fill out the configuration exactly like this:
* **Description:** Version 1 (or whatever you prefer)
* **Execute as:** `Me (your_email@gmail.com)`
* **Who has access:** `Anyone` *(This is required so the public HTML form can send data to it).*


4. Click **Deploy**.
5. Google will ask you to **Authorize Access**. Click it, choose your Google account, click **Advanced**, and then click **Go to [Project Name] (unsafe)**. Finally, click **Allow**.
6. You will now see a deployment screen with a **Web app URL** (it ends in `/exec`).

**Copy that Web app URL**.

### Step 4: Finalize the Frontend

Open your `index.html` file, scroll down to the `<script>` section at the bottom, and replace the placeholder URL with the real one you just copied:

```javascript
// Change this line in your HTML:
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycb...your...long...id.../exec";

```

Now, when anyone fills out your custom HTML form and clicks submit, the data will instantly format itself and drop perfectly into your new Google Sheet!
