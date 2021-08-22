import EventBus from '../../plugins/eventbus';

export function showErrorToast() {
    EventBus.$emit('appendToast', {
        type: 'error',
        message: 'Có lỗi xảy ra! Vui lòng liên hệ MISA.'
    })
}

export function showToast(type, message) {
    EventBus.$emit('appendToast', {
        type: type,
        message: message
    })
}