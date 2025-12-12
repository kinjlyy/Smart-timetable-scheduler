/* ===== CONFIGURATION =====
   Replace both URLs with your actual ones:
   1️⃣ Google Apps Script (input)
   2️⃣ Output timetable spreadsheet ID
*/
const OUTPUT_SHEET_LINK = "https://docs.google.com/spreadsheets/d/1z_UC47iRkvbicMAU5xlZa1SGkhqwgxzAXbqRVuroevA/edit?usp=sharing";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTlZjLp5FSk1IIqPo0-tO24e-sHsRkjNbUl9AovOK-IcI1g2LujBAomPY3cZr_oGbLtA/exec";
const OUTPUT_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzgx9CnlmdecqIPqE3baE1rww4c-AVCTZ8SlGHBMU61YS1PNKjgV0CB9sDCKta8lNTa/exec";
const N8N_WEBHOOK_URL = "https://gaww.app.n8n.cloud/webhook/1dadd5f3-29e4-42a1-935e-b0bf4f1a2190";

const sectionsContainer = document.getElementById("sections-container");
const addSectionBtn = document.getElementById("btn-add-section");
const reviewBtn = document.getElementById("btn-review");
const submitBtn = document.getElementById("btn-submit");
const msgBox = document.getElementById("msg");

const reviewPanel = document.getElementById("review-panel");
const reviewContent = document.getElementById("review-content");
const closeReview = document.getElementById("close-review");
const confirmSubmit = document.getElementById("confirm-submit");

let sectionIndex = 0;
let sections = [];

