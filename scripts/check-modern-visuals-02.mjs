import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

// 別の作業フォルダの成果も、複製・編集せずに検査できる。
const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const dataOnly=process.argv.includes('--data-only');
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,'public',name)).href);
const [{modernEdition,modernPlaces},visuals,{namesForScene,normalizeMapName,sceneMapItems,withMapNames},{modernNameCatalog}]=await Promise.all([
  load('modern-c01-l02-edition.js'),load('modern-story-visuals-02.js'),load('map-name-coverage.js'),load('modern-geography-02.js')
]);
const {withModernVisuals,modernVisualEdition,modernIllustrationFor,modernVisualAssetCatalog,modernVisualScenePlans}=visuals;
assert.equal(typeof withModernVisuals,'function');
assert.equal(typeof modernIllustrationFor,'function');
assert.ok(Array.isArray(modernVisualAssetCatalog),'画像の対応記録を公開する');
assert.ok(modernVisualScenePlans&&typeof modernVisualScenePlans==='object'&&!Array.isArray(modernVisualScenePlans),'場面IDごとの対応記録を公開する');
const scenePlans=Object.values(modernVisualScenePlans);
const recorded=JSON.parse(await readFile(path.join(root,'docs/modern-lesson-02/visual-plan.json'),'utf8'));
assert.deepEqual(recorded.assets,modernVisualAssetCatalog,'公開した画像一覧と記録の一致');
assert.ok(Array.isArray(recorded.scenes),'場面の記録を順番の配列で保存する');
for(const [index,plan] of scenePlans.entries()) {
  const saved=recorded.scenes[index];
  assert.ok(saved,plan.sceneId+': 配置の記録がある');
  assert.deepEqual(Object.fromEntries(Object.keys(plan).map(key=>[key,saved[key]])),JSON.parse(JSON.stringify(plan)),plan.sceneId+': 公開した配置一覧と記録の一致');
}
const original=Object.values(modernEdition).flat();
const rendered=Object.values(modernVisualEdition).flat();
assert.ok(original.length>=30,'第2回の全場面');
assert.deepEqual(Object.keys(modernVisualEdition),Object.keys(modernEdition),'教材の順序を保つ');
assert.deepEqual(rendered.map(scene=>scene.id),original.map(scene=>scene.id),'場面の順序を保つ');
assert.deepEqual(scenePlans.map(scene=>scene.sceneId),original.map(scene=>scene.id),'全場面の配置を記録する');
assert.equal(recorded.scenes.length,original.length,'配置記録も全場面');
assert.equal(modernVisualAssetCatalog.filter(asset=>asset.requiresGeneration).length,recorded.totals.newImages,'新規画像の件数と記録の一致');
assert.equal(modernVisualAssetCatalog.filter(asset=>!asset.requiresGeneration).length,recorded.totals.existingImages,'既存画像の件数と記録の一致');
assert.ok(modernVisualAssetCatalog.length>=20,'本人・階層・制度・物を区別する画像を用意する');

function imageName(key) {
  assert.equal(typeof key,'string','画像名を明記する');
  assert.ok(key&&!key.includes('..')&&!path.isAbsolute(key)&&!key.includes('\\'),'画像は専用の公開フォルダに置く');
  const named=/\.png$/i.test(key)?key:key+'.png';
  const relative=named.includes('/')?named:'modern-c01-l02/'+named;
  return relative;
}

