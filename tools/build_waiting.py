from pathlib import Path
import json
from html import escape

root = Path(__file__).resolve().parents[1]
regions = []
def art(page, x, y, w, h, label):
    assert 0 <= x < x+w <= 3200 and 0 <= y < y+h <= 2267
    i = len(regions)
    regions.append(dict(page=page, x=x, y=y, w=w, h=h, label=label))
    priority = 'fetchpriority="high"' if i == 0 else 'loading="lazy"'
    return f'<button class="crop-button" type="button" data-art="{i}" aria-label="{escape(label)} 확대"><span class="crop" style="aspect-ratio:{w}/{h}"><img src="./projects/stage-waiting-for-you/assets/authored-layout/page-{page}.png" alt="{escape(label)}" {priority} decoding="async" style="width:{3200/w*100:.8f}%;left:{-x/w*100:.8f}%;top:{-y/h*100:.8f}%"></span></button>'

def title(h, sub=''):
    return f'<header class="section-title"><h2>{h}</h2><p>{sub}</p></header>'

parts = ['''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#2d2f41"><meta name="description" content="전아영의 당신을 기다리고 있어 무대·영상 디자인. 공간 콘셉트, 장면별 디자인, 영상 프로젝션 맵핑과 도면.">
<link rel="canonical" href="https://lemonnaclo.github.io/portfolio/waiting-for-you.html">
<meta property="og:title" content="당신을 기다리고 있어 — Jun Ayoung"><meta property="og:type" content="website">
<meta property="og:url" content="https://lemonnaclo.github.io/portfolio/waiting-for-you.html">
<meta property="og:image" content="https://lemonnaclo.github.io/portfolio/asset/thumbnails/stage-waiting-for-you.jpg">
<title>당신을 기다리고 있어 — Jun Ayoung</title>
<link rel="stylesheet" href="./pillowman.css?v=20261116-2"><link rel="stylesheet" href="./waiting-for-you.css?v=20261116-1">
<script src="./waiting-for-you.js?v=20261116-1" defer></script></head><body>
<a class="skip-link" href="#waiting-main">본문으로 건너뛰기</a><article id="web-project">
<a class="back-to-works" href="./works.html#projects">← 전체 작업</a>
<nav class="project-nav" aria-label="작업 목차"><a href="#overview">당신을 기다리고 있어</a><a href="#concept">CONCEPT</a><a href="#letters-1-4">SCENES</a><a href="#process">PROCESS</a><a href="#drawings">DWG</a></nav><main id="waiting-main">''']
parts += ['<section id="overview" class="overview">', art(12,0,0,3200,1762,'당신을 기다리고 있어 대표 무대 이미지'), '''<div class="cover-info pad"><div><p class="author">김보영 작</p><h1 class="project-name">당신을 기다리고 있어</h1><div class="credits"><p>2021-1 추계 공연 | 중앙대학교 연극실험실 1층 극장 | 연출 김예진</p><p>지도 교수 김철승</p><p>무대/영상 디자인 전아영</p></div></div><div class="synopsis"><p>광속으로 성간(星間) 여행이 가능해진 시대, ‘나’와 ‘당신’은 결혼식을 앞두고 있다. 그러나 ‘당신’은 가족을 배웅하기 위해 알파 센타우리로 떠나야 하고, 지구 시간으로 9년이 걸리는 여정에 나선다. ‘나’는 이 긴 시간을 단축하기 위해 ‘기다림의 배’를 선택한다.</p><p>그러나 예상치 못한 사건들로 두 사람의 만남은 계속 미뤄지고, ‘나’는 시간선이 어긋나지 않도록 돛단배를 타고 성계를 오가며 ‘당신’을 기다린다. 그러나 끝내 만나지 못한 채 수많은 시간이 흐르고, 삶을 끝내고자 결혼식을 약속했던 교회(지구)로 향한 ‘나’는, 그곳에서 ‘당신’의 흔적을 발견한다.</p></div></div></section>''']

