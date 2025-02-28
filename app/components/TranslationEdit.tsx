"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface TranslationEditProps {
  translatedScript: string
  setTranslatedScript: (script: string) => void
  prevStep: () => void
  email: string
}

const TranslationEdit: React.FC<TranslationEditProps> = ({
  translatedScript,
  setTranslatedScript,
  prevStep,
  email,
}) => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setProgress(0)

    if (translatedScript.trim() === "") {
      setError("Please enter a translated script.")
      setIsLoading(false)
      return
    }

    try {
      const submitResponse = await fetch("/api/submit-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: translatedScript,
          creatorName: "twin-1-Dr. Ace",
          resolution: "4k",
        }),
      })

      if (!submitResponse.ok) {
        throw new Error("Failed to submit video generation request")
      }

      const submitData = await submitResponse.json()
      console.log("Submit response data:", submitData)
      const { operationId } = submitData

      console.log("Operation ID before polling:", operationId)

      // Start polling after 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000))

      while (true) {
        console.log("Sending poll request with operationId:", operationId)
        
        const pollResponse = await fetch("/api/poll-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ operationId: operationId }),
        })

        if (!pollResponse.ok) {
          throw new Error("Failed to poll video generation status")
        }

        const pollData = await pollResponse.json()

        if (pollData.url) {
          // Video is ready
          router.push(`/video?url=${encodeURIComponent(pollData.url)}&email=${encodeURIComponent(email)}`)
          return
        } else if (pollData.state === "QUEUED" || pollData.state === "PROCESSING") {
          // Update progress
          setProgress(pollData.progress || 0)
          // Wait for 5 seconds before next poll
          await new Promise((resolve) => setTimeout(resolve, 5000))
        } else {
          throw new Error("Unexpected response from polling API")
        }
      }
    } catch (error) {
      setError("Failed to generate video. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="translatedScript" className="block text-sm font-medium text-gray-700">
          Translated Script
        </label>
        <textarea
          id="translatedScript"
          value={translatedScript}
          onChange={(e) => setTranslatedScript(e.target.value)}
          rows={10}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        ></textarea>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={prevStep}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Generating Video..." : "Generate Video"}
        </button>
      </div>
      {isLoading && (
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">{progress}%</span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default TranslationEdit

