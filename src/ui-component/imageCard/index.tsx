import React, { useEffect, useState } from 'react';

export const ImageCard = ({ data }: { data: any[] }) => {
    console.log(data, 'imgcarddata');
    return (
        <div className="mt-2">
            <div className="flex mt-2  w-full overflow-x-auto">
                {data.map((item: any, index: number) => (
                    <div key={index} className="flex rounded-md bg-[#fff] p-[12px] flex-col w-[120px] ml-1">
                        <img className="w-[100px] h-[100px] object-contain" src={item.imageUrl} />
                        <a className="mt-1 text-sm line-clamp-1 text-[#666]" href={item.url} target={'_blank'}>
                            {item.title}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};
