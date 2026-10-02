export const modernDiagrams = {
  july: {title:'七月革命の対立', page:'29・30', columns:[
    ['大資本家（銀行家など）','革命前：反動政治に反対','革命後：立憲王政派が七月王政を成立させる'],
    ['中小資本家（産業資本家）・労働者','革命前：反動政治に反対','革命後：共和派は政権に参加できない'],
    ['農民','原書の図では、国王シャルル10世に反発']
  ]},
  february: {title:'二月革命の対立', page:34, columns:[
    ['中小資本家（産業資本家）','代表：ラマルティーヌ','穏健共和派'],
    ['労働者（社会主義者）','代表：ルイ＝ブラン','社会主義者'],
    ['農民','原書の図では、不満を示す']
  ]},
  germany: {title:'ドイツ統一をめぐる対立', page:38, columns:[
    ['大ドイツ主義','オーストリア中心','オーストリア領内のドイツ人とベーメンを含める'],
    ['小ドイツ主義','プロイセン中心','オーストリアを除いて統一する']
  ]}
};

export function modernDiagramFor(scene) {
  return {'modern-c01-l01-p04-009':modernDiagrams.july,'modern-c01-l01-p05-004':modernDiagrams.february,'modern-c01-l01-p05-016':modernDiagrams.germany}[scene.id];
}

export function modernReferencePages(scene, volume, index) {
  const figure = modernDiagramFor(scene);
  const linked = [...scene.plainBody.join('').matchAll(/P\.(\d+)/g)].map(match => Number(match[1])).filter(page => page >= 15 && page <= 40);
  const diagramPages = figure ? String(figure.page).split('・').map(Number) : [];
  return [...new Set([...(index === 0 && volume.part === 1 ? [15,16] : []), ...scene.sourceText.sourcePages, ...linked, ...diagramPages])].sort((a,b)=>a-b);
}