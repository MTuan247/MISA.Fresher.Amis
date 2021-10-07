<template>
    <div class="context-menu" v-show="isShow" 
        :style="{left: computedPosition.ctxMenuX + 'px', top: computedPosition.ctxMenuY + 'px'}" 
    >
        <div 
            @click="clickAction(item.action)" 
            class="context-menu__item"
            v-for="item in contextMenuItems" 
            :key="item.title" 
        > 
            {{item.title}} 
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BaseContextMenu',
        props: {
        },
        data() {
            return {
                isShow: false,
                contextMenuX: null,
                contextMenuY: null,
                contextMenuItems: {},
            }
        },
        computed:{
            /**
             * Hàm tính toán vị trí cho context menu
             * @author: NMTuan (09/08/2021)
             */
            computedPosition() {
                let ctxMenuX = this.contextMenuX;
                let ctxMenuY = this.contextMenuY;
                let clientHeight = this.contextMenuItems.length * 32
                if (ctxMenuY > window.screen.height*0.6) {
                    ctxMenuY -= clientHeight
                }
                return {
                    ctxMenuX,
                    ctxMenuY
                }
            }
        },
        /**
         * Hàm gọi khi khởi tạo
         * @author: NMTuan 31/08/2021
         */
        created() {
            //Xét các sự kiện cho contexmenu
            this.$eventBus.$on('showContext', (contextMenuX, contextMenuY, contextMenuItems) => { 
                this.isShow = true, 
                this.contextMenuX = contextMenuX, 
                this.contextMenuY = contextMenuY,
                this.contextMenuItems = contextMenuItems
            })
            this.$eventBus.$on('hideContext', () => { this.isShow = false })
            this.$eventBus.$on('setContext', (isShow) => { this.isShow = isShow })
        },
        mounted () {
            document.addEventListener('click', this.clickOutside)
        },
        methods: {
            /**
             * Method click ra ngoài component
             * @author: NMTuan (12/08/2021)
             */
            clickOutside (e) {
                if (!this.$el.contains(e.target)) {
                    this.isShow = false
                }
            },

            /**
             * Method click thực hiện item action
             * @author: NMTuan (12/08/2021)
             */
            clickAction(callback = function(){}) {
                callback()
                this.isShow = false
            }
        }
    }
</script>

<style scoped>
.context-menu {
    --item-height: 32px;
    position: absolute; 
    z-index: 6;
    border-radius: 2px;
    box-shadow: 2px 2px 5px #bbb;
    overflow: hidden;
    font-size: 13px;
}

.context-menu .context-menu__item {
    height: var(--item-height);
    width: 100px;
    background-color: #fff;
    line-height: var(--item-height);
    padding: 0 10px;
    cursor: pointer;
}

.context-menu .context-menu__item:hover {
    /* background-color: var(--primary-color);
    color: #fff; */
    color: var(--primary-color);
}

</style>