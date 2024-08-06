// const date_helpers = {
//     getDays: function (year, month) {
//         return new Date(year, month, 0).getDate();
//     }
// }

// export default date_helpers;


// let DateHelpers = (function () {

//     /**
//      * Return the number of days in the month/year
//      * @param {Number} year
//      * @param {Number} month
//      * @returns {Date} The new Date
//      */
//     function getDays(year, month) {
//         return new Date(year, month, 0).getDate();
//     }

//     return {getDays};
// }) ();

import moment from "moment";

const date_helpers = {};

/**
 * Return the number of days in the month/year
 * @param {Number} year
 * @param {Number} month
 * @returns {Number} The number of days
 */
date_helpers.getDays = (year, month) => {
    return new Date(year, month, 0).getDate();
}

/**
 * Return the number of days in the month/year
 * @param {Date} date
 * @returns {Number} The number of days
 */
date_helpers.getDateDays = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Return the name of the month
 * @param {Number} monthNumber The number of the month(js format)
 * @param {String} locale The locale for the month
 * @returns {String} The name of the month
 */
date_helpers.getMonthName = (monthNumber, locale = 'pt-BR') => {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString(locale, { month: 'long' });
}

date_helpers.parseDate = (date) => {
    return moment(date + 'T00:00:00-03:00');
}

export default date_helpers;