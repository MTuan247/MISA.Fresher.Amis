/**
 * Hàm kiểm tra giá trị có trống
 * @author: NMTuan (21/08/2021)
 * @param {string} value 
 * @returns 
 */
export function validateRequire(value) {
    if (!value) return false;
    return true;
}

/**
 * Hàm kiểm validate email
 * @author: NMTuan (21/08/2021)
 * @param {string} value 
 * @returns 
 */
export function validateEmail(value) {
    //eslint-disable-next-line
    const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(value) && value) {
        return false;
    }
    return true
}

/**
 * Hàm validate giá trị theo pattern
 * @author: NMTuan (21/08/2021)
 * @param {string} value 
 * @param {string} pattern
 * @returns 
 */
export function validate(value, pattern) {
    if(!new RegExp(pattern).test(value) && value) {
        return false;
    }
    return true;
}