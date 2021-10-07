export const EmployeeStore = {
    state: {
        formatDate: 'DD/MM/YYYY',
        department: [],
        isShowSummary: false,
        isPaging: true,
        isShowSettings: false,
        columns: [
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
            {
                title: 'Chức năng',
                fieldName: '',
                style: 'width: 100px; right: 0',
                class: 'sticky text-align-center'
            }
        ],
    }
}