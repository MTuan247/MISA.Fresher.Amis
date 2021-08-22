export const messages =  {
    /**
     * Thông báo giá trị không được để trống
     * @param {string} property 
     * @author: NMTuan (21/08/2021)
     * @returns 
     */
    require: (property) => {
        return property + ' không được phép để trống!'
    },
    /**
     * Thông báo giá trị không hợp lệ
     * @param {string} property 
     * @author: NMTuan (21/08/2021)
     * @returns 
     */
    invalid: (property) => {
        return property + ' không đúng định dạng!'
    },
    error: (property) => {
        return property + ' không hợp lệ!'
    },
}