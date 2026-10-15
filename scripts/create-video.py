"""Render a silent 48-second introductory illustration video from local original artwork."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess, textwrap
root=Path(__file__).resolve().parent.parent
out=Path('/tmp/ktct-video');out.mkdir(exist_ok=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
scenes=[('pagoda','Đặc điểm của tôn giáo ở Việt Nam'),('church','Đa dạng niềm tin'),('communal','Gắn bó cộng đồng'),('altar','Không đồng nhất mọi hình thức thờ cúng với việc theo một tôn giáo.'),('vesak','Tôn trọng khác biệt'),('caodai','Đồng hành cùng dân tộc.')]
for i,(name,title) in enumerate(scenes):
 im=Image.new('RGB',(1280,720),'#f6f1e7');img=Image.open(root/f'public/media/{name}.webp').convert('RGB');img=img.resize((800,600));im.paste(img,(480,60));d=ImageDraw.Draw(im)
 d.rectangle((0,0,480,720),fill='#f6f1e7');d.rectangle((48,165,104,169),fill='#9e2a2b')
 d.text((48,94),'NHÓM 7 · CHỦ ĐỀ 07',font=ImageFont.truetype(font,18),fill='#9e2a2b')
 f=ImageFont.truetype(font,33 if len(title)<65 else 28)
 lines=[];line=''
 for w in title.split():
  cand=(line+' '+w).strip()
  if d.textlength(cand,font=f)>370:lines.append(line);line=w
  else:line=cand
 lines.append(line)
 for j,line in enumerate(lines):d.text((48,215+j*52),line,font=f,fill='#3c2a20')
 d.text((48,600),'Chủ nghĩa xã hội khoa học',font=ImageFont.truetype(font,17),fill='#74634b')
 d.text((48,670),f'0{i+1} / 06    ·    MINH HỌA GỐC — KHÔNG PHẢI PHIM TƯ LIỆU',font=ImageFont.truetype(font,12),fill='#74634b')
 still=out/f'{i}.png';im.save(still)
 if i==0:im.save(root/'public/media/video-poster.webp',quality=88)
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-loop','1','-i',str(still),'-vf',"scale=1320:744,zoompan=z='min(zoom+0.00012,1.023)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=192:s=1280x720:fps=24,fade=t=in:st=0:d=0.4,fade=t=out:st=7.6:d=0.4",'-t','8','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-threads','2',str(out/f'{i}.mp4')],check=True)
(out/'concat.txt').write_text('\n'.join(f"file '{out}/{i}.mp4'" for i in range(6)))
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(out/'concat.txt'),'-c','copy','-movflags','+faststart',str(root/'public/media/mo-dau.mp4')],check=True)
def ts(s):return f'00:00:{s:02d}.000'
(root/'public/media/mo-dau.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{ts(i*8)} --> {ts((i+1)*8)}\n{title}' for i,(_,title) in enumerate(scenes))+'\n')
print('Created local H.264 MP4, 48s, 1280×720, 24fps, captions and poster.')
