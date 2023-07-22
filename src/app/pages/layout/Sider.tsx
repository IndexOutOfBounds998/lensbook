import Link from "next/link";
import { useTranslation } from "react-i18next";
export default function LayoutSider({ titleList, styleWidth, registerClick }) {

    const { t } = useTranslation();

    const icon = (item) => (
        <>
            <i className={`iconfont icon-${item.icon} cursor-pointer text-[30px] mr-3`} />
            <span className='font-bold'>{item.text}</span>
        </>
    );
    titleList = titleList || [
        { text: t('explore'), icon: 'icon-home', router: '/', needLogin: false },
        { text: t('publish'), icon: 'icon-add', router: '/publish', needLogin: true },
        { text: t('mine'), icon: 'icon-user', router: '', needLogin: false },
    ];
    return (
        <div className={styleWidth || 'w-80 pl-10'}>
            <ul>
                {titleList.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.router}
                            className='text-[16px] px-4 py-1 my-2 cursor-pointer flex flex-row items-center rounded-3xl hover:bg-zinc-100'
                        >
                            {item.component ? item.component(item) : icon(item)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
