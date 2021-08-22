<template>
    <div class="navbar" :class="{'navbar--collapsed' : isCollapsed}">
        <div class="navbar-content" >
            <div id="overview" class="nav-item">
                <div class="nav-item-icon" style=""></div>
                <div class="nav-item-text">Tổng quan</div>
            </div>
            <div id="cash" class="nav-item">
                <div class="nav-item-icon" ></div>
                <div class="nav-item-text">Tiền mặt</div>
            </div>
            <div id="deposits" class="nav-item">
                <div class="nav-item-icon" ></div>
                <div class="nav-item-text">Tiền gửi</div>
            </div>
            <div id="buy" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Mua hàng</div>
            </div>
            <div id="sale" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Bán hàng</div>
            </div>
            <div id="invoice" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Quản lý hóa đơn</div>
            </div>
            <div id="stock" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Kho</div>
            </div>
            <div id="tools" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Công cụ dụng cụ</div>
            </div>
            <div id="fixed-assets" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Tài sản cố định</div>
            </div>
            <div id="tax" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Thuế</div>
            </div>
            <div id="price" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Giá thành</div>
            </div>
            <div id="general" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Tổng hợp</div>
            </div>
            <div id="budget" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Ngân sách</div>
            </div>
            <div id="report" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Báo cáo</div>
            </div>
            <div id="finance" class="nav-item">
                <div class="nav-item-icon"></div>
                <div class="nav-item-text">Phân tích tài chính</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TheNavbar',
        props: ['isCollapsed']
    }
</script>

<style scoped>
    @import url('../../css/layout/navbar.css');
</style>