/* 
* Hàm format các giá trị null
* Author: NMTuan (05/07/2021)
*/
export function formatNull(value) {
    if (!value) return "";
    return value;
}

/**
 * Hàm format các giá trị date
 * Author: NMTuan (05/07/2021) 
 * Modified By: NMTuan (05/08/2021)
 * @param {*} value 
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
 * Hàm format tổng hợp
 * Author: NMTuan (05/07/2021)
 * @param {*} value 
 * @param {*} fieldName 
 * @returns 
 */
function formatData(value, fieldName) {
    let rs = value
    if (fieldName == "DateOfBirth") {
        rs = formatDate(rs, localStorage.formatDate)
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

export { formatData, removeAccents}
