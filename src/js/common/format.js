import {Store} from '../../components/views/store'

/* 
* Hàm format các giá trị null
* Author: NMTuan (05/07/2021)
*/
export function formatNull(value) {
    if (value == null || value == undefined) return "";
    return value;
}

/**
 * Hàm format tên tự động viết hóa chữ cái đầu
 * @author: NMTuan (20/08/2021)
 */
export function formatName(value) {
    if (!value) return null;
    value = value.trim();
    let arrayStr = value.split(' ');
    let result = [];
    arrayStr.forEach((string) => {
        result.push(string.charAt(0).toUpperCase() + string.slice(1));
    })
    return result.join(' ')
}

/**
 * Hàm format các giá trị date
 * Author: NMTuan (05/07/2021) 
 * Modified By: NMTuan (05/08/2021)
 * @param {Date} value YYYY-MM-DD, YYYY/MM/DD, Date Format
 * @returns 
 */
export function formatDate(value, format = 'dd/mm/yyyy') {
    if (!value) return null;

    format = format.toLowerCase()
    //Tách format string
    var dateItems = format.split('/');

    //Lấy các giá trị day, month, year
    let result = new Date(value)

    let day = result.getDate()
    let month = result.getMonth() + 1
    let year = result.getFullYear()

    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    result = ''

    //Ghép các giá trị day, month, year
    dateItems.forEach((item, index) => {
        if (item == 'dd') {
            result += day;
        } else if (item == 'mm') {
            result += month;
        } else if (item == 'yyyy') {
            result += year;
        }
        if (index != 2) {
            result += '/'
        }
        
    })

    return result;
}

/**
 * Hàm format giá trị tiền tệ
 * @author: NMTuan (05/07/2021)
 * @param {*} value 
 * @returns 
 */
export function formatMoney(value) {
    if (!value) return 0;
    value = value.toString()
    value = value.replaceAll('.','')
    value = value.replaceAll(',','')
    return Number(value).toLocaleString('it-IT');
}

/**
 * Hàm format tổng hợp
 * Author: NMTuan (05/07/2021)
 * @param {*} value 
 * @param {*} fieldName 
 * @returns 
 */
function formatData(value, fieldName, type) {
    let rs = value
    if (fieldName == "DateOfBirth") {
        rs = formatDate(rs, Store.state.formatDate)
    }
    if (type == "Date") {
        rs = formatDate(rs, Store.state.formatDate)
    } else if (type == 'Money') {
        rs = formatMoney(rs)
    }
    rs = formatNull(rs)
    return rs;
}

/**
 * Hàm format giá trị số điện thoại cố định
 * @param {string} phoneNumberString Telephone number
 * @returns 
 */
export function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{1,4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return cleaned;
}

/**
 * Hàm loại bỏ dấu
 * @param {string} str string cần loại bỏ dấu
 * @returns string đã được loại bỏ dấu
 */
function removeAccents(str) {
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}

/**
 * Hàm format date oninput
 * @author: NMTuan (08/09/2021)
 * @param {String} value date
 * @returns 
 */
export function formatDateOnInput(value, format = "dd/mm/yyyy") {
    format = format.split('/')
    let regFirstSeparator = `^([0-9]{${format[0].length}})([0-9]{1,${format[1].length}})$`
    let regComplete = `^([0-9]{${format[0].length}})([0-9]{${format[1].length}})([0-9]{1,${format[2].length}})$`
    // const REG_DATE_FIRST_SEPARATOR = /^(\d{2})(\d{1,2})$/
    // const REG_DATE_COMPLETE = /^(\d{2})(\d{2})(\d{1,4})$/
    const REG_DATE_FIRST_SEPARATOR = new RegExp(regFirstSeparator);
    const REG_DATE_COMPLETE = new RegExp(regComplete)
    var cleaned = ('' + value).replace(/\D/g, '');
    var matchDateOnFirstSeparator = cleaned.match(REG_DATE_FIRST_SEPARATOR)
    var matchDateFormat = cleaned.match(REG_DATE_COMPLETE)
    if (matchDateOnFirstSeparator) {
        return matchDateOnFirstSeparator[1] + '/' + matchDateOnFirstSeparator[2]
    } else if (matchDateFormat) {
        return matchDateFormat[1] + '/' + matchDateFormat[2] + '/' + matchDateFormat[3]
    }
    return cleaned;
}

export { formatData, removeAccents}
