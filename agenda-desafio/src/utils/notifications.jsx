import { notification } from 'antd';
export  const openErrorNotification = (message) => {
    notification.error({
        message: 'Error',
        description: message,
        duration: 2,
    });
};

export const openSuccessNotification = (message) => {
    notification.success({
        message: 'Éxito',
        description: message,
        duration: 2,
    });
};

export const openWarningNotification = (message) => {
    notification.warning({
        message: 'Advertencia',
        description: message,
        duration: 2,
    });
};