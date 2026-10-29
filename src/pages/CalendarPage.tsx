import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAnalytics } from '@/data/derived';
import { Card, Page, Tabs } from '@/ui/kit';
import { MonthCalendar } from '@/ui/MonthCalendar';
import { YearCalendar } from '@/ui/YearCalendar';
import { Spotlight } from '@/ui/Heatmap';

export default function CalendarPage() {
  const { stats } = useAnalytics();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const view = (params.get('view') as 'year' | 'month') || 'year';
  const years = useMemo(() => [...new Set(stats.days.map(d => +d.date.slice(0, 4)))].sort(), [stats.days]);
  const [year, setYear] = useState(years[years.length - 1] ?? new Date().getFullYear());
  const [focusMonth, setFocusMonth] = useState<Date | undefined>(undefined);
  return (
    <Page>
      <Tabs label="Calendar view" value={view} onChange={v => setParams({ view: v }, { replace: true })} options={[{ value: 'year', label: 'Year' }, { value: 'month', label: 'Month' }]} />
      {view === 'year' ? (
        <Card className="p-0 luxe-border"><Spotlight className="p-5 md:p-7 rounded-xl">
          <YearCalendar days={stats.days} year={year} onYear={setYear} onMonth={m => { setFocusMonth(new Date(year, m, 1)); setParams({ view: 'month' }, { replace: true }); }} />
        </Spotlight></Card>
      ) : (
        <Card><MonthCalendar key={focusMonth?.getTime()} days={stats.days} initial={focusMonth} onDay={d => nav(`/journal?day=${d}`)} /></Card>
      )}
    </Page>
  );
}
