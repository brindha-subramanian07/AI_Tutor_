import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../services/api';
import {
  X,
  User,
  Mail,
  Lock,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { student, setStudent, addToast } = useLearning();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Artificial Intelligence & Data Science',
    semester: 'Semester 6'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          semester: formData.semester
        });
        setStudent({
          ...student,
          name: res.user.name,
          email: res.user.email,
          department: res.user.department,
          semester: res.user.semester,
          avatar: res.user.avatar || student.avatar
        });
        addToast(`Welcome to AI Tutor, ${res.user.name}!`, 'success');
        onClose();
      } else {
        const res = await api.login(formData.email, formData.password);
        setStudent({
          ...student,
          name: res.user.name,
          email: res.user.email,
          department: res.user.department,
          semester: res.user.semester,
          avatar: res.user.avatar || student.avatar
        });
        addToast(`Signed in successfully as ${res.user.name}`, 'success');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Use demo account via Google or direct login
      const res = await api.googleAuth({
        email: 'dheepana.kn@college.edu',
        name: 'Dheepana K.N.',
        avatar: student.avatar
      });
      setStudent({
        ...student,
        name: res.user.name,
        email: res.user.email,
        department: res.user.department,
        semester: res.user.semester
      });
      addToast('Logged in as Dheepana K.N.', 'success');
      onClose();
    } catch (err) {
      setError('Could not connect to backend server. Make sure FastAPI backend is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FFFFFF] border border-[#DBEAFE] rounded-3xl p-6 md:p-8 shadow-snow-xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#F0F6FF] hover:bg-[#DBEAFE] text-[#64748B] hover:text-[#172554] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-snow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#172554]">
              {mode === 'login' ? 'Sign In to AI Tutor' : 'Create Student Account'}
            </h3>
            <p className="text-xs text-[#64748B]">
              {mode === 'login' ? 'Access your lectures and analytics' : 'Join your university AI learning platform'}
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-[#F0F6FF] p-1 border border-[#DBEAFE] text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#2563EB] text-white shadow-snow-sm'
                : 'text-[#64748B] hover:text-[#172554]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#2563EB] text-white shadow-snow-sm'
                : 'text-[#64748B] hover:text-[#172554]'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#9F1239] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#F43F5E]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#172554] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dheepana K.N."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#DBEAFE] rounded-xl text-[#172554] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#172554] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#DBEAFE] rounded-xl text-[#172554] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172554] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 text-xs md:text-sm bg-[#F8F9FE] border border-[#DBEAFE] rounded-xl text-[#172554] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#172554] mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#F8F9FE] border border-[#DBEAFE] rounded-xl text-[#172554] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#172554] mb-1">Semester</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#F8F9FE] border border-[#DBEAFE] rounded-xl text-[#172554] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-snow-md transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative border-t border-[#DBEAFE] pt-3 text-center">
          <span className="text-[11px] text-[#64748B] block mb-2">Or continue with 1-click Google OAuth:</span>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl border border-[#DBEAFE] bg-[#F8F9FE] hover:bg-[#EFF6FF] text-xs font-bold text-[#172554] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <span>Fast Sign In as Dheepana (Demo Google Account)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
