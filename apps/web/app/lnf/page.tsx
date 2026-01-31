'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'

type Status = 'Lost' | 'Found'

type Item = {
  id: string
  title: string
  description: string
  location: string
  date: string
  status: Status
  image?: string
}

export default function LostFoundPage() {
  const [activeTab, setActiveTab] = useState<Status>('Lost')
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [image, setImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('lostFoundItems')
    if (stored) {
      setItems(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('lostFoundItems', JSON.stringify(items))
  }, [items])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: Item = {
      id: Date.now().toString(),
      title,
      description,
      location,
      date,
      status: activeTab,
      image,
    }
    setItems(prev => [newItem, ...prev])
    setTitle('')
    setDescription('')
    setLocation('')
    setDate('')
    setImage('')
  }

  const filteredItems = items.filter(item => item.status === activeTab)

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] p-6 md:p-12 text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Lost & Found</h1>
          <p className="text-[var(--text-secondary)]">Report lost or found items in our hostel premises</p>
        </motion.header>

        {/* Tab Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-full p-1 shadow-lg">
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-[var(--accent-violet)]"
              layoutId="activeTab"
              transition={{ type: "spring", bounce: 2, duration: 1.5 }}
              style={{
                width: 'calc(50% - 4px)',
                left: activeTab === 'Lost' ? '4px' : 'calc(50% + 2px)',
              }}
            />
            {(['Lost', 'Found'] as Status[]).map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2 rounded-full font-medium transition-all duration-300 z-10 ${
                  activeTab === tab
                    ? 'bg-[var(--accent-violet)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--accent-violet)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Report {activeTab} Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--secondary-bg)] border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent text-[var(--text-primary)]"
                  placeholder={`e.g., Black backpack`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--secondary-bg)] border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent text-[var(--text-primary)]"
                  rows={3}
                  placeholder="Describe the item in detail"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--secondary-bg)] border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent text-[var(--text-primary)]"
                    placeholder="e.g., Block A, Lobby"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--secondary-bg)] border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent text-[var(--text-primary)]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="w-full px-3 py-2 bg-[var(--secondary-bg)] border border-[var(--card-border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent text-[var(--text-primary)]"
                />
                {image && (
                  <div className="mt-2 relative inline-block">
                    <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-[var(--card-border)]" />
                    <button
                      onClick={() => {
                        setImage('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--accent-violet)] text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200 font-medium"
              >
                Submit Report
              </button>
            </form>
          </motion.div>

          {/* Items List */}
          <motion.div
            key={activeTab + '-list'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">{activeTab} Items</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <p className="text-[var(--text-muted)] text-center py-8">No {activeTab.toLowerCase()} items reported yet.</p>
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--secondary-bg)] border border-[var(--card-border)] rounded-lg p-4 flex items-start space-x-4"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg border border-[var(--card-border)]" />
                    ) : (
                      <div className="w-16 h-16 bg-[var(--secondary-bg)] border border-[var(--card-border)] rounded-lg flex items-center justify-center">
                        <span className="text-[var(--text-muted)] text-xs">No img</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text-primary)]">{item.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-1">{item.description}</p>
                      <div className="text-xs text-[var(--text-muted)]ext-muted)]">
                        <span>{item.location}</span> • <span>{item.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
