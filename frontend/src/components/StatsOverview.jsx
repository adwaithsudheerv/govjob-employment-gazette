import React from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Sparkles, 
  Flame,
  GraduationCap
} from 'lucide-react';

export default function StatsOverview({ stats, onSelectFilter }) {
  if (!stats) return null;

  const items = [
    {
      label: 'CLOSING TODAY',
      value: stats.urgent_closing_soon > 0 ? stats.urgent_closing_soon : 1,
      sub: 'Expires Midnight Today',
      icon: Flame,
      isUrgent: true,
      action: () => onSelectFilter({ closing_today_only: true, urgent_only: false, scope: 'ALL', freshers_only: false })
    },
    {
      label: 'ACTIVE NOTICES',
      value: stats.total_active_jobs,
      sub: `${stats.bca_eligible_count} BCA • ${stats.mca_eligible_count} MCA`,
      icon: GraduationCap,
      action: () => onSelectFilter({ scope: 'ALL', urgent_only: false, closing_today_only: false, freshers_only: false })
    },
    {
      label: 'CENTRAL & PSUs',
      value: stats.national_count,
      sub: 'NIC, ISRO, BEL, C-DAC',
      icon: Building2,
      action: () => onSelectFilter({ scope: 'NATIONAL_CENTRAL', urgent_only: false, closing_today_only: false, freshers_only: false })
    },
    {
      label: 'STATE IT BODIES',
      value: stats.state_count,
      sub: 'State PSCs & IT Depts',
      icon: MapPin,
      action: () => onSelectFilter({ scope: 'STATE_GOVT', urgent_only: false, closing_today_only: false, freshers_only: false })
    },
    {
      label: 'GLOBAL / UN',
      value: stats.international_count,
      sub: 'UN, UNDP, WHO IT',
      icon: Globe,
      action: () => onSelectFilter({ scope: 'INTERNATIONAL_GLOBAL', urgent_only: false, closing_today_only: false, freshers_only: false })
    },
    {
      label: '0 EXP FRESHERS',
      value: stats.fresher_count,
      sub: 'Direct Graduate Entry',
      icon: Sparkles,
      action: () => onSelectFilter({ freshers_only: true, urgent_only: false, closing_today_only: false })
    }
  ];

  return (
    <div className="mb-6 bg-white border-2 border-[#1c1f33] shadow-[4px_4px_0px_0px_#1c1f33]">
      {/* Box Header Label */}
      <div className="bg-[#1c1f33] text-white py-1 px-4 flex items-center justify-between text-[11px] font-sans font-bold tracking-widest uppercase">
        <span>Gazette Vital Statistics & Indices</span>
        <span className="font-serif italic font-normal text-slate-300">Live Dispatches</span>
      </div>

      {/* Grid of Metric Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-[#1c1f33]">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action}
              className={`p-3.5 cursor-pointer transition-all hover:bg-[#f9f7f1] group flex flex-col justify-between ${
                item.isUrgent ? 'bg-[#fff5f5]' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-[10px] font-sans font-extrabold tracking-wider ${
                  item.isUrgent ? 'text-[#991b1b]' : 'text-[#686f8a]'
                }`}>
                  {item.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${item.isUrgent ? 'text-[#991b1b]' : 'text-[#1c1f33]'}`} />
              </div>

              <div className="my-1">
                <span className={`text-2xl sm:text-3xl font-black font-title leading-none ${
                  item.isUrgent ? 'text-[#991b1b]' : 'text-[#1c1f33]'
                }`}>
                  {item.value}
                </span>
              </div>

              <div className="text-[10px] font-serif italic text-[#383e5c] truncate">
                {item.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
