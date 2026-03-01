import { useState, useRef, useEffect } from 'react'
import useStore from '../store/useStore'
import { getCyclePhase } from '../utils/helpers'

// ── Mock AI response engine ──
function generateResponse(message, context) {
  const { phase, cycleDay, userName, checkInHistory } = context
  const lower = message.toLowerCase()

  // Greetings
  if (/^(hi|hey|hello|sup|yo)\b/.test(lower)) {
    return `Hey ${userName}! I'm here when you need me. You're on day ${cycleDay} of your cycle — ${phase.name.toLowerCase()} phase. How can I help?`
  }

  // Tired / exhausted
  if (/tired|exhausted|no energy|drained|fatigue|fatigued/.test(lower)) {
    if (phase.key === 'luteal' || phase.key === 'menstrual') {
      return `That makes complete sense. You're in your ${phase.name.toLowerCase()} phase (day ${cycleDay}), and ${phase.labelBody.toLowerCase()} \n\nThis isn't you failing to rest enough — it's your body doing real work. What would help you most right now: movement advice, food ideas, or just permission to rest?`
    }
    return `Interesting — you're in your ${phase.name.toLowerCase()} phase, which usually has higher energy. Low energy here could point to sleep, food, or stress. Did anything change recently?`
  }

  // Anxious / stressed
  if (/anxious|anxiety|stressed|overwhelmed|panic/.test(lower)) {
    if (phase.key === 'luteal') {
      return `Anxiety peaks in the luteal phase for a lot of people — progesterone affects GABA receptors which can dampen your brain's calm response. This is biology, not a mental health crisis.\n\nA few things that actually help: magnesium-rich foods (dark chocolate, leafy greens), reducing caffeine, and not scheduling hard conversations in this window.`
    }
    return `Stress outside your cycle can amplify in any phase. Try to reduce decisions and stimulation for the next few hours. What's specifically overwhelming you?`
  }

  // Phase questions
  if (/what (phase|part)|(which|my) (phase|cycle)|cycle day/.test(lower)) {
    return `You're on **day ${cycleDay}** of your cycle — that's your **${phase.name} phase**.\n\n${phase.description}\n\n${phase.labelBody}`
  }

  // Workout / exercise
  if (/workout|exercise|gym|training|run|pilates|yoga/.test(lower)) {
    const advice = {
      menstrual: "Gentle movement only — restorative yoga, slow walks, stretching. Your body is already doing heavy lifting internally.",
      follicular: "This is your best window for strength training and HIIT. Estrogen supports muscle repair — push a little harder than normal.",
      ovulatory: "Peak performance window. Go for PRs, hard runs, or anything you've been building toward. You'll recover faster today.",
      luteal: "Moderate movement is ideal. Pilates, moderate cardio, or a lighter gym session. Skip the HIIT — your body temperature is already elevated.",
    }
    return `Given you're in **${phase.name} phase** (day ${cycleDay}):\n\n${advice[phase.key]}`
  }

  // Food / nutrition
  if (/food|eat|diet|nutrition|cravings|hungry|meal/.test(lower)) {
    const advice = {
      menstrual: "Iron and warmth. Lentils, dark leafy greens, red meat if that's your thing. Warm foods feel better than cold — dal, soups, stews.",
      follicular: "Light, nutrient-dense foods. Your digestion is efficient right now. Fermented foods, seeds, and lean proteins support estrogen metabolism.",
      ovulatory: "Anti-inflammatory support helps — berries, leafy greens, omega-3s. Hydration matters more in this phase.",
      luteal: "Complex carbs are your friend — they stabilize blood sugar and support serotonin. Magnesium helps with cramps and mood. Dal, sweet potato, dark chocolate.",
    }
    return `In your **${phase.name} phase**, here's what your body is asking for:\n\n${advice[phase.key]}`
  }

  // Mood / emotions
  if (/mood|emotional|crying|sad|low mood|depressed/.test(lower)) {
    if (phase.key === 'luteal') {
      return `Low mood in the luteal phase is one of the most common and least talked-about parts of the cycle. Progesterone drops serotonin precursors — this is neurochemical, not personal.\n\nIf this has been going on for more than 3 days, consider logging it as a pattern. Have you eaten and slept? Those two things alone can shift luteal mood significantly.`
    }
    return `Mood dips can happen in any phase — they're not always cycle-related. Have you slept, eaten, and had any social connection today? Sometimes it's those basics. What's going on?`
  }

  // Pattern / insights
  if (/pattern|predict|insights|history|trends/.test(lower)) {
    if (checkInHistory.length >= 3) {
      return `Based on your ${checkInHistory.length} check-ins, you've been tracking for a bit. Your check-ins cluster around the ${phase.name.toLowerCase()} phase.\n\nPatterns need 30+ days to reliably detect — keep checking in and I'll get sharper. What specific pattern are you curious about?`
    }
    return `You've checked in ${checkInHistory.length} time${checkInHistory.length !== 1 ? 's' : ''} so far. I need at least 30 days of data to show you reliable patterns. Every check-in teaches me something about your specific rhythm.\n\nKeep going — the insights get genuinely useful after the first full cycle.`
  }

  // Sleep
  if (/sleep|insomnia|can't sleep|wake up|rest/.test(lower)) {
    const advice = {
      menstrual: "Sleep is often disrupted right at the start of menstruation due to cramps and temperature changes. Magnesium glycinate before bed helps a lot here.",
      follicular: "Sleep is usually better in follicular — if you're struggling, check your caffeine timing and screen light.",
      ovulatory: "Sleep tends to be good here. If not, stress hormones might be interfering.",
      luteal: "Progesterone should help you feel sleepy earlier but can fragment sleep. Keep the room cool, reduce alcohol, and avoid late meals.",
    }
    return `Sleep + ${phase.name.toLowerCase()} phase:\n\n${advice[phase.key]}`
  }

  // What can I do / help
  if (/what (can|should) i do|how (do|can) i|help me|advice/.test(lower)) {
    return `Happy to help. A few things I can assist with:\n\n• **Understanding your current phase** — what your body is doing and why\n• **Movement suggestions** — what type of exercise fits today\n• **Food guidance** — what to eat based on your phase\n• **Mood support** — why you might feel how you feel\n• **Pattern questions** — what your check-in history shows\n\nWhat's on your mind?`
  }

  // Fallback — context-aware
  return `I heard you — "${message.slice(0, 60)}${message.length > 60 ? '...' : ''}"\n\nI'm still learning to respond to that specifically. Right now I'm best at questions about your cycle phase, energy, mood, food, or workouts. What do you want to understand about your body today?`
}

