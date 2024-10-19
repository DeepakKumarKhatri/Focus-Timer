"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX, Moon, Sun } from 'lucide-react'

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 10V20L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default function FocusTimer() {
  const [time, setTime] = useState(25 * 60)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const fullscreenRef = useRef(null)
  const intervalRef = useRef(null)

  const updateTime = useCallback(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    setTime(totalSeconds)
  }, [hours, minutes, seconds])

  const updateTimeInputs = useCallback(() => {
    setHours(Math.floor(time / 3600))
    setMinutes(Math.floor((time % 3600) / 60))
    setSeconds(time % 60)
  }, [time])

  useEffect(() => {
    updateTime()
  }, [hours, minutes, seconds, updateTime])

  useEffect(() => {
    updateTimeInputs()
  }, [time, updateTimeInputs])

  const startTimer = useCallback(() => {
    if (time > 0) {
      setIsRunning(true)
      setIsFinished(false)
      enterFullscreen()
    }
  }, [time])

  const pauseTimer = () => setIsRunning(false)
  const resetTimer = () => {
    setIsRunning(false)
    setTime(25 * 60)
    setIsFinished(false)
    exitFullscreen()
  }

  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer()
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
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
      setIsFinished(true)
      if (!isMuted) {
        const audio = new Audio('/alarm.wav')
        audio.play()
      }
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, time, isMuted])

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
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900'
  const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white'
  const inputBorderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300'

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
              <Slider
                min={0}
                max={7200}
                step={1}
                value={[time]}
                onValueChange={(value) => setTime(value[0])}
                className="w-full mb-4"
              />
              <div className={`grid grid-cols-3 gap-2 ${textColor}`}>
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium mb-1">Hours</label>
                  <Input
                    type="number"
                    id="hours"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value) || 0)}
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
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
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
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                    className={`w-full ${inputBgColor} ${inputBorderColor}`}
                  />
                </div>
              </div>
              <div className={`text-center mt-4 text-2xl font-semibold ${textColor}`}>
                {formatTime(time)}
              </div>
            </div>
            <motion.div 
              className="flex justify-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button onClick={startTimer} size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                Start Focus
              </Button>
              <Button onClick={() => setIsDarkMode(!isDarkMode)} size="icon" variant="outline" className="rounded-full">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={`text-6xl md:text-9xl font-bold ${textColor} text-center`}
            >
              {isFinished ? (
                <div className="flex flex-col items-center">
                  <p className="text-4xl md:text-6xl mb-4">Time's up!</p>
                  <p className="text-xl md:text-2xl">Great job staying focused!</p>
                </div>
              ) : (
                formatTime(time)
              )}
            </motion.div>
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="fixed bottom-8 transform -translate-x-1/2 flex flex-wrap justify-center space-x-2"
                >
                  <Button onClick={toggleTimer} size="icon" variant="outline" className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                    {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button onClick={resetTimer} size="icon" variant="outline" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                  <Button onClick={toggleFullscreen} size="icon" variant="outline" className="bg-gradient-to-r from-pink-400 to-red-500 hover:from-pink-500 hover:to-red-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                    {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                  </Button>
                  <Button onClick={() => setIsMuted(!isMuted)} size="icon" variant="outline" className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                  <Button onClick={() => setIsDarkMode(!isDarkMode)} size="icon" variant="outline" className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                    {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    
    </div>
  )
}