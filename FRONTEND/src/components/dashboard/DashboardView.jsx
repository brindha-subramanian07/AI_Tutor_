import React from 'react';
import { WelcomeBanner } from './WelcomeBanner';
import { QuickTopicInput } from './QuickTopicInput';
import { ProgressOverview } from './ProgressOverview';
import { ContinueLearning } from './ContinueLearning';
import { RecommendedCard } from './RecommendedCard';
import { ActiveRoomsWidget } from './ActiveRoomsWidget';

export const DashboardView = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Section */}
      <WelcomeBanner />

      {/* 2. Large AI Tutor Topic Search / Input */}
      <QuickTopicInput />

      {/* 3. Learning Progress Overview */}
      <ProgressOverview />

      {/* 4. Continue Learning Grid */}
      <ContinueLearning />

      {/* 5 & 6. Two-Column Grid: Recommended For You & Learning Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendedCard />
        <ActiveRoomsWidget />
      </div>
    </div>
  );
};
