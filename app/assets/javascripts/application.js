import { matchValidator, authenticateValidator, confirmValidator } from './custom-validators.js';

window.GOVUKPrototypeKit.documentReady(() => {
  const form = document.querySelector("form");
  const validationRulesElement = document.getElementById("validation-rules");

  if (!validationRulesElement) {
    console.error("No validation rules found. Please ensure there is a script tag with the JSON validation rules.");
    return;
  }

  const validationRules = JSON.parse(validationRulesElement.textContent);

  // Register custom validators
  validate.validators.match = matchValidator;
  validate.validators.authenticate = authenticateValidator;
  validate.validators.confirm = confirmValidator;

  // Disable automatic prepending of field names in error messages
  validate.options = { fullMessages: false };

  // Collection of input types for inline error message placement
  const inlineErrorClasses = [
    "govuk-radios",
    "govuk-checkboxes",
    "govuk-date-input",
    "govuk-input"
  ];

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

          // Check if input has any of the specified classes
          const hasInlineErrorClass = inlineErrorClasses.some((cls) => input.classList.contains(cls));

          if (hasInlineErrorClass) {
            const inputWrapper = input.closest(".govuk-input__wrapper") || input;
            formGroup.insertBefore(errorMessage, inputWrapper);
          }

          // Add GOV.UK error styling to the input
            input.classList.add("govuk-input--error");

            // Remove error styling on valid input
            input.addEventListener("input", () => {
            if (input.classList.contains("govuk-input--error")) {
              input.classList.remove("govuk-input--error");
            }
            });

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

      // Insert the error summary as the first element in the main HTML element
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.insertBefore(errorSummary, mainElement.firstChild);
      }

      // Focus the error summary
      errorSummary.focus();
    } else {
      // Submit the form if validation passes
      form.submit();
    }
  });
});
