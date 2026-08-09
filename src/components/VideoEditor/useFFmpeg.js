import { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const [status, setStatus] = useState('Idle');

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });

    setStatus('Loading FFmpeg Core...');
    
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setLoaded(true);
      setStatus('Ready');
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      setStatus('Error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const extractAudio = async (videoFile) => {
    if (!loaded) return null;
    const ffmpeg = ffmpegRef.current;
    const inputName = 'input.mp4';
    const outputName = 'output.mp3';

    setStatus('Extracting Audio...');
    await ffmpeg.writeFile(inputName, await fetchFile(videoFile));
    await ffmpeg.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', outputName]);
    const data = await ffmpeg.readFile(outputName);
    
    setStatus('Ready');
    return new Blob([data], { type: 'audio/mp3' });
  };

  return { 
    ffmpeg: ffmpegRef.current, 
    loaded, 
    status,
    extractAudio
  };
}