/* === small helper === */
function el(tag, cls = "", html = "") {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

/* === Create Section UI === */
function createSectionCard() {
  sectionIndex++;
  const id = sectionIndex;
  const card = el("div", "section-card");
  card.id = `section-${id}`;

  const header = el("div", "flex justify-between items-center mb-3");
  header.innerHTML = `<h3>Section ${id}</h3>`;
  const removeBtn = el("button", "remove-btn");
  removeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
  removeBtn.onclick = () => {
    if (confirm("Remove this section?")) {
      sections = sections.filter(s => s.id !== id);
      card.remove();
    }
  };
  header.appendChild(removeBtn);
  card.appendChild(header);

  // section info
  const grid = el("div", "grid grid-cols-2 gap-4 mb-4");
  const nameDiv = el("div");
  nameDiv.innerHTML = `<label class='field-label'>Section Name</label>`;
  const nameInput = el("input", "input");
  nameInput.placeholder = "e.g. A";
  nameInput.oninput = () => updateMemory(id);
  nameDiv.appendChild(nameInput);

  const capDiv = el("div");
  capDiv.innerHTML = `<label class='field-label'>Capacity</label>`;
  const capInput = el("input", "input");
  capInput.type = "number";
  capInput.placeholder = "e.g. 60";
  capInput.oninput = () => updateMemory(id);
  capDiv.appendChild(capInput);

  grid.append(nameDiv, capDiv);
  card.appendChild(grid);

  // subjects
  const subjArea = el("div", "mb-4");
  subjArea.appendChild(el("label", "field-label", "Subjects"));
  const subjList = el("div", "space-y-2");
  const subjRow = el("div", "flex gap-2 mt-2");
  const subjInput = el("input", "input");
  subjInput.placeholder = "Subject name";
  const subjBtn = el("button", "btn btn--primary btn--sm", "Add");
  subjBtn.onclick = () => {
    const val = subjInput.value.trim();
    if (!val) return alert("Enter subject");
    addSubject(id, val, subjList, subjInput);
  };
  subjRow.append(subjInput, subjBtn);
  subjArea.append(subjList, subjRow);
  card.appendChild(subjArea);

  // teachers
  const teachArea = el("div", "mb-4");
  teachArea.appendChild(el("label", "field-label", "Teachers"));
  const teachList = el("div", "space-y-2");
  const teachRow = el("div", "flex gap-2 mt-2");
  const teachInput = el("input", "input");
  teachInput.placeholder = "Teacher name";
  const teachBtn = el("button", "btn btn--primary btn--sm", "Add");
  teachBtn.onclick = () => {
    const val = teachInput.value.trim();
    if (!val) return alert("Enter teacher");
    addTeacher(id, val, teachList, teachInput);
  };
  teachRow.append(teachInput, teachBtn);
  teachArea.append(teachList, teachRow);
  card.appendChild(teachArea);

  // mapping
  const mapArea = el("div", "mb-4");
  mapArea.appendChild(el("label", "field-label", "Map Subjects → Teachers & Lectures/week"));
  const mapList = el("div", "space-y-2");
  mapArea.appendChild(mapList);
  const mapBtn = el("button", "btn btn--outline btn--sm mt-2", "Update Mapping");
  mapBtn.onclick = () => buildMapping(id);
  mapArea.appendChild(mapBtn);
  card.appendChild(mapArea);

  sectionsContainer.appendChild(card);
  sections.push({
    id,
    nameInput,
    capInput,
    subjList,
    teachList,
    mapList,
    subjects: [],
    teachers: [],
    mapping: {},
    lectures: {}
  });
  return id;
}

/* === Add Subject === */
function addSubject(id, name, listEl, inputEl) {
  const s = sections.find(x => x.id === id);
  if (s.subjects.includes(name)) return alert("Already exists");
  s.subjects.push(name);
  const row = el("div", "kv-row", `<strong>${name}</strong>`);
  const rm = el("button", "remove-btn", "×");
  rm.onclick = () => {
    s.subjects = s.subjects.filter(x => x !== name);
    row.remove();
    buildMapping(id);
  };
  row.appendChild(rm);
  listEl.appendChild(row);
  inputEl.value = "";
  buildMapping(id);
}

/* === Add Teacher === */
function addTeacher(id, name, listEl, inputEl) {
  const s = sections.find(x => x.id === id);
  if (s.teachers.includes(name)) return alert("Already exists");
  s.teachers.push(name);
  const row = el("div", "kv-row", name);
  const rm = el("button", "remove-btn", "×");
  rm.onclick = () => {
    s.teachers = s.teachers.filter(x => x !== name);
    row.remove();
    buildMapping(id);
  };
  row.appendChild(rm);
  listEl.appendChild(row);
  inputEl.value = "";
  buildMapping(id);
}

/* === Mapping UI === */
function buildMapping(id) {
  const s = sections.find(x => x.id === id);
  const list = s.mapList;
  list.innerHTML = "";
  s.subjects.forEach(sub => {
    const row = el("div", "grid grid-cols-3 gap-2 items-center");
    const label = el("div", "font-medium", sub);
    const sel = el("select", "select");
    sel.innerHTML = `<option value="">Select teacher</option>` + s.teachers.map(t => `<option>${t}</option>`).join("");
    sel.onchange = () => (s.mapping[sub] = sel.value);
    const lec = el("input", "input");
    lec.type = "number";
    lec.placeholder = "Lectures/week";
    lec.oninput = () => (s.lectures[sub] = lec.value);
    row.append(label, sel, lec);
    list.appendChild(row);
  });
}

/* === Memory === */
function updateMemory(id) {
  const s = sections.find(x => x.id === id);
  s.name = s.nameInput.value.trim();
  s.capacity = s.capInput.value.trim();
}

/* === Review === */
function renderReview() {
  reviewContent.innerHTML = "";
  if (sections.length === 0) return (reviewContent.innerText = "No sections added");
  sections.forEach(s => {
    const div = el("div", "border rounded p-3 mb-2");
    div.innerHTML = `
      <div class='font-semibold text-indigo-700 mb-1'>${s.name || "(untitled)"} — ${s.capacity || "-"} students</div>
      <div class='text-sm'><b>Subjects:</b> ${s.subjects.join(", ")}</div>
      <div class='text-sm'><b>Teachers:</b> ${s.teachers.join(", ")}</div>
    `;
    reviewContent.appendChild(div);
  });
}

/* === Build payload & send === */
function buildPayload() {
  return sections.map(s => ({
    Section: s.name,
    Capacity: s.capacity,
    Subjects: JSON.stringify(s.subjects),
    Teachers: JSON.stringify(s.mapping),
    Lectures: JSON.stringify(s.lectures)
  }));
}

async function sendToSheet(payload) {
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger: "generate_timetable" })
    });
    console.log("✅ n8n triggered");
  } catch (e) {
    console.error("⚠️ n8n error", e);
  }
}

