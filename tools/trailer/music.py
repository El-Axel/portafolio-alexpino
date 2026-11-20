"""Música del tráiler (síntesis propia, sin derechos). Uso, desde la raíz del repo:  python3 tools/trailer/music.py
Necesita numpy, scipy y ffmpeg. Escribe assets/set/sfx/music.mp3 (32 s: pad Am-F-C-G, pulso, riser, golpe en «¿Quién soy?» y campanas en el logo).
Los tiempos coinciden con js/set.js (VID = 24,64 s; el logo prende a los ~27,1 s)."""
import os, subprocess, tempfile
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."))
os.chdir(tempfile.mkdtemp())
import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf
rng=np.random.default_rng(7)
SR=44100; DUR=32.0; N=int(SR*DUR)
t=np.arange(N)/SR
def env(a,b,c=None,d=None):
    pass
def smooth(x,a=0.02):
    return x
def adsr(t0,t1,att,rel):
    e=np.zeros(N); i0=int(t0*SR); i1=int(t1*SR)
    seg=np.arange(i1-i0)/SR; L=t1-t0
    e[i0:i1]=np.minimum(1,seg/att)*np.minimum(1,(L-seg)/rel)
    return e
def lp(x,fc,order=2):
    b,a=sg.butter(order,fc/(SR/2)); return sg.lfilter(b,a,x)
def hp(x,fc,order=2):
    b,a=sg.butter(order,fc/(SR/2),'high'); return sg.lfilter(b,a,x)
def bp(x,f1,f2):
    b,a=sg.butter(2,[f1/(SR/2),f2/(SR/2)],'band'); return sg.lfilter(b,a,x)
def note(f,t0,t1,att=2.0,rel=2.5,harm=7,det=.0016,tr=.0):
    L=np.zeros(N); R=np.zeros(N)
    e=adsr(t0,t1,att,rel)
    for k in (-1,0,1):
        ff=f*(1+k*det)
        ph=rng.uniform(0,6.28)
        s=sum(np.sin(2*np.pi*ff*h*t+ph*h)/h**1.1 for h in range(1,harm+1))
        pan=.5+k*.28
        L+=s*(1-pan); R+=s*pan
    return L*e,R*e
mid=lambda m:440*2**((m-69)/12)
A,Bf,C,D,E,F,G=[33,34,24,26,28,29,31]
def nm(name,o): 
    base={"A":9,"B":11,"C":0,"D":2,"E":4,"F":5,"G":7,"C#":1,"F#":6,"Bb":10}[name]
    return mid(12*(o+1)+base)
chords={
 "Am":[("A",2),("E",3),("A",3),("C",4),("E",4),("B",4)],
 "F":[("F",2),("C",3),("F",3),("A",3),("C",4),("G",4)],
 "C":[("C",2),("G",2),("E",3),("G",3),("C",4),("D",4)],
 "G":[("G",2),("D",3),("G",3),("B",3),("D",4),("A",4)],
 "A":[("A",2),("E",3),("A",3),("C#",4),("E",4),("B",4)],
}
prog=[("Am",0,6.6),("F",6.0,12.6),("C",12.0,18.6),("G",18.0,25.2),("A",25.0,32.0)]
padL=np.zeros(N); padR=np.zeros(N)
for name,t0,t1 in prog:
    for n,o in chords[name]:
        l,r=note(nm(n,o),t0,t1,att=2.2,rel=2.6,harm=6 if o<4 else 4)
        g=0.16 if o<3 else .11
        padL+=l*g; padR+=r*g
# cutoff swell via slow lowpass mix: blend dull/bright versions
def swell(x):
    dull=lp(x,500); bright=lp(x,2600)
    m=np.clip((t-2)/22,0,1)*0.8+0.1
    m=np.where(t>25,0.95,m)
    return dull*(1-m)+bright*m
padL=swell(padL); padR=swell(padR)
# deep drone
drone=np.sin(2*np.pi*55*t)*.5+np.sin(2*np.pi*110*t+.4)*.18+np.sin(2*np.pi*27.5*t)*.25
de=adsr(0,31,3.0,2.5); drone=drone*de*(0.8+0.2*np.sin(2*np.pi*.11*t))*.55
# heartbeat pulse
def thump(t0,vol=1.0,f0=95,f1=42,L=.28):
    i0=int(t0*SR); n=int(L*SR); tt=np.arange(n)/SR
    f=f1+(f0-f1)*np.exp(-tt*22); ph=2*np.pi*np.cumsum(f)/SR
    s=np.sin(ph)*np.exp(-tt*11)
    x=np.zeros(N); 
    if i0+n<=N: x[i0:i0+n]=s*vol
    return x
pulse=np.zeros(N)
bpm=76; beat=60/bpm
tt=4.3
while tt<24.2:
    vol=np.clip((tt-4.3)/10,0,1)*.55+.2
    pulse+=thump(tt,vol)+thump(tt+beat*.34,vol*.45)
    tt+=beat*2
