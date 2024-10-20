"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX, Moon, Sun, Settings, BarChart } from 'lucide-react'
import SettingsModal from "@/components/modals/SettingsModal";
import StatisticsModal from "@/components/modals/StatisticsModal";
import PomodoroSettingsModal from "@/components/modals/PomodoroSettingsModal";
import Logo from "@/components/Logo";
import TimerDisplay from '@/components/TimerDisplay'
import ControlPanel from '@/components/ControlPanel'
import { DEFAULT_PRESETS, THEMES } from '@/lib/constants'

export default function FocusTimer() {
  const [time, setTime] = useState(25 * 60)
  const [initialTime, setInitialTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [currentPreset, setCurrentPreset] = useState("Focus 25")
  const [presets, setPresets] = useState(DEFAULT_PRESETS)
  const [isBreak, setIsBreak] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState(false)
  const [pomodoroStep, setPomodoroStep] = useState(0)
  const [stats, setStats] = useState({ sessions: 0, totalFocusTime: 0, streak: 0 })
  const [currentTheme, setCurrentTheme] = useState("default")
  const [currentTask, setCurrentTask] = useState("")
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [showPomodoroSettingsModal, setShowPomodoroSettingsModal] = useState(false)
  const [pomodoroSettings, setPomodoroSettings] = useState({
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    longBreakInterval: 4
  })

  const fullscreenRef = useRef(null)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('focusTimerSettings')) || {}
    setIsDarkMode(savedSettings.isDarkMode || false)
    setIsMuted(savedSettings.isMuted || false)
    setCurrentTheme(savedSettings.theme || "default")
    setPomodoroMode(savedSettings.pomodoroMode || false)
    setPomodoroSettings(savedSettings.pomodoroSettings || pomodoroSettings)
    
    const savedPresets = JSON.parse(localStorage.getItem('focusTimerPresets'))
    if (savedPresets) setPresets(savedPresets)
    
    const savedStats = JSON.parse(localStorage.getItem('focusTimerStats'))
    if (savedStats) setStats(savedStats)
  }, [])

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const savedSettings = JSON.parse(localStorage.getItem('focusTimerSettings')) || {}
      setIsDarkMode(savedSettings.isDarkMode ?? false)
      setIsMuted(savedSettings.isMuted ?? false)
      setCurrentTheme(savedSettings.theme ?? "default")
      setPomodoroMode(savedSettings.pomodoroMode ?? false)
      setPomodoroSettings(savedSettings.pomodoroSettings ?? pomodoroSettings)
      
      const savedPresets = JSON.parse(localStorage.getItem('focusTimerPresets'))
      if (savedPresets) setPresets(savedPresets)
      
      const savedStats = JSON.parse(localStorage.getItem('focusTimerStats'))
      if (savedStats) setStats(savedStats)
    }

    loadFromLocalStorage()
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio("/alarm.wav")
    }
  }, [])

  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem('focusTimerSettings', JSON.stringify({
        isDarkMode,
        isMuted,
        theme: currentTheme,
        pomodoroMode,
        pomodoroSettings,
      }))
      localStorage.setItem('focusTimerPresets', JSON.stringify(presets))
      localStorage.setItem('focusTimerStats', JSON.stringify(stats))
    }

    saveToLocalStorage()
  }, [isDarkMode, isMuted, currentTheme, pomodoroMode, pomodoroSettings, presets, stats])

  const startTimer = useCallback(() => {
    if (time > 0) {
      setIsRunning(true)
      setIsFinished(false)
      enterFullscreen()
      if (!isBreak) {
        setStats(prev => ({ ...prev, sessions: prev.sessions + 1 }))
      }
    }
  }, [time, isBreak])

  const pauseTimer = () => setIsRunning(false)
  const resumeTimer = () => setIsRunning(true)
  const resetTimer = () => {
    setIsRunning(false)
    setTime(initialTime)
    setIsFinished(false)
    setIsBreak(false)
    setPomodoroStep(0)
  }

  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer()
    } else if (time > 0) {
      resumeTimer()
    } else {
      startTimer()
    }
  }

  const enterFullscreen = () => {
    if (fullscreenRef.current && !isFullscreen) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen()
      } else if (fullscreenRef.current.mozRequestFullScreen) {
        fullscreenRef.current.mozRequestFullScreen()
      } else if (fullscreenRef.current.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen()
      } else if (fullscreenRef.current.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    }
  }

  const exitFullscreen = () => {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
        if (!isBreak) {
          setStats(prev => ({ ...prev, totalFocusTime: prev.totalFocusTime + 1 }))
        }
      }, 1000)
    } else if (time === 0 && isRunning) {
      setIsRunning(false)
      setIsFinished(true)
      if (!isMuted) {
        audioRef.current.play()
      }
      if (Notification.permission === "granted") {
        new Notification("Focus Timer", { body: isBreak ? "Break time is over!" : "Focus session completed!" })
      }
      if (pomodoroMode) {
        handlePomodoroStep()
      } else if (!isBreak) {
        startBreakTimer()
      }
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, time, isMuted, isBreak, pomodoroMode])

  const handlePomodoroStep = () => {
    if (pomodoroStep < pomodoroSettings.longBreakInterval * 2 - 1) {
      setPomodoroStep(prev => prev + 1)
      if (pomodoroStep % 2 === 0) {
        // Start break
        setTime(pomodoroStep === pomodoroSettings.longBreakInterval * 2 - 2 ? pomodoroSettings.longBreakDuration : pomodoroSettings.shortBreakDuration)
        setIsBreak(true)
      } else {
        // Start focus
        setTime(pomodoroSettings.focusDuration)
        setIsBreak(false)
      }
      startTimer()
    } else {
      resetTimer()
    }
  }

  const startBreakTimer = () => {
    setTime(pomodoroSettings.shortBreakDuration)
    setInitialTime(pomodoroSettings.shortBreakDuration)
    setIsBreak(true)
    startTimer()
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        toggleTimer()
      } else if (e.code === 'KeyR') {
        resetTimer()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [toggleTimer])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900'
  const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white'
  const inputBorderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300'

  const handlePresetChange = (preset) => {
    const selectedPreset = presets.find(p => p.name === preset)
    if (selectedPreset) {
      setTime(selectedPreset.duration)
      setInitialTime(selectedPreset.duration)
      setCurrentPreset(preset)
    }
  }

  const addPreset = (name, duration) => {
    setPresets(prevPresets => [...prevPresets, { name, duration }])
  }

  const removePreset = (name) => {
    setPresets(prevPresets => prevPresets.filter(preset => preset.name !== name))
  }

  return (
    <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4 transition-colors duration-300`} ref={fullscreenRef}>
      <AnimatePresence mode="wait">
        {!isFullscreen ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md`}
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Logo />
              <h1 className={`text-3xl md:text-4xl font-bold ml-3 ${textColor}`}>
                Focus Timer
              </h1>
            </motion.div>
            <div className="mb-6">
              <Select onValueChange={handlePresetChange} defaultValue={currentPreset}>
                <SelectTrigger className={`w-full mb-4 ${inputBgColor} ${inputBorderColor}`}>
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>{preset.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className={`grid grid-cols-3 gap-2 mb-4 ${textColor}`}>
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium mb-1">Hours</label>
                  <Input
                    type="number"
                    id="hours"
                    min="0"
                    max="23"
                    value={Math.floor(time / 3600)}
                    onChange={(e) => {
                      const newTime = (parseInt(e.target.value) || 0) * 3600 + (time % 3600);
                      setTime(newTime);
                      setInitialTime(newTime);
                    }}
                    className={`w-full ${inputBgColor} ${inputBorderColor}`}
                  />
                </div>
                <div>
                  <label htmlFor="minutes" className="block text-sm font-medium mb-1">Minutes</label>
                  <Input
                    type="number"
                    id="minutes"
                    min="0"
                    max="59"
                    value={Math.floor((time % 3600) / 60)}
                    onChange={(e) => {
                      const newTime = Math.floor(time / 3600) * 3600 + (parseInt(e.target.value) || 0) * 60 + (time % 60);
                      setTime(newTime);
                      setInitialTime(newTime);
                    }}
                    className={`w-full ${inputBgColor} ${inputBorderColor}`}
                  />
                </div>
                <div>
                  <label htmlFor="seconds" className="block text-sm font-medium mb-1">Seconds</label>
                  <Input
                    type="number"
                    id="seconds"
                    min="0"
                    max="59"
                    value={time % 60}
                    onChange={(e) => {
                      const newTime = Math.floor(time / 60) * 60 + (parseInt(e.target.value) || 0);
                      setTime(newTime);
                      setInitialTime(newTime);
                    }}
                    className={`w-full ${inputBgColor} ${inputBorderColor}`}
                  />
                </div>
              </div>
              <div className={`text-center text-2xl font-semibold ${textColor}`}>
                {formatTime(time)}
              </div>
            </div>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="What are you focusing on?"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                className={`w-full ${inputBgColor} ${inputBorderColor}`}
              />
            </div>
            <motion.div 
              className="flex flex-wrap  justify-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={toggleTimer}
                size="lg"
                className={`bg-gradient-to-r ${THEMES[currentTheme].primary} text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : time === initialTime ? (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Focus
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setPomodoroMode(!pomodoroMode);
                  if (!pomodoroMode) {
                    setTime(pomodoroSettings.focusDuration);
                    setInitialTime(pomodoroSettings.focusDuration);
                    setIsBreak(false);
                    setPomodoroStep(0);
                    startTimer();
                  } else {
                    resetTimer();
                  }
                }}
                size="sm"
                variant={pomodoroMode ? "default" : "outline"}
                className="rounded-full"
              >
                Pomodoro
              </Button>
              <Button onClick={toggleFullscreen} size="icon" variant="outline" className="rounded-full">
                <Maximize className="h-5 w-5" />
              </Button>
              <Button onClick={() => setShowSettingsModal(true)} size="icon" variant="outline" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
              <Button onClick={() => setShowStatisticsModal(true)} size="icon" variant="outline" className="rounded-full">
                <BarChart className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <TimerDisplay
            time={time}
            initialTime={initialTime}
            currentTask={currentTask}
            textColor={textColor}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
          >
            <ControlPanel
              isRunning={isRunning}
              toggleTimer={toggleTimer}
              resetTimer={resetTimer}
              toggleFullscreen={toggleFullscreen}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              currentTheme={currentTheme}
            />
          </TimerDisplay>
        )}
      </AnimatePresence>
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        presets={presets}
        addPreset={addPreset}
        removePreset={removePreset}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <StatisticsModal
        isOpen={showStatisticsModal}
        onClose={() => setShowStatisticsModal(false)}
        stats={stats}
        isDarkMode={isDarkMode}
      />
      <PomodoroSettingsModal
        isOpen={showPomodoroSettingsModal}
        onClose={() => setShowPomodoroSettingsModal(false)}
        settings={pomodoroSettings}
        setSettings={setPomodoroSettings}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}