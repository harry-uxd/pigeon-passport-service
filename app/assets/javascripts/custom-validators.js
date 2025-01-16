// Custom email 'match' validator
export const matchValidator = function (value, options, key, attributes, globalOptions) {
    // Assume sessionData.users is available globally
    const userExists = sessionData.users.some(user => user.email === value);
  
    // Return the error message if no match is found
    if (!userExists) {
      return options.message || "This value does not match any record.";
    }
  
    // Valid if a match is found
    return null;
  };
  
  // Custom 'authenticate' validator
  export const authenticateValidator = function (value, options, key, attributes, globalOptions) {
    // Ensure sessionData and users array is available
    if (!sessionData || !Array.isArray(sessionData.users)) {
      console.error("Session data is not properly initialized");
      return "Validation error"; // Generic error if session data is unavailable
    }
  
    // Get the email from the previous 'match' validator's result
    const email = attributes.email; // Assuming 'email' is part of the form data
    if (!email) {
      return "Email is required to authenticate"; // Fail early if no email is provided
    }
  
    // Find the user by email
    const user = sessionData.users.find(user => user.email === email);
  
    // If user is found, check the password
    if (user) {
      // If the passwords do not match, return the error message
      if (user.password !== value) {
        return options.message || "Incorrect password";
      }
    } else {
      return "Email not found"; // This case should never happen if the email match is working
    }
  
    // Valid if the password matches
    return null;
  };