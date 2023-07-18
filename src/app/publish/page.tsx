"use client";
import React from "react";
import Link from "next/link";

export default function Page() {
    const className = 'w-[30%] h-[80%] shadow-[0px_0px_10px_#b6b6b6] px-[30px] pt-[100px] cursor-pointer hover:text-[blueviolet]'

    return (
        <>
            <div className="w-full h-full bg-white flex items-center justify-evenly bg-[#eef1f8]'">
                <Link
                    href="/publish/strategy"
                    className={className}
                >
                    <p className='text-[25px] mb-[20px] text-center'>旅游攻略</p>
                    <p>记录旅游记录，分享给每一位感兴趣的伙伴</p>
                </Link>
                <div
                    className={className}
                >
                    <p className='text-[25px] mb-[20px] text-center'>旅游产品</p>
                    <p>作为旅行社，你可以发布自己的旅游产品， 让更多的用户了解您和您的产品</p>
                </div>
            </div>
        </>
    )
}
