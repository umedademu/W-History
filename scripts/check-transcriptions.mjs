import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = relative => fs.readFile(path.join(root, relative));
const hash = data => createHash('sha256').update(data).digest('hex');
const manifest = JSON.parse(await read('docs/source-consolidation.json'));

async function checkTranscriptions() {
  try {
    await fs.access(path.join(root, 'sources'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.log('書き起こし資料は公開管理の対象外のため、資料の直接検査を省略しました。');
    return;
  }

  const pages = [], lessons = new Set();
  let emptyLegacyCount = 0;
  for (const chapter of manifest.chapters) {
    const folder = path.dirname(chapter.file);
    const markdownFiles = (await fs.readdir(path.join(root, folder))).filter(name => name.endsWith('.md'));
    assert.deepEqual(markdownFiles, ['transcription.md'], `${folder}: 章の直下は統合版1本にします`);
    try {
      const legacyFiles = await fs.readdir(path.join(root, folder, 'legacy'));
      assert.deepEqual(legacyFiles, [], `${folder}: 削除した旧資料が残っています`);
      emptyLegacyCount++;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const data = await read(chapter.file), text = data.toString('utf8');
    assert.equal(hash(data), chapter.sha256, `${chapter.file}: 記録した統合版から変更されています`);

    const headings = [...text.matchAll(/^## (.+)\r?$/gm)];
    const bookHeadings = headings.filter(match => /^\d+$/.test(match[1].trim()));
    const expected = Array.from({length: chapter.page_count}, (_, i) => chapter.page_start + i);
    assert.deepEqual(bookHeadings.map(match => Number(match[1])), expected, `${chapter.file}: ページの欠落・重複・並び順`);
    pages.push(...expected);
    for (const heading of bookHeadings) {
      const index = headings.indexOf(heading);
      const next = headings[index + 1]?.index ?? text.length;
      const body = text.slice(heading.index + heading[0].length, next).trim().replace(/\n---\s*$/, '').trim();
      const recorded = chapter.pages.find(page => page.page === Number(heading[1]));
      assert.ok(recorded, `${chapter.file}: ページの出典記録がありません`);
      assert.equal(hash(body), recorded.body_sha256, `${chapter.file}: ${heading[1]}ページの本文が記録と不一致`);
    }
    for (const lesson of chapter.lessons) {
      assert.match(text, new RegExp(`^### 第${lesson}回[ \\u3000]`, 'm'), `${chapter.file}: 第${lesson}回の見出し`);
      lessons.add(lesson);
    }
    assert.ok(!/完了したページ数|次回開始するページ数/.test(text), `${chapter.file}: 作業完了メモが本文に混在しています`);
    assert.ok(!/編集注|照合保留|重複ページの扱い|legacy|統合記録/.test(text), `${chapter.file}: 編集時の追記が残っています`);
    const imageHashes = [...text.matchAll(/<img\b[^>]*>/g)].map(match => hash(match[0]));
    assert.deepEqual(imageHashes, chapter.embedded_image_sha256, `${chapter.file}: 埋め込み画像が変更されています`);
  }
  assert.deepEqual(pages, Array.from({length: 466}, (_, i) => i + 15));
  assert.deepEqual([...lessons].sort((a, b) => a - b), Array.from({length: 30}, (_, i) => i + 1));

  for (const original of manifest.originals) {
    await assert.rejects(read(original.archived), {code: 'ENOENT'}, `${original.archived}: 削除対象の旧資料が残っています`);
  }
  assert.equal(hash(await read('sources/sekai_shi_tankyu_mokuji.md')), manifest.toc_sha256, '目次が変更されています');
  console.log(`統合版7本、本文465ページと目次由来の章扉1ページ、全30回の保持、編集時の追記と旧資料${manifest.original_count}本の削除を確認しました。`);
  if (emptyLegacyCount) console.log(`空のlegacyフォルダが${emptyLegacyCount}個残っています（中の資料は削除済み）。`);
}

await checkTranscriptions();
