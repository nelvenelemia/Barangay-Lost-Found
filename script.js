// Barangay Lost & Found — form validation
const form = document.getElementById("item-form");
const formError = document.getElementById("form-error");

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
    type: formData.get("reportType"),
    name: formData.get("itemName").trim(),
    category: formData.get("category"),
    location: formData.get("location").trim(),
    date: formData.get("date"),
    description: formData.get("description").trim(),
    contact: formData.get("contact").trim()
  };

  if (!newReport.name || !newReport.location || !newReport.description) {
    formError.textContent = "Please do not leave required fields blank.";
    return;
  }

  alert("Your report details are valid. Saving will be added in the next step.");
  form.reset();
});
