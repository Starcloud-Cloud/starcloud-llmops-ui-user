export function downloadFile(url: string, filename: string) {
    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}
