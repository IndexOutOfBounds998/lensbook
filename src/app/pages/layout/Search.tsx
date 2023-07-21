import { useEffect, useState } from "react";

import { getAuthenticatedClient } from "@/app/shared/getAuthenticatedClient";

export default function Search() {
    const icon = (icon) => (
        <i className={`iconfont icon-${icon} cursor-pointer text-[18px] hover:text-black`} />
    );



    const [inputValue, setInputValue] = useState('');

    const onInput = async (e) => {
        setInputValue(e.target.value)
        const lensClient = await getAuthenticatedClient();
        const result = await lensClient.search.profiles({
            query: e.target.value,
            limit: 10,
        });
        console.log(result);
    }
    const onDel = () => {
        setInputValue('')
    }

    return (
        <div className='w-full h-10 absolute'>
            <input type="text"
                value={inputValue}
                onInput={onInput}
                className="w-full h-full pl-5 pr-20 text-black caret-red-500 text-[16px] absolute rounded-3xl bg-gray-100 focus:outline-none border-none focus:border-gray-100"
                placeholder="搜索用户/标签" />
            <div className='h-full flex items-center justify-end font-normal text-slate-500'>
                {
                    inputValue ? (
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

            </div>
        </div>
    )
}
