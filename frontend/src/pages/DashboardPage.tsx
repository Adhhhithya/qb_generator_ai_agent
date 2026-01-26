import React, { useState, useEffect } from 'react';
import IntroHeader from '../components/dashboard/IntroHeader';
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardAnalyticsPreview from '../components/dashboard/DashboardAnalyticsPreview';
import QuickActions from '../components/dashboard/QuickActions';
import RecentPapers from '../components/dashboard/RecentPapers';
import SystemStatusWidget from '../components/dashboard/SystemStatusWidget'; // New
import ActivityFeed from '../components/dashboard/ActivityFeed'; // New
import { fetchRecentPapers, type RecentPaper } from '../api/dashboard';

interface DashboardPageProps {
  setPage: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage }) => {
  const [recentPapers, setRecentPapers] = useState<RecentPaper[]>([]);

  useEffect(() => {
    fetchRecentPapers().then(setRecentPapers).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <IntroHeader userName="Adhithya" />
        <SystemStatusWidget />
      </div>

      {/* Stats - Interactive Flashcards */}
      <DashboardStats
        totalDrafts={12}
        totalFinalized={45}
        averageCoverage={78}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Analytics & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardAnalyticsPreview onViewFullReport={() => setPage('history')} />
          <RecentPapers papers={recentPapers} onOpen={(id) => console.log("Open paper", id)} />
        </div>

        {/* Right Column: Feed & Notifications */}
        <div className="lg:col-span-1 space-y-8">
          <QuickActions onAction={(action) => {
            if (action === 'createPaper') setPage('generate');
            if (action === 'drafts') setPage('drafts');
            if (action === 'finalized') setPage('finalized');
          }} />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
