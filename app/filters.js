//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const { DateTime } = require('luxon');
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('longDate', (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.toFormat('d MMMM yyyy');
});

addFilter('return', (jsonString, key) => {
    try {
        const json = JSON.parse(jsonString);
        return json[key];
    } catch (e) {
        return null;
    }
});