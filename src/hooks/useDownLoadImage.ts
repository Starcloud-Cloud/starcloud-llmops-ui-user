import JSZip from 'jszip';
export const downAllImages = (imageUrls: any[]) => {
    const zip = new JSZip();
    // 异步加载图片并添加到压缩包
    const promises = imageUrls.map(async (imageUrl) => {
        const response = await fetch(imageUrl.url);
        const arrayBuffer = await response.arrayBuffer();
        zip.file(imageUrl.uuid + '_' + imageUrl.time + `.${imageUrl.type}`, arrayBuffer);
    });
    // 等待所有图片添加完成后创建压缩包并下载
    Promise.all(promises)
        .then(() => {
            zip.generateAsync({ type: 'blob' }).then((content: any) => {
                const url = window.URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'images.zip'; // 设置下载的文件名
                a.click();
                window.URL.revokeObjectURL(url);
            });
        })
        .catch((error) => {
            console.error('Error downloading images:', error);
        });
};
const downLoadImages = (url: string, type: string, uuid: string, time: string) => {
    fetch(url)
        .then((response: any) => {
            if (response.ok) {
                return response.blob();
            }
        })
        .then((blob) => {
            // 创建一个临时链接
            const url = window.URL.createObjectURL(blob as Blob);
            // 创建一个临时链接的<a>标签
            const link = document.createElement('a');
            link.href = url;
            link.download = uuid + '_' + time + '.' + type; // 设置下载的文件名
            link.click();
            // 释放临时链接的资源
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('下载文件时出错:', error);
        });
};
export default downLoadImages;
