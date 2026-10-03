import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

// 別の作業フォルダの成果も、複製・編集せずに検査できる。
const workspace=process.argv.find(value=>value.startsWith('--workspace='))?.slice('--workspace='.length);
const root=path.resolve(workspace??fileURLToPath(new URL('../',import.meta.url)));
const load=name=>import(pathToFileURL(path.join(root,'public',name)).href);
const [{modernEdition,modernPlaces},visuals,{namesForScene,normalizeMapName,sceneMapItems,withMapNames},{modernNameCatalog}]=await Promise.all([
  load('modern-c01-l01-edition.js'),load('modern-story-visuals.js'),load('map-name-coverage.js'),load('modern-geography.js')
]);
const {withModernVisuals,modernVisualEdition,modernIllustrationFor,modernVisualAssetCatalog,modernVisualScenePlans}=visuals;
assert.equal(typeof withModernVisuals,'function');
assert.equal(typeof modernIllustrationFor,'function');
assert.ok(Array.isArray(modernVisualAssetCatalog),'画像の対応記録を公開する');
assert.ok(Array.isArray(modernVisualScenePlans),'場面の対応記録を公開する');
const recorded=JSON.parse(await readFile(path.join(root,'docs/modern-lesson-01/visual-plan.json'),'utf8'));
assert.deepEqual(recorded.assets,modernVisualAssetCatalog,'公開した画像一覧と記録の一致');
assert.deepEqual(recorded.scenes,modernVisualScenePlans,'公開した配置一覧と記録の一致');
const original=Object.values(modernEdition).flat();
const rendered=Object.values(modernVisualEdition).flat();
assert.equal(original.length,63,'第1回の全63場面');
assert.deepEqual(Object.keys(modernVisualEdition),Object.keys(modernEdition),'教材の順序を保つ');
assert.deepEqual(rendered.map(scene=>scene.id),original.map(scene=>scene.id),'場面の順序を保つ');
assert.deepEqual(modernVisualScenePlans.map(scene=>scene.sceneId),original.map(scene=>scene.id),'全場面の配置を記録する');

function imageName(key) {
  assert.equal(typeof key,'string','画像名を明記する');
  assert.ok(key&&!key.includes('..')&&!path.isAbsolute(key)&&!key.includes('\\'),'画像は専用の公開フォルダに置く');
  const named=/\.png$/i.test(key)?key:key+'.png';
  const relative=named.includes('/')?named:'modern-c01-l01/'+named;
  assert.ok(relative.startsWith('modern-c01-l01/'),'近代第1回の固有画像を使う');
  return relative;
}

// PNG の透過と実際に描かれた範囲を調べる。色数の上限では画風を判定しない。
function pngContent(bytes,label) {
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
  assert.equal(width,192,label+': 共通の画像幅');assert.equal(height,192,label+': 共通の画像高さ');
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

const byImage=new Map(),identityImages=new Map(),hashIdentities=new Map(),imageReports=[];
assert.equal(new Set(modernVisualAssetCatalog.map(asset=>imageName(asset.image))).size,modernVisualAssetCatalog.length,'基本画像の一覧に同じファイルを重複させない');
for(const asset of modernVisualAssetCatalog) {
  assert.ok(['person','group','prop','building'].includes(asset.kind),'人物・集団・物・建物を区別する');
  assert.ok(asset.name&&asset.identity,'画像の姓名・役割と同一人物の識別を記録する');
  const filenames=[asset.image,...(asset.afterImage?[asset.afterImage]:[])].map(imageName);
  for(const filename of filenames) {
    assert.ok(!byImage.has(filename)||byImage.get(filename).identity===asset.identity,filename+': 同じ画像を別の人物にしない');
    if(byImage.has(filename))continue;
    byImage.set(filename,asset);
    const bytes=await readFile(path.join(root,'public/images',filename));
    const hash=createHash('sha256').update(bytes).digest('hex');
    assert.ok(!hashIdentities.has(hash)||hashIdentities.get(hash)===asset.identity,filename+': 別の人物・役割の画像が同一ではない');
    hashIdentities.set(hash,asset.identity);
    const row={file:filename,identity:asset.identity,hash,...pngContent(bytes,filename)};
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
  const before=structuredClone(scene),enriched=withModernVisuals(scene),displayed=rendered[index],plan=modernVisualScenePlans[index];
  assert.deepEqual(scene,before,scene.id+': 原データを変更しない');
  for(const field of ['id','title','body','plainBody','sourceText'])assert.deepEqual(enriched[field],before[field],scene.id+': 本文・原文との対応を保つ');
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
  for(const item of [...items,...figures]) {
    assert.ok(item.name&&item.image,scene.id+': 絵に表示する名前と画像がある');
    const filename=imageName(item.image),asset=byImage.get(filename);
    assert.ok(asset,scene.id+': 画像の対応記録に含まれる '+filename);used.add(filename);
    const entity=entityFor(item.name);
    if(asset.kind==='person') {
      assert.ok(entity?.kind==='person',scene.id+': 人物名が本文の対応表にある '+item.name);
      assert.ok(requiredFamilies.has(entity.family??entity.name),scene.id+': 人物がその場面の本文に登場する '+item.name);
      shownPeople.add(entity.family??entity.name);
    }
    // 集団・物の説明にも、本文にない地名や個人名を紛れ込ませない。
    const addedNames=namesForScene(scene,item.name).filter(name=>!requiredFamilies.has(name.family??name.name));
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
      if(entity?.kind==='person')assert.ok(entity.points.some(candidate=>Math.hypot(candidate[0]-at[0],candidate[1]-at[1])<.05),scene.id+': 人物の活動地域と配置が対応する '+item.name);
    }
  }
  const mapNames=sceneMapItems(withMapNames(enriched,modernPlaces),modernPlaces).map(item=>normalized(item.text));
  for(const item of items)assert.equal(mapNames.filter(name=>name===normalized(item.name)).length,1,scene.id+': 地図上で人物・物の名前を二重表示しない '+item.name);
  for(const name of plan.hiddenPersonNames??[]) {
    assert.ok(figures.some(figure=>normalized(figure.name)===normalized(name)),scene.id+': 地図から外した人物には模式欄で到達する '+name);
    assert.equal(mapNames.filter(value=>value===normalized(name)).length,0,scene.id+': 模式欄の人物を地図上にも重複させない '+name);
  }
  const shown=[...mapNames,...figures.map(figure=>normalized(figure.name))];
  for(const entity of required.filter(entity=>entity.kind!=='concept'))assert.ok(shown.some(name=>name.includes(entity.key)),scene.id+': 本文の名前が地図または模式欄にある '+entity.name);
}
for(const name of ['メッテルニヒ','タレーラン','アレクサンドル1世','ニコライ1世','ボリバル','サン＝マルティン','シャルル10世','ルイ＝フィリップ','ラマルティーヌ','ルイ＝ブラン','ルイ＝ナポレオン','コシュート','マッツィーニ']) {
  const entity=entityFor(name);assert.ok(entity&&shownPeople.has(entity.family??entity.name),'重要人物に固有の絵がある '+name);
}
assert.ok(moving>0,'移動する人物・物がある');assert.ok(switches>0,'同じ人物の姿の切替がある');
assert.equal(used.size,byImage.size,'配置記録にある全画像を教材で使う');
console.log(`近代第1回の63場面、画像${byImage.size}枚を確認しました。本文・出典・順序の保持、透過・描画範囲・画像の重複、人物名と場所、模式欄${illustrated}場面、移動${moving}件、姿の切替${switches}件を確認済みです。`);
