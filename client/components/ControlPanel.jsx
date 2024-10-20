import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX, Moon, Sun } from 'lucide-react'

const ControlPanel = ({
  isRunning,
  toggleTimer,
  resetTimer,
  toggleFullscreen,
  isMuted,
  setIsMuted,
  isDarkMode,
  setIsDarkMode,
}) => {

  return (
    <motion.div
      className="fixed bottom-8 left-0 right-0 flex justify-center"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-wrap justify-center gap-2"
        >
          <Button
            onClick={toggleTimer}
            size="icon"
            variant="outline"
            className={`bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105`}
          >
            {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button
            onClick={resetTimer}
            size="icon"
            variant="outline"
            className={`bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105`}
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Button
            onClick={toggleFullscreen}
            size="icon"
            variant="outline"
            className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {document.fullscreenElement ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </Button>
          <Button
            onClick={() => setIsMuted(!isMuted)}
            size="icon"
            variant="outline"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            size="icon"
            variant="outline"
            className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default ControlPanel