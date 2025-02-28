"use client"
import { useSearchParams } from "next/navigation"
import VideoPlayer from "../components/VideoPlayer"

export default function VideoPage() {
  const searchParams = useSearchParams()
  const videoUrl = searchParams.get("url")
  const email = searchParams.get("email")

  if (!videoUrl || !email) {
    return <div>Error: Missing video URL or email</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <VideoPlayer videoUrl={videoUrl} email={email} />
        </div>
      </div>
    </div>
  )
}

