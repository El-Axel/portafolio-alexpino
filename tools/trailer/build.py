"""Tráiler de «El set» (montaje.mp4). Uso, desde la raíz del repo:  python3 tools/trailer/build.py
Corta planos reales de assets/video/ (monitor-reel.mp4 y montaje.mp4), los une con fundidos a negro y gradúa.
Escribe assets/set/montaje.mp4. Si cambias duraciones, actualiza BEATS/SHOTS/TITLES/VID en js/set.js con lo que imprime."""
import subprocess, os, json, tempfile, shutil
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."))
R=ROOT+"/assets/video/"
WORK=tempfile.mkdtemp(); os.chdir(WORK)
M=R+"monitor-reel.mp4"; V=R+"montaje.mp4"
FPS=25
def sh(cmd): 
    r=subprocess.run(cmd,shell=True,capture_output=True,text=True)
    if r.returncode: print(r.stderr[-1500:]); raise SystemExit(1)
BASE="scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1"
def clip(name,src,ss,d,slow=1.0):
    vf=BASE
    if slow!=1.0: vf+=f",setpts={slow}*PTS,minterpolate=fps={FPS}:mi_mode=blend"
    else: vf+=f",fps={FPS}"
    sh(f'ffmpeg -v error -y -ss {ss} -t {d} -i "{src}" -vf "{vf}" -an -c:v libx264 -preset veryfast -crf 14 -pix_fmt yuv420p {name}.mp4')
def dur(f):
    return float(subprocess.check_output(f'ffprobe -v error -show_entries format=duration -of csv=p=0 {f}',shell=True))
def xf(out,a,b,t=.3):
    da=dur(a)
    sh(f'ffmpeg -v error -y -i {a} -i {b} -filter_complex "[0][1]xfade=transition=fade:duration={t}:offset={da-t:.3f},format=yuv420p" -c:v libx264 -preset veryfast -crf 14 {out}.mp4')
def dip(out,a,i=.4,o=.4):
    d=dur(a)
    sh(f'ffmpeg -v error -y -i {a} -vf "fade=t=in:st=0:d={i},fade=t=out:st={d-o:.3f}:d={o}" -c:v libx264 -preset veryfast -crf 14 -pix_fmt yuv420p {out}.mp4')
# beat 1 Telecafe: silueta + domo (en camara lenta suave)
clip("c1a",M,0,1.28,1.25); clip("c1b",M,2.72,1.28,1.25)
xf("b1x","c1a.mp4","c1b.mp4"); dip("b1","b1x.mp4")
# beat 2 Paisajes: molino + regadera
clip("c2a",V,1.6,1.44); clip("c2b",M,4.3,2.2)
xf("b2x","c2a.mp4","c2b.mp4"); dip("b2","b2x.mp4")
# beat 3 Austin
clip("c3",M,8.0,3.2); dip("b3","c3.mp4")
# beat 4 La Cepa + Pregon
clip("c4a",M,12.0,2.4); clip("c4b",M,16.0,2.4)
xf("b4x","c4a.mp4","c4b.mp4"); dip("b4","b4x.mp4")
# beat 5 campo (el titulo ¿Quien soy? va encima), cierra a negro lento
clip("c5",V,7.6,4.2); dip("b5","c5.mp4",.5,.9)
# negros
sh(f'ffmpeg -v error -y -f lavfi -i color=c=black:s=1280x720:r={FPS}:d=1.8 -c:v libx264 -preset veryfast -pix_fmt yuv420p k18.mp4')
sh(f'ffmpeg -v error -y -f lavfi -i color=c=black:s=1280x720:r={FPS}:d=1.6 -c:v libx264 -preset veryfast -pix_fmt yuv420p k16.mp4')
order=["k18","b1","k16","b2","k16","b3","k16","b4","b5"]
open("list.txt","w").write("".join(f"file '{o}.mp4'\n" for o in order))
t=0; marks=[]
for o in order:
    d=dur(o+".mp4"); marks.append((o,round(t,2),round(t+d,2))); t+=d
print(json.dumps(marks)); print("total",round(t,2))
# concat + grade final
grade="eq=contrast=1.07:saturation=1.06:gamma=0.98,colorbalance=rs=-.035:bs=.05:rm=-.01:bm=.03:rh=.035:bh=-.035,vignette=PI/5.5"
sh(f'ffmpeg -v error -y -f concat -safe 0 -i list.txt -vf "{grade}" -an -c:v libx264 -preset veryfast -crf 24 -maxrate 3500k -bufsize 7000k -pix_fmt yuv420p -movflags +faststart montaje.mp4')
shutil.copy("montaje.mp4",ROOT+"/assets/set/montaje.mp4"); print("size",os.path.getsize("montaje.mp4"))
