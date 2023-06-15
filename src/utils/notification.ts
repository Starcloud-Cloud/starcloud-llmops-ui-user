let setNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void = () => {};

const registerNotification = (callback: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void) => {
    setNotification = callback;
};

let setMessageBox: (message: string, title: string, type: 'warning' | 'error') => void = () => {};

const registerMessageBox = (callback: (message: string, title: string, type: 'warning' | 'error') => void) => {
    setMessageBox = callback;
};

export { registerNotification, registerMessageBox, setNotification, setMessageBox };
