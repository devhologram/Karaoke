import { useState, useEffect, useRef } from 'react';

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [speechEvent, setSpeechEvent] = useState('Initialized'); // Debug state
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const offsetIndexRef = useRef(0);
  const resultsLengthRef = useRef(0);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechError('not-supported');
      setSpeechEvent('Not Supported');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Diagnostic Events
    recognition.onaudiostart = () => setSpeechEvent('Audio capturing started');
    recognition.onsoundstart = () => setSpeechEvent('Sound detected');
    recognition.onspeechstart = () => setSpeechEvent('Speech detected');
    recognition.onnomatch = () => setSpeechEvent('No match found');

    recognition.onresult = (event) => {
      resultsLengthRef.current = event.results.length;
      let currentTranscript = '';
      
      const startIdx = Math.min(offsetIndexRef.current, event.results.length);
      for (let i = startIdx; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
      }
      
      const cleanTranscript = currentTranscript.trim().toLowerCase();
      setTranscript(cleanTranscript);
      setSpeechEvent(`Heard: ${cleanTranscript.substring(0, 20)}...`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'no-speech') {
        // Pauses are normal in karaoke, ignore and let it restart
        setSpeechEvent('Silence detected, waiting...');
        return;
      }
      setSpeechError(event.error);
      setSpeechEvent(`Error: ${event.error}`);
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      setSpeechEvent('Engine stopped');
      // Auto restart if it stops unexpectedly
      if (isListeningRef.current && recognitionRef.current) {
        try {
          setSpeechEvent('Restarting engine...');
          recognitionRef.current.start();
        } catch (e) {
          console.error("Failed to restart", e);
          setSpeechEvent(`Restart failed: ${e.message}`);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    isListeningRef.current = true;
    offsetIndexRef.current = 0;
    resultsLengthRef.current = 0;
    setTranscript('');
    try {
      recognitionRef.current?.start();
    } catch(e) {
      console.error("Start error:", e);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    isListeningRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch(e) {
      console.error("Stop error:", e);
    }
  };

  const resetTranscript = () => {
    offsetIndexRef.current = resultsLengthRef.current;
    setTranscript('');
  };

  return { transcript, isListening, startListening, stopListening, resetTranscript, speechError, speechEvent };
}