// PNG の透過と実際に描かれた範囲を調べる。色数の上限では画風を判定しない。
function pngContent(bytes,label,dimensions=[192,192]) {
  assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10],label+': PNG形式');
  let header,palette,transparency;const compressed=[];
  for(let offset=8;offset<bytes.length;) {
    const length=bytes.readUInt32BE(offset),type=bytes.toString('ascii',offset+4,offset+8),data=bytes.subarray(offset+8,offset+8+length);
    assert.ok(offset+length+12<=bytes.length,label+': PNGの各部分が欠けていない');
    if(type==='IHDR')header=data;
    if(type==='PLTE')palette=data;
    if(type==='tRNS')transparency=data;
    if(type==='IDAT')compressed.push(data);
    offset+=length+12;if(type==='IEND')break;
  }
  assert.ok(header&&compressed.length,label+': 画像内容がある');
  const width=header.readUInt32BE(0),height=header.readUInt32BE(4),depth=header[8],kind=header[9];
  assert.equal(width,dimensions[0],label+': 共通の画像幅');assert.equal(height,dimensions[1],label+': 共通の画像高さ');
  assert.equal(depth,8,label+': 8ビットのPNG');assert.equal(header[12],0,label+': 通常のPNG');
  const channels={0:1,2:3,3:1,4:2,6:4}[kind];assert.ok(channels,label+': 読み取れるPNG');
  if(kind===3)assert.ok(palette,label+': 色の対応表がある');
  const raw=inflateSync(Buffer.concat(compressed)),stride=width*channels;
  assert.equal(raw.length,(stride+1)*height,label+': 画素が欠けていない');
  const pixels=Buffer.alloc(stride*height);
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<height;y++) {
    const method=raw[y*(stride+1)];assert.ok(method<=4,label+': PNGの行の復元');
    for(let x=0;x<stride;x++) {
      const i=y*stride+x,left=x>=channels?pixels[i-channels]:0,up=y?pixels[i-stride]:0,corner=y&&x>=channels?pixels[i-stride-channels]:0;
      const prediction=[0,left,up,Math.floor((left+up)/2),paeth(left,up,corner)][method];
      pixels[i]=(raw[y*(stride+1)+1+x]+prediction)&255;
    }
  }
  let transparent=0,visible=0,left=width,top=height,right=-1,bottom=-1;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const i=(y*width+x)*channels;
    let alpha=kind===6?pixels[i+3]:kind===4?pixels[i+1]:kind===3?transparency?.[pixels[i]]??255:255;
    if(kind===0&&transparency&&pixels[i]===transparency.readUInt16BE(0))alpha=0;
    if(kind===2&&transparency&&[0,1,2].every(n=>pixels[i+n]===transparency.readUInt16BE(n*2)))alpha=0;
    if(alpha===0)transparent++;
    if(alpha>0){visible++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  }
  assert.ok(transparent>=width*height*.01,label+': 外側に本来の透過領域がある');
  assert.ok(visible>=width*height*.01,label+': 空の画像ではない');
  assert.ok(right-left>=8&&bottom-top>=10,label+': 人物や物を表示できる範囲がある');
  assert.ok(left>0&&top>0&&right<width-1&&bottom<height-1,label+': 被写体が画像の端で切れていない');
  return {width,height,transparent,visible,bounds:[left,top,right,bottom]};
}

