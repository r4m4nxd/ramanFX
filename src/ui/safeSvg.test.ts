import { describe, expect, it } from 'vitest';
import { safeSvg } from '@/ui/LessonMedia';

const wrap = (inner: string, attrs = '') => `<svg viewBox="0 0 10 10"${attrs}>${inner}</svg>`;

describe('safeSvg', () => {
  it('keeps plain figures, gradients included', () => {
    const ok = wrap('<defs><linearGradient id="g"/></defs><rect fill="url(#g)" width="5" height="5"/><text x="1" y="2">Zone</text>');
    expect(safeSvg(ok)).toBe(ok);
  });

  it.each([
    ['script', wrap('<script>alert(1)</script>')],
    ['event handler', wrap('<rect onclick="alert(1)"/>')],
    ['entity-encoded javascript link', wrap('<a href="&#106;avascript:alert(1)"><text>x</text></a>')],
    ['link element with any href', wrap('<a href="/somewhere"><text>x</text></a>')],
    ['xlink:href', wrap('<a xlink:href="javascript:alert(1)"><text>x</text></a>')],
    ['animate rewriting href', wrap('<a><animate attributeName="href" values="javascript:alert(1)"/><text>x</text></a>')],
    ['set rewriting an attribute', wrap('<set attributeName="onmouseover" to="alert(1)"/>')],
    ['remote url() paint', wrap('<rect fill="url(https://evil.example/x.svg#a)"/>')],
    ['foreignObject', wrap('<foreignObject><div/></foreignObject>')],
    ['not an svg', '<div>hi</div>'],
  ])('drops %s', (_, markup) => {
    expect(safeSvg(markup)).toBeNull();
  });
});
