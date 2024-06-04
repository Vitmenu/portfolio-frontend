import { useState, useEffect } from "react";
import useItemInput from "../../ux/hooks/useItemInput"
import useGetMedia  from "../../ux/hooks/useGetMedia"

// https://www.npmjs.com/package/multer

/*



*/

const ProfileImage = ({ isThisUser, onClick, alt='PFP', contentClasses, loading='eager', image_key, defaultSvg, styles, classes, defaultClasses="w-7 h-7 min-w-7 min-h-7 rounded-full bg-white text-black flex justify-center items-center " }) => {

    const { media } = useGetMedia({ objKey: image_key });

    const handleClickZoomIn = () => {
        const custEvent = new CustomEvent('cust-img-modal', {
            detail: {
                imgUrl: media,
            },
        });
        dispatchEvent(custEvent);
    };
    const handleClickOpenEditorModal = () => {
        const custEvent = new CustomEvent('cust-img-editor-modal', {
            detail: {
                imgUrl: media,
                isThisUser,
            },
        });
        dispatchEvent(custEvent);
    };

    const handleClickProfile = () => {
        try {
            if (typeof onClick === 'function') {
                onClick();
            } else {
                if (isThisUser) {
                    handleClickOpenEditorModal();
                } else if (media) {
                    handleClickZoomIn();
                };
            };
        } catch(err) {
            console.log(err);
        };
    };
    
    return media ? (
        <div onClick={handleClickProfile} style={styles} className={defaultClasses + classes}>
            <img
                src={media}
                alt={alt}
                className={"flex justify-center items-center rounded-full w-full h-full cursor-pointer object-contain border " + contentClasses}
                loading={loading}
            />
        </div>
    ) : (
        <div onClick={handleClickProfile} style={styles} className={defaultClasses + classes}>
            {defaultSvg}
        </div>
    );
}
 
export default ProfileImage;