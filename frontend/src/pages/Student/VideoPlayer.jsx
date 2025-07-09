import { useState, useRef, useEffect } from 'react';
import { FileDown, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const { lecId } = useSelector(state => state.lec);
  const { lecInfo } = useSelector(state => state.lec);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      videoRef.current.currentTime = e.target.value;
      setProgress(e.target.value);
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDownload = () => {
    // In a real application, this would point to your actual file
    const fileUrl = lecInfo;
    const link = document.createElement('a');
    link.href = lecInfo;
    link.download = "presentation-document.pdf";
    document.body.appendChild(link);
    link.click(fileUrl);
    document.body.removeChild(link);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Lecture video</h1>
      
      <div className="relative rounded-lg overflow-hidden shadow-lg mb-6 bg-black">
        {/* Video Player */}
        <video
          ref={videoRef}
          className="w-full aspect-video"
          poster="/api/placeholder/1280/720"
          onClick={togglePlay}
        >
          <source src={lecId} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex flex-col">
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(progress / duration) * 100}%, #A9A9A9 ${(progress / duration) * 100}%, #A9A9A9 100%)`
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                  className="text-white hover:text-blue-400 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              <div className="text-white text-sm">
                {formatTime(duration - progress)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
        >
          <FileDown size={18} />
          <span>Download Tute</span>
        </button>
      </div>
    </div>
  );
}