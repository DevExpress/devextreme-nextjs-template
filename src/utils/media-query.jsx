'use client'
import { useState, useCallback, useEffect } from 'react';
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(getScreenSize());
  const onSizeChanged = useCallback(() => {
    setScreenSize(getScreenSize());
  }, []);

  useEffect(() => {
    subscribe(onSizeChanged);

    return () => {
      unsubscribe(onSizeChanged);
    };
  }, [onSizeChanged]);

  return screenSize;
};

let handlers = [];
let xSmallMedia;
let smallMedia;
let mediumMedia;
let largeMedia;

if (typeof window !== 'undefined') {
  xSmallMedia = window.matchMedia('(max-width: 599.99px)');
  smallMedia = window.matchMedia('(min-width: 600px) and (max-width: 959.99px)');
  mediumMedia = window.matchMedia('(min-width: 960px) and (max-width: 1279.99px)');
  largeMedia = window.matchMedia('(min-width: 1280px)');

  [xSmallMedia, smallMedia, mediumMedia, largeMedia].forEach(media => {
    media.addListener((e) => {
      if(e.matches) {
        handlers.forEach(handler => handler())
      }
    });
  });
}

const subscribe = (handler) => handlers.push(handler);

const unsubscribe = (handler) => {
  handlers = handlers.filter(item => item !== handler);
};

function getScreenSize() {
  return {
    isXSmall: xSmallMedia?.matches,
    isSmall: smallMedia?.matches,
    isMedium: mediumMedia?.matches,
    isLarge: largeMedia?.matches
  };
}
