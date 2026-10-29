// Trade screenshots live in the private `attachments` bucket. The journal keeps each image's object URL as a stable
// id; screens show it through a short-lived signed URL, so a copied link stops working after an hour.
import { useEffect, useState } from 'react';
import type { Attachment } from '@/core/types';
import { supa } from './cloud';

const OBJ = 'https://dqjzufofmblerslcynzr.supabase.co/storage/v1/object/';
const TTL = 3600;

/** Object path inside the attachments bucket for a stored (public-form) or signed URL; null for anything else. */
export function attachmentPath(url: string | undefined): string | null {
  if (!url?.startsWith(OBJ)) return null;
  const m = /^(?:public|sign|authenticated)\/attachments\/([^?#]+)/.exec(url.slice(OBJ.length));
  if (!m) return null;
  try { return decodeURIComponent(m[1]); } catch { return null; }
}

const cache = new Map<string, { url: string; exp: number }>();

/** Image src per attachment id: a signed URL for bucket images, the inline data URL otherwise. */
export function useAttachmentSrcs(atts: Attachment[]): Record<string, string> {
  const [srcs, setSrcs] = useState<Record<string, string>>({});
  const sig = atts.map(a => a.id + (a.storageUrl ?? '')).join('|');
  useEffect(() => {
    let live = true;
    const now = Date.now() / 1000;
    const out: Record<string, string> = {};
    const need: { id: string; path: string }[] = [];
    for (const a of atts) {
      const path = attachmentPath(a.storageUrl);
      const c = path ? cache.get(path) : undefined;
      if (path && c && c.exp > now + 300) out[a.id] = c.url;
      else if (path) need.push({ id: a.id, path });
      else out[a.id] = a.dataUrl ?? '';
    }
    setSrcs(out);
    if (!need.length) return;
    void supa().storage.from('attachments').createSignedUrls(need.map(n => n.path), TTL).then(({ data }) => {
      if (!live || !data) return;
      const add: Record<string, string> = {};
      data.forEach((d, i) => {
        if (!d.signedUrl) return;
        cache.set(need[i].path, { url: d.signedUrl, exp: now + TTL });
        add[need[i].id] = d.signedUrl;
      });
      setSrcs(s => ({ ...s, ...add }));
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  return srcs;
}
