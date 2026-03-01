import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { ONBOARDING_QUESTIONS } from '../data/mockData'
import TagSelect from '../components/TagSelect'

const TOTAL_STEPS = ONBOARDING_QUESTIONS.length + 2 // welcome + questions + done

export default function Onboarding() {
  const navigate = useNavigate()
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const alreadyDone = useStore((s) => s.onboardingComplete)

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState({})
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (alreadyDone) navigate('/', { replace: true })
  }, [alreadyDone, navigate])

  const goNext = () => {
    setAnimating(true)
    setTimeout(() => {
      setStep((s) => s + 1)
      setAnimating(false)
    }, 200)
  }

  const goBack = () => {
    if (step > 0) {
      setAnimating(true)
      setTimeout(() => {
        setStep((s) => s - 1)
        setAnimating(false)
      }, 200)
    }
  }

  const finish = () => {
    completeOnboarding({
      name: name.trim() || 'there',
      preferences: answers,
    })
    navigate('/', { replace: true })
  }

  const currentQuestion = step >= 1 && step <= ONBOARDING_QUESTIONS.length
    ? ONBOARDING_QUESTIONS[step - 1]
    : null

  const progress = (step / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-brand-purple transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between">
        {step > 0 ? (
          <button
            onClick={goBack}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-9" />
        )}
        <span className="text-xs font-medium text-gray-400">
          {step + 1} / {TOTAL_STEPS}
        </span>
        {currentQuestion && (
          <button
            onClick={goNext}
            className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip
          </button>
        )}
        {!currentQuestion && <div className="w-9" />}
      </div>

      {/* Content */}
      <div
        className={`flex-1 flex flex-col justify-center px-6 max-w-lg mx-auto w-full
          transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
      >
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Biome
              </h1>
              <p className="text-base text-gray-500 leading-relaxed">
                Understand your body's energy patterns. No guilt, no streaks — just insight and adaptation.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What should I call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 text-base
                  focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple
                  transition-colors placeholder:text-gray-300"
                autoFocus
              />
            </div>

            <button onClick={goNext} className="btn-primary mt-4">
              Get started
            </button>
          </div>
        )}

        {/* Steps 1–5: Questions */}
        {currentQuestion && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {currentQuestion.question}
              </h2>
              <p className="text-sm text-gray-400">{currentQuestion.subtitle}</p>
            </div>

            <TagSelect
              options={currentQuestion.options.map((o) => ({ label: o }))}
              selected={answers[currentQuestion.key] || []}
              onChange={(sel) =>
                setAnswers((prev) => ({ ...prev, [currentQuestion.key]: sel }))
              }
              multi={currentQuestion.multiSelect}
            />

            <button
              onClick={goNext}
              className="btn-primary mt-4"
            >
              Next
            </button>
          </div>
        )}

        {/* Final step: Done */}
        {step === TOTAL_STEPS - 1 && (
          <div className="space-y-6 text-center">
            <div className="text-5xl mb-2">✨</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                All set{name ? `, ${name.trim()}` : ''}!
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                Biome will learn your patterns over time. The more you check in, the smarter it gets.
              </p>
            </div>
            <button onClick={finish} className="btn-primary mt-4">
              Let's go
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
