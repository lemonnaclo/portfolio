from pathlib import Path
from html import escape as esc
import json

ROOT = Path(__file__).resolve().parents[1]

class Project:
    def __init__(self, id, slug, name):
        self.id,self.slug,self.name=id,slug,name
        self.regions=[]
        self.body=[]
    def art(self,page,x,y,w,h,label):
        return self.image(f'./projects/{self.id}/assets/authored-layout/page-{page:02}.png',3200,2267,x,y,w,h,label)
    def original(self,number,label):
        f=next((ROOT/'projects'/self.id/'assets/high-res').glob(f'original-{number:02}-*'))
        data=json.loads((ROOT/'projects'/self.id/'project.json').read_text(encoding='utf-8'))
        record=next(item for item in data['media'] if item.get('path')=='high-res/'+f.name)
        sw,sh=record['width'],record['height']
        return self.image('./'+f.relative_to(ROOT).as_posix(),sw,sh,0,0,sw,sh,label)
    def image(self,src,sw,sh,x,y,w,h,label):
        assert x>=0 and y>=0 and x+w<=sw and y+h<=sh, (src,x,y,w,h)
        i=len(self.regions)
        self.regions.append(dict(src=src,sw=sw,x=x,y=y,w=w,h=h,label=label))
        load='fetchpriority="high"' if i==0 else 'loading="lazy"'
        return f'<button class="crop-button" type="button" data-art="{i}" aria-label="{esc(label)} 확대"><span class="crop" style="aspect-ratio:{w}/{h}"><img src="{src}" alt="{esc(label)}" {load} decoding="async" style="width:{sw/w*100:.8f}%;left:{-x/w*100:.8f}%;top:{-y/h*100:.8f}%"></span></button>'
    def add(self,*s):self.body.extend(s)
    def save(self,links):
        nav=''.join(f'<a href="#{id}">{text}</a>' for id,text in links)
        html=f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="전아영의 {self.name} 디자인 작업. 작품 소개, 디자인 콘셉트와 이미지."><title>{self.name} — Jun Ayoung</title>
