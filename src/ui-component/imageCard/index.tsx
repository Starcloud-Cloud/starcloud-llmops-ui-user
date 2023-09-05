import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const ImageCard = ({ data }: { data: any[] }) => {
    return (
        <div className="mt-2">
            <div className="flex mt-2  w-full overflow-x-auto">
                {data?.map((item: any, index: number) => (
                    <div key={index} className="flex rounded-md bg-[#fff] p-[12px] flex-col w-[120px] mr-1">
                        <img className="w-[100px] h-[100px] object-contain" src={item.imageUrl} />
                        <Tooltip title={item.title} placement="top" arrow>
                            <a className="mt-1 text-sm line-clamp-1 text-[#666] no-underline" href={item.url} target={'_blank'}>
                                {item.title}
                            </a>
                        </Tooltip>
                    </div>
                ))}
            </div>
        </div>
    );
};
