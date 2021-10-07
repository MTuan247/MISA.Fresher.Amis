<template>
    <div 
        class="modal" 
        tabindex="0" 
        @keydown.ctrl.shift.83.exact.prevent.stop="submitForm('Save-Add')" 
        @keydown.ctrl.83.exact.prevent.stop="submitForm('Save')"
        @keydown.esc.exact.prevent="closeForm"
    >
        <BaseSpinner :isLoading="isLoading" backgroundColor="rgba(0,0,0,0.5)" />
        <div class="info-form employee-form">
            <div class="form__header flex flex-align-center">
                <h1 class="text-heading notosans-bold">Thông tin nhân viên</h1>
                <div v-tooltip.bottom="{ content: 'Close (ESC)', classes: ['btn-tooltip'], delay: { show: 300 }}" 
                    class="close mi mi-24 mi-close" 
                    @click="closeForm"
                ></div>
            </div>
            <div action="" class="form__body">
                <div class="form__content">
                    <div class="flex">
                        <div class="form__input">
                            <div id="code-input" class="form__field-input">
                                <BaseInput 
                                    ref="EmployeeCode"
                                    inputLabel="Mã nhân viên"
                                    tabindex="1"
                                    :required="true"
                                    :inputMaxlength="20"
                                    :value="this.data['EmployeeCode'] | formatNull"
                                    @input="setData($event,'EmployeeCode')"
                                    @validate="setValid($event,'EmployeeCode')"
                                    @keydown.native.shift.tab.exact.prevent="$refs.Cancel.$refs.Button.focus()"
                                />
                            </div>

                            <div class="form__field-input">
                                <BaseInput
                                    ref="EmployeeName"
                                    inputLabel="Họ và tên"
                                    tabindex="2"
                                    :inputMaxlength="100"
                                    :required="true"
                                    :value="this.data['EmployeeName'] | formatName | formatNull"
                                    @input="setData($event,'EmployeeName')"
                                    @validate="setValid($event,'EmployeeName')"
                                />
                            </div>

                            <div class="form__field-input">
                                <div class="label">Đơn vị <span style="color: red;">*</span></div>
                                <BaseVCombobox 
                                    ref="Department"
                                    v-model="department"
                                    label="Đơn vị"
                                    fieldName="DepartmentName"
                                    fieldValue="DepartmentId"
                                    tabindex="3"
                                    @validate="setValid($event,'Department')"
                                    :extraData="departmentItems"
                                    :required="true"
                                />
                            </div>

                            <div class="form__field-input">
                                <BaseInput
                                    ref="EmployeePosition"
                                    inputLabel="Chức danh"
                                    tabindex="4"
                                    :inputMaxlength="100"
                                    :value="this.data['EmployeePosition'] | formatNull"
                                    @input="setData($event,'EmployeePosition')"
                                />
                            </div>

                            

                        </div>
                        <div class="form__input">

                            <div fieldType="Date" class="form__field-input">
                                <div class="label">Ngày sinh</div>
                                <BaseDatePick 
                                    ref="DateOfBirth"
                                    inputClass="date-input"
                                    :value="data['DateOfBirth']"
                                    @input="setData($event,'DateOfBirth')"
                                    :formatType="formatDate"
                                    tab="5"
                                />
                            </div>

                            <div id="gender-input" class="v-input-radio form__field-input">
                                <div class="label">Giới tính</div>
                                <v-radio-group mandatory row v-model="data.Gender">
                                    <v-radio tabindex="6" label="Nam" :value="$enums.Gender.Male"></v-radio>
                                    <v-radio tabindex="7" label="Nữ" :value="$enums.Gender.Female"></v-radio>
                                    <v-radio tabindex="8" label="Khác" :value="$enums.Gender.Other"></v-radio>
                                </v-radio-group>
                            </div>

                            <div class="form__field-input">
                                <BaseInput
                                    ref="IdentityNumber"
                                    inputLabel="Số CMTND/ Căn cước"
                                    tabindex="9"
                                    pattern="^[0-9]{9,}$"
                                    inputType="number"
                                    :inputMaxlength="25"
                                    :value="this.data['IdentityNumber'] | formatNull"
                                    @input="setData($event,'IdentityNumber')"
                                    @validate="setValid($event,'IdentityNumber')"
                                />
                            </div>

                            <div class="flex-grow-0 form__field-input">
                                <div class="label">Ngày cấp</div>
                                <BaseDatePick 
                                    ref="IdentityDate"
                                    inputClass="date-input"
                                    tab="10"
                                    :value="data['IdentityDate']"
                                    @input="setData($event,'IdentityDate')"
                                    :formatType="formatDate"
                                />
                            </div>

                            <div class="form__field-input">
                                <BaseInput 
                                    ref="IdentityPlace"
                                    inputLabel="Nơi cấp"
                                    tabindex="11"
                                    :inputMaxlength="255"
                                    :value="this.data['IdentityPlace'] | formatNull"
                                    @input="setData($event,'IdentityPlace')" 
                                />
                            </div>

                        </div>
                    </div>

                    <div class="flex flex-column" style="margin-top: 15px;">
                        <div class="form__input full-width">
                            <div class="form__field-input full-width">
                                <BaseInput 
                                    ref="Address"
                                    inputLabel="Địa chỉ"
                                    tabindex="12"
                                    :inputMaxlength="255"
                                    :value="this.data['Address']"
                                    @input="setData($event,'Address')"
                                />
                            </div>

                            <div class="form__field-input sub-input">
                                <BaseInput 
                                    ref="PhoneNumber"
                                    inputLabel="Điện thoại di động"
                                    tabindex="13"
                                    pattern="^[0-9]{9,}$"
                                    inputType="number"
                                    :inputMaxlength="50"
                                    :value="this.data['PhoneNumber'] | formatNull"
                                    @input="setData($event,'PhoneNumber')"
                                    @validate="setValid($event,'PhoneNumber')"
                                />
                            </div>

                            <div class="form__field-input sub-input">
                                <BaseInput 
                                    ref="TelephoneNumber"
                                    inputLabel="Điện thoại cố định"
                                    tabindex="14"
                                    pattern="^[0-9]{9,}$"
                                    inputType="number"
                                    :inputMaxlength="50"
                                    :value="this.data['TelephoneNumber'] | formatNull"
                                    @input="setData($event,'TelephoneNumber')"
                                    @validate="setValid($event,'TelephoneNumber')"
                                />
                            </div>

                            <div class="form__field-input sub-input">
                                <BaseInput 
                                    ref="Email"
                                    inputLabel="Email"
                                    tabindex="15"
                                    inputType="email"
                                    :inputMaxlength="100"
                                    :value="this.data['Email'] | formatNull"
                                    @input="setData($event,'Email')"
                                    @validate="setValid($event,'Email')"
                                />
                            </div>

                        </div>

                        <div class="form__input full-width">
                            <div class="form__field-input sub-input">
                                <BaseInput 
                                    ref="BankAccountNumber"
                                    inputLabel="Tài khoản ngân hàng"
                                    tabindex="16"
                                    pattern="^[0-9]{6,}$"
                                    inputType="number"
                                    :inputMaxlength="25"
                                    :value="this.data['BankAccountNumber'] | formatNull"
                                    @input="setData($event,'BankAccountNumber')"
                                />
                            </div>
                            <div class="form__field-input sub-input">
                                <BaseInput 
                                    ref="BankName"
                                    inputLabel="Tên ngân hàng"
                                    tabindex="17"
                                    :inputMaxlength="255"
                                    :value="this.data['BankName'] | formatNull"
                                    @input="setData($event,'BankName')"
                                />
                            </div>
                            <div class="form__field-input sub-input">
                                <BaseInput 
                                    ref="BankBranchName"
                                    inputLabel="Chi nhánh"
                                    tabindex="18"
                                    :inputMaxlength="255"
                                    :value="this.data['BankBranchName'] | formatNull"
                                    @input="setData($event,'BankBranchName')"
                                />
                            </div>
                        </div>     
                    </div>
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
                        tabindex="21"
                        :clickEvent="this.hideForm"
                        @keydown.native.tab.exact.prevent="$refs.EmployeeCode.$refs.Input.focus()"
                    />
                    <BaseButton 
                        id="save"
                        btnClass="btn-base"
                        hoverTitle="Cất (Ctrl + S)"
                        title="Lưu"
                        tabindex="19"
                        :clickEvent="() => submitForm('Save')"
                    />
