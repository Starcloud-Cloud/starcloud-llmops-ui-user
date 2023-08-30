import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

export const WebPageInfo = ({ urlList, tips }: { urlList: any; tips: string }) => {
    return (
        <div className="mt-2">
            <div className="flex justify-between">
                <div>{tips}</div>
                <div>{urlList.length}条</div>
            </div>
            <div className="grid gap-1 grid-cols-2 sm:grid-cols-3 mt-2">
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
