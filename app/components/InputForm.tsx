import type React from "react"
import { useState } from "react"

interface InputFormProps {
  email: string
  setEmail: (email: string) => void
  script: string
  setScript: (script: string) => void
  language: string
  setLanguage: (language: string) => void
  nextStep: () => void
  setTranslatedScript: (script: string) => void
}

const InputForm: React.FC<InputFormProps> = ({
  email,
  setEmail,
  script,
  setScript,
  language,
  setLanguage,
  nextStep,
  setTranslatedScript,
}) => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (script.trim() === "") {
      setError("Please enter a video script.")
      return
    }

    if (language === "") {
      setError("Please select a language for translation.")
      return
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 1 minute timeout

      const response = await fetch("https://hook.eu2.make.com/07ejricg9d628ncekmzhrd54gxeorg9o", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script, language }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("Failed to translate script")
      }

      const data = await response.json()
      setTranslatedScript(data.translatedScript)
      nextStep()
    } catch (error) {
      if (error.name === "AbortError") {
        setError("Request timed out. Please try again.")
      } else {
        setError("Failed to translate script. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="script" className="block text-sm font-medium text-gray-700">
          Video Script
        </label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={5}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Translation Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select a language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
          <option value="Portuguese">Portuguese</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Translating...
            </>
          ) : (
            "Translate Script"
          )}
        </button>
      </div>
    </form>
  )
}

export default InputForm

