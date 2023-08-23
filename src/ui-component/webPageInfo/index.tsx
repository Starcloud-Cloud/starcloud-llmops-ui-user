import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

export const WebPageInfo = ({ urlList, tips }: { urlList: any; tips: string }) => {
    return (
        <div className="mt-2">
            <div className="flex justify-between">
                <div>正在为你搜索新闻</div>
                <div>{urlList.length}条</div>
            </div>
            <div className="grid gap-4 grid-cols-3 mt-2">
                {urlList.map((item: any, index: number) => (
                    <div key={index} className="flex rounded-md bg-[#fff] p-[12px]">
                        <img src={item.logo} alt="" className="w-[36px] h-[36px]" />
                        <div>
                            <div>{item.title}</div>
                            <div className="mt-1">{item.des}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
