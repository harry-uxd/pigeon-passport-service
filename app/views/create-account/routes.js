
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

router.post('/what-is-your-name', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data
    const users = data['users']

    // Get the name from the form data
    const firstName = data['first-name']
    const lastName = data['last-name']

    // Check if the user has already been created
    let user = users.find(user => user.userID === data['userID']);

    if (user) {
        // Update the first and last name if the user already exists
        user.firstName = firstName;
        user.lastName = lastName;
    } else {
        // Initialise the new user object
        // We create the userID, name and accountCreated properties here. 
        // The rest of these will be added on later pages
        user = {
            userID: [...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            email: '',
            password: '',
            firstName: firstName,
            lastName: lastName,
            dob: '',
            phoneNumber: '',
            address: '',
            preferredContactMethod: '',
            accountCreated: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
            pigeonCount: 0
        }

        // Add the new user to the top of the users list
        users.unshift(user);
    }

    // Redirect to the next step in the account creation process
    // Add a url query parameter so we know who the 'current' user is
    // Check to see if this page has been reached from the check your answers page
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`create-account/check-your-answers?userID=${user.userID}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`user/homepage?userID=${user.userID}#your-details`);
    } else {
        response.redirect(`create-account/what-is-your-email?userID=${user.userID}`);
    }

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
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`create-account/check-your-answers?userID=${currentUser.userID}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`user/homepage?userID=${currentUser.userID}#your-details`);
    } else {
        response.redirect(`create-account/enter-your-password?userID=${currentUser.userID}`);
    }

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
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`create-account/check-your-answers?userID=${currentUser.userID}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`user/homepage?userID=${currentUser.userID}#your-details`);
    } else {
        response.redirect(`create-account/what-is-your-date-of-birth?userID=${currentUser.userID}`);
    }



})

router.post('/what-is-your-date-of-birth', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data
    const users = data['users']

    // Get the user ID from the query parameter
    const currentUserID = data['userID']

    // Save the current user to a variable
    const currentUser = users.find(user => user.userID === currentUserID)
    // Get the date values from the form data
    let day = data['date-of-birth-day']
    let month = data['date-of-birth-month']
    const year = data['date-of-birth-year']

    // Prefix single days or months with a 0
    if (day.length === 1) {
        day = '0' + day;
    }
    if (month.length === 1) {
        month = '0' + month;
    }

    // Add the date of birth to the current user
    currentUser.dob = `${year}-${month}-${day}`;

    // Redirect to the next step in the account creation process
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`create-account/check-your-answers?userID=${currentUser.userID}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`user/homepage?userID=${currentUser.userID}#your-details`);
    } else {
        response.redirect(`create-account/find-your-address?userID=${currentUser.userID}`);
    }

})

router.post('/what-is-your-address', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data
    const users = data['users']

    // Get the user ID from the query parameter
    const currentUserID = data['userID']

    // Save the current user to a variable
    const currentUser = users.find(user => user.userID === currentUserID)

    // Get the date values from the form data
    const addressLine1 = data['address-line-1']
    const addressLine2 = data['address-line-2']
    const addressTown = data['address-town']
    const addressCounty = data['address-county']
    const addressPostcode = data['address-postcode']

    // Add to the current user
    currentUser.address = {
        line1: addressLine1,
        line2: addressLine2,
        town: addressTown,
        county: addressCounty,
        postcode: addressPostcode
    };

    // Redirect to the next step in the account creation process
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`create-account/check-your-answers?userID=${currentUser.userID}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`user/homepage?userID=${currentUser.userID}#your-details`);
    } else {
        response.redirect(`create-account/what-is-your-phone-number?userID=${currentUser.userID}`);
    }


})

router.post('/what-is-your-phone-number', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data
    const users = data['users']

    // Get the user ID from the query parameter
    const currentUserID = data['userID']

    // Save the current user to a variable
    const currentUser = users.find(user => user.userID === currentUserID)

    // Get the phone number from the form data
    const phoneNumber = data['phone-number']

    // Add the phone number to the current user
    currentUser.phoneNumber = phoneNumber


    // Redirect to the next step in the account creation process
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`create-account/check-your-answers?userID=${currentUser.userID}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`user/homepage?userID=${currentUser.userID}#your-details`);
    } else {
        response.redirect(`create-account/how-would-you-like-to-be-contacted?userID=${currentUser.userID}`);
    }


})

router.post('/how-would-you-like-to-be-contacted', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data
    const users = data['users']

    // Get the user ID from the query parameter
    const currentUserID = data['userID']

    // Save the current user to a variable
    const currentUser = users.find(user => user.userID === currentUserID)

    // Get the contact preference from the form data
    const contactPreference = data['contact-preference']

    // Add the phone number to the current user
    currentUser.preferredContactMethod = contactPreference

    // Redirect to the next step in the account creation process
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`create-account/check-your-answers?userID=${currentUser.userID}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`user/homepage?userID=${currentUser.userID}#your-details`);
    } else {
        response.redirect(`create-account/check-your-answers?userID=${currentUser.userID}`);
    }

})

router.post('/check-your-answers', function (request, response) {
    // Save the session data and users object to variables for easier access
    const data = request.session.data

    // Get the user ID from the query parameter
    const currentUserID = data['userID']

    // Redirect to the first step in the add a pigeon process
    response.redirect('add-pigeon/would-you-like-to-add-a-pigeon?userID=' + currentUserID);

})


module.exports = { router };