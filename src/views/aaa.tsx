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

    return (
        <div>
            <h1>Microphone Recorder</h1>
            <button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? 'Stop Recording' : 'Start Recording'}</button>
            <audio ref={audioRef} controls />
        </div>
    );
}

export default MicrophoneRecorder;
