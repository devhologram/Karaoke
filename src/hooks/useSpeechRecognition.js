import { useState, useEffect, useRef } from 'react';

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [speechEvent, setSpeechEvent] = useState('Initialized'); // Debug state
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const baselineRef = useRef('');
  const fullRawTranscriptRef = useRef('');

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
    recognition.maxAlternatives = 1; // Force fastest single-result processing

    // Diagnostic Events
    recognition.onaudiostart = () => setSpeechEvent('Audio capturing started');
    recognition.onsoundstart = () => setSpeechEvent('Sound detected');
    recognition.onspeechstart = () => setSpeechEvent('Speech detected');
    recognition.onnomatch = () => setSpeechEvent('No match found');

    recognition.onresult = (event) => {
      let rawTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        rawTranscript += event.results[i][0].transcript + ' ';
      }
      
      fullRawTranscriptRef.current = rawTranscript;
      
      let cleanTranscript = rawTranscript.toLowerCase();
      let cleanBaseline = baselineRef.current.toLowerCase();
      
      let activeTranscript = '';
      if (cleanTranscript.startsWith(cleanBaseline)) {
        activeTranscript = cleanTranscript.substring(cleanBaseline.length);
      } else {
        // Fallback if interim result changed a previous word slightly
        activeTranscript = cleanTranscript.substring(Math.min(cleanTranscript.length, cleanBaseline.length));
      }
      
      const finalClean = activeTranscript.trim();
      setTranscript(finalClean);
      setSpeechEvent(`Heard: ${finalClean.substring(0, 20)}...`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'no-speech') {
        // Pauses are normal in karaoke, ignore and let it restart
        setSpeechEvent('Silence detected, waiting...');
        return;
      }
      if (event.error === 'network') {
        // Common glitch in Chrome Speech API, let it restart
        setSpeechEvent('Reconnecting...');
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
        setSpeechEvent('Restarting engine...');
        setTimeout(() => {
          try {
            // Check again in case it was stopped during the timeout
            if (isListeningRef.current && recognitionRef.current) {
              // A new session means event.results is wiped clean, so we must wipe our tracking baseline too!
              baselineRef.current = '';
              fullRawTranscriptRef.current = '';
              recognitionRef.current.start();
            }
          } catch (e) {
            console.error("Failed to restart", e);
            setSpeechEvent(`Restart failed: ${e.message}`);
          }
        }, 50);
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
    baselineRef.current = '';
    fullRawTranscriptRef.current = '';
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
    baselineRef.current = fullRawTranscriptRef.current;
    setTranscript('');
  };

  return { transcript, isListening, startListening, stopListening, resetTranscript, speechError, speechEvent };
}
