'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Check, Copy, ArrowRight, X, RefreshCw, BookOpen, GraduationCap } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  initialText?: string;
  defaultAction?: 'summary' | 'improve' | 'professional' | 'ats' | 'student_transform';
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialText = '',
  defaultAction = 'improve',
}) => {
  const [selectedAction, setSelectedAction] = useState<string>(defaultAction);
  const [inputText, setInputText] = useState<string>(initialText);
  const [studentRole, setStudentRole] = useState<string>('Software Developer');
  const [studentLevel, setStudentLevel] = useState<string>('Vocational High School (SMK)');
  const [toolsUsed, setToolsUsed] = useState<string>('HTML, CSS, JavaScript');
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      if (selectedAction === 'summary') {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_summary',
            payload: {
              role: studentRole,
              studentLevel,
              skills: toolsUsed.split(',').map((s) => s.trim()),
            },
          }),
        });
        const data = await res.json();
        setGeneratedResult(data.data?.summary || '');
      } else if (selectedAction === 'student_transform') {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'transform_experience',
            payload: {
              type: 'school_project',
              title: studentRole || 'Academic Project',
              rawDescription: inputText || 'I created a school website project using HTML, CSS, and JavaScript.',
              toolsUsed,
            },
          }),
        });
        const data = await res.json();
        const highlights = data.data?.highlights || [];
        setGeneratedResult(highlights.join('\n'));
      } else {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'improve_text',
            payload: {
              text: inputText || 'I worked on developing the frontend application',
              mode: selectedAction,
            },
          }),
        });
        const data = await res.json();
        setGeneratedResult(data.data?.result || '');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedResult('Spearheaded technical project execution utilizing modern development methodologies, ensuring high performance and responsive accessibility.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyToCV = () => {
    if (generatedResult) {
      onApply(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-white/90 shadow-2xl p-6 sm:p-8 bg-white/95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">CVGenie AI Assistant</h3>
              <p className="text-xs text-slate-500">Transform student potential into professional recruiter-ready prose.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {[
            { id: 'improve', label: 'Improve Text', icon: Wand2 },
            { id: 'professional', label: 'Make Professional', icon: BookOpen },
            { id: 'summary', label: 'Generate Summary', icon: Sparkles },
            { id: 'student_transform', label: 'Transform Project', icon: GraduationCap },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedAction === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedAction(item.id)}
                className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Additional contextual fields for Summary & Student Transform */}
        {selectedAction === 'summary' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Target Role / Track</label>
              <input
                type="text"
                value={studentRole}
                onChange={(e) => setStudentRole(e.target.value)}
                placeholder="e.g. Software Developer, UI/UX Designer"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Education Level</label>
              <select
                value={studentLevel}
                onChange={(e) => setStudentLevel(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="Vocational High School (SMK)">Vocational High School (SMK)</option>
                <option value="Senior High School (SMA)">Senior High School (SMA)</option>
                <option value="University Student">University Student</option>
                <option value="Fresh Graduate">Fresh Graduate</option>
              </select>
            </div>
          </div>
        )}

        {selectedAction === 'student_transform' && (
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Tools or Technologies Used (comma separated)</label>
            <input
              type="text"
              value={toolsUsed}
              onChange={(e) => setToolsUsed(e.target.value)}
              placeholder="e.g. HTML, CSS, JavaScript, PHP, MySQL, Figma"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        )}

        {/* Text Input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-700 mb-1 flex justify-between">
            <span>
              {selectedAction === 'summary'
                ? 'Key Notes / Background (Optional)'
                : selectedAction === 'student_transform'
                ? 'Your Raw Experience / Project Details'
                : 'Original Bullet Point / Description'}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Tell AI what you did in simple words</span>
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedAction === 'student_transform'
                ? 'Example: I created a school website project using HTML, CSS, and JavaScript for an assignment.'
                : 'Enter your draft description...'
            }
            className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Generate Action Button */}
        <div className="flex justify-end mb-5">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Professional Content</span>
              </>
            )}
          </button>
        </div>

        {/* Result Area */}
        {generatedResult && (
          <div className="border border-blue-100 bg-blue-50/50 rounded-2xl p-4 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> AI Recommendation
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line mb-4 font-normal">
              {generatedResult}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-blue-200/60">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyToCV}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <span>Apply to CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
