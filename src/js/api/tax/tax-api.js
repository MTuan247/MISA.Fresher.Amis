import BaseAPI from "../base/base-api";
import axios from 'axios';
import { showErrorToast, showToast } from '../../base/toast'
import {TaxStore} from '../../../components/views/tax/store'

export default class TaxApi extends BaseAPI {
    constructor() {
        super()
    }

    static api = this.host + "Tax/"

    /**
     * Hàm lấy bản ghi theo tiêu chí
     * @param {int} pageSize Số bản ghi trong 1 trang
     * @param {int} pageNumber Số trang
     * @param {string} entityFilter Giá trị filter
     * @param {function} callback Hàm gọi sau khi load
     */
    static getDataFiltered(pageSize, pageNumber, entityFilter, callback = function(){}, failCallback = function(){}) {
        axios.get(this.api + `taxFilter?pageSize=${pageSize}&pageNumber=${pageNumber}&taxFilter=${entityFilter}&year=${TaxStore.state.year.value}`)
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

}