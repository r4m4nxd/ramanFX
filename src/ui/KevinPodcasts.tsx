// Kevin's (FX Telepath) trading-psychology podcasts: links out to YouTube, newest list order as in his playlist.
import { useState } from 'react';
import { Collapsible } from './Collapse';
import { Icon } from './Icon';

const LIST = 'PL2X9oRVvYgoHpAlYMP-ISF486KEYsmJu6';
const EPISODES: [id: string, title: string, sec: number][] = [
  ['by3HikJQ0Gk', '5 Rules to Trading Success', 1124],
  ['hczHmSCX0mc', 'How Stoicism Builds Profitable Traders', 1863],
  ['bKlML3YcJBw', 'What is the Best Trading Strategy?', 1800],
  ['1lRqdAJmuBM', "Stoic Wisdom for Navigating Trump's Tariff Impact", 1140],
  ['9zUkEUt0kd8', "Why You Can't Stick to Your Trading Plan", 2127],
  ['8IJydjFZhao', 'Setting Realistic Expectations in Trading', 1632],
  ['kQ4iGdQzAhc', 'Do You Need A Trading Mentor?', 2023],
  ['zK_3D73vRk4', 'Become a Better Person - Become a Better Trader', 2552],
  ['SPmyIHYIh8U', '5 Things Beginner Traders MUST Focus on in 2026', 1875],
  ['BvIV-zrzPfs', 'Interview with a Trader on Mindset and Consistency', 3340],
  ['Lxr4WpPqxYY', 'Why Traders Keep Changing Trading Strategies', 1971],
  ['JOOYLY-yMV4', 'How to Handle Losing Streaks in Trading', 1860],
  ['knpHKV0wtHg', 'Stoic Approach to Trading Losses: Drawdowns as Data', 1876],
  ['XV4IHUqhKqE', 'Supply & Demand Trading is SUPERIOR to Other Strategies', 1504],
  ['axf8xEmhoUo', 'How to Stay Calm During War Market Volatility', 1923],
  ['8t-ZDmoRt2Y', 'Fundamental Analysis is BULLSH*T!', 1821],
  ['kv7Qj_gpIbc', 'How to Handle a Trading Drawdown the Right Way', 1147],
  ['il5c9Hp8x-s', 'Why Stoics Make Better Traders', 1642],
  ['YZsbitsu0h0', 'The Truth About Growing Small Trading Accounts', 1522],
];
const url = (id: string, i: number) => `https://www.youtube.com/watch?v=${id}&list=${LIST}&index=${i + 1}`;

export function KevinPodcasts() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible id="kevin-podcasts" title="Kevin's podcasts" pill={<span className="num text-[12px] text-ink3">{EPISODES.length}</span>}
      preview="Trading psychology · opens YouTube" open={open} onToggle={() => setOpen(o => !o)}>
      <a href={`https://www.youtube.com/playlist?list=${LIST}`} target="_blank" rel="noopener noreferrer" className="btn w-full h-10 mb-2"><Icon name="play" size={14} />Open the playlist</a>
      <ol className="flex flex-col gap-0.5">
        {EPISODES.map(([id, title, sec], i) => (
          <li key={id}>
            <a href={url(id, i)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-lg px-2 py-2 min-h-[44px] text-[13px] text-ink2 hover:bg-raised/60">
              <span className="num text-[11.5px] text-ink3 w-5 shrink-0">{i + 1}</span>
              <span className="min-w-0 flex-1 leading-snug">{title}</span>
              <span className="num text-[11.5px] text-ink3 shrink-0">{Math.round(sec / 60)}m</span>
            </a>
          </li>
        ))}
      </ol>
    </Collapsible>
  );
}