/* === Fetch timetable (Modified with Download Link) === */
async function loadTimetables() {
  const target = document.getElementById("timetable-display") || (() => {
    const div = el("div");
    div.id = "timetable-display";
    document.querySelector("main").appendChild(div);
    return div;
  })();

  target.innerHTML = "<h2 class='text-xl font-semibold mb-4'>Generated Timetables</h2><p>Loading...</p>";

  try {
    const res = await fetch(OUTPUT_SHEET_WEBAPP_URL);
    if (!res.ok) throw new Error("Failed to fetch output sheet data");

    const data = await res.json();
    target.innerHTML = "";

    // ✅ Added Download Link
    const downloadDiv = el("div", "mb-4 text-center");
    downloadDiv.innerHTML = `
      <a href="${OUTPUT_SHEET_LINK}" target="_blank" 
         style="display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:6px;">
         ⬇️ Download Timetable Sheet
      </a>`;
    target.appendChild(downloadDiv);

    if (Array.isArray(data)) {
      const headers = Object.keys(data[0]);
      const table = el("table", "timetable-table");
      const thead = el("thead");
      const trHead = el("tr");
      headers.forEach(h => trHead.appendChild(el("th", "", h)));
      thead.appendChild(trHead);
      table.appendChild(thead);

      const tbody = el("tbody");
      data.forEach(row => {
        const tr = el("tr");
        headers.forEach(h => tr.appendChild(el("td", "", row[h] ?? "")));
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      target.appendChild(table);
    } else {
      const sheets = Object.keys(data);
      for (const sheetName of sheets) {
        const rows = data[sheetName];
        if (!rows || rows.length === 0) continue;

        const headers = rows[0];
        const table = el("table", "timetable-table");
        const thead = el("thead");
        const headRow = el("tr");
        headers.forEach(h => headRow.appendChild(el("th", "", h)));
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = el("tbody");
        rows.slice(1).forEach(r => {
          const tr = el("tr");
          r.forEach(v => {
            const cell = el("td", "");
            if (typeof v === "string" && v.includes(" ")) {
              const parts = v.split(" ");
              const subject = parts[0];
              const teacher = parts.slice(1).join(" ");
              cell.innerHTML = `<div>${subject}</div><div style="font-size: 0.8em; color: #555;">${teacher}</div>`;
            } else {
              cell.textContent = v;
            }
            tr.appendChild(cell);
          });

          tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        const secDiv = el("div", "timetable-section");
        secDiv.appendChild(el("h2", "", `Section ${sheetName}`));
        secDiv.appendChild(table);
        target.appendChild(secDiv);
      }
    }

  } catch (err) {
    console.error("Error loading timetables:", err);
    target.innerHTML = "<p class='text-red-600'>Failed to load timetable data. Please check your Sheet ID and permissions.</p>";
  }
}

/* === Event bindings === */
addSectionBtn.onclick = () => createSectionCard();
reviewBtn.onclick = () => {
  renderReview();
  reviewPanel.classList.remove("hidden");
};
closeReview.onclick = () => reviewPanel.classList.add("hidden");
confirmSubmit.onclick = async () => {
  msgBox.classList.remove("hidden");
  msgBox.innerText = "Submitting...";
  await sendToSheet(buildPayload());
  msgBox.innerText = "✅ Submitted! Generating result... (please wait 6s)";
  reviewPanel.classList.add("hidden");
  setTimeout(loadTimetables, 6000);
};
submitBtn.onclick = async () => {
  msgBox.classList.remove("hidden");
  msgBox.innerText = "Submitting...";
  await sendToSheet(buildPayload());
  msgBox.innerText = "✅ Submitted! Generating result... (please wait 6s)";
  setTimeout(loadTimetables, 6000);
};

/* === Initialize === */
createSectionCard();

/* === Attach Load Timetable Button === */
document.addEventListener("DOMContentLoaded", () => {
  const loadBtn = document.getElementById("btn-view-timetable");
  if (loadBtn) {
    console.log("✅ Load button found and listener attached");
    loadBtn.addEventListener("click", () => {
      console.log("🟢 Load button clicked");
      loadTimetables();
    });
  } else {
    console.log("❌ Load button not found in DOM");
  }
});
