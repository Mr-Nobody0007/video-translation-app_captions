import type React from "react"
import { useState, useEffect, useRef } from "react"

interface VideoPlayerProps {
  videoUrl: string
  email: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, email }) => {
  const [isPortrait, setIsPortrait] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const aspectRatio = video.videoWidth / video.videoHeight;
      setIsPortrait(aspectRatio < 1);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Video Generated Successfully!</h2>
      <p className="text-gray-600">
        Your video has been generated and sent to your email address: <strong>{email}</strong>
      </p>
      <div className={`${isPortrait ? 'aspect-[9/16] max-w-[400px]' : 'aspect-video'} mx-auto`}>
        <video 
          ref={videoRef}
          src={videoUrl} 
          controls 
          className="w-full h-full object-contain rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div>
        <a
          href={videoUrl}
          download
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download Video
        </a>
      </div>
    </div>
  )
}

export default VideoPlayer

