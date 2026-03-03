import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCyclePhase, generateMockEnergyData } from '../utils/helpers'

const useStore = create(
  persist(
    (set, get) => ({
      // ── User Profile ──
      user: null,
      onboardingComplete: false,

      // ── Cycle Data ──
      cycleDay: 21,
      cycleLength: 28,

      // ── Current Flow State ──
      currentFlow: null, // { mode: 'low'|'high', checkIn: {...} }

      // ── History ──
      checkInHistory: [],
      dailyLogs: [],
      adaptActions: [],

      // ── Today's Quick Log ──
      todayLog: {
        date: new Date().toISOString().split('T')[0],
        sleep: null,
        moved: null,
        ate: null,
      },

      // ── Period Tracking ──
      periodActive: false,
      periodStartDate: null,
      periodHistory: [],

      // ── Planner Blocks ──
      plannerBlocks: {}, // { 'YYYY-MM-DD': ['Focus time', 'Rest', ...] }

      // ── Notifications ──
      notifications: [
        { id: '1', message: "Time for your daily check-in ✨", read: false, timestamp: Date.now() - 3600000 },
        { id: '2', message: "Your luteal phase starts in 2 days — plan accordingly 🌙", read: false, timestamp: Date.now() - 7200000 },
        { id: '3', message: "Track your period start to keep your cycle accurate 🌸", read: true, timestamp: Date.now() - 86400000 },
      ],

      // ── Derived Getters ──
      getCyclePhase: () => getCyclePhase(get().cycleDay, get().cycleLength),

      getEnergyPattern: () => {
        return generateMockEnergyData(get().cycleDay, get().cycleLength)
      },

      getPatternInsight: () => {
        const day = get().cycleDay
        const phase = getCyclePhase(day, get().cycleLength)
        if (phase.key === 'luteal' || phase.key === 'menstrual') {
          return {
            exists: true,
            message: `Your energy tends to dip around day 19–22. Today is day ${day}.`,
            occurrences: 3,
            confidence: 'high',
          }
        }
        if (phase.key === 'follicular' || phase.key === 'ovulatory') {
          return {
            exists: true,
            message: `You tend to peak around days 7–10 of your cycle. Today is day ${day}.`,
            occurrences: 4,
            confidence: 'high',
          }
        }
        return { exists: false, message: '', occurrences: 0, confidence: 'low' }
      },

      // ── Actions ──
      completeOnboarding: (profile) =>
        set({
          user: profile,
          onboardingComplete: true,
        }),

      startFlow: (mode) =>
        set({
          currentFlow: {
            mode,
            checkIn: { feelings: [], challenges: [], quickLog: {} },
          },
        }),

      updateFlowCheckIn: (data) =>
        set((state) => ({
          currentFlow: state.currentFlow
            ? { ...state.currentFlow, checkIn: { ...state.currentFlow.checkIn, ...data } }
            : null,
        })),

      saveCheckIn: () => {
        const state = get()
        if (!state.currentFlow) return
        const entry = {
          id: Date.now().toString(36),
          timestamp: Date.now(),
          mode: state.currentFlow.mode,
          ...state.currentFlow.checkIn,
          cycleDay: state.cycleDay,
          phase: getCyclePhase(state.cycleDay, state.cycleLength).key,
        }
        set({
          checkInHistory: [...state.checkInHistory, entry],
        })
      },

      clearFlow: () => set({ currentFlow: null }),

      toggleQuickLog: (key) =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const log = state.todayLog.date === today ? state.todayLog : { date: today, sleep: null, moved: null, ate: null }
          return {
            todayLog: {
              ...log,
              date: today,
              [key]: log[key] === true ? false : true,
            },
          }
        }),

      logAdaptAction: (action) =>
        set((state) => ({
          adaptActions: [
            ...state.adaptActions,
            {
              id: Date.now().toString(36),
              timestamp: Date.now(),
              action,
              cycleDay: state.cycleDay,
            },
          ],
        })),

      updateCycleDay: (day) => set({ cycleDay: day }),
      updateCycleLength: (length) => set({ cycleLength: length }),

      // ── Period Actions ──
      logPeriodStart: () =>
        set((state) => ({
          periodActive: true,
          periodStartDate: new Date().toISOString().split('T')[0],
          periodHistory: [
            ...state.periodHistory,
            {
              id: Date.now().toString(36),
              start: new Date().toISOString().split('T')[0],
              end: null,
            },
          ],
        })),

      logPeriodEnd: () =>
        set((state) => {
          const history = [...state.periodHistory]
          const last = history[history.length - 1]
          if (last && !last.end) {
            history[history.length - 1] = {
              ...last,
              end: new Date().toISOString().split('T')[0],
            }
          }
          return { periodActive: false, periodHistory: history }
        }),

      // ── Notification Actions ──
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      addNotification: (message) =>
        set((state) => ({
          notifications: [
            { id: Date.now().toString(36), message, read: false, timestamp: Date.now() },
            ...state.notifications,
          ],
        })),

      // ── Planner Block Actions ──
      addPlannerBlock: (dayKey, label) =>
        set((state) => {
          const existing = state.plannerBlocks[dayKey] || []
          if (existing.includes(label)) return state
          return {
            plannerBlocks: {
              ...state.plannerBlocks,
              [dayKey]: [...existing, label],
            },
          }
        }),

      removePlannerBlock: (dayKey, label) =>
        set((state) => ({
          plannerBlocks: {
            ...state.plannerBlocks,
            [dayKey]: (state.plannerBlocks[dayKey] || []).filter((b) => b !== label),
          },
        })),

      resetApp: () =>
        set({
          user: null,
          onboardingComplete: false,
          currentFlow: null,
          checkInHistory: [],
          dailyLogs: [],
          adaptActions: [],
          todayLog: { date: new Date().toISOString().split('T')[0], sleep: null, moved: null, ate: null },
          cycleDay: 21,
          cycleLength: 28,
          periodActive: false,
          periodStartDate: null,
          periodHistory: [],
          plannerBlocks: {},
          notifications: [],
        }),
    }),
    {
      name: 'biome-storage',
    }
  )
)

export default useStore
