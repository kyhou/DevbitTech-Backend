/**
 * Return the formated version of the document(CPF or CNPJ).
 * @param {String} value the document(CPF or CNPJ).
 * @returns {String} the formated version of the value.
 */
exports.formatCnpjCpf = (value) => {
    const cnpjCpf = value.replace(/\D/g, '');

    if (cnpjCpf.length === 11) {
        return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
    }

    return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
}