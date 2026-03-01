// ── Cycle Phase Definitions ──

export const CYCLE_PHASES = {
  menstrual: {
    key: 'menstrual',
    name: 'Menstrual',
    dayRange: [1, 5],
    color: '#EF9A9A',
    bgColor: '#FFF0F0',
    description: 'Your body is shedding the uterine lining. Energy is typically lowest.',
    labelHeadline: "You're in your menstrual phase — your body is resetting.",
    labelBody: "Your uterine lining is shedding, and your hormone levels are at their lowest. Fatigue right now is biology, not laziness.",
  },
  follicular: {
    key: 'follicular',
    name: 'Follicular',
    dayRange: [6, 13],
    color: '#A5D6A7',
    bgColor: '#F0FFF0',
    description: 'Estrogen is rising. This is your high-output window.',
    labelHeadline: "You're in your follicular phase — this is your high-output window.",
    labelBody: "Estrogen is rising, cortisol tolerance is higher, and your body is primed for effort. This is the window to push.",
  },
  ovulatory: {
    key: 'ovulatory',
    name: 'Ovulatory',
    dayRange: [14, 16],
    color: '#FFF176',
    bgColor: '#FFFFF0',
    description: 'Peak energy and fertility. Maximum output capacity.',
    labelHeadline: "You're in your ovulatory phase — peak energy window.",
    labelBody: "Estrogen and testosterone are at their highest. Your body is primed for maximum output, both physically and mentally.",
  },
  luteal: {
    key: 'luteal',
    name: 'Luteal',
    dayRange: [17, 28],
    color: '#FFCC80',
    bgColor: '#FFF8F0',
    description: 'Progesterone peaks. Your body is working harder than usual.',
    labelHeadline: "You're in your luteal phase — energy is supposed to be lower right now.",
    labelBody: "Progesterone peaks here, which raises your body temperature and costs energy. This is physiology, not discipline.",
  },
}

// ── Onboarding Questions ──

export const ONBOARDING_QUESTIONS = [
  {
    key: 'movement',
    question: "What's your preferred movement?",
    subtitle: 'Select all that apply',
    options: ['Yoga / pilates', 'Gym / weights', 'Walks / outdoor', 'Dance', 'Rest is valid too'],
    multiSelect: true,
  },
  {
    key: 'triggers',
    question: 'What usually makes hard days harder?',
    subtitle: 'Select all that apply',
    options: ['Bad sleep', 'Stress', 'Hormones / cycle', 'Food / eating', "I don't know yet"],
    multiSelect: true,
  },
  {
    key: 'helpers',
    question: 'What helps you feel better?',
    subtitle: 'Select all that apply',
    options: ['Movement', 'Good food', 'Rest', 'Talking to someone', 'Just knowing why'],
    multiSelect: true,
  },
  {
    key: 'tone',
    question: 'How do you want me to talk to you?',
    subtitle: 'Pick one',
    options: ['Just the facts', 'Gentle and warm', 'A bit of humor', 'Mix it up'],
    multiSelect: false,
  },
  {
    key: 'health',
    question: 'Any health context you want to share?',
    subtitle: 'Select all that apply — totally optional',
    options: ['PCOS', 'Insulin resistance', 'Thyroid', 'Cycle stuff', 'Nothing diagnosed'],
    multiSelect: true,
  },
]

// ── Check-in Options ──

export const CHECK_IN_LOW = {
  feelings: [
    { emoji: '😩', label: 'Exhausted' },
    { emoji: '🌫️', label: 'Foggy' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😶', label: 'Low' },
    { emoji: '🤔', label: 'Just off' },
  ],
  challenges: [
    { label: 'Getting started' },
    { label: 'Staying focused' },
    { label: 'Physical energy' },
    { label: 'Motivation' },
    { label: 'All of it' },
  ],
}

export const CHECK_IN_HIGH = {
  feelings: [
    { emoji: '⚡', label: 'Energized' },
    { emoji: '🎯', label: 'Focused' },
    { emoji: '💪', label: 'Strong' },
    { emoji: '☀️', label: 'Light' },
    { emoji: '🔮', label: 'Clear-headed' },
  ],
  goals: [
    { label: 'Push my workout' },
    { label: 'Get focused work done' },
    { label: 'Plan my week' },
    { label: 'Just log it' },
  ],
}

// ── Adaptation Suggestions ──

export const ADAPTATIONS_LOW = [
  {
    icon: '🧘',
    category: 'Movement',
    title: 'Gentler alternative',
    body: "You had a gym session planned. Here's a 20-min pilates flow that still counts — and won't drain you.",
    action: 'pilates',
    actionLabel: 'Start pilates',
  },
  {
    icon: '🍲',
    category: 'Food',
    title: 'Nourish, don\'t restrict',
    body: "Craving something warm? Dal and rice is exactly what your body wants right now. That's not a cheat — that's good sense.",
    action: 'logged-food',
    actionLabel: 'Log what I ate',
  },
  {
    icon: '😴',
    category: 'Rest',
    title: 'Permission granted',
    body: 'Rest is not a setback today. It is the right move.',
    action: 'rested',
    actionLabel: 'Log that I rested',
  },
]

export const ADAPTATIONS_HIGH = [
  {
    icon: '💪',
    category: 'Movement',
    title: 'Level up',
    body: "You had a 20-min pilates session planned. Your body can go harder today — here's a 45-min strength option.",
    action: 'strength',
    actionLabel: 'Go for it',
  },
  {
    icon: '🧠',
    category: 'Focus',
    title: 'Deep work window',
    body: "This is a good window for deep work, hard conversations, or anything that needs your full brain.",
    action: 'deep-work',
    actionLabel: 'Block focus time',
  },
  {
    icon: '📅',
    category: 'Planning',
    title: 'Plan your week',
    body: "Your energy is high enough to think ahead. Want to map out the rest of the week around your cycle?",
    action: 'plan-week',
    actionLabel: 'Open planner',
  },
]

// ── Weekly Planner Data ──

export const WEEKLY_PLAN = [
  { day: 'Mon', date: 3, phase: 'follicular', energy: 'High', events: ['Morning run'], tip: 'Push hard — peak window.' },
  { day: 'Tue', date: 4, phase: 'follicular', energy: 'High', events: ['Work presentation'], tip: 'Good day for hard conversations.' },
  { day: 'Wed', date: 5, phase: 'ovulatory', energy: 'Peak', events: ['Gym 6pm'], tip: 'Peak energy. Max effort.' },
  { day: 'Thu', date: 6, phase: 'luteal', energy: 'Protect', events: ['Dinner plans'], tip: 'Energy dropping. Protect your evening.' },
  { day: 'Fri', date: 7, phase: 'luteal', energy: 'Lower', events: [], tip: 'Lighter day — plan accordingly.' },
  { day: 'Sat', date: 8, phase: 'luteal', energy: 'Lower', events: ['Family brunch'], tip: 'Rest when you can.' },
  { day: 'Sun', date: 9, phase: 'luteal', energy: 'Rest', events: [], tip: 'Menstrual phase approaching. Rest is the plan.' },
]

// ── Default User (for demo pre-population) ──

export const DEFAULT_USER = {
  name: 'Anisha',
  preferences: {
    movement: ['Yoga / pilates', 'Gym / weights'],
    triggers: ['Bad sleep', 'Hormones / cycle'],
    helpers: ['Movement', 'Good food', 'Just knowing why'],
    tone: 'Gentle and warm',
    health: ['Insulin resistance', 'Thyroid'],
  },
}
