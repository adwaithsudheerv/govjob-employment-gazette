import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database
} from 'lucide-react';
import { fetchSyncLogs, triggerSync } from '../api/client';

export default function SyncControlModal({ onClose, onSyncComplete }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const loadLogs = async () => {
    try {
      const data = await fetchSyncLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    setMessage('Gazette live ingestion dispatched across Central, State, and Global feeds. Updating registry...');
    try {
      await triggerSync();
      setTimeout(async () => {
        await loadLogs();
        setSyncing(false);
        setMessage('Ingestion completed! Gazette updated.');
        if (onSyncComplete) onSyncComplete();
      }, 3500);
    } catch (e) {
      setMessage('Sync failed: ' + e.message);
      setSyncing(false);
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
        <div className="flex items-center space-x-3 mb-6 pr-10 border-b-2 border-[#1c1f33] pb-4">
          <div className="p-2.5 border border-[#1c1f33] bg-[#fbf9f5] text-[#1c1f33]">
            <RefreshCw className="w-5 h-5 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Gazette Ingestion & Feed Engine
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Automated 12-hour scheduler & live multi-source scraper status.
            </p>
          </div>
        </div>

        {/* Current Sync Schedule Info */}
        <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-[#1c1f33]">
              <Clock className="w-4 h-4 text-[#065f46]" />
              <span className="font-extrabold uppercase text-[10px]">Automatic Cycle:</span>
              <span className="font-mono font-bold text-[#065f46]">Every 12 Hours (Half-Day Cadence)</span>
            </div>
            <p className="text-[11px] font-serif italic text-[#686f8a]">
              Aggregates NIC, ISRO, C-DAC, BEL, SSC, IBPS, State PSCs & Global UN Agencies.
            </p>
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className={`gazette-btn-ink px-4 py-2 text-xs flex items-center space-x-2 shrink-0 ${
              syncing ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Ingesting Feeds...' : 'Force Sync Gazette'}</span>
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-[#ecfdf5] border border-[#065f46] text-xs font-bold text-[#065f46]">
            {message}
          </div>
        )}

        {/* Sync History Logs */}
        <h3 className="text-xs font-sans font-extrabold uppercase tracking-wider text-[#1c1f33] mb-3 flex items-center space-x-1.5">
          <Database className="w-4 h-4" />
          <span>Recent Ingestion Logs</span>
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs font-serif italic text-[#686f8a]">Loading sync history...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-xs font-serif italic text-[#686f8a]">No sync logs recorded yet.</div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {logs.map((log) => {
              const isSuccess = log.status === 'SUCCESS';
              const time = new Date(log.created_at).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={log.id}
                  className="p-3 bg-[#fbf9f5] border border-[#1c1f33]/30 text-xs flex items-start justify-between gap-3"
                >
                  <div className="flex items-start space-x-2.5">
                    {isSuccess ? (
                      <CheckCircle className="w-4 h-4 text-[#065f46] shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#991b1b] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-extrabold uppercase text-[11px] text-[#1c1f33]">
                        {log.source_name}
                      </div>
                      <p className="text-[11px] font-serif italic text-[#383e5c] mt-0.5">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-sans">
                    <span className="text-[10px] text-[#686f8a] block">{time}</span>
                    <span className="text-[10px] font-extrabold text-[#065f46]">
                      +{log.jobs_added} notices
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
