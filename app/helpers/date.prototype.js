export default () => {
    /**
     * Returns the date with added `months` of delay.
    *
    * @param {Number} months - the delay in months
    *
    * @returns {Date} The new date
    */
   Date.prototype.addMonths = function(months) {
       this.setMonth(this.getMonth() + months);
    }
}