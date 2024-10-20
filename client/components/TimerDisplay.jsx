import React from 'react'
import { motion } from 'framer-motion'
import { THEMES } from '@/lib/constants'

const TimerDisplay = ({ time, initialTime, currentTask, textColor, currentTheme, isDarkMode, children }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      key="timer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center pt-2"
    >
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full bg-gradient-to-r ${THEMES[currentTheme].primary}`}
          style={{ width: `${((initialTime - time) / initialTime) * 100}%` }}
        />
      </div>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`text-9xl font-bold ${textColor} mt-8`}
      >
        {formatTime(time)}
      </motion.div>
      {currentTask && (
        <div className={`mt-4 text-xl font-semibold ${textColor}`}>
          {currentTask}
        </div>
      )}
      {children}
    </motion.div>
  )
}

export default TimerDisplay