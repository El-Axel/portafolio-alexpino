"""Genera css/claro.css: el tema claro.
Lee style.css, sets.css e impresos.css, busca colores fijos pensados para fondo
oscuro y escribe la versión para fondo claro, solo bajo html[data-theme="light"].
Las "islas oscuras" (portada, claqueta, visor, sets, pantallas) no se tocan."""
import re,sys
ISL=".hero,.pre,.viewer,.stage,.screen,.sc-media,.tlx,.phone,.tv,.keys-box,.prog-stage,.mnu,.corte,.entry,.nxt-go,.crt"
ISL_SET=set(x.strip() for x in ISL.split(','))
def strip_comments(s): return re.sub(r'/\*.*?\*/','',s,flags=re.S)
def rules(css):
    # yields (selector, body) for top-level and inside @media (keeps media prefix)
    i=0;out=[]
    def parse(block,media):
        j=0
        while j<len(block):
            k=block.find('{',j)
            if k<0:break
            sel=block[j:k].strip()
            depth=1;m=k+1
            while depth and m<len(block):
                if block[m]=='{':depth+=1
                elif block[m]=='}':depth-=1
                m+=1
            body=block[k+1:m-1]
            if sel.startswith('@media'): parse(body,sel)
            elif sel.startswith('@'): pass
            else: out.append((media,sel,body))
            j=m
    parse(css,None);return out
INK=lambda a:f"rgba(15,28,31,{a})"
def swap(prop,val):
    p=prop.strip().lower()
    if p in('box-shadow','text-shadow','filter','-webkit-mask','mask','--reed','--sheen') or p.startswith('--'): return None
    v=val
    isbg=p.startswith('background')
    if isbg and ('gradient' in v and 'rgba(255,255,255' in v and not re.search(r'rgba\((11,19,21|10,20,22|5,12,13|12,22,24|244,241,234)',v)): return None
    def w(m):
        a=float(m.group(1));return INK(round(min(1,a*0.9 if not isbg else a*0.55),3))
    v=re.sub(r'rgba\(255,\s*255,\s*255,\s*([\d.]+)\)',w,v)
    v=re.sub(r'rgba\(244,\s*241,\s*234,\s*([\d.]+)\)',lambda m:INK(round(float(m.group(1))*(0.5 if isbg else 1),3)),v)
    v=re.sub(r'#F4F1EA\b','#0F1C1F',v,flags=re.I)
    if isbg:
        v=re.sub(r'rgba\((?:11,19,21|10,20,22|12,22,24|5,12,13|5,9,10),\s*([\d.]+)\)',lambda m:f"rgba(250,252,251,{min(.92,float(m.group(1))+.15):.2f})",v)
        v=re.sub(r'#0B1315\b|#0A1214\b|#05090a\b','#EEF2F0',v,flags=re.I)
    return v if v!=val else None
def notisl(sel):
    parts=[]
    for s in sel.split(','):
        s=s.strip()
        if not s: continue
        first=re.split(r'[\s>+~]',s)[0]
        if any(x in s.split(':')[0].split() or s.startswith(x) for x in ISL_SET) or re.match(r'^(\.hero|\.pre|\.viewer|\.stage|\.tv|\.phone|\.screen|\.tlx|\.sc-media|\.keys|\.prog-|\.prg|\.pslide|\.pframe|\.ptl|\.ptag|\.pyear|\.pc\b|\.pnum|\.ptitle|\.pcifra|\.plink|\.pmeta|\.ln|\.mnu|\.corte|html\[data-theme|html\.cutting|\.kin|\.lens-o|\.en-|\.entry|\.nxt-|\.crt|\.reel-word|\.rm-)',s): return None
        if s.startswith(('html','body',':root')):
            s=re.sub(r'^(html|:root)','',s).strip()
        pe=''
        m=re.search(r'(::?(before|after|placeholder|selection|-webkit-[a-z-]+))$',s)
        if m: pe=m.group(1); s=s[:m.start()]
        parts.append(f'html[data-theme="light"] {s}:not(:is({ISL}) *){pe}')
    return ',\n'.join(parts) if parts else None
out=[]
for f in sys.argv[1:-1]:
    css=strip_comments(open(f).read())
    for media,sel,body in rules(css):
        decls=[]
        for d in body.split(';'):
            if ':' not in d: continue
            p,v=d.split(':',1)
            nv=swap(p,v)
            if nv: decls.append(f'{p.strip()}:{nv.strip()}')
        if not decls: continue
        ns=notisl(sel)
        if not ns: continue
        r=f'{ns}{{{";".join(decls)}}}'
        out.append(f'{media}{{{r}}}' if media else r)
open(sys.argv[-1],'w').write('/* GENERADO por tools/gen_light.py — no editar a mano; los ajustes van en la sección 27 de style.css */\n'+'\n'.join(out)+'\n')
print(len(out),'reglas')