# soft ticks (shaker-ish) from 10s to 24s
def tick(t0,vol):
    i0=int(t0*SR); n=int(.09*SR); x=np.zeros(N)
    nz=lp(hp(rng.standard_normal(n),5000),9500)*np.exp(-np.arange(n)/SR*45)*0.6
    if i0+n<=N: x[i0:i0+n]=nz*vol
    return x
ticks=np.zeros(N); tt=10.0
while tt<24.2:
    ticks+=tick(tt,.05+.05*np.clip((tt-10)/12,0,1)); tt+=beat/2
# riser 18.3->21.4
def riser(t0,t1):
    i0=int(t0*SR); i1=int(t1*SR); n=i1-i0; tt_=np.arange(n)/SR; L=t1-t0
    nz=rng.standard_normal(n)
    # swept bandpass via block processing
    out=np.zeros(n); blocks=60; bl=n//blocks
    for k in range(blocks):
        fc=300*(2**(k/blocks*4.2)); seg=nz[k*bl:(k+1)*bl if k<blocks-1 else n]
        b,a=sg.butter(2,[fc/(SR/2)*.8,min(.95,fc*1.35/(SR/2))],'band'); out[k*bl:k*bl+len(seg)]=sg.lfilter(b,a,seg)
    out*=(tt_/L)**2.2*np.minimum(1,(L-tt_)/.05+.0)
    x=np.zeros(N); x[i0:i1]=out; return x
ris=riser(18.4,21.3)*1.6
# big hit at 21.35 and logo hit at 27.15
def boom(t0,vol=1.0,L=3.2):
    i0=int(t0*SR); n=int(L*SR); tt_=np.arange(n)/SR
    f=34+90*np.exp(-tt_*9); ph=2*np.pi*np.cumsum(f)/SR
    s=np.sin(ph)*np.exp(-tt_*1.4)
    nz=lp(rng.standard_normal(n),1400)*np.exp(-tt_*5)*.35
    x=np.zeros(N); m=min(n,N-i0); x[i0:i0+m]=(s+nz)[:m]*vol; return x
hit1=boom(21.35,.9,2.6)
# bells (sine partial bells) at the logo
def bell(f,t0,vol,L=4.0):
    i0=int(t0*SR); n=int(L*SR); tt_=np.arange(n)/SR
    s=(np.sin(2*np.pi*f*tt_)+.4*np.sin(2*np.pi*f*2.76*tt_)*np.exp(-tt_*3)+.25*np.sin(2*np.pi*f*5.4*tt_)*np.exp(-tt_*6))*np.exp(-tt_*1.15)
    x=np.zeros(N); m=min(n,N-i0); x[i0:i0+m]=s[:m]*vol; return x
bells=np.zeros(N)
for k,(m,dt) in enumerate([(81,0),(88,.22),(93,.44),(100,.78),(105,1.2)]):
    bells+=bell(mid(m),27.15+dt,.05/(1+k*.12),3.5)
hit2=boom(27.15,1.0,3.8)
# logo riser (iris opening) 25.1->27.1 : tonal swell of A
def swellA(t0,t1):
    e=np.zeros(N); i0=int(t0*SR);i1=int(t1*SR); seg=np.arange(i1-i0)/SR; L=t1-t0
    e[i0:i1]=(seg/L)**2.4
    s=np.zeros(N)
    for m in (57,64,69,76,81):
        s+=np.sin(2*np.pi*mid(m)*t+rng.uniform(0,6.28))
    return s*e*.045
sw=swellA(25.1,27.15)
# reverb
ir_n=int(2.8*SR); itt=np.arange(ir_n)/SR
irL=rng.standard_normal(ir_n)*np.exp(-itt*2.2); irR=rng.standard_normal(ir_n)*np.exp(-itt*2.2)
irL=lp(irL,5000); irR=lp(irR,5000); irL[:int(.02*SR)]*=np.linspace(0,1,int(.02*SR)); irR[:int(.02*SR)]*=np.linspace(0,1,int(.02*SR))
def rev(x,ir): return sg.fftconvolve(x,ir)[:N]
wetsrcL=padL*.6+bells*1.0+hit2*.25+ris*.4+hit1*.3+sw
wetsrcR=padR*.6+bells*1.0+hit2*.25+ris*.4+hit1*.3+sw
wL=rev(wetsrcL,irL)*.018; wR=rev(wetsrcR,irR)*.018
drySt=drone+pulse*.9+ticks*.8+hit1*.7+hit2*.8+ris*.5+bells*.5+sw*.6
L=padL*.9+drySt+wL; R=padR*.9+drySt+wR
# master fades
mf=np.minimum(1,t/1.5)*np.minimum(1,(DUR-t)/2.5)
L*=mf; R*=mf
st=np.stack([L,R],1)
# gentle compress/limit
st=np.tanh(st*1.1)
pk=np.max(np.abs(st)); st=st/pk*0.82
wf.write("trailer.wav",SR,(st*32767).astype(np.int16))
print("peak ok",pk)

subprocess.run(["ffmpeg","-v","error","-y","-i","trailer.wav","-af","loudnorm=I=-16:TP=-2:LRA=9","-ar","44100","-c:a","libmp3lame","-b:a","112k",ROOT+"/assets/set/sfx/music.mp3"],check=True)
print("music.mp3 listo")
