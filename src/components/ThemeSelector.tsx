import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { THEME_OPTIONS, ThemeOption } from '../data/products';

interface ThemeSelectorProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj =
    THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change color palette / theme"
        className="h-10 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
          style={{ backgroundColor: activeThemeObj.accentColor }}
        />
        <span className="hidden sm:inline whitespace-nowrap">
          {activeThemeObj.name}
        </span>
        <Palette className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-3 z-50 animate-fadeIn">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-[var(--color-border)] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[var(--color-accent)]" />
              <span>Color Schemes</span>
            </span>
            <span className="text-[10px] text-[var(--color-text-subtle)]">
              Live Preview
            </span>
          </div>

          <div className="space-y-1.5">
            {THEME_OPTIONS.map((theme: ThemeOption) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-surface-subtle)] ring-1 ring-[var(--color-accent)]'
                      : 'hover:bg-[var(--color-surface-subtle)]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.previewColor }}
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[var(--color-text-main)] block">
                        {theme.name}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-subtle)] leading-tight block">
                        {theme.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
