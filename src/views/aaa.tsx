import React, { useState, useEffect, useRef } from 'react';

function MicrophoneRecorder() {
    const [isRecording, setIsRecording] = useState<any>(false);
    const [audioStream, setAudioStream] = useState<any>(null);
    const audioRef = useRef<any>(null);

    // 开始录音
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioStream(stream);
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    // 停止录音
    const stopRecording = () => {
        if (audioStream) {
            audioStream.getTracks().forEach((track: any) => track.stop()); // 停止所有音轨
            setAudioStream(null);
            setIsRecording(false);
        }
    };

    // 播放录制的音频
    useEffect(() => {
        if (audioStream && audioRef.current) {
            audioRef.current.srcObject = audioStream;
            audioRef.current.play();
        }
    }, [audioStream]);
    const aaa = () => {
        const xiaohongshuScheme =
            'xiaohongshu://publish?content=你的发布内容&image=https://service-oss-juzhen.mofaai.com.cn/upload/image/a0a3d66108074c79b10b2c3e2eaf5e39.png';

        // 创建一个隐藏的 iframe 来尝试打开 URL Scheme
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = xiaohongshuScheme;

        // 设置超时时间，如果在一定时间内没有成功打开应用，则跳转到小红书的下载页面
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
                window.location.href = 'https://www.xiaohongshu.com/app'; // 小红书下载页面
            }
        }, 2000); // 2 秒超时

        document.body.appendChild(iframe);
    };

    return (
        <div>
            <h1>Microphone Recorder</h1>
            <button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? 'Stop Recording' : 'Start Recording'}</button>
            <audio ref={audioRef} controls />
            <button onClick={aaa}>aaaaaaaa</button>
        </div>
    );
}

export default MicrophoneRecorder;
