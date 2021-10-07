<template>
    <div 
        class="modal" 
        tabindex="0" 
        @keydown.ctrl.83.exact.prevent.stop="submitForm('Save')"
        @keydown.esc.exact.prevent="closeForm"
    >   

        <BaseSpinner :isLoading="isLoading" backgroundColor="rgba(0,0,0,0.2)" />
        <div class="tax-detail info-form">
            <div class="form__header flex flex-align-center">
                <h1 class="text-heading notosans-bold">Thông tin kỳ thuế</h1>
                <div v-tooltip.bottom="{ content: 'Close (ESC)', classes: ['btn-tooltip'], delay: { show: 300 }}" 
                    class="close mi mi-24 mi-close" 
                    @click="closeForm"
                ></div>
            </div>
            <div action="" class="form__body">
                <div class="form__content">
                    <div class="flex">
                        <div class="form__input">
                            <div class="form__field-input">
                                <BaseInput 
                                    ref="TaxCode"
                                    inputLabel="Mã kỳ"
                                    tabindex="1"
                                    :required="true"
                                    :inputMaxlength="20"
                                    v-model="data['TaxCode']"
                                    @validate="setValid($event,'TaxCode')"
                                    @keydown.native.shift.tab.exact.prevent="$refs.Cancel.$refs.Button.focus()"
                                />
                            </div>

                            <div class="form__field-input">
                                <BaseInput
                                    ref="TaxName"
                                    inputLabel="Tên kỳ thuế"
                                    tabindex="2"
                                    :inputMaxlength="100"
                                    :required="true"
                                    :value="data['TaxName'] | formatNull"
                                    @input="setData($event,'TaxName')"
                                    @validate="setValid($event,'TaxName')"
                                />
                            </div>

                        </div>
                        <div class="form__input">

                            <div class="form__field-input">
                                <div class="label">Ngày bắt đầu<span style="color: red">*</span></div>
                                <BaseDatePick 
                                    ref="StartDate"
                                    inputClass="date-input"
                                    :value="data['StartDate']"
                                    :disabledDate="(date) => date == null"
                                    :required="true"
                                    label="Ngày bắt đầu"
                                    @input="setData($event,'StartDate')"
                                    @validate="setValid($event,'StartDate')"
                                    :formatType="formatDate"
                                    tab="3"
                                />
                            </div>

                            <div class="form__field-input">
                                <div class="label">Ngày kết thúc<span style="color: red">*</span></div>
                                <BaseDatePick 
                                    ref="EndDate"
                                    inputClass="date-input"
                                    tab="4"
                                    :value="data['EndDate']"
                                    label="Ngày kết thúc"
                                    :required="true"
                                    :disabledDate="(date) => date == null"
                                    @input="setData($event,'EndDate')"
                                    @validate="setValid($event,'EndDate')"
                                    :formatType="formatDate"
                                />
                            </div>

                        </div>
                    </div>

                    <div class="flex flex-column">
                        <div class="form__input full-width">
                            <div class="form__field-input full-width">
                                <BaseInput 
                                    ref="Description"
                                    inputLabel="Ghi chú"
                                    tabindex="5"
                                    :inputMaxlength="255"
                                    :value="this.data['Description'] | formatNull"
                                    @input="setData($event,'Description')"
                                />
                            </div>

                        </div>     
                    </div>
                    
                    <TaxDetailEmployeeList ref="List" />
                </div>
            </div>
            <div class="form__footer flex flex-justify-space-between flex-align-center">
                <div class="footer-left flex flex-grow-0">
                    
                </div>
                <div class="footer-right flex flex-grow-0">
                    <BaseButton 
                        id="cancel"
                        ref="Cancel"
                        btnClass="btn-seconds"
                        title="Hủy"
                        tabindex="8"
                        :clickEvent="this.hideForm"
                        @keydown.native.tab.exact.prevent="$refs.TaxCode.$refs.Input.focus()"
                    />
                    <BaseButton 
                        id="save"
                        btnClass="btn-base"
                        hoverTitle="Cất (Ctrl + S)"
                        title="Lưu"
                        tabindex="7"
                        :clickEvent="() => submitForm('Save')"
                    />
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>

    import { formatName, formatNull, formatMoney } from '../../../js/common/format'
    import TaxApi from '../../../js/api/tax/tax-api'

    import BaseButton from '../../base/BaseButton.vue'
    import BaseInput from '../../base/BaseInput.vue'
    import BaseSpinner from '../../base/BaseSpinner.vue'
    import BaseDatePick from '../../base/BaseDatePick.vue'
    import {TaxStore} from './store'
    import {Store} from '../store.js'


    import Vue from 'vue'
    import TaxDetailEmployeeList from './TaxDetailEmployeeList.vue'
