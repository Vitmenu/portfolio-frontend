export const imgModal = ({media} = {}) => {
    try {
        const custEvent = new CustomEvent('cust-img-modal', {
            detail: {
                imgUrl: media,
            },
        });
        return dispatchEvent(custEvent);
    } catch(err) {
        return false;
    };
};
export const imgEditorModal = ({media, isThisUser} = {}) => {
    try {
        const custEvent = new CustomEvent('cust-img-editor-modal', {
            detail: {
                imgUrl: media,
                isThisUser,
            },
        });
        dispatchEvent(custEvent);
    } catch(err) {
        return false;
    };
};