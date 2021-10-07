import EventBus from '../../plugins/eventbus';
import Resources from '../../resources';

export function showErrorToast() {
    EventBus.$emit('appendToast', {
        type: 'error',
        message: Resources.messages.exception,
    })
}

export function showToast(type, message) {
    EventBus.$emit('appendToast', {
        type: type,
        message: message
    })
}