const byImage=new Map(),identityImages=new Map(),hashIdentities=new Map(),personIdentities=new Map(),imageReports=[];
assert.equal(new Set(modernVisualAssetCatalog.map(asset=>imageName(asset.image))).size,modernVisualAssetCatalog.length,'基本画像の一覧に同じファイルを重複させない');
for(const asset of modernVisualAssetCatalog) {
  assert.ok(['person','group','prop','building'].includes(asset.kind),'人物・集団・物・建物を区別する');
  assert.ok(asset.name&&asset.identity,'画像の姓名・役割と同一人物の識別を記録する');
  if(asset.kind==='person') {
    const person=namesForScene(original[0],asset.name).find(entity=>entity.kind==='person');
    assert.ok(person,asset.name+': 本人の姓名が対応表にある');
    const family=person.family??person.name;
    assert.ok(!personIdentities.has(asset.identity)||personIdentities.get(asset.identity)===family,asset.name+': 同じ本人として別人を混ぜない');
    personIdentities.set(asset.identity,family);
  }
  const filenames=[asset.image,...(asset.afterImage?[asset.afterImage]:[])].map(imageName);
  assert.ok(filenames.every(filename=>asset.requiresGeneration?filename.startsWith('modern-c01-l02/'):['modern-c01-l01/','ancient/','modern-c01-l02/'].some(folder=>filename.startsWith(folder))),asset.name+': 新規画像と既存の本人・建物を区別する');
  for(const filename of filenames) {
    assert.ok(!byImage.has(filename)||byImage.get(filename).identity===asset.identity,filename+': 同じ画像を別の人物にしない');
    if(byImage.has(filename))continue;
    byImage.set(filename,asset);
    const bytes=dataOnly?null:await readFile(path.join(root,'public/images',filename));
    const hash=dataOnly?filename:createHash('sha256').update(bytes).digest('hex');
    assert.ok(!hashIdentities.has(hash)||hashIdentities.get(hash)===asset.identity,filename+': 別の人物・役割の画像が同一ではない');
    hashIdentities.set(hash,asset.identity);
    const row={file:filename,identity:asset.identity,hash,...(bytes?pngContent(bytes,filename,asset.requiresGeneration?[192,192]:[asset.width,asset.height]):{})};
    imageReports.push(row);identityImages.set(asset.identity,[...(identityImages.get(asset.identity)??[]),row]);
  }
  if(asset.afterImage) {
    const images=identityImages.get(asset.identity),first=images.find(image=>image.file===filenames[0]),last=images.find(image=>image.file===filenames[1]);
    assert.notEqual(first.hash,last.hash,asset.name+': 同じ本人の姿が実際に切り替わる');
  }
}
assert.equal(byImage.size,imageReports.length,'切替も含むすべての画像を検査する');

