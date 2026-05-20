/**
 * ============================================================
 *  NIELIT Forms Utility — Run Both + Fix Sheet Headers
 *
 *  Functions in this file:
 *
 *  createBothForms()
 *    → Creates both the GOT form and Bootcamp form in one run.
 *      Useful if you want both at once.
 *
 *  fixSheetHeaders(spreadsheetUrl)
 *    → After responses come in, call this to rename the
 *      Google Sheet header row to exactly match the CSV
 *      column names the Flask app expects.
 *      Pass the Sheet URL from the Logger output.
 *
 *  HOW TO USE fixSheetHeaders:
 *    1. Open this script file.
 *    2. Edit the SHEET_URL constant below with your sheet URL.
 *    3. Run fixSheetHeaders() (no argument needed when using
 *       the constant).
 * ============================================================
 */

// ── Paste your Sheet URLs here before running fixSheetHeaders ─
var GOT_SHEET_URL      = "PASTE_GOT_SHEET_URL_HERE";
var BOOTCAMP_SHEET_URL = "PASTE_BOOTCAMP_SHEET_URL_HERE";

// ── Column name maps: Google Form question title → CSV column name ──────────
// Only entries that differ need to be listed.
// Any question title that already matches the CSV column can be omitted.

var GOT_COLUMN_MAP = {
  "Timestamp":                   "Timestamp",
  "Track":                       "Track",
  "Level":                       "Level",
  "Course Name":                 "Course_Name",
  "Course Start Date":           "Course_Start_Date",
  "Date of Training":            "Date_of_Training",
  "Resource Centre Name":        "Resource_Centre_Name",
  "Title":                       "Title",
  "Name":                        "Name",
  "DOB":                         "DOB",
  "Gender":                      "Gender",
  "Aadhar":                      "Aadhar",
  "Native State":                "Native_State",
  "District":                    "District",
  "Contact Number":              "Contact_Number",
  "Email":                       "Email",
  "Organisation":                "Organisation",
  "Department":                  "Department",
  "Designation":                 "Designation",
  "Status":                      "Status",
  "Beneficiary Category":        "Beneficiary_Category",
  "Organization / Academic Institute": "Organization_Academic_Institute",
  "Institute Address":           "Institute_Address",
  "Institute Contact":           "Institute_Contact",
  "Institute Email":             "Institute_Email",
  "Highest Qualification":       "Highest_Qualification",
  "Edu1_Year":                   "Edu1_Year",
  "Edu1_Degree":                 "Edu1_Degree",
  "Edu1_University":             "Edu1_University",
  "Edu2_Year":                   "Edu2_Year",
  "Edu2_Degree":                 "Edu2_Degree",
  "Edu2_University":             "Edu2_University",
  "Edu3_Year":                   "Edu3_Year",
  "Edu3_Degree":                 "Edu3_Degree",
  "Edu3_University":             "Edu3_University",
  "Exp1_Year":                   "Exp1_Year",
  "Exp1_Area_of_Expertise":      "Exp1_Area_of_Expertise",
  "Exp1_Centre":                 "Exp1_Centre",
  "Exp2_Year":                   "Exp2_Year",
  "Exp2_Area_of_Expertise":      "Exp2_Area_of_Expertise",
  "Exp2_Centre":                 "Exp2_Centre",
  "Exp3_Year":                   "Exp3_Year",
  "Exp3_Area_of_Expertise":      "Exp3_Area_of_Expertise",
  "Exp3_Centre":                 "Exp3_Centre",
  "Previous FSP Program":        "Previous_FSP_Program",
  "Previous FSP Details 1":      "Previous_FSP_Details_1",
  "Previous FSP Details 2":      "Previous_FSP_Details_2",
  "Head Name Designation Seal":  "Head_Name_Designation_Seal",
  "Recommended Status":          "Recommended_Status",
  "Role":                        "Role"
};

// Bootcamp uses the same map (fields are identical)
var BOOTCAMP_COLUMN_MAP = GOT_COLUMN_MAP;


// ── Create both forms in one run ─────────────────────────────
function createBothForms() {
  Logger.log("Creating GOT form...");
  createGOTNominationForm();
  Logger.log("Creating Bootcamp form...");
  createBootcampNominationForm();
  Logger.log("Done. Check the logs above for both Form and Sheet URLs.");
}


// ── Fix sheet column headers ─────────────────────────────────
/**
 * Renames the header row of the response Sheet so that the
 * downloaded CSV has exactly the column names the Flask app expects.
 *
 * @param {string} [sheetUrl] - Spreadsheet URL. Defaults to GOT_SHEET_URL.
 */
function fixGOTSheetHeaders(sheetUrl) {
  _fixHeaders(sheetUrl || GOT_SHEET_URL, GOT_COLUMN_MAP, "GOT");
}

function fixBootcampSheetHeaders(sheetUrl) {
  _fixHeaders(sheetUrl || BOOTCAMP_SHEET_URL, BOOTCAMP_COLUMN_MAP, "Bootcamp");
}

function _fixHeaders(url, columnMap, label) {
  if (!url || url.indexOf("http") === -1) {
    Logger.log("ERROR: Invalid or missing sheet URL for " + label + ".");
    Logger.log("Paste the URL into GOT_SHEET_URL or BOOTCAMP_SHEET_URL at the top of this file.");
    return;
  }

  var ss    = SpreadsheetApp.openByUrl(url);
  var sheet = ss.getSheets()[0];  // First sheet = Form Responses
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  var headers = range.getValues()[0];

  var renamed = 0;
  var newHeaders = headers.map(function(h) {
    var mapped = columnMap[h.trim()];
    if (mapped && mapped !== h) {
      renamed++;
      return mapped;
    }
    return h;
  });

  range.setValues([newHeaders]);
  Logger.log(label + " sheet: renamed " + renamed + " column(s).");
  Logger.log("Header row is now ready for Flask app CSV export.");
}


// ── Quick test: log all question titles from a live form ─────
/**
 * Useful for debugging — logs every question title in a form
 * so you can verify question names match the column map.
 *
 * @param {string} formUrl - The edit URL of the form.
 */
function logFormQuestions(formUrl) {
  var form  = FormApp.openByUrl(formUrl);
  var items = form.getItems();
  Logger.log("Questions in: " + form.getTitle());
  items.forEach(function(item, i) {
    Logger.log((i + 1) + ". [" + item.getType() + "] " + item.getTitle());
  });
}
