import React, { useEffect, useState } from "react";
import { Modal, Switch, InputNumber, Select } from "antd";
import { useCurrencies, Erc20 } from '@lens-protocol/react-web';
import {useTranslation} from "react-i18next";

export default function Search({ show, setShow, setCollectData }) {
    const Icon = (icon) => (
        <i className={`iconfont icon-${icon} text-[blueviolet] cursor-pointer text-[18px] mr-[5px]`} />
    );

    const { t } = useTranslation();

    const { data, loading } = useCurrencies();

    //此贴可以收藏
    let [isCollect, setIsCollect] = useState(false);
    //收取费用
    let [isCost, setIsCost] = useState(false);
    //镜像推荐奖励
    let [isReward, setIsReward] = useState(false);
    //限量版
    let [isLimit, setIsLimit] = useState(false);
    //时限
    let [isTimeLimit, setIsTimeLimit] = useState(false);
    //是否只有关注者才能收集
    let [followerOnly, setFollowerOnly] = useState(false);
    //代币种类
    let [currencys, setCurrencys] = useState([]);
    //所选的币种数量
    let [amount, setAmount] = useState(0);
    //所选的币种地址
    let [selectAddress, setSelectAddress] = useState('');
    //转发人获取到的收益百分比
    let [referralFee, setReferralFee] = useState(0);
    //该发布的最大收集次数
    let [collectLimit, setCollectLimit] = useState(0);
    //是否保存当前操作
    let [isSave, setIsSave] = useState(false);

    useEffect(() => {
        if (!loading) {
            setCurrencys(data);
            setSelectAddress(data[0].address)
        }
    }, [loading])

    //初始化
    const modelInfo = () => {
        setIsCollect(false);
        setIsCost(false);
        setIsReward(false);
        setIsLimit(false);
        setIsTimeLimit(false);
        setFollowerOnly(false);
        setAmount(0);
        setSelectAddress(currencys[0].address);
        setReferralFee(0);
        setCollectLimit(0);
    }

    const handleCancel = () => {
        if (!isSave) {
            modelInfo()
        }
        setShow(false);
    };

    const handleOk = () => {
        setShow(false)
    }

    return (
        <Modal
            title={t('collectSetting')}
            centered
            open={show}
            onCancel={handleCancel}
            onOk={handleOk}
        >
            <div className='py-[20px] border-[#00000014] border-t-[1px] overflow-auto'>
                <div className='flex mb-[20px]'>
                    <Switch
                        className='switch-basic'
                        checked={isCollect}
                        onChange={(val) => {
                            modelInfo()
                            setIsCollect(val)
                        }}
                    />
                    <span className='ml-[10px] font-bold text-[#71717a]'>{t('canCollected')}</span>
                </div>
                {
                    isCollect ?
                        <div className='pl-[30px]'>
                            <div className='mb-[20px]'>
                                <p className='mb-[10px] flex text-[16px]'>
                                    {Icon('zuoce-yubeifeiyong')}
                                    {t('chargeCollecting')}
                                </p>
                                <div className='flex mb-[20px]'>
                                    <Switch className='switch-basic' onChange={(val) => { setIsCost(val) }} />
                                    <span className='ml-[10px] font-bold text-[#71717a]'>{t('getPPaid')}</span>
                                </div>
                                {isCost ?
                                    <>
                                        <div className='w-full flex justify-between mb-[20px]'>
                                            <div className='w-[60%]'>
                                                <p className='mb-[5px]'>{t('price')}</p>
                                                <InputNumber
                                                    className='w-full rounded-[10px]'
                                                    value={amount}
                                                    onChange={(val) => (setAmount(val > 0 ? val : 0))}
                                                    defaultValue={0}
                                                    min={0}
                                                />
                                            </div>
                                            <div className='w-[38%]'>
                                                <p className='mb-[5px]'>{t('selectCurrency')}</p>
                                                <Select
                                                    value={currencys[0].name}
                                                    className='w-full'
                                                    fieldNames={{ label: 'name', value: 'address' }}
                                                    options={currencys}
                                                    onChange={(val, option) => { setSelectAddress(val) }}
                                                />
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <p className='mb-[10px] flex text-[16px]'>
                                                {Icon('share')}
                                                {t('referral')}
                                            </p>
                                            <div className='flex mb-[20px]'>
                                                <Switch className='switch-basic' onChange={(val) => { setIsReward(val) }} />
                                                <span className='ml-[10px] font-bold text-[#71717a]'>{t('amplify')}</span>
                                            </div>
                                            {
                                                isReward ?
                                                    <div className='mb-[20px]'>
                                                        <p className='mb-[5px]'>{t('referralFee')}</p>
                                                        <InputNumber
                                                            className='w-full rounded-[10px]'
                                                            value={referralFee}
                                                            onChange={(val) => (setReferralFee(val > 0 ? val : 0))}
                                                            min={0}
                                                            max={100}
                                                            addonAfter="%"
                                                        />
                                                    </div> : ''
                                            }
                                        </div>
                                    </> : ''}
                            </div>
                            <div className='mb-[20px]'>
                                <p className='mb-[10px] flex text-[16px]'>
                                    {Icon('qianggou')}
                                    {t('limitedEdition')}
                                </p>
                                <div className='flex mb-[20px]'>
                                    <Switch className='switch-basic' onChange={(val) => { setIsLimit(val) }} />
                                    <span className='ml-[10px] font-bold text-[#71717a]'>{t('exclusive')}</span>
                                </div>
                                {isLimit ?
                                    <div>
                                        <p className='mb-[5px]'>{t('collectLimit')}</p>
                                        <InputNumber
                                            className='w-full rounded-[10px]'
                                            value={collectLimit}
                                            onChange={(val) => (setCollectLimit(val > 0 ? val : 0))}
                                            min={0}
                                        />
                                    </div> : ''
                                }
                            </div>
                            <div className='mb-[20px]'>
                                <p className='mb-[10px] flex text-[16px]'>
                                    {Icon('xianshimiaosha')}
                                    {t('timeLimit')}
                                </p>
                                <div className='flex mb-[20px]'>
                                    <Switch className='switch-basic' onChange={(val) => { setIsTimeLimit(val) }} />
                                    <span className='ml-[10px] font-bold text-[#71717a]'>{t('first24h')}</span>
                                </div>
                            </div>
                            <div className='mb-[20px]'>
                                <p className='mb-[10px] flex text-[16px]'>
                                    {Icon('renqun')}
                                    {t('canCollect')}
                                </p>
                                <div className='flex mb-[20px]'>
                                    <Switch className='switch-basic' onChange={(val) => { setFollowerOnly(val) }} />
                                    <span className='ml-[10px] font-bold text-[#71717a]'>{t('onlyFollowers')}</span>
                                </div>
                            </div>
                        </div> : ''
                }
            </div>
        </Modal>
    )
}
