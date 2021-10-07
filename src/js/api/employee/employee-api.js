import BaseAPI from "../base/base-api";
import axios from 'axios';
import showErrorPopup from '../../base/popup';
import { showErrorToast, showToast } from '../../base/toast'

export default class EmployeeApi extends BaseAPI {
    constructor() {
        super()
    }
    // static api = "http://cukcuk.manhnv.net/v1/Employees/"
    static host = "https://localhost:44334/api/v1/"
    static api = this.host + "Employee/"
    static positionApi = this.host + "Position/"
    static departmentApi = this.host + "Department/"

    
    /**
     * Hàm lấy bản ghi theo tiêu chí
     * @param {int} pageSize Số bản ghi trong 1 trang
     * @param {int} pageNumber Số trang
     * @param {string} entityFilter Giá trị filter
     * @param {string} departmentId Id phòng ban
     * @param {string} positionId Id vị trí
     * @param {function} callback Hàm gọi sau khi load
     */
    static getDataFiltered(pageSize, pageNumber, entityFilter, departmentId, callback = function(){}, failCallback = function(){}) {
        let empl = entityFilter
        // if(!empl) empl = `NV`
        axios.get(this.api + `employeeFilter?pageSize=${pageSize}&pageNumber=${pageNumber}&employeeFilter=${empl}&departmentId=${departmentId}`)
        .then((response) => {
            console.log(response)
            callback(response)
            // if (response.data.TotalRecord == 0 || response.status == 204) {
            //     showToast('error', 'Không có dữ liệu trả về!')
            // }
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
     * Hàm gọi api sửa nhiều bản ghi
     * @param {Object} data data truyền vào body
     * @param {Function} successCallback callback khi thành công
     * @param {Function} failCallback callback khi thất bại
     * @param {Function} completeCallback callback sau khi hoàn thành
     * @author: NMTuan (01/09/2021)
     */
    static updateMultiple(data, successCallback = function(){}, failCallback = function(){}, completeCallback = function(){}) {
        axios.put(this.api + "Multiple", data)
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
}