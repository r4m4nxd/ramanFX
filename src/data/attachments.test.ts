import { describe, expect, it } from 'vitest';
import { attachmentPath } from './attachments';

const B = 'https://dqjzufofmblerslcynzr.supabase.co/storage/v1/object';

describe('attachmentPath', () => {
  it('reads the object path from the stored public-form URL', () => {
    expect(attachmentPath(`${B}/public/attachments/u1/acc_7/a1.jpg`)).toBe('u1/acc_7/a1.jpg');
  });
  it('reads it from a signed URL too', () => {
    expect(attachmentPath(`${B}/sign/attachments/u1/acc_7/a1.jpg?token=x`)).toBe('u1/acc_7/a1.jpg');
  });
  it('decodes escaped characters', () => {
    expect(attachmentPath(`${B}/public/attachments/u1/acc%207/a1.jpg`)).toBe('u1/acc 7/a1.jpg');
  });
  it('ignores other buckets, other hosts and data URLs', () => {
    expect(attachmentPath(`${B}/public/crests/x.png`)).toBeNull();
    expect(attachmentPath('https://evil.example/storage/v1/object/public/attachments/u1/a.jpg')).toBeNull();
    expect(attachmentPath('data:image/png;base64,AAAA')).toBeNull();
    expect(attachmentPath(undefined)).toBeNull();
  });
});
