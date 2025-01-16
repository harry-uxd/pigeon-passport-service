// TODO fix date stuff
// Define a custom date validator
validate.validators.date = function(value, options, key, attributes) {
    const day = parseInt(attributes[options.dayField], 10);
    const month = parseInt(attributes[options.monthField], 10);
    const year = parseInt(attributes[options.yearField], 10);

    // Check if all parts are present
    if (!day || !month || !year) {
      return options.message || "Enter a valid date";
    }

    // Check if the date is valid
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return options.message || "Enter a valid date";
    }

    // Check if the date is in the past (optional)
    const today = new Date();
    if (date > today) {
      return "The date must be in the past";
    }

    return null;
  };
