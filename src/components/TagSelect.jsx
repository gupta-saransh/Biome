import { useState } from 'react'

/**
 * Multi-select (or single-select) tag group.
 * @param {{ options: {emoji?: string, label: string}[], selected: string[], onChange: (selected: string[]) => void, multi?: boolean }} props
 */
export default function TagSelect({ options, selected, onChange, multi = true }) {
  const toggle = (label) => {
    if (multi) {
      const next = selected.includes(label)
        ? selected.filter((s) => s !== label)
        : [...selected, label]
      onChange(next)
    } else {
      onChange(selected.includes(label) ? [] : [label])
    }
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map(({ emoji, label }) => {
        const isSelected = selected.includes(label)
        return (
          <button
            key={label}
            type="button"
            onClick={() => toggle(label)}
            className={`
              px-4 py-2.5 rounded-full text-sm font-medium
              border-2 transition-all duration-150 cursor-pointer
              select-none active:scale-95 min-h-[44px]
              ${
                isSelected
                  ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-brand-purple hover:text-brand-purple'
              }
            `}
          >
            {emoji && <span className="mr-1.5">{emoji}</span>}
            {label}
          </button>
        )
      })}
    </div>
  )
}
