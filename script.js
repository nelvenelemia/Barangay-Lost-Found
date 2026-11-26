const STORAGE_KEY = "barangayLostFoundReports";

const form = document.getElementById("item-form");
const reportList = document.getElementById("report-list");
const emptyState = document.getElementById("empty-state");
const filterSelect = document.getElementById("filter-select");
const searchInput = document.getElementById("search-input");
const formError = document.getElementById("form-error");
const toast = document.getElementById("toast");

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
    showToast("Unable to save. Browser storage may be full or disabled.");
    return false;
  }
}

function updateStats() {
  document.getElementById("total-count").textContent = reports.length;
  document.getElementById("lost-count").textContent = reports.filter(item => item.type === "Lost").length;
  document.getElementById("found-count").textContent = reports.filter(item => item.type === "Found").length;
}

function formatDate(dateString) {
  if (!dateString) return "Date not provided";
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function renderReports() {
  const selectedType = filterSelect.value;
  const searchTerm = searchInput.value.trim().toLowerCase();

  const visibleReports = reports.filter(item => {
    const matchesType = selectedType === "All" || item.type === selectedType;
    const searchableText = [item.name, item.category, item.location, item.description].join(" ").toLowerCase();
    return matchesType && searchableText.includes(searchTerm);
  });

  reportList.replaceChildren();
  emptyState.classList.toggle("hidden", visibleReports.length > 0);

  if (reports.length > 0 && visibleReports.length === 0) {
    const message = createTextElement("p", "no-results", "No reports match your search or filter.");
    message.style.cssText = "color:#758198;text-align:center;font-size:12px;padding:25px 8px;";
    reportList.appendChild(message);
    emptyState.classList.add("hidden");
  }

  visibleReports.forEach(item => {
    const card = document.createElement("article");
    card.className = "report-card";

    const top = document.createElement("div");
    top.className = "report-top";
    top.appendChild(createTextElement("h3", "report-title", item.name));

    const badge = createTextElement("span", `report-badge ${item.type === "Lost" ? "badge-lost" : "badge-found"}`, item.type);
    top.appendChild(badge);
    card.appendChild(top);

    card.appendChild(createTextElement("p", "report-category", item.category));
    card.appendChild(createTextElement("p", "report-description", item.description));

    const meta = document.createElement("div");
    meta.className = "report-meta";
    meta.appendChild(createTextElement("span", "", `⌖ ${item.location}`));
    meta.appendChild(createTextElement("span", "", `▦ ${formatDate(item.date)}`));
    card.appendChild(meta);

    if (item.contact) {
      card.appendChild(createTextElement("div", "report-contact", `Contact: ${item.contact}`));
    }
    reportList.appendChild(card);
  });

  updateStats();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

document.querySelectorAll('input[name="reportType"]').forEach(input => {
  input.addEventListener("change", () => {
    document.querySelectorAll(".type-option").forEach(option => {
      option.classList.toggle("selected", option.dataset.type === input.value);
    });
  });
});

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
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
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
  document.querySelector('input[name="reportType"][value="Lost"]').checked = true;
  document.querySelectorAll(".type-option").forEach(option => {
    option.classList.toggle("selected", option.dataset.type === "Lost");
  });
  document.getElementById("date").value = new Date().toISOString().slice(0, 10);

  filterSelect.value = "All";
  searchInput.value = "";
  renderReports();
  showToast("Your report has been posted successfully.");
});

filterSelect.addEventListener("change", renderReports);
searchInput.addEventListener("input", renderReports);

document.getElementById("date").value = new Date().toISOString().slice(0, 10);
renderReports();
