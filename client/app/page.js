"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX, Moon, Sun } from 'lucide-react'

export default function FocusTimer() {
  const [time, setTime] = useState(25 * 60) // Default to 25 minutes
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

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
      enterFullscreen()
    }
  }, [time])

  const pauseTimer = () => setIsRunning(false)
  const resumeTimer = () => setIsRunning(true)
  const resetTimer = () => {
    setIsRunning(false)
    setTime(25 * 60)
    exitFullscreen()
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

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg w-full max-w-md`}
          >
            <motion.h1 
              className={`text-4xl font-bold mb-6 text-center ${textColor}`}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              Focus Timer
            </motion.h1>
            <div className="mb-8">
              <Slider
                min={0}
                max={7200}
                step={1}
                value={[time]}
                onValueChange={(value) => setTime(value[0])}
                className="w-full mb-4"
              />
              <div className={`flex justify-between items-center ${textColor}`}>
                <div className="flex-1 mr-2">
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
                <div className="flex-1 mx-2">
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
                <div className="flex-1 ml-2">
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
              <Button onClick={startTimer} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Focus
              </Button>
              <Button onClick={() => setIsDarkMode(!isDarkMode)} size="icon" variant="outline">
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
              className={`text-9xl font-bold ${textColor}`}
            >
              {formatTime(time)}
            </motion.div>
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="fixed bottom-8 transform -translate-x-1/2 flex space-x-4"
                >
                  {isRunning ? (
                    <Button onClick={pauseTimer} size="icon" variant="outline">
                      <Pause className="h-6 w-6" />
                    </Button>
                  ) : (
                    <Button onClick={resumeTimer} size="icon" variant="outline">
                      <Play className="h-6 w-6" />
                    </Button>
                  )}
                  <Button onClick={resetTimer} size="icon" variant="outline">
                    <RotateCcw className="h-6 w-6" />
                  </Button>
                  <Button onClick={toggleFullscreen} size="icon" variant="outline">
                    {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                  </Button>
                  <Button onClick={() => setIsMuted(!isMuted)} size="icon" variant="outline">
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                  <Button onClick={() => setIsDarkMode(!isDarkMode)} size="icon" variant="outline">
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