import showErrorPopup from '../../../js/base/popup'

    export default {
        name: 'TaxDetail',
        props: ['entityId', 'formState'],
        data() {
            return {

                /**
                 * List các ref input trong form
                 */
                refs: ['TaxCode','TaxName', 'StartDate', 'EndDate'],

                data: {},
                valids: [],
                formatDate: Store.state.formatDate,
                department: null,
                oldData: {},
                isLoading: false,
                afterClose: () => {},
                
            }
        },
        computed: {
            TaxStore() {
                return TaxStore.state;
            }
        },

        //#region Filters
        filters: {
            /**
             * Filter các giá trị null
             * @author: NMTuan (20/07/2021)
             */
            formatNull: function(value) {
                return formatNull(value)
            },
            
            /**
             * Filter giá trị tên, tự động viết hoa chữ cái đầu
             * @author: NMTuan (30/08/2021)
             */
            formatName: function(value) {
                return formatName(value)
            },

            /**
             * Filter giá trị tiền
             * @author: NMTuan (20/09/2021)
             */
            formatMoney: function(value) {
                return formatMoney(value)
            }


        },
        //#endregion

        components: {
            BaseButton, BaseInput, BaseDatePick, BaseSpinner,
                TaxDetailEmployeeList
        },

        /**
         * Hàm xử lý khi khởi tạo lấy dữ liệu từ api
         * @author: NMTuan (20/07/2021)
         */
        async created() {
            this.isLoading = true
            // Kiểm tra nếu có truyền vào id thì lấy dữ liệu từ id
            if (this.entityId) {
                TaxApi.getById(this.entityId, (response) => {
                    this.setForm(response.data)
                    this.convertData()
                    // Lưu dữ liệu để so sánh sau khi đổi
                    this.oldData = JSON.parse(JSON.stringify(this.data))
                    this.isLoading = false
                }, () => {
                    this.isLoading = false
                })
            } else {
                // Nếu không có id truyền vào thì lấy mã mới
                let employeeCode = await TaxApi.getNewCode()
                Vue.set(this.data,'TaxCode', employeeCode)
                // Lưu dữ liệu để so sánh sau khi đổi
                this.oldData = JSON.parse(JSON.stringify(this.data))
                this.isLoading = false
            }
        },

        /**
         * Hàm xử khi khởi tạo xong
         * @author: NMTuan (20/07/2021)
         */
        mounted: function() {
            this.$refs.TaxCode.$refs.Input.focus()
        },
            
        watch: {
        },

        methods: {

            /**
             * Hàm ẩn form
             * @author: NMTuan(20/07/2021)
             */
            hideForm() {
                this.$emit('closeModal');
                this.afterClose();
            },

            /**
             * Hàm đóng form
             * @author: NMTuan (21/07/2021)
             */
            closeForm() {
                if (this.isChanged()) {
                    let popup = {
                        type: 'question',
                        message : 'Dữ liệu đã bị thay đổi. Bạn có muốn cất không?',
                        isShow: true,
                        confirm: 'Có',
                        subConfirm: 'Không',
                        cancel: 'Hủy',
                        callback: () => {
                            this.submitForm('Save')
                        },
                        subCallback: () => {
                            this.hideForm()
                        }
                    }
                    this.$eventBus.$emit('showPopup', popup);
                } else {
                    this.hideForm()
                }
                
            },

            /**
             * Hàm reset lại form
             * @author: NMTuan (20/07/2021)
             */
            resetForm() {
                this.data = {}
            },

            /**
             * Hàm xét các giá trị của form
             * @author: NMTuan (20/07/2021)
             */
            async setForm(response) {
                for (let field in response) {
                    let val = response[field]
                    Vue.set(this.data, field, val)
                }
                this.$eventBus.$emit('setRecordsDetailEmployeeList', response['Details'])
                if (this.formState == 'Add') {
                    Vue.set(this.data, 'TaxCode', null)
                    Vue.set(this.data, 'TaxCode', await TaxApi.getNewCode())
                }
            },

            /**
             * Submit form
             * @author: NMTuan (20/07/2021)
             */
            submitForm(state) {
                console.log(state)
                //Nếu hợp lệ thì submit form
                if (this.validateForm()) {
                    //Chuẩn hóa dữ liệu trước khi gửi
                    this.standardizeData(this.data)

                    //Kiểm tra trang thái là Cất hay Cất và thêm
                    let success = () => {};
                    //Nếu là cất thì đóng form và load lại trang
                    if (state == 'Save') {
                        success = () => {
                            this.hideForm()
                        }
                    //Nếu là cất và thêm thì submit form, đưa trạng thái form về thêm, lấy code mới
                    } else if (state == 'Save-Add') {
                        success = async () => {
                            //Reset lại form
                            this.resetForm();
                            //Đưa về trang thái thêm
                            this.$parent.formState = 'Add';
                            this.$parent.entityId = '';
                            //Lấy lại EmployeeCode
                            Vue.set(this.data, 'TaxCode', await TaxApi.getNewCode());
                            //Lưu lại dữ liệu
                            this.oldData = JSON.parse(JSON.stringify(this.data))
                            //Focus vào Employeecode
                            this.$refs.EmployeeCode.$refs.Input.focus();
                            //Đăt load lại trang khi đòng form
                            this.afterClose = () => { this.$eventBus.$emit('refresh') }
                        }
                    }
                    
                    //Kiểm tra trạng thái của form là Add hay Update rồi submit
                    if(this.formState == 'Update') {
                        this.updateData(() => {
                            success();
                            this.$eventBus.$emit('loadData', {
                                success: () => {
                                    this.$eventBus.$emit('detail', this.entityId)
                                    this.$eventBus.$emit('updateSelectedMaster', [this.entityId])
                                }
                            });
                        });
                    } else {
                        this.addNewData(() => {
                            success();
                            this.$eventBus.$emit('refresh');
                        });
                    }
                }
                
            },

            /**
             * Gán các giá trị từ các trường tương ứng
             * @author: NMTuan (20/07/2021)
             */
            setData(value, fieldName) {
                Vue.set(this.data, fieldName, value)
            },

            /**
             * Lấy giá trị hợp lệ từ các trường
             * @author: NMTuan (20/07/2021)
             */
            setValid(valid, fieldName) {
                this.valids[fieldName] = valid
            },

            /**
             * Hàm chuẩn hóa các giá trị từ form trước khi gửi
             * @author: NMTuan (20/07/2021)
             */
            standardizeData(data) {
                if (this.formState == 'Add') data.Year = TaxStore.state.year.value;
                data.Details = this.$refs.List.records;
                data.Details.forEach((item) => {
                    if(data.TaxId) item.TaxId = data.TaxId;
                    if (typeof item.Salary == 'string') {
                        item.Salary = parseInt(item.Salary.replaceAll('.',''));
                    }
                    if (typeof item.Insurance == 'string') {
                        item.Insurance = parseInt(item.Insurance.replaceAll('.',''));
                    }
                })
            },

            /**
             * Hàm chuyển các giá trị từ dữ liệu api
             * @author: NMTuan (20/07/2021)
             */
            convertData() {
            },

            /**
             * Hàm thêm mới dữ liệu
             * @author: NMTuan (05/08/2021)
             */
            addNewData(success = function() {}) {
                this.isLoading = true
                TaxApi.saveData(this.data, () => {
                    success();
                }, (response) => {
                    this.$refs[response.Data].$refs.Input.focus()
                }, () => {
                    this.isLoading = false;
                })
            },

            /**
             * Hàm cập nhật thông tin dữ liệu
             * @author: NMTuan (05/08/2021)
             */
            updateData(success = function() {}) {
                this.isLoading = true
                TaxApi.update(this.data, this.entityId, () => {
                    success();
                }, (response) => {
                    this.$refs[response.Data].$refs.Input.focus()
                }, () => {
                    this.isLoading = false;
                })
            },

            /**
             * Hàm kiểm tra giá trị đã được cập nhật
             * @author: NMTuan (11/08/2021)
             */
            isChanged() {
                return JSON.stringify(this.oldData) !== JSON.stringify(this.data)
            },

            /**
             * Hàm validate dữ liệu trước khi gửi
             * @author: NMTuan (19/08/2021)
             */
            validateForm() {
                //Blur qua các ô input
                this.refs.forEach(item => {
                    this.$refs[item].inputFocusoutEvent()
                    if(this.valids[item] == false) {
                        this.$refs[item].showTooltip()
                    }
                })
                //Kiểm tra có trường bị sai
                for (let valid in this.valids) {
                    if (!this.valids[valid]) {
                        this.$refs[valid].$refs.Input.focus()
                        return false;
                    }
                }
                // Kiểm tra ngày băt đầu phải xảy ra trước ngày kết thúc
                if (this.data['StartDate'] > this.data['EndDate']) {
                    showErrorPopup('Ngày bắt đầu phải xảy ra trước ngày kết thúc', () => {
                        this.$refs.StartDate.$refs.Input.focus()
                    })
                    return false;
                }
                
                // Kiểm tra phải có ít nhất 1 bản ghi trong bảng!
                if (this.$refs.List.records.length == 0) {
                    showErrorPopup('Vui lòng chọn ít nhất 1 nhân viên trong bảng!')
                    return false;
                }

                // Kiểm tra danh sách thông tin trong bảng
                let list = this.$refs.List
                let checkList = list.records.every((item, index) => {
                    if (item.Salary == 0) {
                        list.$refs['Salary'][index].$refs.Input.focus();
                        list.$refs['Salary'][index].validate()
                        return false;
                    }
                    if (item.Insurance == 0) {
                        list.$refs['Insurance'][index].$refs.Input.focus();
                        list.$refs['Insurance'][index].validate();
                        return false;
                    }
                    return true;
                })
                if (!checkList) {
                    return false
                }

                return true;
            },

        }
    }
</script>

<style scoped>
@import '../../../css/base/detail.css';
@import '../../../css/views/tax/tax-detail.css';
</style>