import React, { useState } from 'react';
import { 
  Film, Cpu, Heart, Activity, Zap, Compass, Sparkles, Video, Camera, 
  Award, Workflow, Eye, Layers, Sliders, Palette, Music, CheckCircle, 
  ShieldCheck, Play, Radio, Monitor, Clapperboard, Flame, Target, 
  Lightbulb, Shield, Briefcase, Scissors, Disc, Crosshair, Star
} from 'lucide-react';

export const AVAILABLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Film,
  Video,
  Clapperboard,
  Camera,
  Cpu,
  Workflow,
  Sparkles,
  Zap,
  Activity,
  Heart,
  Compass,
  Palette,
  Layers,
  Music,
  Award,
  Eye,
  Sliders,
  Scissors,
  Flame,
  Target,
  Lightbulb,
  Radio,
  Monitor,
  Disc,
  Crosshair,
  Star,
  Shield,
  ShieldCheck,
  CheckCircle,
  Briefcase
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const CurrentIcon = AVAILABLE_ICONS[value] || Film;

  const filteredIcons = Object.keys(AVAILABLE_ICONS).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-mono uppercase text-[#a8a6a1]">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Selected trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] hover:border-[#2563eb] transition-colors text-xs text-[#f1f2ed] w-full"
        >
          <div className="w-6 h-6 rounded-lg bg-[#2563eb]/30 border border-[#2563eb]/50 flex items-center justify-center text-[#f1f2ed]">
            <CurrentIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono">{value || 'Film'}</span>
          <span className="ml-auto text-[10px] text-[#706e6a] uppercase font-mono">
            {isOpen ? 'Close' : 'Change'}
          </span>
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1.5 z-50 w-full sm:w-80 p-3 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-2xl space-y-2.5">
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none focus:border-[#2563eb]"
            />

            <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredIcons.map((iconName) => {
                const IconComponent = AVAILABLE_ICONS[iconName];
                const isSelected = value === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                    title={iconName}
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-[#232323] text-[#a8a6a1] hover:text-[#f1f2ed] hover:bg-[#2b2b2b]'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
