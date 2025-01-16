import { matchValidator, authenticateValidator } from './custom-validators.js';

window.GOVUKPrototypeKit.documentReady(() => {
  const form = document.getElementById("sign-in-form");
  const validationRules = JSON.parse(document.getElementById("validation-rules").textContent);

  // Register custom validators
  validate.validators.match = matchValidator;
  validate.validators.authenticate = authenticateValidator;

  // Disable automatic prepending of field names in error messages
  validate.options = { fullMessages: false };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Collect form data
    const formData = Object.fromEntries(new FormData(form).entries());

    // Validate form data
    const errors = validate(formData, validationRules);

    // Clear previous errors
    document.querySelectorAll(".govuk-form-group").forEach((group) => {
      group.classList.remove("govuk-form-group--error");
      const error = group.querySelector(".govuk-error-message");
      if (error) error.remove();
    });

    // Remove previous error summary (if it exists)
    const existingErrorSummary = document.querySelector(".govuk-error-summary");
    if (existingErrorSummary) {
      existingErrorSummary.remove();
    }

    if (errors) {
      console.log(errors);
      // Create error summary dynamically
      const errorSummary = document.createElement("div");
      errorSummary.className = "govuk-error-summary";
      errorSummary.setAttribute("aria-labelledby", "error-summary-title");
      errorSummary.setAttribute("role", "alert");
      errorSummary.setAttribute("tabindex", "-1");

      // Error summary title
      const errorSummaryTitle = document.createElement("h2");
      errorSummaryTitle.className = "govuk-error-summary__title";
      errorSummaryTitle.id = "error-summary-title";
      errorSummaryTitle.textContent = "There is a problem";
      errorSummary.appendChild(errorSummaryTitle);

      // Error summary list
      const errorSummaryBody = document.createElement("div");
      errorSummaryBody.className = "govuk-error-summary__body";
      const errorSummaryList = document.createElement("ul");
      errorSummaryList.className = "govuk-list govuk-error-summary__list";

      Object.keys(errors).forEach((fieldName) => {
        const input = form.querySelector(`[name="${fieldName}"]`);
        const formGroup = input.closest(".govuk-form-group");

        if (formGroup) {
          // Add inline error
          formGroup.classList.add("govuk-form-group--error");
          const errorMessage = document.createElement("span");
          errorMessage.className = "govuk-error-message";
          errorMessage.textContent = errors[fieldName][0];
          const label = formGroup.querySelector(":scope > label");
          if (label) {
            label.insertAdjacentElement("afterend", errorMessage);
          } else {
            formGroup.insertBefore(errorMessage, formGroup.firstChild);
          }

          // Add GOV.UK error styling to the input
          input.classList.add("govuk-input--error");

          // Add to error summary list
          const errorListItem = document.createElement("li");
          const errorLink = document.createElement("a");
          errorLink.href = `#${input.id}`;
          errorLink.textContent = errors[fieldName][0];
          errorLink.addEventListener("click", (e) => {
            e.preventDefault();
            input.focus();
          });
          errorListItem.appendChild(errorLink);
          errorSummaryList.appendChild(errorListItem);
        }
      });

      errorSummaryBody.appendChild(errorSummaryList);
      errorSummary.appendChild(errorSummaryBody);

      // Insert the error summary above the <h1>
      const heading = form.querySelector("h1");
      heading.parentNode.insertBefore(errorSummary, heading);

      // Focus the error summary
      errorSummary.focus();
    } else {
      // Submit the form if validation passes
      form.submit();
    }
  });
});