import { Link } from 'react-router-dom';
import { MENTOR_CHECKS } from '@/core/lessonLinks';
import { VIDEO_LESSONS } from '@/core/videoLessons';
import { Icon } from './Icon';

/** "Study" chips: jump to the video lessons behind a screen or step. */
export function LessonChips({ nums, label = 'Study' }: { nums: number[]; label?: string }) {
  const ls = nums.map(n => VIDEO_LESSONS.find(l => l.n === n)).filter(Boolean) as typeof VIDEO_LESSONS;
  if (!ls.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="label mr-1">{label}</span>
      {ls.map(l => <Link key={l.n} to={`/learn?l=${l.n}`} className="chip"><Icon name="playbook" size={12} />{l.n}. {l.title}</Link>)}
    </div>
  );
}

/** The mentor's pre-trade checks for the given lessons (all lessons when omitted), each linked to its lesson. */
export function MentorChecks({ nums }: { nums?: number[] }) {
  const groups = MENTOR_CHECKS.filter(g => !nums || nums.includes(g.n));
  if (!groups.length) return null;
  return (
    <div className="flex flex-col gap-4">
      {groups.map(g => (
        <div key={g.n}>
          <Link to={`/learn?l=${g.n}`} className="text-[12.5px] font-semibold text-accent hover:underline">Lesson {g.n} · {g.title}</Link>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {g.items.map((it, i) => <li key={i} className="flex gap-2 text-[13px] text-ink2"><Icon name="check" size={13} className="mt-0.5 shrink-0 text-profit" />{it}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
