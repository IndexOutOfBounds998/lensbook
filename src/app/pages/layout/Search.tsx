import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SearhResult from "../../components/searchResult/SearhResult";
import { getAuthenticatedClient } from "@/app/shared/getAuthenticatedClient";
import {Popover} from "antd";

export default function Search() {
    const icon = (icon) => (
        <i className={`iconfont icon-${icon} cursor-pointer text-[18px] hover:text-black`} />
    );

    const { t } = useTranslation();

    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const onInput = (e) => {
        setInputValue(e.target.value)
        if (e.target.value) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }
    const clickInput = () => {
        if (inputValue) {
            setOpen(true);
        }
    }
    const onDel = () => {
        setInputValue('')
    }

    return (
        <div className='w-full h-10 absolute'>
            <input type="text"
                value={inputValue}
                onInput={onInput}
                onClick={clickInput}
                className="w-full h-full pl-5 pr-20 text-black caret-red-500 text-[16px] absolute rounded-3xl bg-gray-100 focus:outline-none border-none focus:border-gray-100"
                placeholder={t('searchBar')}
            />
            <div className='h-full flex items-center justify-end font-normal text-slate-500'>
                {
                    open ? (
                        <div className='w-10 h-full flex items-center justify-center z-50' onClick={onDel}>
                            {icon('icon-close')}
                        </div>
                    ) : ''
                }
                <div className='w-10 h-full flex items-center justify-center z-50 mr-1'>
                    {icon('icon-search')}
                </div>
            </div>
            <div>
                <Popover
                    content={<SearhResult></SearhResult>}
                    overlayClassName='w-[30%]'
                    arrow={false}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                >
                    <div className='w-full absolute top-0 h-[40px] z-[-100]'/>
                </Popover>
            </div>
        </div>
    )
}