groups = [
 ('#광활한 우주 &nbsp; #무한한 공간', "디자인 과정에서 가장 큰 이슈는, '소극장'이라는 작은 규모의 제한된 공간에서 광활한 우주를 구현해야 하는 것이었다. 원근감을 활용하거나 여백을 만들거나, 관객과의 거리감을 주는 등의 방식을 활용할 수 없었다. 그래서 선택한 방식은 관객이 극장의 공간 규모나 형태를 한눈에 파악할 수 없도록 설계하는 것이었다. 이외에도 객석 배치, 유광 처리 등 여러 요소를 최대로 활용하였다.", [
 ('1) 곡면 벽체',['무대 세트의 벽체를 곡면으로 휘어, 벽과 바닥의 경계성을 지움']),
 ('2) 오브제/가림막 사용',['극장을 비우는 대신, 오브제와 가림막으로 공간을 채워서 공간의 경계를 숨김']),
 ('3) 객석 배치',['객석을 양쪽으로 배치하여 무대가 가로질러 열린 듯한 느낌을 연출','배우가 정면이 아닌 4면을 자유롭게 응시하며 방황하는 형식의 동선'])]),
 ('#로맨틱 &nbsp; #아날로그', '작품은 남자 주인공의 15통의 편지로 서사가 전개되는 SF 로맨스 소설이다. 극 중 주된 공간인 ‘우주’는 연인을 기다리며 외로움과 절망을 느끼는 장소이지만, 동시에 사랑하는 연인을 향한 애틋한 감정이 깃든 공간이기도 하다. 이러한 이중적인 감정을 담기 위해, 우주를 마냥 차갑고 어두운 분위기가 아닌 감성적이고 로맨틱한 느낌을 더하여 표현하고자 했다. 바다의 이미지를 활용하여 우주라는 공간이 단순한 고독의 상징이 아니라, 사랑을 품고 있는 애틋한 공간으로 느껴질 수 있도록 했다.', [
 ('1-1) 우주 = 바다',["'우주 = 바다'처럼 표현, 블루톤 색감을 기본으로 설정"]),
 ('1-2) 우주 = 바다',['벽체 작화에 물결 모양을 반영하고, 유광(애폭시) 처리를 통해 반사 효과 구현']),
 ('2) 돛단배',['기술적 우주선 대신 감성적인 돛단배 디자인을 채택해 인간적인 정서를 강조'])]),
 ('#추상', '작품의 무대는 지구와 우주, 여러 시간대가 얽혀 있는 공간이다. 하나의 고정된 세트로 다양한 시공간을 표현하기 위해 추상적인 디자인 양식을 사용했다.', [
 ('1) 구체적인 디테일 배제',['공간의 장소성을 명확히 하기보다는, 상징적/추상적 형태로 관객의 상상력 자극']),
 ('2) 조명, 영상 활용',['단순한 형태의 무대 디자인을 보완하기 위해 조명과 프로젝션 맵핑을 활용'])])]
parts += ['<section id="concept">', art(13,0,0,3200,327,'공간 콘셉트 참고 이미지 전체'), '<div class="waiting-concept"><div class="concept-copy pad">', title('CONCEPT','전체적인 공간 컨셉')]
for keyword, description, principles in groups:
    parts += [f'<div class="concept-group"><h3 class="keywords">{keyword}</h3><p class="concept-summary">{escape(description)}</p><ol class="waiting-principles">']
    for head, paras in principles:
        parts += [f'<li><h4>{head}</h4>' + ''.join(f'<p>− {escape(p)}</p>' for p in paras) + '</li>']
    parts += ['</ol></div>']
parts += ['</div><div class="concept-visuals dark">', art(13,1716,554,1381,903,'전체적인 공간 콘셉트 무대 렌더'), '<div class="two-up">', art(13,1725,1615,674,485,'공간 콘셉트 평면도'), art(13,2410,1615,675,485,'공간 콘셉트 입면도'), '</div></div></div></section>']

