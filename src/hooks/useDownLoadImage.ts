const downLoadImages = (url: string, type: string, uuid: string) => {
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
            link.download = uuid + type; // 设置下载的文件名
            link.click();
            // 释放临时链接的资源
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('下载文件时出错:', error);
        });
};
export default downLoadImages;
