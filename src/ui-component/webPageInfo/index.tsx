import React, { useEffect, useState } from 'react';

export const WebPageInfo = ({ data }: { data: any[] }) => {
    return (
        <div className="mt-2">
            <div className="grid gap-1 grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-2">
                {data.map((item: any, index: number) => (
                    <div key={index} className="flex rounded-md bg-[#fff] p-[12px] flex-col">
                        <div className="text-lg line-clamp-1 text-[#666]">{item.title}</div>
                        <div className="mt-1 text-sm line-clamp-2 text-[#666]">{item.content}</div>
                        <div className="flex">
                            {item.img && <img className="mr-1" src={item.img} />}
                            <div className="line-clamp-1 text-xs text-[#d9d9d9]">{item.url}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
