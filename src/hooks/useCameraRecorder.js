import { useState, useRef } from 'react';

export function useCameraRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startCameraRecording = async () => {
    // Prevent multiple recordings from starting simultaneously
    if (isRecording) return;

    try {
      // Only request video to avoid conflicts with speech recognition microphone
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      
      const options = MediaRecorder.isTypeSupported('video/webm') 
        ? { mimeType: 'video/webm' } 
        : undefined; // Let browser fallback (e.g. Safari mp4)
        
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const type = options ? 'video/webm' : 'video/mp4';
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        
        // Auto download locally
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const extension = options ? 'webm' : 'mp4';
        a.download = `karaoke-recording-${Date.now()}.${extension}`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        // Stop all camera tracks so the light turns off
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Stop exactly after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 10000);

    } catch (err) {
      console.error("Failed to start camera recording:", err);
      // It might fail if user denies permission or no camera is found
    }
  };

  return { startCameraRecording, isRecording };
}
