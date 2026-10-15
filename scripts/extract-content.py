"""Rebuild the typed, NFC-normalized slide content from the supplied DOCX."""
import json,re,unicodedata,zipfile,xml.etree.ElementTree as ET
from pathlib import Path
root=Path(__file__).resolve().parent.parent
with zipfile.ZipFile(root/'Noi_dung_Chu_de_7_da_bien_tap.docx') as z:
 ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
 doc=ET.fromstring(z.read('word/document.xml'))
 paragraphs=[unicodedata.normalize('NFC',''.join(t.text or '' for t in p.findall('.//w:t',ns))) for p in doc.findall('.//w:p',ns)]
sections=['mo-dau']*3+['khai-niem']+['dac-diem-1']*3+['dac-diem-2']*2+['dac-diem-3']*2+['dac-diem-4']*2+['dac-diem-5']*2+['chinh-sach']*3+['on-tap']*2
layouts={1:'title',2:'roadmap',3:'prompt',4:'concepts',5:'feature-map',7:'stats',9:'quote',12:'concepts',15:'stats',19:'quiz',20:'closing'}
source_ids=['tai-lieu-nhom','vnplus-2025-08-15','luat-2016','vnplus-2025-05-06','congbao-07-2026','bdttg-2026']
source_map={1:[0],2:[0],3:[2],4:[2],5:[0],6:[0],7:[1,2],8:[0,2],9:[0,2],10:[0,2],11:[2],12:[2],13:[0,2],14:[0,2],15:[3],16:[0,2],17:[4,5],18:[0,2],19:[0,2],20:[0,2]}
starts=[i for i,p in enumerate(paragraphs) if re.match(r'^\d{2}\. ',p)]
end=paragraphs.index('Thông tin nguồn để nhóm gắn vào web')
slides=[]
for n,start in enumerate(starts,1):
 block=paragraphs[start:(starts[n] if n<20 else end)]
 cut=block.index('Ghi chú và lời thuyết trình')
 points=block[2:cut]
 s=dict(id=f'{n:02}',section=sections[n-1],layout=layouts.get(n,'points'),title=block[0][4:],points=points,notes='\n'.join(block[cut+1:]),sourceIds=[source_ids[i] for i in source_map[n]])
 if n==1:
  s['title']=points[2]; s['points']=[points[0],points[1],points[3]]
 if n in (4,12):
  s['concepts']=[dict(zip(['term','definition'],p.split(': ',1))) for p in points];s['points']=[]
 if n==7:
  s['stats']=[{'value':16,'label':'tôn giáo'},{'value':43,'label':'tổ chức'},{'value':27.7,'decimals':1,'prefix':'Trên ','suffix':' triệu','label':'tín đồ'},{'value':30000,'prefix':'Gần ','label':'cơ sở thờ tự'}];s['asOf']='2025-08-15'
 if n==15:
  s['stats']=[{'value':2700,'prefix':'Hơn ','label':'đại biểu'},{'value':85,'label':'quốc gia và vùng lãnh thổ'}];s['asOf']='2025-05-06';s['mediaIds']=['vesak']
 if n==3: s['mediaIds']=['pagoda','church','caodai','mosque','altar','communal','temple']
 if n==6: s['mediaIds']=['pagoda','church','protestant','mosque','caodai','hoahao']
 if n==19:
  explanations=['Phân biệt tôn giáo và tổ chức.','Dựa vào giáo trình.','Dựa vào định nghĩa tín đồ.','Phân biệt phẩm vị với chức vụ.','Dựa vào Điều 6.']
  s['quiz']=[]
  for i,p in enumerate(points):
   m=re.match(r'Câu \d+\. (.*?) A\. (.*?) B\. (.*?) Đáp án ([AB])\.',p)
   q,a,b,answer=m.groups(); s['quiz'].append({'question':q,'options':[{'key':'A','text':a},{'key':'B','text':b}],'answer':answer,'explanation':explanations[i]})
  s['points']=[]
 slides.append(s)
assert len(slides)==20
out=root/'src/content/slides.ts'
out.write_text("// Generated from the supplied DOCX by scripts/extract-content.py.\nimport type { Slide } from './types';\nexport const slides: Slide[] = "+json.dumps(slides,ensure_ascii=False,indent=2)+';\n')
labels=['Tài liệu học tập do nhóm cung cấp','TTXVN/VietnamPlus · 15/08/2025','Luật Tín ngưỡng, tôn giáo 2016 · 02/2016/QH14','TTXVN/VietnamPlus · 06/05/2025','Công báo Chính phủ · Luật 07/2026/QH16','Bộ Dân tộc và Tôn giáo · Giới thiệu Luật 2026']
urls=[None]+[p for p in paragraphs[end:] if p.startswith('https:')]
sources=[dict(id=id,label=label,**({'url':url} if url else {})) for id,label,url in zip(source_ids,labels,urls)]
(root/'src/content/sources.ts').write_text("import type { Source } from './types';\nexport const sources: Source[] = "+json.dumps(sources,ensure_ascii=False,indent=2)+';\n')
print('Extracted 20 slides and 6 sources from DOCX.')
