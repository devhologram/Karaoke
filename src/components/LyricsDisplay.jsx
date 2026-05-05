import React, { useEffect, useRef } from 'react';

const LyricsDisplay = ({ lyrics, activeIndex, songMissingData, filledLines }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('.lyric-line.active');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  return (
    <div className="lyrics-container" ref={containerRef}>
      {lyrics.map((line, index) => {
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;

        let content = line.text;
        const missingWord = songMissingData ? songMissingData[index] : null;

        if (missingWord) {
          const isWordFilled = filledLines ? filledLines[index] : false;
          // Case insensitive match to find the original word
          const regex = new RegExp(`\\b${missingWord}\\b`, 'i');
          const match = line.text.match(regex);
          
          if (match) {
            const wordIndex = match.index;
            const before = line.text.substring(0, wordIndex);
            const originalWord = line.text.substring(wordIndex, wordIndex + missingWord.length);
            const after = line.text.substring(wordIndex + missingWord.length);
            
            let spanClass = 'waiting';
            let spanContent = originalWord;

            if (isWordFilled) {
              spanClass = 'filled success-anim';
              spanContent = originalWord;
            } else if (isPast) {
              spanClass = 'missed error-anim';
              spanContent = originalWord;
            }

            content = (
              <>
                {before}
                <span className={`lyric-blank ${spanClass}`}>
                  {spanContent}
                </span>
                {after}
              </>
            );
          }
        }

        return (
          <div 
            key={index} 
            className={`lyric-line ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default LyricsDisplay;
