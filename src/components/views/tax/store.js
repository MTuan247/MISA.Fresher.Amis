export const TaxStore = {
    state: {
        formatDate: 'DD/MM/YYYY',
        department: [],
        isShowSummary: false,
        isPaging: true,
        isShowSettings: false,
        year: {
            text: 'Năm ' + new Date().getFullYear(),
            value: new Date().getFullYear()
        },
        columns: [
            {
                title: '',
                fieldName: 'Checkbox',
                style: 'width: 40px; left: 0',
                class: 'sticky',
            },
            {
                title: 'Mã kỳ',
                fieldName: 'TaxCode',
                style: 'width: 100px; left: 40px',
                class: 'sticky'
            },
            {
                title: 'Tên kỳ',
                fieldName: 'TaxName',
                style: 'width: 190px; left: 140px',
                class: 'sticky'
            },
            {
                title: 'Ngày bắt đầu',
                fieldName: 'StartDate',
                style: 'width: 120px;',
                type: 'Date',
                class: 'text-align-center'
            },
            {
                title: 'Ngày kết thúc',
                fieldName: 'EndDate',
                style: 'width: 120px;',
                type: 'Date',
                class: 'text-align-center'
            },
            {
                title: 'Số lượng nhân viên',
                fieldName: 'Quantity',
                style: 'width: 160px;',
                type: 'Number',
                class: 'text-align-right'
            },
            {
                title: 'Tổng tiền thuế',
                fieldName: 'SummaryTax',
                style: 'width: 160px;',
                type: 'Money',
                class: 'text-align-right'
            },
            {
                title: 'Ghi chú',
                fieldName: 'Description',
                style: '',
            },
            {
                title: 'Chức năng',
                fieldName: '',
                style: 'width: 100px; right: 0',
                class: 'sticky text-align-center'
            }
        ],
        detailColumns: [
            {
                title: 'STT',
                style: 'width: 40px',
                tooltip: 'Số thứ tự',
                class: 'text-align-center'
            },
            {
                title: 'Mã nhân viên',
                fieldName: 'EmployeeCode',
                style: 'width: 120px;',
            },
            {
                title: 'Tên nhân viên',
                fieldName: 'EmployeeName',
                style: 'width: 200px;',
            },
            {
                title: 'Tiền lương',
                fieldName: 'Salary',
                style: 'width: 150px',
                class: 'text-align-right',
                type: 'Money'
            },
            {
                title: 'Tiền BHXH',
                fieldName: 'Insurance',
                style: 'width: 150px',
                class: 'text-align-right',
                type: 'Money',
                tooltip: 'Tiền bảo hiểm',
                tooltipClass: 'insurance-tooltip'
            },
            {
                title: 'Thu nhập tính thuế',
                fieldName: 'TaxableIncome',
                style: 'width: 150px',
                class: 'text-align-right',
                type: 'Money'
            },
            {
                title: 'Thuế',
                fieldName: 'Tax',
                style: 'width: 150px',
                class: 'text-align-right',
                type: 'Money'
            },
        ],
        employeeColumns: [
            {
                title: '',
                fieldName: 'Checkbox',
                style: 'width: 40px; left: 0',
                class: 'sticky',
            },
            {
                title: 'Mã nhân viên',
                fieldName: 'EmployeeCode',
                style: 'width: 120px; left: 40px',
                class: 'sticky'
            },
            {
                title: 'Tên nhân viên',
                fieldName: 'EmployeeName',
                style: 'width: 200px; left: 160px',
                class: 'sticky'
            },
            {
                title: 'Giới tính',
                fieldName: 'GenderName',
                style: 'width: 75px;',
            },
            {
                title: 'Ngày sinh',
                fieldName: 'DateOfBirth',
                style: 'width: 120px; text-align: center',
                type: 'date'
            },
            {
                title: 'Số CMND',
                fieldName: 'IdentityNumber',
                style: 'width: 150px;',
                tooltip: 'Số chứng minh nhân dân',
            },
            {
                title: 'Địa chỉ',
                fieldName: 'Address',
                style: 'width: 250px;',
            },
            {
                title: 'Số điện thoại',
                fieldName: 'PhoneNumber',
                style: 'width: 150px;',
            },
            {
                title: 'Email',
                fieldName: 'Email',
                style: 'width: 200px;',
            },
            {
                title: 'Chức danh',
                fieldName: 'EmployeePosition',
                style: 'width: 180px;',
            },
            {
                title: 'Bộ phận/Phòng ban',
                fieldName: 'DepartmentName',
                style: 'width: 180px;',
            },
            {
                title: 'Số tài khoản',
                fieldName: 'BankAccountNumber',
                style: 'width: 120px;',
            },
            {
                title: 'Tên ngân hàng',
                fieldName: 'BankName',
                style: 'width: 180px;',
            },
            {
                title: 'Chi nhánh ngân hàng',
                fieldName: 'BankBranchName',
                style: 'width: 180px;',
            },
        ],
    }
}