scenes = [
 (14,'letters-1-4',[
  ('1번째 편지','Scene 1','항해 1일째, 지구 시간으로 1일째','아, 예식장에 신부로 서 있는 당신 모습은 얼마나 아름다울까? 당신이랑 결혼한다고 생각을 하면 자다가도 좋아서 깨. 어떻게 2달을 기다리지 하루도 더 못 기다리겠는데... 얼른 보고싶어. 사랑해.'),
  ('4번째 편지','Scene 5','항해 1개월 25일째, 지구 시간으로 7년 8개월하고 25일 후','음성 편지를 받았어. 다 나 때문이야. 당신 잘못은 하나도 없어. 배를 갈아탄 건 정말 잘한거야. 피난해서 다행이야. 하지만 11년, 11년이라니... 벌써 3년이나 늦었어. 7년반이나 지났다고. 어디서부터 뭐가 잘못되었는지는 모르겠지만 다 잘못된거야.')], [(0,256,1583,1060),(1616,256,1584,1060)]),
 (15,'letters-6-8',[
  ('6번째 편지','Scene 11','항해 4개월째, 지구 시간으로 13년 9개월 후','선장과 승무원들은 지구를 떠나 다른 별로 간다고 했어. 나는 5년 뒤의 이 항구에 와야 한다고 했어. 신부가 오고 있다고. 내가 불쌍해보였나봐, 배 안에서 작은 배 하나를 꺼내주더라. 5년 뒤로 가려면 태양계에서 2년 더 떠돌아야 한대. 목성 궤도를 타라고 하더라'),
  ('8번째 편지','Scene 14','항해 3년 2개월째, 지구 시간으로 19년 2개월하고 3일 후','당신이 오기로 한 날에 맞춰 항구로 갔어. 아무도 안오더라. 4개월하고 3일을 기다렸어. 당신은 오지 않았어. 그런데 왠지 슬프지 않더라. 기쁘지도 않았고, 그저 담담했어. 그 뒤에 난 떠났어. 사실 떠날 이유는 없었어. 더 이상 미래로 갈 이유는 없었으니까. 하지만 여기가 아니라면 어디든 좋다고 생각했어. 이 모든 것을 떠올리지 않아도 되는 곳으로. 당신을 포함해서.')], [(0,261,1582,1060),(1615,261,1583,1060)]),
 (16,'letters-12-15',[
  ('12번째 편지','Scene 1','항해 9년째, 지구 시간으로 (대충) 170년 후','하루에도 수천번씩 당신 모습을 그려. 그러니까 이제는 내가 당신인지, 당신이 나인지도 모르겠어. 여전히 당신을 기다리고 있어. 당신이 이미 이 세상에 없다해도. 오래전에 어느 별에 정착해서 좋은 사람 만나 아들 딸 열 쯤 낳고, 가족들의 축복 속에서 생을 마감했다 하더라도. 어쩌면 아득한 성계 너머에서 이제 막 배에서 내리며, 어린 날의 가벼운 추억거리처럼 ‘아, 그런 남자가 있었죠. 오래전에 다른 시간대에서 죽었겠지만,’ 이라며 나를 회상하고 있다고 해도.'),
  ('15번째 편지','Scene 4','항해 (아마도) 14년째, 지구 시간 모름','벽에는 색바랜 종이가 겹겹히 붙어있었어. 원래는 색지였을 것 같지만 모두 회색이었어. 그러다 노란색 종이 하나가 눈에 띄었어. 떼어내려는데 잘 안 떨어지더라. 접착제가 남아있다는 뜻이었어. 작년이었을까? 한달전? 어제? 방금? 바람이 불어와 삭고 낡은 종이가 우수수 떨어졌어. 햇빛이 내려앉아 글씨를 황금빛으로 비추었어.\n“기다리고 있어. 내가 여기 있어”')], [(0,271,1583,1060),(1625,269,1575,1060)])]
