import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Music, AlertCircle, Smile, Frown, Zap, Coffee, ArrowLeft, Clock, Copy, Check } from 'lucide-react';
import AudioPlayer from './components/AudioPlayer';
import LyricsDisplay from './components/LyricsDisplay';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useCameraRecorder } from './hooks/useCameraRecorder';
import { songsData } from './data/lyrics';
import { QRCodeSVG } from 'qrcode.react';
import './index.css';

const getEligibleWords = (text) => {
  const matches = text.match(/\b[a-zA-Z]{4,}\b/g);
  return matches ? Array.from(new Set(matches)) : [];
};

function LeaderboardView({ onFinish, currentScore, currentMood, videoUrl }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          throw new Error(data.error || 'Failed to fetch leaderboard');
        }
        return data;
      })
      .then(data => {
        setScores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setApiError(e.message);
        setScores([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container center-content">
      <div className="leaderboard-layout">
        
        {/* Left Side: Leaderboard */}
        <div className="glass-panel leaderboard-panel">
          <h2 className="mood-title" style={{marginBottom: '1rem'}}>Global Leaderboard</h2>
          <div className="current-run">
            <p>You scored <strong style={{color: 'var(--success)'}}>{currentScore}</strong> on <em>{currentMood}</em>!</p>
          </div>
          
          {loading ? (
            <p className="loading-text">Loading top scores...</p>
          ) : apiError ? (
            <div className="audio-warning" style={{marginBottom: '2rem'}}>
              <AlertCircle size={20} />
              <p>Database Error: {apiError}</p>
            </div>
          ) : (
            <div className="leaderboard-table">
               {scores.length === 0 ? <p>No scores yet. You are the first!</p> : null}
               {scores.map((s, i) => (
                  <div key={i} className="leaderboard-row">
                    <span className="rank">#{i+1}</span>
                    <span className="mood-badge">{s.mood}</span>
                    <span className="score">{s.score} pts</span>
                  </div>
               ))}
            </div>
          )}
          
          <button className="play-btn finish-btn" onClick={onFinish}>
            <ArrowLeft size={24} /> Finish
          </button>
        </div>

        {/* Right Side: QR Code */}
        {videoUrl && (
          <div className="glass-panel qr-panel" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 className="mood-title" style={{marginBottom: '1.5rem'}}>Get Your Video!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Scan this code to download your 10-second performance.</p>
            <div className="qr-container" style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <QRCodeSVG value={videoUrl} size={200} fgColor="#1f2833" bgColor="#ffffff" />
            </div>
            <div style={{ marginTop: '2rem' }}>
              <a href={videoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem', padding: '0.75rem 1.5rem', background: 'rgba(138, 43, 226, 0.1)', border: '1px solid var(--primary)', borderRadius: '2rem', transition: 'all 0.3s' }}>
                Open link in browser
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function MicTestView({ onBack }) {
  const { transcript, startListening, stopListening, resetTranscript, isListening, speechError, speechEvent } = useSpeechRecognition();

  return (
    <div className="app-container center-content">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <h2 className="mood-title" style={{marginBottom: '1rem'}}>Mic Diagnostic Test</h2>
        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
          This screen isolates the Web Speech API. Sing or speak normally to test exactly how fast the cloud transcribes your voice.
        </p>

        <div className="controls" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <button 
            className={`play-btn ${isListening ? 'playing' : ''}`} 
            onClick={isListening ? stopListening : startListening}
            style={{ width: 'auto', padding: '1rem 2rem', borderRadius: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            {isListening ? 'Stop Mic' : 'Start Mic'}
          </button>
          
          <button 
            className="play-btn" 
            onClick={resetTranscript}
            style={{ width: 'auto', padding: '1rem 2rem', borderRadius: '2rem', background: 'var(--bg-glass)' }}
          >
            Clear Text
          </button>
        </div>

        <div className={`mic-status ${isListening ? 'active' : ''}`} style={{ justifyContent: 'center', marginBottom: '1rem' }}>
          <span className="mic-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            Status: {speechError ? `Error: ${speechError}` : (isListening ? speechEvent : 'Mic Off')}
          </span>
        </div>

        <div className="transcript-box" style={{ minHeight: '150px', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px' }}>
          <p className="transcript-text" style={{ fontSize: '1.5rem', lineHeight: '1.5' }}>
            {transcript ? `"${transcript}"` : (isListening ? "Waiting for voice..." : "Press Start Mic to begin")}
          </p>
        </div>

        <button className="back-btn" onClick={onBack} style={{ marginTop: '2rem' }}>
          <ArrowLeft size={20} /> Back to Menu
        </button>
      </div>
    </div>
  );
}

function App() {
  const [selectedMood, setSelectedMood] = useState(null); 
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMicTest, setShowMicTest] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [audioError, setAudioError] = useState(false);
  
  const [songMissingData, setSongMissingData] = useState({});
  const [filledLines, setFilledLines] = useState({});

  // Sync Mode states
  const [isSyncMode, setIsSyncMode] = useState(false);
  const [syncIndex, setSyncIndex] = useState(0);
  const [syncedLyrics, setSyncedLyrics] = useState([]);
  const [showSyncResult, setShowSyncResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  
  const { transcript, startListening, stopListening, resetTranscript, isListening, speechError, speechEvent } = useSpeechRecognition();
  const { startCameraRecording, isRecording: isCameraRecording, recordedBlob, clearRecordedBlob } = useCameraRecorder();

  const currentSong = selectedMood ? songsData[selectedMood] : null;

  // Keydown listener for Sync Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSyncMode && isPlaying && e.code === 'Space') {
        e.preventDefault();
        if (syncIndex < currentSong.lyrics.length) {
          const newLine = {
            time: parseFloat(currentTime.toFixed(2)),
            text: currentSong.lyrics[syncIndex].text
          };
          setSyncedLyrics(prev => [...prev, newLine]);
          setSyncIndex(prev => prev + 1);
          
          if (syncIndex + 1 >= currentSong.lyrics.length) {
            // Done syncing
            setIsPlaying(false);
            audioRef.current?.pause();
            setShowSyncResult(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSyncMode, isPlaying, syncIndex, currentTime, currentSong]);

  // Handle setting active index based on time (Normal Mode)
  useEffect(() => {
    if (!currentSong || isSyncMode || showSyncResult) return;
    
    let newIndex = -1;
    for (let i = 0; i < currentSong.lyrics.length; i++) {
      if (currentTime >= currentSong.lyrics[i].time) {
        newIndex = i;
      } else {
        break;
      }
    }
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      if (!isSyncMode) resetTranscript();
    }
  }, [currentTime, activeIndex, currentSong, isSyncMode, showSyncResult]);

  // Pre-calculate missing words for the entire song when a mood is selected
  useEffect(() => {
    if (!currentSong) return;
    
    const newMissingData = {};
    currentSong.lyrics.forEach((line, index) => {
      const eligibleWords = getEligibleWords(line.text);
      if (eligibleWords.length > 0) {
        const randomWord = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
        newMissingData[index] = randomWord.toLowerCase();
      }
    });
    
    setSongMissingData(newMissingData);
    setFilledLines({});
    resetTranscript();
  }, [currentSong]);

  // Check speech recognition (Normal Mode)
  useEffect(() => {
    if (isSyncMode) return;
    
    const checkWord = (index) => {
      if (index < 0) return false;
      const missingWord = songMissingData[index];
      const isFilled = filledLines[index];

      if (missingWord && !isFilled && isPlaying) {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes(missingWord)) {
          setFilledLines(prev => ({ ...prev, [index]: true }));
          setScore(s => s + 100);
          resetTranscript();
          return true;
        }
      }
      return false;
    };

    // Because of cloud network latency, transcripts often arrive *after* the song 
    // has already moved to the next line. We give a 1-line grace period!
    // Check the previous line first (chronological order)
    let filled = checkWord(activeIndex - 1);
    if (!filled) {
      checkWord(activeIndex);
    }
  }, [transcript, activeIndex, isPlaying, isSyncMode, songMissingData, filledLines]);

  // Mock timer if audio fails
  useEffect(() => {
    if (!currentSong) return;

    if (audioError && isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (!isSyncMode && t >= currentSong.lyrics[currentSong.lyrics.length - 1].time + 3) {
            handleEnded();
            return 0;
          }
          return t + 0.1;
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [audioError, isPlaying, currentSong, isSyncMode]);

  const handleTimeUpdate = (time) => {
    if (!audioError) {
      setCurrentTime(time);
    }
  };

  const handleAudioError = () => {
    console.warn("Audio file missing or failed to load. Falling back to mock timer.");
    setAudioError(true);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        stopListening();
      } else {
        audioRef.current.play().catch(e => {
          console.log("Audio play failed, using mock timer", e);
          setAudioError(true);
        });
        startListening();
        
        // Start the 10-second camera recording at the beginning of the song
        // (Only if it's currently at the beginning)
        if (currentTime < 1) {
          startCameraRecording();
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = async () => {
    setIsPlaying(false);
    stopListening();
    if (!isSyncMode) {
      setActiveIndex(-1);
    }
    setCurrentTime(0);

    if (recordedBlob) {
      setIsUploading(true);
      try {
        const extension = recordedBlob.type === 'video/mp4' ? 'mp4' : 'webm';
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-file-name': `karaoke-${Date.now()}.${extension}`
          },
          body: recordedBlob
        });
        const data = await response.json();
        setVideoUrl(data.url);
      } catch (err) {
        console.error("Failed to upload video:", err);
      }
      setIsUploading(false);
    }

    // Only save to leaderboard if not in sync mode and they scored something
    if (!isSyncMode && score >= 0) {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, mood: selectedMood })
      }).catch(console.error).finally(() => {
        setShowLeaderboard(true);
      });
    } else {
      setShowLeaderboard(true);
    }
  };

  const handleBackToMoods = () => {
    if (isPlaying) togglePlay();
    setSelectedMood(null);
    setShowMicTest(false);
    setScore(0);
    setActiveIndex(-1);
    setCurrentTime(0);
    setSongMissingData({});
    setFilledLines({});
    resetTranscript();
    setIsSyncMode(false);
    setShowSyncResult(false);
    setSyncedLyrics([]);
    setSyncIndex(0);
    setShowLeaderboard(false);
    setVideoUrl(null);
    clearRecordedBlob();
  };

  const toggleSyncMode = () => {
    const newSyncMode = !isSyncMode;
    setIsSyncMode(newSyncMode);
    setShowSyncResult(false);
    setSyncedLyrics([]);
    setSyncIndex(0);
    setCurrentTime(0);
    if (isPlaying) {
      togglePlay(); // pause
    }
    if (newSyncMode) {
      setActiveIndex(-1);
      stopListening();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(syncedLyrics, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showMicTest) {
    return <MicTestView onBack={handleBackToMoods} />;
  }

  if (!selectedMood) {
    return (
      <div className="app-container center-content">
        <div className="logo large">
          <Music className="icon" size={48} />
          <h1>VocalStar</h1>
        </div>
        <h2 className="mood-title">How are you feeling today?</h2>
        <div className="mood-grid">
          <button className="mood-card happy" onClick={() => setSelectedMood('happy')}>
            <Smile size={48} />
            <span>Happy</span>
          </button>
          <button className="mood-card sad" onClick={() => setSelectedMood('sad')}>
            <Frown size={48} />
            <span>Sad</span>
          </button>
          <button className="mood-card exciting" onClick={() => setSelectedMood('exciting')}>
            <Zap size={48} />
            <span>Exciting</span>
          </button>
          <button className="mood-card chill" onClick={() => setSelectedMood('chill')}>
            <Coffee size={48} />
            <span>Chill</span>
          </button>
        </div>
        <div style={{ marginTop: '3rem' }}>
          <button 
            className="play-btn" 
            onClick={() => setShowMicTest(true)}
            style={{ width: 'auto', padding: '1rem 3rem', borderRadius: '2rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Mic size={24} /> Test Mic
          </button>
        </div>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <LeaderboardView 
        onFinish={handleBackToMoods} 
        currentScore={score} 
        currentMood={currentSong?.title || selectedMood} 
        videoUrl={videoUrl}
      />
    );
  }

  if (isUploading) {
    return (
      <div className="app-container center-content">
        <div className="glass-panel" style={{textAlign: 'center'}}>
          <h2 className="mood-title" style={{marginBottom: '1rem'}}>Uploading Performance...</h2>
          <p className="loading-text" style={{animation: 'pulse-blank 1.5s infinite'}}>Saving your 10 second clip to the cloud!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBackToMoods}>
            <ArrowLeft size={20} /> Back
          </button>
          <button className={`sync-toggle-btn ${isSyncMode ? 'active' : ''}`} onClick={toggleSyncMode}>
            <Clock size={20} /> {isSyncMode ? 'Exit Sync Mode' : 'Sync Mode'}
          </button>
        </div>
        <div className="logo">
          <Music className="icon" />
          <h1>VocalStar</h1>
        </div>
        <div className="score-display">
          Score: <span>{score}</span>
        </div>
      </header>

      <main className="main-content">
        <div className="player-card glass-panel">
          <h2 className="song-title">{currentSong.title}</h2>
          
          <AudioPlayer 
            ref={audioRef}
            src={currentSong.audioSrc} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={handleAudioError}
          />

          {showSyncResult ? (
            <div className="sync-result-container">
              <h3>Sync Complete!</h3>
              <p>Copy the JSON below and replace the `lyrics` array for this song in <code>src/data/lyrics.js</code>.</p>
              <div className="code-block">
                <button className="copy-btn" onClick={copyToClipboard}>
                  {copied ? <Check size={16} /> : <Copy size={16} />} 
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
                <pre>{JSON.stringify(syncedLyrics, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <LyricsDisplay 
              lyrics={currentSong.lyrics}
              activeIndex={isSyncMode ? syncIndex : activeIndex}
              songMissingData={songMissingData}
              filledLines={filledLines}
            />
          )}

          {isSyncMode && !showSyncResult && (
            <div className="sync-instructions">
              <p className="pulse-text">Press <strong>SPACEBAR</strong> exactly when the highlighted lyric starts singing.</p>
              <p>Current Time: <span>{currentTime.toFixed(2)}s</span></p>
            </div>
          )}

          {!showSyncResult && (
            <>
              <div className="controls">
                <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                {!isSyncMode && (
                  <div className={`mic-status ${isListening ? 'active' : ''}`}>
                    {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                    <span className="mic-text">
                      {speechError ? `Error: ${speechError}` : (isListening ? `Mic: ${speechEvent}` : 'Mic Off')}
                    </span>
                  </div>
                )}
              </div>
              
              {!isSyncMode && (
                <div className="transcript-box">
                  <p className="transcript-text">
                    {transcript ? `"${transcript}"` : (isListening ? "Sing here..." : "")}
                  </p>
                </div>
              )}
            </>
          )}

          {audioError && (
            <div className="audio-warning">
               <AlertCircle size={16} />
               <p>No real audio file found for this mood. Mocking playback timer.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
