import axios from 'axios'
import showErrorPopup from '../../base/popup';
import { showErrorToast, showToast } from '../../base/toast'
import Resources from '../../../resources';

export default class BaseAPI {

    constructor() {
    }

    static host = "https://localhost:44334/api/v1/";
    static api = null;

    /**
     * Hàm lấy toàn bộ dữ liệu
     * @param {function} callback Callback
     */
    static getAll(callback = () => { }) {
        axios.get(this.api)
            .then((response) => {
                callback(response)
            }).catch((error) => {
                try {
                    showToast('error', error.response.data.UserMsg);
                } catch {
                    showErrorToast();
                }
            })
    }

    /**
     * Hàm lấy bản ghi theo id
     * @param {string} id id của bản ghi
     * @param {function} callback Hàm truyền vao
     */
    static getById(id, callback = () => {}, failCallback = () => {}) {
        axios.get(this.api + id)
            .then((response) => {
                console.log(response)
                callback(response)
            }).catch((error) => {
                try {
                    showToast('error', error.response.data.UserMsg);
                } catch {
                    showErrorToast();
                } finally {
                    failCallback();
                }
            })
    }

    /**
     * Hàm lấy bản ghi theo danh sách id
     * @param {Array}} danh sach id của bản ghi
     * @param {Function} callback Hàm truyền vao
     */
    static getByIds(ids, successCallback = function(){}, failCallback = function(){}, completeCallback = function(){}) {
        // axios.get(this.api + 'multipleId', {
        //     data: data
        // })
        // axios({
        //     method: 'get',
        //     url: this.api + 'multipleId',
        //     data: ids,
        // })
        axios.post(this.api + 'multipleId', ids)
        .then((response) => {
            successCallback(response.data)
        }).catch((error) => {
            try {
                let msg = error.response.data.UserMsg ? error.response.data.UserMsg : Resources.messages.exception
                showToast('error', msg);
            } catch {
                showErrorToast();
            } finally {
                failCallback();
            }
        }).finally(() => {
            completeCallback();
        })
    }

    /**
     * Hàm lấy dữ liệu từ api
     * @param {url} api api cần gọi
     * @param {function} callback Hàm callback
     */
    static get(api, callback = function () { }) {
        axios.get(api)
            .then((response) => {
                callback(response)
                if (response.data.TotalRecord == 0) {
                    showToast('error', 'Không có dữ liệu trả về!')
                }
            }).catch((error) => {
                try {
                    showToast('error', error.response.data.UserMsg);
                } catch {
                    showErrorToast();
                }
            })
    }

    /**
     * Hàm post data
     * @param {object} data data cần post
     * @param {function} successCallback Hàm callback
     */
    static saveData(data, successCallback = function(){}, failCallback = function(){}, completeCallback = function(){}) {
        axios.post(this.api, data)
        .then((response) => {
            if (response.data.Success) {
                successCallback(response);
                showToast('success', response.data.UserMsg);
            } else {
                showErrorPopup(response.data.UserMsg, () => failCallback(response.data))
            }
        }).catch((error) => {
            try {
                showToast('error', error.response.data.UserMsg);
            } catch {
                showErrorToast();
            } finally {
                failCallback();
            }
        }).finally(() => {
            completeCallback();
        })
    }

    /**
     * Hàm cập nhật dữ liệu
     * @param {*} id 
     * @param {*} body 
     */
    static update(data, id, successCallback = function(){}, failCallback = function(){}, completeCallback = function(){}) {
        axios.put(this.api + id, data)
        .then((response) => {
            if (response.data.Success) {
                successCallback(response);
                showToast('success', response.data.UserMsg);
            } else {
                showErrorPopup(response.data.UserMsg, () => failCallback(response.data))
            }
        }).catch((error) => {
            try {
                showToast('error', error.response.data.UserMsg);
            } catch {
                showErrorToast();
            } finally {
                failCallback();
            }
        }).finally(() => {
            completeCallback();
        })
    } 

    /**
     * Hàm xóa bản ghi
     * @param {*} id 
     */
    static delete(id, callback = function () { }) {
        axios.delete(this.api + id)
            .then((response) => {
                if (response.data.Success) {
                    callback(response);
                    showToast('success', response.data.UserMsg);
                } else {
                    showToast('error', response.data.UserMsg);
                }
            }).catch((error) => {
                try {
                    showToast('error', error.response.data.UserMsg);
                } catch {
                    showErrorToast();
                }
            })
    }

    /**
     * Hàm xóa nhiều bản ghi
     * @param {array} ids danh sách id
     * @param {function} callback Callback
     */
    static async deleteMultiple(ids, callback = function(){}, failCallback = function(){}) {
        // axios({
        //     method: 'delete',
        //     url: this.api + 'multiple',
        //     data: ids,
        // })
        axios.delete(this.api + 'multiple', {
            data: ids
        })
        .then((response) => {
            callback()
            showToast('success', response.data.UserMsg)
        }).catch((error) => {
            try {
                showToast('error', error.response.data.UserMsg);
            } catch {
                showErrorToast();
            } finally {
                failCallback();
            }
        })
    }

    /**
     * Hàm lấy mã mới
     * @returns string
     */
    static async getNewCode() {
        let res;
        await axios.get(this.api + 'newCode')
            .then((response) => {
                res = response.data
            }).catch((error) => {
                try {
                    showToast('error', error.response.data.UserMsg);
                } catch {
                    showErrorToast();
                }
            })
        return res
    }
}