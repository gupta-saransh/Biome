import { useNavigate } from 'react-router-dom'

export default function StepBack() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="text-5xl">🤍</div>

        {/* Headline */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Today sounds really heavy.
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            You don't need to fix anything right now. You don't need to do anything at all.
          </p>
        </div>

        {/* Support option */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-sm text-gray-600 mb-4">
            Would it help to talk to someone?
          </p>
          <a
            href="https://www.thecalmzone.net/get-support"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-semibold text-brand-purple
              border-2 border-brand-purple rounded-full px-5 py-2.5
              hover:bg-brand-light transition-colors"
          >
            Find support →
          </a>
        </div>

        {/* Back to home — gentle */}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          Go home when you're ready
        </button>
      </div>
    </div>
  )
}