<link rel="canonical" href="https://lemonnaclo.github.io/portfolio/{self.slug}.html">
<link rel="stylesheet" href="./pillowman.css?v=20261116-2"><link rel="stylesheet" href="./editorial.css?v=20261116-1"><script src="./editorial.js?v=20261116-1" defer></script></head>
<body class="{self.slug}"><a class="skip-link" href="#editorial-main">본문으로 건너뛰기</a><article id="web-project"><a class="back-to-works" href="./works.html#projects">← 전체 작업</a><nav class="project-nav" aria-label="작업 목차">{nav}</nav><main id="editorial-main">{''.join(self.body)}</main><footer class="project-footer"><span>{self.name} · 전아영</span><a href="#overview">맨 위로 ↑</a></footer></article>
<dialog id="art-dialog" aria-labelledby="art-label"><header><span id="art-label"></span><button id="art-zoom" type="button" aria-pressed="false">더 크게 보기</button><button id="art-close" type="button" autofocus>닫기 ×</button></header><div id="art-scroll"><div id="art-target"></div></div></dialog>
<script id="region-data" type="application/json">{json.dumps(self.regions,ensure_ascii=False)}</script></body></html>'''
        (ROOT/f'{self.slug}.html').write_text(html,encoding='utf-8')
        print(self.slug,len(self.regions),'artwork regions')

def title(h,p=''):return f'<header class="section-title"><h2>{h}</h2><p>{p}</p></header>'
def figure(art,caption):return f'<figure>{art}<figcaption>{caption}</figcaption></figure>'
def principles(items):
    return '<ol class="principles">'+''.join(f'<li><h3>{h}</h3>'+''.join(f'<p>− {esc(p)}</p>' for p in paras)+'</li>' for h,paras in items)+'</ol>'

p=Project('stage-living-double-life','living-double-life','살아있는 이중생 각하')
p.add('<section id="overview">',p.art(3,0,0,3200,1750,'살아있는 이중생 각하 공연 전경'),'''<div class="cover-info pad"><div><p class="author">작 오영진</p><h1 class="project-name">살아있는 이중생 각하</h1><div class="credits"><p>2022-1 제작공연 | 중앙대학교 공연예술원 SPACE 1959 | 연출 황윤진</p><p>지도 교수 이진석</p><p>공동 무대 디자인 전아영 · 우채원</p></div></div><div class="synopsis"><p>1949년 해방 직후의 서울 종로</p><p>친일파 이중생은 광복 후에도 미국에 들러붙어 사기를 치며 더 많은 재산을 모은다. 어느 날 이중생의 집에는 반민특위가 들이닥치고 그 동안의 수많은 죄로 인해 입건된다. 하지만 최변호사의 도움으로 가석방되고, 재산 몰수 위기에 맞닥뜨리자 이를 지키기 위해 위장 자살극을 꾸며 거짓 초상을 치른다. 그러나 계획을 그가 원하는 대로 흘러가지 않았고, 모든 재산을 잃게 된 이중생은 결국 자살을 택한다.</p></div></div></section>''')
p.add('<section id="design-concept" class="photo-concept">',p.original(2,'디자인 컨셉 공연 사진'),'''<div class="photo-copy"><h2>디자인 컨셉</h2><p>광복 직후 시대적 배경의 고증을 통해 ‘한양 절충식’ 한옥을 재현하였다. 온돌방과 다다미방을 ‘ㄱ’ 자형으로 배치하고, 온돌방의 벽 중앙에 일본식 원형문을 끼워 넣어 이질적인 느낌을 만들었다. 이는 친일파인 주인공 '이중생'의 인물 특성을 반영하기 위해, 전통 한옥에 일본적 요소를 더해 공간의 이중성을 표현하고자 한 것이다.</p><p>이중생은 탐욕스럽고 교양이 부족한 인물로, 재산은 많지만 안목이 부족하다는 점을 그의 집 내부 공간(무대) 디테일을 통해 관객에게 보여주고자 했다. 집의 분위기는 호화롭지만 격조가 없도록, 서양식 전식과 일본풍 대나무 정원, 한국적인 문 등과 같이 여러 양식적 구조를 뒤섞었다. 이는 비싼 물건을 사들여 과시하려는 의도는 뚜렷하지만, 미감의 부족으로 인해 정돈되지 않은 느낌을 강조하기 위한 것이다.</p></div></section>''')
p.add('<section id="model"><div class="black">',title('CONCEPT','3D 모델링 · Sketchup Pro _ 스케치업'),p.art(5,0,220,3200,1000,'스케치업 무대 3D 모델링'),'</div><div class="two-up model-concepts pad"><div>',figure(p.art(5,31,1312,1568,545,'무대 모델링 낮 장면'),'낮 장면'),'<h3 class="row-title">A. 절충식 가옥 구조</h3>',principles([('1) 전통 한옥 + 왜색적 소재',['전통 한옥 (창 / 툇마루 / 사랑채 구조)','왜색적 소재 (원형문 / 다다미방 / 대나무 정원)']),('2) 색감 차이',['한옥 내부의 목재는 전체적으로 엠버톤','원형문 창살은 짙은 고동색으로 마감'])]),'</div><div>',figure(p.art(5,1627,1312,1545,545,'무대 모델링 밤 장면'),'밤 장면'),'<h3 class="row-title">B. 호화롭지만 격조 없는 분위기</h3>',principles([('1) 혼란스러운 배치(대도구 / 전식)',['통일성과 미감의 부족으로 인해 배치가 조화롭지 못함']),('2) 불균형과 과도함',['한국식 창과 일식 문양 창이 섞여 내부에서도 색과 스타일이 충돌'])]),'</div></div></section>')
p.add('<section id="circulation" class="pad">',title('C. 등퇴장로',"극 중 이야기가 전개되는 주 공간: '사랑채 - 툇마루 - 마당'"),'<div class="circulation-refs">')
for h,desc,box in [('1) 원형문','[무대 중앙] 온돌방과 후원(대나무 정원)을 이어주는 통로',(152,244,1085,308)),('2) 한국식 대문','[하수] 집 외부의 공간을 이어주는 통로',(1265,246,326,305)),('3) 한국식 일각문','[상수] 마당에서 안채로 통하는 통로',(1618,246,308,305)),('[세트 사진]','',(2007,246,1045,308))]:
    p.add(f'<figure><figcaption><h3>{h}</h3><p>{desc}</p></figcaption>',p.art(6,*box,h+' 참고 이미지'),'</figure>')
p.add('</div><div class="two-up circulation-plans">',figure(p.art(6,358,658,1106,1380,'동선이 표시된 무대 탑뷰 · 온돌방, 다다미방, 마당, 후원, 외부, 안채'),'Top View (Render)'),figure(p.art(6,1708,655,1224,1384,'무대 동선 평면도'),'Ground Plan'),'</div></section>')
p.add('<section id="drawings" class="black pad">',title('DWG','도면 · AutoCAD 2022'),'<div class="two-up living-drawings">')
for (x,y,w,h),label in zip([(264,144,1304,925),(1627,144,1307,925),(264,1180,1304,925),(1627,1180,1307,925)],['01 Ground Plan','02 Plan 1','05 Section B','06 Wall Plan / Elevation C']):p.add(figure(p.art(7,x,y,w,h,label),label))
p.add('</div></section><section id="stage" class="black quote-photo"><blockquote>“이중생씨의 안사랑채. 온돌방에 연달아 일본식 다다미방이 조금 보인다. 8.15 이전에 흔히 우리들이 볼 수 있던 소위 화선절충식 주택이다. 후경은 우리 주인공이 늘상 사랑하여 마지않는 정원이다. 석등롱뿐 아니라 어렴풋이 정자까지 바라보이니 가히 호화로운 구조를 짐작할 수 있다.”</blockquote>',p.original(11,'공연 사진 · 이중생의 안사랑채'),'<blockquote>“방안에 놓인 화초분 등 어느 것 하나 값진 물건 아닌 것이 없으나<br>왜 그런지 공연히 번거롭고 몰취미해서 풍류의 맛이란 도시 찾아볼 수 없다.”</blockquote></section>')
for page in [9,10,11]:
    p.add(f'<section id="photos-{page}" class="photo-grid pad" aria-label="공연 사진 {page-8}">')
    # The original four-photo editorial grid, rearranged into one column on small windows.
    boxes={9:[(56,124,1546,875),(1628,124,1518,875),(56,1018,1546,875),(1628,1018,1518,875)],10:[(56,124,1546,887),(1628,124,1518,887),(56,1034,1546,892),(1628,1034,1518,892)],11:[(56,124,1528,866),(1610,124,1528,866),(56,1008,1528,888),(1610,1008,1528,888)]}[page]
    for i,box in enumerate(boxes):p.add(p.art(page,*box,f'공연 사진 {page-8} · {i+1}'))
    p.add('</section>')
p.save([('overview',p.name),('design-concept','CONCEPT'),('model','3D'),('circulation','PLAN'),('drawings','DWG'),('stage','STAGE')])

p=Project('production-normal-business','normal-business','정상영업 합니다')
p.add('<section id="overview">',p.art(28,0,0,3200,1787,'정상영업 합니다 · 2022년 상가 전경'),'''<div class="cover-info pad"><div><p class="author">Apocalypse Project</p><h1 class="project-name">정상영업 합니다</h1><div class="credits"><p>2022-2 공연영상디자인(2) | 아포칼립스 프로젝트</p><p>지도 교수 이하준</p><p>프로덕션 디자인 전아영</p></div></div><div class="synopsis"><p>2020년과 2022년, 두 시대의 상가 모습을 담은 이야기.</p><p>2020년 전세계를 공포에 떨게 했던 좀비 펜데믹 사태. 2년이 지난 현재, 사람들은 이 펜데믹 상황에 적응하기 시작했다. 더 이상 좀비의 존재는 엄청난 공포의 대상이 아니다. 그저 거리를 돌아다니는 유해 생물일 뿐이다. 좀비에 대한 공포가 무뎌지기에 2년의 시간은 충분했고, 사람들은 이전의 삶을 다시 살아가기 시작했다.</p></div></div></section>''')
for page,num,year,keyword,desc,detail,detailbox,renderbox,roofbox in [
 (29,1,2020,'#평화와는 거리가 먼, 하루도 조용할 날이 없는 상가','분당의 작은 상가 건물, 매일같이 다투고 기싸움을 하는 입주민들. 하루도 그냥 지나가는 법이 없는, 평화와는 거리가 먼 상가이다. 평범한 작은 상가 건물이지만, 그 속에서는 끊임없이 갈등과 소란이 벌어지며, 잔잔한 날은 찾아볼 수 없는 시끌벅적한 모습이 보인다','상가 입주민 벽보 (Detail)',(104,886,1380,1259),(1681,665,1413,856),(1681,1533,1413,612)),
 (33,2,2022,'#평범했던 과거와 비정상적인 현재가 뒤섞인 상가','2020년 전세계를 공포에 떨게 했던 좀비 펜데믹 사태. 2년이 지난 현재, 사람들은 이 펜데믹 상황에 적응하기 시작했다. 더 이상 좀비의 존재는 엄청난 공포의 대상이 아니다. 그저 거리를 돌아다니는 유해 생물일 뿐이다. 좀비에 대한 공포가 무뎌지기에 2년의 시간은 충분했고, 사람들은 이전의 삶을 다시 살아가기 시작했다.','좀비 펜데믹 흔적 (Detail)',(104,941,1445,1129),(1680,664,1411,864),(1680,1540,1411,606))]:
    p.add(f'<section id="concept-{num}">',p.art(page,0,0,3200,357,f'{year}년 상가 콘셉트 참고 이미지 전체'),'<div class="pad">',title(f'CONCEPT {num}',f'{year}년 상가'),'<div class="business-concept"><div>',f'<h3 class="keywords">{keyword}</h3><p class="business-copy">{desc}</p><figure class="business-detail"><figcaption>{detail}</figcaption>',p.art(page,*detailbox,detail+' 전체'),'</figure></div><div class="business-renders"><p class="row-title">상가 전체, '+('옥상' if num==1 else '옥상 정원')+' <span>Sketchup, Enscape</span></p>',p.art(page,*renderbox,f'{year}년 상가 전체 렌더'),p.art(page,*roofbox,f'{year}년 상가 옥상 탑뷰'),'</div></div></div></section>')
    if num==1:
        p.add('<section id="day-night">',f'<div class="pad scene-page-title"><div><h2>2020년 상가</h2><p>낮 / 밤 장면</p></div><p>Sketchup, Enscape</p></div>','<div class="photo-grid edge-grid">')
        for box,label in zip([(0,272,1578,916),(1623,272,1577,916),(0,1223,1578,889),(1623,1223,1577,889)],['밤 장면 1','낮 장면 1','밤 장면 2','낮 장면 2']):p.add(p.art(30,*box,'2020년 상가 '+label))
        p.add('</div></section>')
        for page,anchor,subtitle,main,side,bottom in [
          (31,'alley','골목/구둣방',(0,275,2118,1234),[(2142,275,1058,589),(2142,884,1058,627)],[(275,1520,503,626),(783,1520,1335,626),(2142,1520,1058,626)]),
          (32,'roof-2020','옥상',(0,288,2118,1133),[(2142,288,1058,549),(2142,857,1058,564)],[(563,1438,1255,710),(1840,1438,1360,710)])]:
            p.add(f'<section id="{anchor}"><div class="pad scene-page-title"><div><h2>2020년 상가</h2><p>{subtitle}</p></div><p>Sketchup, Enscape</p></div><div class="mosaic-top">',p.art(page,*main,'2020년 상가 '+subtitle+' 전경'),'<div>')
            for i,box in enumerate(side):p.add(p.art(page,*box,f'2020년 상가 {subtitle} 디테일 {i+1}'))
            p.add('</div></div>',f'<div class="mosaic-bottom mosaic-{len(bottom)}">')
            for i,box in enumerate(bottom):p.add(p.art(page,*box,f'2020년 상가 {subtitle} 디테일 {i+3}'))
            p.add('</div></section>')
p.add('<section id="roof-2022"><div class="pad scene-page-title"><div><h2>2022년 상가</h2><p>옥상 (생존한 입주민들의 텃밭으로 사용)</p></div><p>Sketchup, Enscape</p></div><div class="mosaic-top">',p.art(34,0,236,2118,1233,'2022년 상가 옥상 텃밭 전경'),'<div>',p.art(34,2142,236,1058,605,'2022년 옥상 텃밭 디테일 1'),p.art(34,2142,863,1058,606,'2022년 옥상 텃밭 디테일 2'),'</div></div><div class="mosaic-bottom mosaic-2">',p.art(34,948,1490,1255,661,'2022년 상가 옥상 정원 렌더'),p.art(34,2224,1490,976,661,'2022년 상가 옥상 정원 탑뷰'),'</div></section>')
p.save([('overview',p.name),('concept-1','2020 CONCEPT'),('day-night','SCENES'),('concept-2','2022 CONCEPT'),('roof-2022','ROOFTOP')])
