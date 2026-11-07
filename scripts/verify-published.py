"""Verify live studio routes and the existing direct privacy URL."""
import hashlib,json,urllib.request
from pathlib import Path
base='https://abodengames.com/'
def get(path):
 with urllib.request.urlopen(urllib.request.Request(base+path,headers={'User-Agent':'Aboden-studio-verifier'}),timeout=30) as r:
  assert r.status==200
  return r.read()
for path in ['','games/','studio/','team/','support/','contact/','games/dahrooj-quest/','games/mafateeh/','play/bawwabat/','games/battleship/','play/battleship/','roblox/']:
 body=get(path).decode();assert 'عبودين قيمز' in body;assert 'github.com/' not in body
 print('VERIFIED',path or '/')
original=json.loads(Path('migration/destination-original-sha256.json').read_text())
for path in ['dahrooj-privacy.html','privacy-policies/dahrooj-meta-quest.html']:
 assert hashlib.sha256(get(path)).hexdigest()==original['dahrooj-privacy.html']
 print('VERIFIED exact preserved policy',path)
