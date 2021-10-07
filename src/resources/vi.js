export const messages = {
    /**
     * Thông báo giá trị không được để trống
     * @param {string} property 
     * @author: NMTuan (21/08/2021)
     * @returns 
     */
    required: (property) => {
        return `${property} không được phép để trống!`
    },
    /**
     * Thông báo giá trị không hợp lệ
     * @param {string} property 
     * @author: NMTuan (21/08/2021)
     * @returns 
     */
    invalid: (property) => {
        return `${property} không đúng định dạng!`
    },
    /**
     * Thông báo giá trị không hợp lệ
     * @param {string} property 
     * @author: NMTuan (21/08/2021)
     * @returns 
     */
    error: (property) => {
        return `${property} không hợp lệ!`
    },
    /**
     * Thông báo exception
     */
    exception: "Có lỗi xảy ra! Vui lòng liên hệ MISA.",
}

export const poppupMsg = {
    deleteEmpty : 'Bạn chưa chọn bản ghi cần xóa!',
    deleteMultiple : `Bạn có chắc muốn xóa {0} bản ghi hay không?`

}

export default {messages}