//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

router.post('/sign-in', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data
    const users = data['users']

    // Get the email and password from the form data
    const email = data['email']
    const password = data['password']

    // Find the user's ID from the email provided
    // We will use this to check the email, associated password and pigeon count
    const userID = Object.keys(users).find(id => users[id].email === email);

    // Check if the user exists (has an email address)
    if (!userID) {
        data.errors = { email: ["User not found"] };
        return response.redirect('sign-in');
    }
    // Check if the password matches the user's password
    if (users[userID].password !== password) {
        data.errors = { password: ["Incorrect password"] };
        return response.redirect('sign-in');
    }
    // Check if the user has any pigeons, redirect to the add pigeon journey if they don't have any pigeons
    // Redirect them to the dashboard if they have pigeons
    if (users[userID].pigeonCount === 0) {
        return response.redirect('add-pigeon/what-is-their-name');
    } else {
        return response.redirect('dashboard');
    }
})

// ----------------------------------------------------------- //
// ------------------ CREATE ACCOUNT ROUTES ------------------ //
// ----------------------------------------------------------- //

router.post('/what-is-your-name', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data
    const users = data['users']

    // Get the name from the form data
    const firstName = data['first-name']
    const lastName = data['last-name']

    // Initialise the user object
    // We create the userID, name and accountCreated properties here. 
    // The rest of these will be added on later pages
    const user = {
        userID: [...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        email: '',
        password: '',
        name: `${firstName} ${lastName}`,
        dob: '',
        postcode: '',
        phoneNumber: '',
        address: '',
        preferredContactMethod: '',
        accountCreated: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        pigeonCount: 0
    }

    // Add the new user to the top of the users list
    users.unshift(user);

    // Redirect to the next step in the account creation process
    // Add a url query parameter so we know who the 'current' user is
    response.redirect('create-account/what-is-your-email?userID=' + user.userID);

})

router.post('/what-is-your-email', function (request, response) {
        // Save the session data and users object to variables for easier access
        const data = request.session.data
        const users = data['users']

        // Get the user ID from the query parameter
        const currentUserID = data['userID']

        // Save the current user to a variable
        const currentUser = users.find(user => user.userID === currentUserID)
    
        // Get the email from the form data
        const email = data['email']

        // Add the email to the current user
        currentUser.email = email;

        // Redirect to the next step in the account creation process
        response.redirect('create-account/enter-your-password?userID=' + currentUserID);
   
})

router.post('/enter-your-password', function (request, response) {
        // Save the session data and users object to variables for easier access
        const data = request.session.data
        const users = data['users']

        // Get the user ID from the query parameter
        const currentUserID = data['userID']

        // Save the current user to a variable
        const currentUser = users.find(user => user.userID === currentUserID)

        // Get the password from the form data
        const password = data['password']

        // Add the password to the current user
        currentUser.password = password;

        // Redirect to the next step in the account creation process
        response.redirect('create-account/what-is-your-date-of-birth?userID=' + currentUserID);

})
