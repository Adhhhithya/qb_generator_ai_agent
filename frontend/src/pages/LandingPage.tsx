import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Safe Landing Page</h1>
      <p className="mb-4">If you see this, the routing works and the crash was in the animation logic.</p>
      <button
        onClick={onGetStarted}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </button>
    </div>
  )
}
