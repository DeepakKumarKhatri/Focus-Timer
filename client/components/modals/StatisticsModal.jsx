import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StatisticsModal({ isOpen, onClose, stats, isDarkMode }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const chartData = [
    { name: 'Sessions', value: stats.sessions },
    { name: 'Total Focus Time', value: Math.floor(stats.totalFocusTime / 60) },
    { name: 'Streak', value: stats.streak },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}>
        <DialogHeader>
          <DialogTitle>Statistics</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Total Sessions: {stats.sessions}</p>
          <p>Total Focus Time: {formatTime(stats.totalFocusTime)}</p>
          <p>Current Streak: {stats.streak} days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}