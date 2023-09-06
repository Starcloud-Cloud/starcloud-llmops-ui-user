import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const WebPageInfo = ({ data }: { data: any[] }) => {
    return (
        <div className="mt-2">
            <div className="flex mt-2  w-full overflow-x-auto">
                {data?.map((item: any, index: number) => (
                    <div key={index} className="flex rounded-md bg-[#fff] p-[12px] flex-col max-w-[210px] min-w-[210px] mr-1">
                        <Tooltip title={item.title} placement="top" arrow>
                            <div className="text-lg line-clamp-1 text-[#666]">{item.title}</div>
                        </Tooltip>
                        <Tooltip title={item.content} placement="top" arrow>
                            <div className="mt-1 text-sm line-clamp-2 text-[#666]">{item.content}</div>
                        </Tooltip>
                        <div className="flex">
                            {item.img && <img className="mr-1" src={item.img} />}
                            <a className="mt-1 text-sm line-clamp-1 text-[#999] no-underline" href={item.url} target={'_blank'}>
                                {item.url}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
