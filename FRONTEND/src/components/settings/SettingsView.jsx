import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import {
  Settings,
  User,
  Volume2,
  VolumeX,
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  Play,
  Sun,
  Moon,
  Check
} from 'lucide-react';

export const SettingsView = () => {
  const {
    student,
    setStudent,
    speechEnabled,
    setSpeechEnabled,
    speechRate,
    setSpeechRate,
    speakText,
    addToast,
    theme,
    setTheme,
    toggleTheme
  } = useLearning();

  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email,
    department: student.department,
    semester: student.semester
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setStudent((prev) => ({
      ...prev,
      ...formData
    }));
    addToast('Profile preferences updated successfully!', 'success');
  };

  const handleTestVoice = () => {
    speakText("Welcome back, Dheepana. Your AI Tutor speech narration is functioning smoothly.");
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">
            Configuration Studio
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[#1E1B33] mt-0.5">
            Platform Settings & Student Preferences
          </h2>
          <p className="text-xs md:text-sm text-[#676282]">
            Personalize your student identity, AI voice playback settings, and visual ambiance.
          </p>
        </div>
      </div>

      {/* Visual Theme Selection (Light ☀️ vs Dark 🌙) */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#E6E8F6] pb-3">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#7C5CFC]" />
            <div>
              <h3 className="text-base font-bold text-[#1E1B33]">
                Visual Theme System
              </h3>
              <p className="text-xs text-[#676282]">
                Switch between modern soft blue light mode and deep navy dark mode
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F1EDFE] text-[#7C5CFC] border border-[#DCD3FC] capitalize">
            {theme} Mode Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Option */}
          <div
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              theme === 'light'
                ? 'border-[#2563EB] bg-[#EFF6FF]/60 shadow-snow-md'
                : 'border-[#E6E8F6] bg-[#FFFFFF] hover:border-[#BFDBFE]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-snow-sm">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172554]">
                    Light Theme ☀️
                  </h4>
                  <p className="text-xs text-[#475569]">
                    White, soft blue & subtle highlights
                  </p>
                </div>
              </div>
              {theme === 'light' && (
                <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#DBEAFE]">
              <div className="w-6 h-6 rounded-lg bg-[#2563EB]" title="Primary Blue #2563EB" />
              <div className="w-6 h-6 rounded-lg bg-[#60A5FA]" title="Soft Blue #60A5FA" />
              <div className="w-6 h-6 rounded-lg bg-[#DBEAFE]" title="Light Blue #DBEAFE" />
              <div className="w-6 h-6 rounded-lg bg-[#38BDF8]" title="Accent Cyan #38BDF8" />
              <div className="w-6 h-6 rounded-lg bg-[#FFFFFF] border border-[#DBEAFE]" title="White #FFFFFF" />
            </div>
          </div>

          {/* Dark Mode Option */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              theme === 'dark'
                ? 'border-[#3B82F6] bg-[#0B1F3A] shadow-snow-md text-[#F0F9FF]'
                : 'border-[#E6E8F6] bg-[#FFFFFF] hover:border-[#BFDBFE]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-white shadow-snow-sm">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">
                    Dark Theme 🌙
                  </h4>
                  <p className="text-xs opacity-75">
                    Deep navy, cyan accent & soft blue
                  </p>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[#1E3A5F]">
              <div className="w-6 h-6 rounded-lg bg-[#071426] border border-[#1E3A5F]" title="Background #071426" />
              <div className="w-6 h-6 rounded-lg bg-[#102A4C]" title="Card #102A4C" />
              <div className="w-6 h-6 rounded-lg bg-[#3B82F6]" title="Primary #3B82F6" />
              <div className="w-6 h-6 rounded-lg bg-[#22D3EE]" title="Cyan #22D3EE" />
              <div className="w-6 h-6 rounded-lg bg-[#60A5FA]" title="Bright Blue #60A5FA" />
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Form */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#E6E8F6] pb-3">
          <User className="w-5 h-5 text-[#7C5CFC]" />
          <h3 className="text-base font-bold text-[#1E1B33]">
            Student Profile Information
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                College Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                Academic Program / Degree
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1B33] mb-1">
                Semester Cohort
              </label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#E6E8F6] rounded-xl text-[#1E1B33] focus:outline-none focus:border-[#7C5CFC]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6846EB] text-white font-bold text-xs flex items-center gap-2 shadow-snow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Voice & Audio Narration Settings */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#E6E8F6] p-6 shadow-snow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E8F6] pb-3">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-[#7C5CFC]" />
            <div>
              <h3 className="text-base font-bold text-[#1E1B33]">
                AI Speech Narration Studio
              </h3>
              <p className="text-xs text-[#676282]">
                Web Speech API narration for interactive slides and AI tutor answers
              </p>
            </div>
          </div>

          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              speechEnabled
                ? 'bg-[#F1EDFE] text-[#7C5CFC] border-[#DCD3FC]'
                : 'bg-[#F8F9FE] text-[#676282] border-[#E6E8F6]'
            }`}
          >
            {speechEnabled ? 'Narration Active' : 'Muted'}
          </button>
        </div>

        {speechEnabled && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E1B33]">Speech Speed ({speechRate}x)</span>
              <button
                onClick={handleTestVoice}
                className="px-3 py-1 rounded-lg bg-[#F8F9FE] hover:bg-[#F0F2FA] text-xs font-semibold text-[#7C5CFC] border border-[#E6E8F6] flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Audio</span>
              </button>
            </div>

            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-[#7C5CFC] cursor-pointer"
            />
          </div>
        )}
      </div>

    </div>
  );
};
