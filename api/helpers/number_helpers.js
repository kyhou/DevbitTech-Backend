const number_helpers = {};

number_helpers.toFixed = (num, fixed) => {
    let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return Number(num.toString().match(re)[0]);
}

export default number_helpers;