for page, anchor, pair, boxes in scenes:
    parts += [f'<section id="{anchor}" class="letter-section"><div class="letter-grid dark">']
    for (head, scene, time, quote), (x,y,w,h) in zip(pair, boxes):
        parts += [f'<figure><figcaption class="scene-heading"><h2>{head}</h2><p>{scene}</p></figcaption>', art(page,x,y,w,h,f'{head} {scene} 무대 렌더'), f'<div class="letter-copy"><p class="letter-time">{time}</p><blockquote>{escape(quote).replace(chr(10),"<br>")}</blockquote></div></figure>']
    parts += ['</div><div class="letter-plans pad">', art(page,120 if page == 14 else 76,1678,656,468,f'{page}쪽 장면 평면도')]
    if page != 16:
        parts += ['<figure class="opposite"><figcaption>[반대쪽 객석 시야]</figcaption><div class="two-up">',art(page,1065,1731,987,395,f'{pair[0][0]} 반대쪽 객석 시야'),art(page,2070,1731,986,395,f'{pair[1][0]} 반대쪽 객석 시야'),'</div></figure>']
    parts += ['</div></section>']

parts += ['<section id="process" class="pad">',title('DESIGN PROCESS','영상 프로젝션 맵핑'),'<p class="tools">Blender, Photoshop, Midjourney</p><div class="mapping-grid"><div><h3 class="row-title">15번째 편지 (마지막 장면)</h3><div class="final-mapping">', art(17,124,324,1581,807,'15번째 편지 프로젝션 맵핑 1'),art(17,124,1152,1581,795,'15번째 편지 프로젝션 맵핑 2'),'<div class="paper-references">',art(17,124,1965,180,175,'마지막 장면 종이 질감 1'),art(17,307,1965,177,175,'마지막 장면 종이 질감 2'),'</div></div></div><div class="mapping-variations">']
for letter,y in [(4,319),(8,969),(12,1618)]:
    parts += [f'<figure><figcaption class="row-title">{letter}번째 편지</figcaption>',art(17,1920,y,1155,524,f'{letter}번째 편지 프로젝션 맵핑과 질감'),'</figure>']
parts += ['</div></div></section><section id="drawings" class="dark pad">',title('DWG','Rhino 8 도면'),'<div class="drawing-grid">']
for (x,y,w,h), label in zip([(38,248,1024,726),(1088,248,1024,726),(2138,248,1024,726),(35,1144,1025,726),(1086,1144,1024,726),(2137,1144,1024,726)],['평면도','입면도','세트 디테일 1','세트 디테일 2','세트 디테일 3','세트 디테일 4 · 작화']):
    parts += [art(18,x,y,w,h,label)]
parts += ['''</div></section></main><footer class="project-footer"><span>당신을 기다리고 있어 · 무대/영상 디자인 전아영</span><a href="#overview">맨 위로 ↑</a></footer></article>
<dialog id="art-dialog" aria-labelledby="art-label"><header><span id="art-label"></span><button id="art-zoom" type="button">더 크게 보기</button><button id="art-close" type="button" autofocus>닫기 ×</button></header><div id="art-scroll"><div id="art-target"></div></div></dialog>''', '<script id="region-data" type="application/json">',json.dumps(regions,ensure_ascii=False),'</script></body></html>']
(root/'waiting-for-you.html').write_text('\n'.join(parts),encoding='utf-8')
(root/'waiting-for-you.js').write_text((root/'pillowman.js').read_text(encoding='utf-8').replace('stage-pillowman','stage-waiting-for-you'),encoding='utf-8')
print(f'Built 7 sections, {len(regions)} artwork regions across pages {sorted(set(r["page"] for r in regions))}')
