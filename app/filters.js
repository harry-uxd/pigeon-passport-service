//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const { DateTime } = require('luxon');
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

// This filter takes a date string in ISO format and returns it in the GDS format
addFilter('longDate', (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.toFormat('d MMMM yyyy');
});

// This filter takes a JSON string that contains user data and returns the value of the key provided
addFilter('return', (jsonString, key) => {
    try {
        const json = JSON.parse(jsonString);
        return json[key];
    } catch (e) {
        return null;
    }
});

addFilter('cleanseSession', (sessionJson) => {
    console.log(sessionJson)
    try {
        const session = JSON.parse(sessionJson);
        delete session.data.users;
        delete session.data.pigeons;
        return JSON.stringify(session);
    } catch (e) {
        return null;
    }
});

addFilter('lstrip', (str, char) => {
    if (str.startsWith(char)) {
        return str.slice(1);
    }
    return str;
});