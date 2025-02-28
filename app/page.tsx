"use client"

import { useState } from "react"
import InputForm from "./components/InputForm"
import TranslationEdit from "./components/TranslationEdit"

export default function Home() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [script, setScript] = useState("")
  const [language, setLanguage] = useState("")
  const [translatedScript, setTranslatedScript] = useState("")

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          {step === 1 && (
            <InputForm
              email={email}
              setEmail={setEmail}
              script={script}
              setScript={setScript}
              language={language}
              setLanguage={setLanguage}
              nextStep={nextStep}
              setTranslatedScript={setTranslatedScript}
            />
          )}
          {step === 2 && (
            <TranslationEdit
              translatedScript={translatedScript}
              setTranslatedScript={setTranslatedScript}
              prevStep={prevStep}
              email={email}
            />
          )}
        </div>
      </div>
    </div>
  )
}

