import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PomodoroSettingsModal({ isOpen, onClose, settings, setSettings, isDarkMode }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: parseInt(value) * 60 }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="focusDuration">Focus Duration (minutes)</Label>
            <Input
              id="focusDuration"
              name="focusDuration"
              type="number"
              value={settings.focusDuration / 60}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="shortBreakDuration">Short Break Duration (minutes)</Label>
            <Input
              id="shortBreakDuration"
              name="shortBreakDuration"
              type="number"
              value={settings.shortBreakDuration / 60}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="longBreakDuration">Long Break Duration (minutes)</Label>
            <Input
              id="longBreakDuration"
              name="longBreakDuration"
              type="number"
              value={settings.longBreakDuration / 60}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="longBreakInterval">Long Break Interval (sessions)</Label>
            <Input
              id="longBreakInterval"
              name="longBreakInterval"
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, longBreakInterval: parseInt(e.target.value) }))}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}