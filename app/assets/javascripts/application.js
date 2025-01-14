//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  const form = document.getElementById("sign-in-form");
  const validationRules = JSON.parse(document.getElementById("validation-rules").textContent);

  // Disable automatic prepending of field names in error messages
  validate.options = { fullMessages: false };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Collect form data
    const formData = Object.fromEntries(new FormData(form).entries());

    // Validate form data
    const errors = validate(formData, validationRules);

    // Clear existing errors
    document.querySelectorAll(".govuk-form-group").forEach((group) => {
      group.classList.remove("govuk-form-group--error");
      const error = group.querySelector(".govuk-error-message");
      if (error) error.remove();
    });

    // Display validation errors
    if (errors) {
      console.log(errors)
      Object.keys(errors).forEach((fieldName) => {
        const input = form.querySelector(`[name="${fieldName}"]`);
        const formGroup = input.closest(".govuk-form-group");

        if (formGroup) {
          formGroup.classList.add("govuk-form-group--error");
          const errorMessage = document.createElement("span");
          errorMessage.className = "govuk-error-message";
          errorMessage.textContent = errors[fieldName][0];
          const label = formGroup.querySelector("label");
          formGroup.insertBefore(errorMessage, label.nextSibling);

          // Add GOV.UK error styling to the input
          input.classList.add("govuk-input--error");
        }
      });
    } else {
      // Submit the form if validation passes
      form.submit();
    }
  });
});

