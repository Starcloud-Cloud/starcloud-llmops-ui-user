import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

export const WebPageInfo = ({ url }: { url: string }) => {
    const [iconUrl, setIconUrl] = useState<string | undefined>('');
    const [pageTitle, setPageTitle] = useState<string | undefined>('');
    const [pageDescription, setPageDescription] = useState<string | undefined>('');

    useEffect(() => {
        // 发起 HTTP 请求获取网页内容
        axios
            .get(url)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);

                // 提取图标地址
                const iconLink = $('link[rel*="icon"], link[rel*="shortcut icon"]');
                setIconUrl(iconLink.attr('href'));

                // 提取标题
                setPageTitle($('title').text());

                // 提取简介
                const descriptionMeta = $('meta[name="description"]');
                setPageDescription(descriptionMeta.attr('content'));
            })
            .catch((error) => {
                console.error('获取信息失败:', error);
            });
    }, [url]);

    return (
        <div>
            <h2>页面信息</h2>
            {iconUrl && <img src={iconUrl} alt="网页图标" />}
            {pageTitle && <h3>标题: {pageTitle}</h3>}
            {pageDescription && <p>简介: {pageDescription}</p>}
        </div>
    );
};
