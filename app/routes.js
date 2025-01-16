//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


// Add your routes here
router.post('/sign-in', function (request, response) {
    const data = request.session.data
    const email = data['email']
    const password = data['password']
    const users = data['users']
    console.log(email, password)

    if (!users || !users[email]) {
        request.session.data.errors = { email: ["User not found"] };
        return response.redirect('sign-in');
    } 
    if (users[email].password !== password) {
        request.session.data.errors = { password: ["Incorrect password"] };
        return response.redirect('sign-in');
    }

    response.redirect('dashboard')
})