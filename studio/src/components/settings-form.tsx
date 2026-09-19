'use client';

import { useState } from 'react';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { request } from '@/lib/api';
import type { Settings } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SettingsFormProps {
  settings: Settings;
  due: number;
}

export function SettingsForm({ settings, due }: SettingsFormProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    draft.reviewEnabled !== settings.reviewEnabled ||
    draft.strictMode !== settings.strictMode ||
    draft.dailyCap !== settings.dailyCap;

  const save = async () => {
    setSaving(true);
    try {
      await request<{ settings: Settings }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(draft),
      });
      setSaved(true);
      window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  const renderToggle = (
    key: 'reviewEnabled' | 'strictMode',
    label: string,
    body: string,
    disabled = false,
  ) => (
    <button
      type="button"
      role="switch"
      aria-checked={draft[key]}
      disabled={disabled}
      onClick={() => setDraft({ ...draft, [key]: !draft[key] })}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors',
        disabled
          ? 'border-line opacity-40'
          : draft[key]
            ? 'border-primary/40 bg-primary/[0.06]'
            : 'border-line bg-panel/60 hover:border-primary/25',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors',
          draft[key] ? 'bg-primary/80' : 'bg-white/10',
        )}
      >
        <span
          className={cn(
            'size-4 rounded-full bg-background transition-transform',
            draft[key] && 'translate-x-4',
          )}
        />
      </span>

      <span className="min-w-0">
        <span className="block text-[13px] font-medium">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{body}</span>
      </span>
    </button>
  );

  return (
    <div className="space-y-4">
      {renderToggle('reviewEnabled', t('review.repeatSolved'), t('review.repeatSolvedNote'))}

      {renderToggle(
        'strictMode',
        t('review.strict'),
        t('review.strictNote'),
        !draft.reviewEnabled,
      )}

      {draft.strictMode && draft.reviewEnabled && (
        <p className="flex items-start gap-2 rounded-xl border border-medium/30 bg-medium/[0.06] p-3 text-xs leading-relaxed text-medium">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            {t('review.strictWarnLead')} <strong>{t('review.defer')}</strong>{' '}
            {t('review.strictWarnTail')}
          </span>
        </p>
      )}

      <div
        className={cn(
          'rounded-xl border border-line bg-panel/60 p-4',
          !draft.reviewEnabled && 'opacity-40',
        )}
      >
        <label htmlFor="daily-cap" className="block text-[13px] font-medium">
          {t('review.dailyCap')}
        </label>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {t('review.dailyCapNote')}
        </p>
        <Input
          id="daily-cap"
          type="number"
          min={1}
          max={40}
          value={draft.dailyCap}
          disabled={!draft.reviewEnabled}
          onChange={(event) => setDraft({ ...draft, dailyCap: Number(event.target.value) })}
          className="mt-3 h-8 w-24 text-[13px]"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={!dirty || saving}>
          {saving ? <Loader2 className="animate-spin" /> : saved ? <Check /> : null}
          {t('common.save')}
        </Button>
        {due > 0 && (
          <p className="text-xs text-muted-foreground">{t('review.dueRightNow', { count: due })}</p>
        )}
      </div>
    </div>
  );
}
