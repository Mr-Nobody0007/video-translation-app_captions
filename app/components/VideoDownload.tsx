import type React from "react"

interface VideoDownloadProps {
  videoLink: string
  email: string
}

const VideoDownload: React.FC<VideoDownloadProps> = ({ videoLink, email }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Video Generated Successfully!</h2>
      <p className="text-gray-600">
        Your video has been generated and sent to your email address: <strong>{email}</strong>
      </p>
      <div>
        <a
          href={videoLink}
          download
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download Video
        </a>
      </div>
    </div>
  )
}

export default VideoDownload

