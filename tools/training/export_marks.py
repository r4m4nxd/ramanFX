#!/usr/bin/env python3
"""Pull the owner's "Train my eye" marks (Supabase rfx_training_marks) into the test fixture
src/core/training/fixtures/marks.json, which src/core/trainingFixtures.test.ts scores against the engine.

Runs in GitHub Actions only (.github/workflows/training-export.yml): the service-role key comes from the environment
(SUPABASE_SERVICE_ROLE_KEY secret) and is never written anywhere or shipped to the client.

  SUPABASE_URL=https://dqjzufofmblerslcynzr.supabase.co SUPABASE_SERVICE_ROLE_KEY=... python3 tools/training/export_marks.py
  python3 tools/training/export_marks.py --from training-marks-2026-10-30.json   # from the page's Export JSON instead
  python3 tools/training/export_marks.py --rows rows.json   # raw table rows (Supabase MCP: select json_agg(r) ...)
"""
import argparse
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'src' / 'core' / 'training' / 'fixtures' / 'marks.json'
DEFAULT_URL = 'https://dqjzufofmblerslcynzr.supabase.co'


def from_rows(rows):
    charts = []
    for r in rows:
        marks = r.get('marks') or {}
        charts.append({
            'id': r['id'], 'symbol': r['symbol'], 'tf': r['tf'],
            'market': marks.pop('market', 'fx') if isinstance(marks, dict) else 'fx',
            'cls': marks.pop('cls', '') if isinstance(marks, dict) else '',
            'as_of': r['as_of'], 'bars_hash': r['bars_hash'], 'bars': r.get('bars') or [],
            'marks': marks, 'note': r.get('note') or '', 'created_at': r['created_at'], 'updated_at': r['updated_at'],
        })
    return charts


def pull(url, key):
    req = urllib.request.Request(
        f'{url}/rest/v1/rfx_training_marks?select=*&order=created_at.asc',
        headers={'apikey': key, 'Authorization': f'Bearer {key}', 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as res:
        return from_rows(json.load(res))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--from', dest='src', help="the Train page's Export JSON file instead of the database")
    ap.add_argument('--rows', help='raw rfx_training_marks rows as JSON (e.g. select json_agg(r) via the Supabase MCP)')
    ap.add_argument('--out', default=str(OUT))
    a = ap.parse_args()
    if a.rows:
        charts = from_rows(json.loads(Path(a.rows).read_text()))
    elif a.src:
        charts = json.loads(Path(a.src).read_text())['charts']
    else:
        key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        if not key:
            sys.exit('SUPABASE_SERVICE_ROLE_KEY is not set (GitHub Actions secret); or pass --from <export.json>')
        charts = pull(os.environ.get('SUPABASE_URL', DEFAULT_URL).rstrip('/'), key)
    charts.sort(key=lambda c: (c['symbol'], c['tf'], c['as_of']))
    out = {'version': 1, 'exported_at': datetime.now(timezone.utc).isoformat(timespec='seconds'),
           'note': "The owner's marked charts (tools/training/export_marks.py).", 'charts': charts}
    Path(a.out).write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
    print(f'{len(charts)} marked chart(s) -> {a.out}')


if __name__ == '__main__':
    main()