const normalized=value=>normalizeMapName(value);
const entityFor=name=>modernNameCatalog.find(entity=>entity.key===normalized(name));
const point=value=>typeof value==='string'?modernPlaces[value]?.point:value;
function geographicPoint(value,label) {
  const at=point(value);
  assert.ok(Array.isArray(at)&&at.length===2&&at.every(Number.isFinite),label+': 場所を明記する');
  assert.ok(Math.abs(at[0])<=180&&Math.abs(at[1])<=90,label+': 地理図の座標');
  return at;
}
const used=new Set(),shownPeople=new Set();let moving=0,switches=0,illustrated=0;
for(const [index,scene] of original.entries()) {
  const before=structuredClone(scene),enriched=withModernVisuals(scene),displayed=rendered[index],plan=scenePlans[index],saved=recorded.scenes[index];
  assert.deepEqual(scene,before,scene.id+': 原データを変更しない');
  for(const field of ['id','title','body','plainBody','sourceText'])assert.deepEqual(enriched[field],before[field],scene.id+': 本文・原文との対応を保つ');
  for(const [field,hashField] of [['body','htmlBodySha256'],['plainBody','plainBodySha256'],['sourceText','sourceTextSha256']])if(saved[hashField]!==undefined)assert.equal(createHash('sha256').update(JSON.stringify(before[field])).digest('hex'),saved[hashField],scene.id+': 記録した本文・出典の一致');
  if(saved.sourcePages!==undefined)assert.deepEqual(saved.sourcePages,before.sourceText.sourcePages,scene.id+': 記録した原書ページの一致');
  assert.deepEqual(enriched,displayed,scene.id+': 一覧と個別の表示処理が一致する');
  assert.deepEqual(enriched.actors??[],plan.mapActors??[],scene.id+': 人物配置の記録');
  assert.deepEqual(enriched.props??[],plan.mapProps??[],scene.id+': 物や建物の配置の記録');
  const illustration=modernIllustrationFor(enriched);
  assert.deepEqual(illustration,plan.illustration??null,scene.id+': 地図外の模式欄の記録');
  const figures=(illustration?.groups??[]).flatMap(group=>group.figures??[]),items=[...(enriched.actors??[]),...(enriched.props??[])];
  assert.ok(items.length+figures.length>0,scene.id+': 全場面に内容に応じた絵がある');
  if(figures.length)illustrated++;
  assert.ok(typeof plan.reason==='string'&&plan.reason.trim(),scene.id+': その場所・模式欄を選んだ根拠を記録する');
  const narrative=scene.title+'。'+scene.plainBody.join(''),required=namesForScene(scene,narrative),requiredFamilies=new Set(required.map(entity=>entity.family??entity.name));
  const preceding=original[index-1];
  // 「この会議」などの続きでは、直前に原文が明示した地名・施設名を引き継げる。
  const precedingNames=preceding?.sourceText.part===scene.sourceText.part?namesForScene(preceding,preceding.title+'。'+preceding.plainBody.join('')).filter(entity=>entity.kind!=='person'):[];
  const locationFamilies=new Set([...required,...precedingNames].map(entity=>entity.family??entity.name));
  for(const item of [...items,...figures]) {
    assert.ok(item.name&&item.image,scene.id+': 絵に表示する名前と画像がある');
    const filename=imageName(item.image),asset=byImage.get(filename);
    assert.ok(asset,scene.id+': 画像の対応記録に含まれる '+filename);used.add(filename);
    const entity=entityFor(item.name);
    if(asset.kind==='person') {
      assert.ok(entity?.kind==='person',scene.id+': 人物名が本文の対応表にある '+item.name);
      const assetPerson=namesForScene(scene,asset.name).find(name=>name.kind==='person');
      assert.ok(assetPerson,scene.id+': 画像の本人を対応表で識別できる '+asset.name);
      assert.equal(entity.family??entity.name,assetPerson.family??assetPerson.name,scene.id+': 姓名と表示する本人の絵が一致する '+item.name);
      assert.ok(requiredFamilies.has(entity.family??entity.name),scene.id+': 人物がその場面の本文に登場する '+item.name);
      shownPeople.add(entity.family??entity.name);
    }
    // 集団・物の説明にも、本文にない地名や個人名を紛れ込ませない。
    const addedNames=namesForScene(scene,item.name).filter(name=>!(name.kind==='person'?requiredFamilies:locationFamilies).has(name.family??name.name)&&(name.kind==='person'||!normalizeMapName(narrative).includes(normalizeMapName(name.name))));
    assert.deepEqual(addedNames,[],scene.id+': 表示名と本文の対応 '+item.name);
    if(item.afterImage) {
      const after=imageName(item.afterImage),afterAsset=byImage.get(after);assert.ok(afterAsset,scene.id+': 切替画像の記録');
      assert.ok(enriched.duration>0,scene.id+': 初めの姿から切り替わる時間がある');
      assert.equal(asset.identity,afterAsset.identity,scene.id+': 切替後も同じ本人');
      assert.notEqual(imageReports.find(row=>row.file===filename).hash,imageReports.find(row=>row.file===after).hash,scene.id+': 切替画像が異なる');used.add(after);switches++;
    }
  }
  for(const item of items) {
    const at=geographicPoint(item.at,scene.id+' '+item.name);
    if(item.route!==undefined) {
      const route=enriched.routes?.[item.route];assert.ok(route&&route.points.length>=2,scene.id+': 移動経路がある');
      route.points.forEach(value=>geographicPoint(value,scene.id+' 移動経路'));assert.ok(enriched.duration>0,scene.id+': 動きの時間がある');moving++;
    } else {
      const entity=entityFor(item.name);
      if(entity?.kind==='person') {
        const locations=[...entity.points,...required.filter(name=>name.kind!=='person').flatMap(name=>name.points),...(enriched.pins??[]).map(key=>modernPlaces[key].point)];
        const [west,south,east,north]=scene.frame;
        const countryTour=/全国|全土|国内/.test(narrative)&&/国内巡回|全国|各地/.test(plan.reason)&&at[0]>=west&&at[0]<=east&&at[1]>=south&&at[1]<=north;
        assert.ok(locations.some(candidate=>Math.hypot(candidate[0]-at[0],candidate[1]-at[1])<.1)||countryTour,scene.id+': 本文の現地・人物の活動地域・明記した国内巡回と配置が対応する '+item.name);
      }
    }
  }
  const mapNames=sceneMapItems(withMapNames(enriched,modernPlaces),modernPlaces).map(item=>normalized(item.text));
  // 場所の印と同名の絵を併用する場合、印の文字の省略は共通の描画処理と画面検査で確かめる。
  for(const item of items)assert.equal(items.filter(other=>normalized(other.name)===normalized(item.name)).length,1,scene.id+': 地図上の複数の絵を同じ表示名にしない '+item.name);
  for(const name of plan.hiddenPersonNames??[]) {
    const onMap=items.some(item=>normalized(item.name)===normalized(name)),outside=figures.some(figure=>normalized(figure.name)===normalized(name));
    const noted=[...(plan.textOnlyPeople??[]),...(plan.excludedPersonNames??[]),...(plan.personAliases??[])].find(note=>normalized(note.name)===normalized(name));
    assert.ok(onMap||outside||noted?.reason,scene.id+': 地図から外した文字の到達先・除外理由がある '+name);
    assert.equal(mapNames.filter(value=>value===normalized(name)).length,onMap?1:0,scene.id+': 人物名を地図上に補完して二重表示しない '+name);
  }
  const shown=[...mapNames,...figures.map(figure=>normalized(figure.name))];
  for(const entity of required.filter(entity=>entity.kind!=='concept')) {
    const note=[...(plan.textOnlyPeople??[]),...(plan.excludedPersonNames??[])].find(note=>normalized(note.name)===entity.key),alias=(plan.personAliases??[]).find(note=>normalized(note.name)===entity.key);
    if(note){assert.ok(note.reason,scene.id+': 人物を地図へ置かない理由');continue;}
    const aliased=alias&&[...items,...figures].some(item=>item.identity===alias.identity);
    assert.ok(shown.some(name=>name.includes(entity.key))||aliased,scene.id+': 本文の名前が地図・模式欄または文脈上の別名に対応する '+entity.name);
  }
  for(const figure of figures.filter(figure=>figure.kind==='person'))if(items.some(item=>item.identity===figure.identity)) {
    const compared=items.find(item=>item.identity===figure.identity&&item.afterImage);
    assert.ok(compared&&['before','after'].includes(figure.temporalRole),scene.id+': 本人の単なる二重表示をしない '+figure.name);
    assert.equal(figure.image,figure.temporalRole==='before'?compared.image:compared.afterImage,scene.id+': 本人の姿の前後比較と切替画像が一致する');
  }
}
for(const name of ['グレイ','コブデン','ブライト','ピール','ダービー','ヴィクトリア女王','クック','ディズレーリ','グラッドストン','オコンネル','ウェリントン','オブライエン','アスキス','デ＝ヴァレラ','ナポレオン3世','オスマン','マクシミリアン','ビスマルク','ティエール']) {
 const entity=entityFor(name);assert.ok(entity&&shownPeople.has(entity.family??entity.name),'本文に登場する本人に固有の絵がある '+name);
}
for(const asset of modernVisualAssetCatalog.filter(asset=>asset.variantOf)) {
 const before=modernVisualAssetCatalog.find(candidate=>candidate.key===asset.variantOf);
 assert.ok(before,asset.name+': 姿を変える前の本人がある');
 assert.equal(asset.identity,before.identity,asset.name+': 姿の違いが別人を表していない');
}

