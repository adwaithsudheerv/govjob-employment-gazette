import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  Send, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  GraduationCap, 
  Sun
} from 'lucide-react';
import { fetchSettings, updateSettings, testTelegram, sendMorningDigest, autoDetectChatId } from '../api/client';

export default function SettingsModal({ onClose, onSaveComplete }) {
  const [settings, setSettings] = useState({
    degree: 'BOTH',
    target_scope: 'ALL',
    experience_years: 0,
    skills: 'Python, SQL, Linux, Networking',
    telegram_bot_token: '',
    telegram_chat_id: '',
    telegram_alerts_enabled: false,
    email_alerts_enabled: false,
    alert_email: '',
    sync_interval_hours: 12,
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [detectingChatId, setDetectingChatId] = useState(false);

  const handleAutoDetect = async () => {
    setDetectingChatId(true);
    setStatusMessage({ type: '', text: '' });
    try {
      await updateSettings(settings);
      const res = await autoDetectChatId();
      setSettings(prev => ({ ...prev, telegram_chat_id: res.chat_id, telegram_alerts_enabled: true }));
      setStatusMessage({ type: 'success', text: res.message });
    } catch (e) {
      setStatusMessage({ type: 'error', text: e.message });
    } finally {
      setDetectingChatId(false);
    }
  };

  useEffect(() => {
    fetchSettings()
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage({ type: '', text: '' });
    try {
      await updateSettings(settings);
      setStatusMessage({ type: 'success', text: 'Gazette preferences saved successfully!' });
      setTimeout(() => {
        if (onSaveComplete) onSaveComplete(settings);
        onClose();
      }, 1000);
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Failed to update: ' + e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setStatusMessage({ type: '', text: '' });
    try {
      await updateSettings(settings);
      const res = await testTelegram();
      setStatusMessage({ type: 'success', text: res.message || 'Telegram test dispatch delivered successfully!' });
    } catch (e) {
      setStatusMessage({ type: 'error', text: e.message });
    } finally {
      setTestingTelegram(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border-2 border-[#1c1f33] shadow-[6px_6px_0px_0px_#1c1f33] p-6 sm:p-8 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 border border-[#1c1f33] bg-white hover:bg-[#1c1f33] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6 pr-10">
          <div className="p-2.5 border border-[#1c1f33] bg-[#fbf9f5] text-[#1c1f33]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Gazette Preferences & Telegram Alerts
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Configure degree scope, 8:00 AM morning digest, and automated Telegram bot integration.
            </p>
          </div>
        </div>

        {statusMessage.text && (
          <div className={`mb-5 p-3.5 border-2 text-xs flex items-center space-x-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#ecfdf5] border-[#065f46] text-[#065f46]'
              : 'bg-[#fef2f2] border-[#991b1b] text-[#991b1b]'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-bold">{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-6 text-xs text-[#1c1f33]">
          
          {/* Degree & Profile Preferences */}
          <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-[#065f46]" />
              <span>Academic Qualification & Ingestion Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#686f8a] block mb-1">Target Degree</label>
                <select
                  value={settings.degree}
                  onChange={(e) => setSettings({ ...settings, degree: e.target.value })}
                  className="w-full bg-white border border-[#1c1f33] px-3 py-2 text-xs text-[#1c1f33] focus:outline-none cursor-pointer"
                >
                  <option value="BOTH">Both BCA & MCA</option>
                  <option value="BCA">BCA Only (Bachelor Cadres)</option>
                  <option value="MCA">MCA Only (Officer / Master Cadres)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#686f8a] block mb-1">Background Ingestion Cycle</label>
                <select
                  value={settings.sync_interval_hours}
                  onChange={(e) => setSettings({ ...settings, sync_interval_hours: Number(e.target.value) })}
                  className="w-full bg-white border border-[#1c1f33] px-3 py-2 text-xs text-[#1c1f33] focus:outline-none cursor-pointer"
                >
                  <option value={6}>Every 6 Hours (Quarter-day)</option>
                  <option value={12}>Every 12 Hours (Half-day - Recommended)</option>
                  <option value={24}>Every 24 Hours (Daily)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Telegram Real-Time Job Alerts */}
          <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-[#1e3a8a]" />
                <span>Instant Telegram Gazette Dispatches (@Goverment_job_bot)</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.telegram_alerts_enabled}
                  onChange={(e) => setSettings({ ...settings, telegram_alerts_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#1c1f33] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1c1f33]"></div>
              </label>
            </div>

            <p className="text-[11px] font-serif italic text-[#383e5c]">
              Receive morning 8:00 AM recruitment briefs and immediate alerts when positions closing today are published.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#686f8a] block mb-1">Telegram Bot Token</label>
                <input
                  type="text"
                  value={settings.telegram_bot_token || ''}
                  onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
                  placeholder="e.g. 8992400103:AAF4nmCc..."
                  className="w-full bg-white border border-[#1c1f33] px-3 py-2 text-xs text-[#1c1f33] font-mono focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase text-[#686f8a] block">Your Telegram Chat ID</label>
                  <button
                    type="button"
                    onClick={handleAutoDetect}
                    disabled={detectingChatId}
                    className="text-[10px] text-[#065f46] hover:underline font-extrabold uppercase"
                  >
                    {detectingChatId ? 'Detecting...' : '⚡ Auto-Detect My Chat ID'}
                  </button>
                </div>
                <input
                  type="text"
                  value={settings.telegram_chat_id || ''}
                  onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
                  placeholder="Click 'Auto-Detect' after pressing Start on bot"
                  className="w-full bg-white border border-[#1c1f33] px-3 py-2 text-xs text-[#1c1f33] font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={async () => {
                  setStatusMessage({ type: '', text: '' });
                  try {
                    await updateSettings(settings);
                    const res = await sendMorningDigest();
                    setStatusMessage({ type: 'success', text: res.message });
                  } catch (e) {
                    setStatusMessage({ type: 'error', text: e.message });
                  }
                }}
                disabled={!settings.telegram_bot_token || !settings.telegram_chat_id}
                className="gazette-btn-outline px-3.5 py-1.5 text-xs flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Sun className="w-3.5 h-3.5 text-[#b45309]" />
                <span>Deliver Morning Digest to Telegram</span>
              </button>

              <button
                type="button"
                onClick={handleTestTelegram}
                disabled={testingTelegram || !settings.telegram_bot_token || !settings.telegram_chat_id}
                className="gazette-btn-ink px-3.5 py-1.5 text-xs flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testingTelegram ? 'Dispatching...' : 'Send Test Ping'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t-2 border-[#1c1f33]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-sans font-bold uppercase text-[#686f8a] hover:text-[#1c1f33] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="gazette-btn-ink px-6 py-2 text-xs uppercase"
          >
            {saving ? 'Recording...' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </div>
  );
}
