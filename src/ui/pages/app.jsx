import { useState, useEffect }    from "react";
import { Outlet, useLocation }    from "react-router-dom";
import ChatBoard                  from "../layouts/chatBoard";
import Sidebar                    from "../layouts/sidebar";
import Tooltip                    from "../components/tooltip";
import * as svg                   from "../components/svgs";
import SpanText                   from "../components/spanText";
import SideSectionHomeResumeItem  from "../components/sideSectionHome/sideSectionHomeResumeItem";
import retrieve                   from "../../ux/utils/retrieve";
import { useGeneralContext }      from "../../ux/contexts/general.context";
import useItemInput               from "../../ux/hooks/useItemInput";
import TooManyRequestsByGuestUser from "../components/bigmodal/tooManyRequestsByGuestUser";
import TooManyRequests            from "../components/bigmodal/tooManyRequests";
import Registration               from "../components/bigmodal/registration";

const ImageEditor = ({ img, thisUser }) => {

    const [newImage, setNewImage]   = useState();
    const [status, setStatus]       = useState(0);
    const [message, setMessage]     = useState();

    const handleImageUploaded = (e) => {
        setMessage();

        const file = e.target.files[0];

        if (file && file.size < 1024 * 1024 * 5) {

            setNewImage({
                url: URL.createObjectURL(file),
                file: file,
            });

        } else {
            setMessage('tbf');
        };
    };

    const handleClickSave = async () => {
        const allowedContentTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (newImage && newImage.file instanceof File && allowedContentTypes.includes(newImage.file.type)) {

            setStatus(1);

            const formData = new FormData();

            formData.append('image', newImage.file)
            formData.append('entity', JSON.stringify({
                field: 'user',
                param: thisUser,
            }));

            // console.log(newImage.file);
            await retrieve('/api/mult/media/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            }, async (res) => {
                if (res) {
                    setStatus(2);
                    setTimeout(() => setStatus(0), 2000);
                } else {
                    setStatus(4);
                    setMessage('dcl');
                    setTimeout(() => setStatus(0), 2000);
                };
            });
        };
    };

    return (
        <div className="w-full h-full lg:w-1/3 lg:h-full flex flex-col justify-start items-center p-8 gap-y-8 overflow-y-scroll">
            <div className="w-[10rem] md:w-[14rem] max-w-[10rem] md:max-w-[14rem] h-[10rem] md:h-[14rem] max-h-[10rem] md:max-h-[14rem] object-contain rounded-full border relative flex items-center justify-center">
                {
                    (img || (newImage && newImage.url)) ? (
                        <img
                            src={(newImage && newImage.url) ? newImage.url : img}
                            alt={'image'}
                            className={"w-[10rem] md:w-[14rem] max-w-[10rem] md:max-w-[14rem] h-[10rem] md:h-[14rem] max-h-[10rem] md:max-h-[14rem] object-contain rounded-full border relative flex items-center justify-center"}
                        />
                    ) : (
                        <div className="w-full h-full">
                            {svg.profile}
                        </div>
                    )
                }
                <input
                    id="user-profile-input"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImageUploaded}
                    hidden
                />
                <label htmlFor="user-profile-input" className="rounded-lg w-1/4 md:w-1/5 flex justify-center items-center bg-white p-1 cursor-pointer absolute bottom-0 border right-0 peer/change z-10">
                    {svg.edit}
                </label>
                <div className="absolute bottom-0 right-0 peer-hover/change:opacity-100 opacity-0 duration-500 translate-y-2 peer-hover/change:translate-y-8">
                    <span className="text-wrap -z-50 noselect text-xs bg-white rounded shadow px-2 py-1">
                        Change profile photo
                    </span>
                </div>
                {
                    img && (
                        <>
                            <label htmlFor="user-profile-input" className="rounded-lg w-1/4 md:w-1/5 flex justify-center items-center bg-white text-red-500 border-red-500 p-1 cursor-pointer absolute top-0 border-2 right-0 peer/delete z-10">
                                {svg.eraser}
                            </label>
                            <div className="absolute top-0 right-0 peer-hover/delete:opacity-100 opacity-0 duration-500 translate-y-6 peer-hover/delete:translate-y-12">
                                <span className="text-wrap -z-50 noselect text-xs bg-white rounded shadow px-2 py-1">
                                    Delete profile photo
                                </span>
                            </div>
                        </>
                    )
                }
            </div>
            <div className="flex flex-col w-full h-full space-y-6">
                <div className="flex flex-col w-full">
                    <div className="font-medium">
                        Name:
                    </div>
                    <div>
                        {thisUser.name}
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="font-medium">
                        Company:
                    </div>
                    <div>
                        {thisUser.company}
                    </div>
                </div>
                <div className="flex flex-col items-end justify-end w-full h-full space-y-4">
                    <div className="w-full flex justify-end">
                        {
                            message && (
                                <SpanText dataLang={message} classes={"w-full text-right font-light text-red-500 text-sm"} isMesg={true}/>
                            )
                        }
                    </div>
                    <div onClick={handleClickSave} className={"noselect rounded text-white px-4 py-2 " + (newImage ? "bg-blue-500 hover:bg-blue-600 cursor-pointer duration-200" : "bg-gray-400 cursor-default")}>
                        <SpanText dataLang={
                            status == 0 ? "wsnw" : 
                            status == 1 ? "lodn" :
                            status == 2 ? "savd" :
                            status == 4 && "erro"
                        } />
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {


    const currVersion = 'v0';

    const [sidebarClosed, setSidebarClosed] = useState(localStorage.getItem('sidebar-closed'));
    const location                          = useLocation();
    const { thisUser } = useGeneralContext();
    
    useEffect(() => {
        try {
            window.innerWidth < 768 && setSidebarClosed(true);
            if (!sidebarClosed && location.pathname !== '/') {
                const sideSection = document.querySelectorAll('[data-side-section]');
                if (sideSection.length > 1) {
                    [...sideSection].forEach((section) => {
                        section.dataset.sideSection = "1";
                    });
                } else {
                    sideSection.dataset.sideSection = "1";
                };
            };
        } catch(err) {
            console.log(err);
        };
        
    }, [location]);
    

    const { item, setItem, itemRef } = useItemInput();
    const handleClickItemInput = () => setItem(!item);

    const [ modalImg, setModalImg ]         = useState();
    const [ registration, setRegistration ] = useState(true);

    const onCustomBigModal = (e) => setItem(e.detail.item);
    const onCustomImageModal = (e) => {
        setModalImg(e.detail.imgUrl);
        setItem('img');
    };
    const onCustomImageEditorModal = (e) => {
        setModalImg(e.detail.imgUrl);
        setItem('img-editor');
    };

    useEffect(() => {
        
        window.addEventListener('cust-big-modal', onCustomBigModal);
        window.addEventListener('cust-img-modal', onCustomImageModal);
        window.addEventListener('cust-img-editor-modal', onCustomImageEditorModal);

        return () => {
            window.removeEventListener('cust-big-modal', onCustomBigModal);
            window.removeEventListener('cust-img-modal', onCustomImageModal);
            window.removeEventListener('cust-img-editor-modal', onCustomImageEditorModal);
        };
        
    }, []);

    const sidebarClosedWrapperClasses = sidebarClosed ? 'w-full' : 'w-full lg:w-[calc(100%-14.4rem)]';

    return (
        <div className="flex flex-row w-full h-full">
            <Sidebar sidebarClosed={sidebarClosed} setSidebarClosed={setSidebarClosed}/>
            <div className={"flex divide-x " + sidebarClosedWrapperClasses}>
                <Outlet context={{ sidebarClosed }}/>
                {location.pathname !== '/' &&  <ChatBoard sidebarClosed={sidebarClosed} />}
            </div>
            {
                (registration && thisUser && localStorage.getItem('version') !== currVersion) && (
                    <Registration setItem={setRegistration} currVersion={currVersion}/>
                )
            }
            {
                (item === 'img' && modalImg) ? (
                    <div onClick={handleClickItemInput} className="absolute flex justify-center items-center backdrop-blur w-screen h-screen top-0 left-0 z-50">
                        <div className="absolute top-0 right-0 w-16 h-16 flex justify-center items-center">
                            <div className="w-6 h-6 cursor-pointer">
                                <Tooltip dataLang={"cls"} svg={svg.close} align="bottom"/>
                            </div>
                        </div>
                        <div className="w-full h-full md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3">
                            <img
                                src={modalImg}
                                alt={'modal image'}
                                className={"flex justify-center items-center w-full h-full object-contain"}
                            />
                        </div>
                    </div>
                ) : (item === 'img-editor') ? (
                    <div className="absolute flex justify-center items-center backdrop-blur w-screen h-screen top-0 left-0 z-50">
                        <div onClick={handleClickItemInput} className="absolute top-0 right-0 w-16 h-16 flex justify-center items-center">
                            <div className="w-6 h-6 cursor-pointer">
                                <Tooltip dataLang={"cls"} svg={svg.close} align="bottom"/>
                            </div>
                        </div>
                        <div className="flex justify-center items-start w-4/5 h-4/5 border md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3 bg-white rounded">
                            <div className="w-full h-full flex flex-col divide-y lg:divide-y-0 lg:flex-row lg:divide-x">
                                <ImageEditor img={modalImg} thisUser={thisUser} />
                                <div className="hidden w-0 h-0 lg:w-2/3 lg:h-full lg:flex flex-col justify-start items-center p-8 space-y-8">
                                    <div className="w-full h-1/2 flex flex-col">
                                        {svg.welcome}
                                    </div>
                                    <div className="w-full h-1/2 flex flex-col">
                                        <SideSectionHomeResumeItem titleLang={"wcpf"} listItemLangs={["li1", "li2", "li3"]}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (item && thisUser) && (
                    thisUser.company.toLowerCase() == 'guest'
                    ? <TooManyRequestsByGuestUser item={item} setItem={setItem} />
                    : <TooManyRequests item={item} setItem={setItem} />
                )
            }
        </div>
    );
};
 
export default App;