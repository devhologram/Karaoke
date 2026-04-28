import { useState, useEffect, useRef } from 'react';

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechError('not-supported');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript.trim().toLowerCase());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setSpeechError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto restart if it stops unexpectedly
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Failed to restart", e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    try {
      recognitionRef.current?.start();
    } catch(e) {
      console.error("Start error:", e);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch(e) {
      console.error("Stop error:", e);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return { transcript, isListening, startListening, stopListening, resetTranscript, speechError };
}
