import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsModal({ isOpen, onClose, presets, addPreset, removePreset, currentTheme, setCurrentTheme, isDarkMode, setIsDarkMode }) {
  const [newPresetName, setNewPresetName] = useState('')
  const [newPresetDuration, setNewPresetDuration] = useState('')

  const handleAddPreset = () => {
    if (newPresetName && newPresetDuration) {
      addPreset(newPresetName, parseInt(newPresetDuration) * 60)
      setNewPresetName('')
      setNewPresetDuration('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select id="theme" value={currentTheme} onValueChange={setCurrentTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="ocean">Ocean</SelectItem>
                <SelectItem value="sunset">Sunset</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="darkMode" className="mr-2">Dark Mode</Label>
            <Button id="darkMode" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? 'Disable' : 'Enable'}
            </Button>
          </div>
          <div>
            <Label>Presets</Label>
            {presets.map((preset) => (
              <div key={preset.name} className="flex justify-between items-center p-1">
                <span>{preset.name} ({Math.floor(preset.duration / 60)} minutes)</span>
                <Button onClick={() => removePreset(preset.name)} variant="destructive">Remove</Button>
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="newPresetName">New Preset Name</Label>
            <Input
              id="newPresetName"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Enter preset name"
            />
          </div>
          <div>
            <Label htmlFor="newPresetDuration">New Preset Duration (minutes)</Label>
            <Input
              id="newPresetDuration"
              type="number"
              value={newPresetDuration}
              onChange={(e) => setNewPresetDuration(e.target.value)}
              placeholder="Enter duration in minutes"
            />
          </div>
          <Button onClick={handleAddPreset}>Add Preset</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}