// 対応表からそのまま期待値を作らず、通読して混同しやすい意味を固定する。
const figuresFor=scene=>(modernIllustrationFor(scene)?.groups??[]).flatMap(group=>group.figures??[]);
const itemsFor=scene=>[...(scene.actors??[]),...(scene.props??[]),...figuresFor(scene)];
const sceneWith=phrase=>rendered.find(scene=>scene.plainBody.join('').includes(phrase));
const napoleon3=entityFor('ナポレオン3世'),napoleon1=entityFor('ナポレオン');
assert.ok(napoleon3?.kind==='person'&&napoleon1?.kind==='person','ナポレオン1世と3世を別に識別する');
assert.notEqual(napoleon3.family??napoleon3.name,napoleon1.family??napoleon1.name,'ナポレオン1世の回想を3世本人へ取り違えない');
const governor=modernNameCatalog.find(entity=>entity.name==='オスマン'),empire=modernNameCatalog.find(entity=>entity.name==='オスマン帝国');
assert.equal(governor?.kind,'person','オスマンは知事本人');assert.ok(empire&&empire.kind!=='person','オスマン帝国は地理図の国家');
const reform=sceneWith('ダービー内閣が第2回選挙法改正');assert.ok(reform,'第2回選挙法改正の説明を収録する');
assert.ok(itemsFor(reform).some(item=>/都市労働者/.test([item.name,item.bubble,item.caption].join(''))),'第2回改正の対象は都市労働者');
const famine=sceneWith('新天地アメリカへの移民が急増');assert.ok(famine,'飢饉から移民増加の説明がある');
assert.ok(famine.routes.some(route=>route.points[0][0]>-20&&route.points.at(-1)[0]<-60),'アイルランドからアメリカへ向かう移民の方向');
const autonomy=sceneWith('実施は延期された');assert.ok(autonomy,'1914年の成立と延期を説明する');
assert.ok(itemsFor(autonomy).some(item=>/延期/.test([item.bubble,item.caption].join(''))),'自治法は成立だけで即実施した描写へしない');
const partition=sceneWith('南部のみがアイルランド自由国');assert.ok(partition,'南部のみの自治領化を収録する');
assert.ok(!itemsFor(partition).some(item=>/全島.*独立|北部.*独立/.test([item.bubble,item.caption].join(''))),'南部自治領化を全島独立へ取り違えない');
const mexican=sceneWith('メキシコ皇帝にした');assert.ok(mexican,'マクシミリアンのメキシコ皇帝即位を収録する');
const max=itemsFor(mexican).find(item=>normalized(item.name)===normalized('マクシミリアン'));
assert.ok(max,'メキシコの皇帝はマクシミリアン本人');
const collapse=sceneWith('ナポレオン3世自身が捕虜となって退位');assert.ok(collapse,'帝政崩壊の説明を収録する');
const emperor=collapse.actors.find(item=>normalized(item.name)===normalized('ナポレオン3世'));
assert.ok(emperor?.afterImage,'第3世本人の姿を敗北・退位後に切り替える');
assert.equal(byImage.get(imageName(emperor.image)).identity,byImage.get(imageName(emperor.afterImage)).identity,'退位後も第3世の同一人物');
assert.ok(!itemsFor(collapse).some(item=>normalized(item.name)===normalized('ナポレオン')),'スダンの捕虜は第1世ではない');
for(const scene of rendered)for(const item of itemsFor(scene)) {
 const asset=byImage.get(imageName(item.image));if(asset?.kind!=='person')continue;
 const historic=['エリザベス1世','クロムウェル','チャールズ2世','メアリ1世','ナポレオン'];
 if(historic.includes(asset.name)) {
   assert.ok(['past','comparison','historical'].includes(item.temporalRole)||/過去|かつて|以前|時代|思い出|回想|17世紀|大陸封鎖/.test([item.caption,item.bubble,item.description,modernVisualScenePlans[scene.id].reason].join('')),'回想の人物には過去との比較であることを明記 '+scene.id+' '+item.name);
   assert.ok(item.route===undefined,'過去比較の人物を19世紀の事件へ行軍させない '+item.name);
 }
}
assert.ok(moving>0,'移動する人物・物がある');assert.ok(switches>0,'同じ人物の姿の切替がある');
assert.equal(used.size,byImage.size,'配置記録にある全画像を教材で使う');
if(dataOnly)console.log(`近代第2回の${original.length}場面と画像${byImage.size}枚の対応記録を確認しました。本文・出典・順序の保持、人物名と場所、模式欄${illustrated}場面、移動${moving}件、姿の切替${switches}件の対応を確認済みです。画像ファイルの存在・透過・描画範囲・画像内容の重複は未実施です。`);
else console.log(`近代第2回の${original.length}場面、画像${byImage.size}枚を確認しました。本文・出典・順序の保持、透過・描画範囲・画像の重複、人物名と場所、模式欄${illustrated}場面、移動${moving}件、姿の切替${switches}件を確認済みです。`);