<!-- 
                    <BaseButton 
                        id="submit"
                        ref="SubmitAndAdd"
                        title="Cất và thêm"
                        hoverTitle="Cất và thêm (Ctrl + Shift + S)"
                        tabindex="20"
                        :clickEvent="() => submitForm('Save-Add')"
                    /> -->
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>

    import { formatName, formatNull } from '../../../js/common/format'
    import EmployeeApi from '../../../js/api/employee/employee-api'

    import BaseButton from '../../base/BaseButton.vue'
    import BaseInput from '../../base/BaseInput.vue'
    import BaseSpinner from '../../base/BaseSpinner.vue'
    import BaseDatePick from '../../base/BaseDatePick.vue'
    import BaseVCombobox from '../../base/BaseVCombobox.vue'
    import {EmployeeStore} from './store'
    import {Store} from '../store.js'

    import Vue from 'vue'
    // import { showAlarmPopup } from '../../../js/base/popup'

    export default {
        name: 'EmployeeForm',
        props: ['entityId', 'formState'],
        data() {
            return {

                /**
                 * List các ref input trong form
                 */
                refs: [
                    'EmployeeCode', 
                    'EmployeeName',
                    'Department',
                    'DateOfBirth',
                    'IdentityNumber',
                    'IdentityDate',
                    'IdentityPlace',
                    'Email',
                    'PhoneNumber',
                    'TelephoneNumber',
                    'BankAccountNumber',
                ],

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
            // Lây danh sách department
            departmentItems() {
                return EmployeeStore.state.department;
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


        },
        //#endregion

        components: {
            BaseButton, BaseInput, BaseDatePick, BaseSpinner,
                BaseVCombobox
        },

        /**
         * Hàm xử lý khi khởi tạo lấy dữ liệu từ api
         * @author: NMTuan (20/07/2021)
         */
        async created() {
            this.isLoading = true
            // Kiểm tra nếu có truyền vào id thì lấy dữ liệu từ id
            if (this.entityId) {
                EmployeeApi.getById(this.entityId, (response) => {
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
                let employeeCode = await EmployeeApi.getNewCode()
                Vue.set(this.data,'EmployeeCode', employeeCode)
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
            this.$refs.EmployeeCode.$refs.Input.focus()
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
                this.department = {
                    text: '',
                    val: null,
                }
            },

            /**
             * Hàm xét các giá trị của form
             * @author: NMTuan (20/07/2021)
             */
            async setForm(response) {
                for (let field in response) {
                    let val = response[field]
                    // if(val == null) val = ''
                    Vue.set(this.data, field, val)
                }
                if (this.formState == 'Add') {
                    Vue.set(this.data, 'EmployeeCode', null)
                    Vue.set(this.data, 'EmployeeCode', await EmployeeApi.getNewCode())
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
                    this.standardizedData(this.data)

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
                            Vue.set(this.data, 'EmployeeCode', await EmployeeApi.getNewCode());
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
                            this.$eventBus.$emit('loadData');
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
            standardizedData(data) {
                data.DepartmentId = this.department.value
                if (data.DepartmentId == undefined) {
                    data.DepartmentId = null
                }
            },

            /**
             * Hàm chuyển các giá trị từ dữ liệu api
             * @author: NMTuan (20/07/2021)
             */
            convertData() {
                this.department = {
                    text: this.data['DepartmentName'],
                    value: this.data['DepartmentId']
                }
            },

            /**
             * Hàm thêm mới dữ liệu
             * @author: NMTuan (05/08/2021)
             */
            addNewData(success = function() {}) {
                this.isLoading = true
                EmployeeApi.saveData(this.data, () => {
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
                EmployeeApi.update(this.data, this.entityId, () => {
                    success();
                }, (response) => {
                    // this.$refs[response.Data].tooltipMessage = response.UserMsg;
                    // this.$refs[response.Data].isValid = false;
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
                        // showAlarmPopup(this.$refs[valid].tooltipMessage, () => {
                        //     this.$refs[valid].$refs.Input.focus()
                        // })
                        this.$refs[valid].$refs.Input.focus()
                        return false;
                    }
                }
                return true;
            }

        }
    }
</script>

<style scoped>
@import '../../../css/base/detail.css';
@import '../../../css/views/employee/form.css';
</style>