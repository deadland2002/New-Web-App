function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

function containsAlpha(str) {
    const alpha = /[QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm]/;
    return alpha.test(str);
}

function containsNumbers(str) {
    return /\d/.test(str);
}
