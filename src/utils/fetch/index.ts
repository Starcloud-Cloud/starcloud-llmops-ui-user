import { getAccessToken } from 'utils/auth';
import { config } from 'utils/axios/config';
const { base_url } = config;
export default function fetchRequest(url: string, method: string, body: any, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            credentials: 'include' as RequestCredentials,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getAccessToken()
            },
            body: body ? JSON.stringify(body) : null
        };

        const controller = new AbortController();
        const signal = controller.signal;

        const timer = setTimeout(() => {
            controller.abort(); // 请求超时时中断请求
            reject(new Error('Request timeout'));
        }, 1000 * 60);

        fetch(base_url + url, { ...options, signal })
            .then((response) => {
                clearTimeout(timer); // 请求成功时，清除计时器
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                return response.body;
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                clearTimeout(timer); // 请求失败时，清除计时器
                reject(error);
            });
    });
}

// const fetchStream = (url: string, params: any) => {
//     const { onmessage, onclose, ...otherParams } = params;

//     const push = async (controller: any, reader: any) => {
//         const { value, done } = await reader.read();
//         if (done) {
//             controller.close();
//             onclose?.();
//         } else {
//             onmessage?.(new TextDecoder().decode(value));
//             controller.enqueue(value);
//             push(controller, reader);
//         }
//     };
//     // 发送请求
//     return fetch(base_url + url, otherParams)
//         .then((response) => {
//             // 以ReadableStream解析数据
//             const reader = response.body?.getReader();
//             const stream = new ReadableStream({
//                 start(controller) {
//                     push(controller, reader);
//                 }
//             });
//             return stream;
//         })
//         .then((stream) =>
//             new Response(stream, { headers: { 'Content-Type': 'text/html', Authorization: 'Bearer ' + getAccessToken() } }).text()
//         );
// };
// export default fetchStream;
