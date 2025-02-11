
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

router.post('/what-is-your-pigeons-name', function (request, response) {
    // Save the session data and pigeons object to variables for easier access
    const data = request.session.data
    const pigeons = data['pigeons']
    const userID = data['userID']

    // Get the name from the form data
    const name = data['name']

    // Check if the pigeon has already been created
    let pigeon = pigeons.find(pigeon => pigeon.passportNumber === data['pigeonID']);

    if (pigeon) {
        // Update the first and last name if the pigeon already exists
        pigeon.name = name;
    } else {
        // Generate a random passport number for the pigeon
        function generatePassportNumber(name) {
            const letters = name.slice(0, 2).toUpperCase();
            const numbers = Math.floor(10000000 + Math.random() * 90000000).toString();
            return letters + numbers;
        }
        // Initialise the new pigeon object
        // We create the passportNumber and name and here. 
        // The rest of these will be added on later pages
        pigeon = {
            passportNumber: generatePassportNumber(name),
            name: '',
            breed: '',
            age: '',
            sex: '',
            uniqueMarkings: '',
            vaccinationStatus: '',
            passportIssued: '',
            passportExpiry: '',
            photoURL: '',
            ownerID: userID,
            lastFlightLocation: '',
            awards: []
        }

        // Add the new pigeon to the top of the pigeons list
        pigeons.unshift(pigeon);
    }

    // Redirect to the next step in the account creation process
    // Add a url query parameter so we know who the 'current' pigeon is
    // Check to see if this page has been reached from the check your answers page
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`add-pigeon/check-your-answers?userID=${userID}&pigeonID=${pigeon.passportNumber}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`pigeon/homepage?userID=${userID}&pigeonID=${pigeon.passportNumber}#your-pigeons`);
    } else {
        response.redirect(`add-pigeon/what-breed-is-your-pigeon?userID=${userID}&pigeonID=${pigeon.passportNumber}`);
    }
})

router.post('/what-breed-is-your-pigeon', function (request, response) {
    // Save the session data and pigeons object to variables for easier access
    const data = request.session.data
    const pigeons = data['pigeons']
    const userID = data['userID']

    // Get the user ID from the query parameter
    const currentPigeonID = data['pigeonID']

    // Save the current pigeon to a variable
    let pigeon = pigeons.find(pigeon => pigeon.passportNumber === currentPigeonID);

    // Get the breed from the form data
    let breed = data['breed']

    // Check if breed is other, save as the conditional input if so
    if (breed === 'other') {
        breed = data['other-breed']
    }

    // Add the breed to the current pigeon
    pigeon.breed = breed;

    // Redirect to the next step in the account creation process
    // Add a url query parameter so we know who the 'current' pigeon is
    // Check to see if this page has been reached from the check your answers page
    if (data['origin'] === 'check-your-answers') {
        response.redirect(`add-pigeon/check-your-answers?userID=${userID}&pigeonID=${pigeon.passportNumber}`);
    } else if (data['origin'] === 'homepage') {
        response.redirect(`pigeon/homepage?userID=${userID}&pigeonID=${pigeon.passportNumber}#your-pigeons`);
    } else {
        response.redirect(`add-pigeon/how-old-is-your-pigeon?userID=${userID}&pigeonID=${pigeon.passportNumber}`);
    }
})

module.exports = { router };