// ── Component ──
export default function ChatPanel({ onClose }) {
  const user = useStore((s) => s.user)
  const cycleDay = useStore((s) => s.cycleDay)
  const cycleLength = useStore((s) => s.cycleLength)
  const checkInHistory = useStore((s) => s.checkInHistory)

  const phase = getCyclePhase(cycleDay, cycleLength)
  const userName = user?.name || 'there'

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hey ${userName}! I'm Biome.\n\nYou're on **day ${cycleDay}** of your cycle — ${phase.name.toLowerCase()} phase. ${phase.description}\n\nAsk me anything about how you're feeling, your energy, workouts, food, or what your body is doing right now.`,
      time: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: Date.now().toString(), role: 'user', text, time: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Simulate AI thinking time
    const delay = 600 + Math.random() * 800
    setTimeout(() => {
      const response = generateResponse(text, { phase, cycleDay, userName, checkInHistory })
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response,
        time: new Date(),
      }])
      setTyping(false)
    }, delay)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center">
            <span className="text-white text-sm">✦</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Ask Biome</p>
            <p className="text-xs text-gray-400">Day {cycleDay} · {phase.name}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center shrink-0 mt-0.5 mr-2">
                <span className="text-white text-[10px]">✦</span>
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-brand-purple text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}
            >
              {/* Render simple markdown bold */}
              <MessageText text={msg.text} isUser={msg.role === 'user'} />
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center shrink-0 mt-0.5 mr-2">
              <span className="text-white text-[10px]">✦</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {[
          'Why am I tired?',
          'What should I eat?',
          'Best workout today?',
          'What phase am I in?',
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              setInput(prompt)
              inputRef.current?.focus()
            }}
            className="shrink-0 text-xs font-medium text-brand-purple bg-brand-light
              border border-brand-muted rounded-full px-3 py-1.5
              hover:bg-brand-mid transition-colors whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-100 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your energy, cycle, food..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 rounded-xl border-2 border-gray-200
              text-sm focus:outline-none focus:border-brand-purple transition-colors
              placeholder:text-gray-300 max-h-24"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || typing}
            className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center
              hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-300 mt-1.5 text-center">Not medical advice · For informational use only</p>
      </div>
    </div>
  )
}

// Render **bold** markdown
function MessageText({ text, isUser }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className={isUser ? 'font-bold' : 'font-bold text-gray-900'}>
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </div>
  )
}
