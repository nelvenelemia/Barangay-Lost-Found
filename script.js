// Barangay Lost & Found — form validation and localStorage
const STORAGE_KEY = "barangayLostFoundReports";
const form = document.getElementById("item-form");
const reportList = document.getElementById("report-list");
const emptyState = document.getElementById("empty-state");
const formError = document.getElementById("form-error");

let reports = loadReports();

function loadReports() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Could not read saved reports:", error);
    return [];
  }
}

function saveReports() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return true;
  } catch (error) {
    console.error("Could not save reports:", error);
    alert("Unable to save. Browser storage may be full or disabled.");
    return false;
  }
}

function renderReports() {
  reportList.replaceChildren();
  emptyState.classList.toggle("hidden", reports.length > 0);

  reports.forEach(item => {
    const card = document.createElement("article");
    card.className = "report-card";

    const title = document.createElement("h3");
    title.className = "report-title";
    title.textContent = item.name;

    const badge = document.createElement("span");
    badge.className = `report-badge ${item.type === "Lost" ? "badge-lost" : "badge-found"}`;
    badge.textContent = item.type;

    const top = document.createElement("div");
    top.className = "report-top";
    top.append(title, badge);

    const category = document.createElement("p");
    category.className = "report-category";
    category.textContent = item.category;

    const description = document.createElement("p");
    description.className = "report-description";
    description.textContent = item.description;

    const meta = document.createElement("div");
    meta.className = "report-meta";
    const location = document.createElement("span");
    location.textContent = `⌖ ${item.location}`;
    const date = document.createElement("span");
    date.textContent = `▦ ${item.date}`;
    meta.append(location, date);

    card.append(top, category, description, meta);
    if (item.contact) {
      const contact = document.createElement("p");
      contact.className = "report-contact";
      contact.textContent = `Contact: ${item.contact}`;
      card.appendChild(contact);
    }
    reportList.appendChild(card);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  formError.textContent = "";

  if (!form.checkValidity()) {
    formError.textContent = "Please complete all required fields before submitting.";
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const newReport = {
    id: Date.now().toString(),
    type: formData.get("reportType"),
    name: formData.get("itemName").trim(),
    category: formData.get("category"),
    location: formData.get("location").trim(),
    date: formData.get("date"),
    description: formData.get("description").trim(),
    contact: formData.get("contact").trim(),
    createdAt: new Date().toISOString()
  };

  if (!newReport.name || !newReport.location || !newReport.description) {
    formError.textContent = "Please do not leave required fields blank.";
    return;
  }

  reports.unshift(newReport);
  if (!saveReports()) {
    reports.shift();
    return;
  }

  form.reset();
  document.getElementById("date").value = new Date().toISOString().slice(0, 10);
  renderReports();
});
renderReports();
