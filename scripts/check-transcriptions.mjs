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

  const toc = (await read('sources/sekai_shi_tankyu_mokuji.md')).toString('utf8');
  assert.equal(hash(toc), manifest.toc_sha256, '目次が変更されています');
  const tocLessons = [...toc.matchAll(/^### 第(\d+)回\s+(.+?)\s+……\s+(\d+)\s*$/gm)]
    .map(match => ({lesson: Number(match[1]), title: match[2], start: Number(match[3])}));
  assert.equal(tocLessons.length, 30);
  assert.equal(manifest.lessons.length, 30);
  assert.equal(new Set(manifest.lessons.map(lesson => lesson.file)).size, 30);
  const pages = [], lessons = [];
  let emptyLegacyCount = 0;
  for (const chapter of manifest.chapters) {
    const folder = chapter.folder;
    const chapterLessons = manifest.lessons.filter(lesson => lesson.chapter === chapter.chapter);
    assert.deepEqual(chapterLessons.map(lesson => lesson.lesson), chapter.lessons);
    assert.deepEqual(chapterLessons.map(lesson => lesson.file), chapter.files);
    const markdownFiles = (await fs.readdir(path.join(root, folder))).filter(name => name.endsWith('.md'));
    assert.deepEqual(markdownFiles.sort(), chapter.files.map(file => path.basename(file)).sort(), `${folder}: 各回1本のファイル構成と不一致`);
    try {
      const legacyFiles = await fs.readdir(path.join(root, folder, 'legacy'));
      assert.deepEqual(legacyFiles, [], `${folder}: 削除した旧資料が残っています`);
      emptyLegacyCount++;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const chapterImages = [];
    for (const [index, lesson] of chapterLessons.entries()) {
      const tocLesson = tocLessons.find(item => item.lesson === lesson.lesson);
      assert.equal(lesson.title, tocLesson.title, `${lesson.file}: 書籍の題名と不一致`);
      assert.equal(lesson.lesson_start, tocLesson.start);
      assert.equal(lesson.page_start, index === 0 ? chapter.page_start : tocLesson.start);
      const nextLesson = chapterLessons[index + 1];
      assert.equal(lesson.page_end, nextLesson ? nextLesson.lesson_start - 1 : chapter.page_end);
      assert.equal(lesson.page_count, lesson.page_end - lesson.page_start + 1);
      assert.equal(lesson.file, `${folder}/${String(lesson.lesson).padStart(2, '0')}_${tocLesson.title}.md`);
      const data = await read(lesson.file), text = data.toString('utf8');
      assert.equal(hash(data), lesson.sha256, `${lesson.file}: 記録した分割版から変更されています`);
      assert.ok(text.startsWith(`# 第${lesson.lesson}回　${lesson.title}\n`));

      const headings = [...text.matchAll(/^## (.+)\r?$/gm)];
      const bookHeadings = headings.filter(match => /^\d+$/.test(match[1].trim()));
      const expected = Array.from({length: lesson.page_count}, (_, i) => lesson.page_start + i);
      assert.deepEqual(bookHeadings.map(match => Number(match[1])), expected, `${lesson.file}: ページの欠落・重複・並び順`);
      pages.push(...expected);
      for (const heading of bookHeadings) {
        const next = headings[headings.indexOf(heading) + 1]?.index ?? text.length;
        const body = text.slice(heading.index + heading[0].length, next).trim().replace(/\n---\s*$/, '').trim();
        const recorded = chapter.pages.find(page => page.page === Number(heading[1]));
        assert.ok(recorded, `${lesson.file}: ページの出典記録がありません`);
        assert.equal(hash(body), recorded.body_sha256, `${lesson.file}: ${heading[1]}ページの本文が分割前と不一致`);
        if (Number(heading[1]) === lesson.lesson_start) {
          assert.match(body, new RegExp(`^### 第${lesson.lesson}回[ \\u3000]`, 'm'), `${lesson.file}: 第何回の見出しが目次の開始ページにありません`);
        }
      }
      lessons.push(lesson.lesson);
      assert.ok(!/完了したページ数|次回開始するページ数|編集注|照合保留|重複ページの扱い|legacy|統合記録/.test(text), `${lesson.file}: 編集時の追記が残っています`);
      const imageHashes = [...text.matchAll(/<img\b[^>]*>/g)].map(match => hash(match[0]));
      assert.deepEqual(imageHashes, lesson.embedded_image_sha256, `${lesson.file}: 埋め込み画像が変更されています`);
      chapterImages.push(...imageHashes);
    }
    assert.deepEqual(chapterImages, chapter.embedded_image_sha256, `${folder}: 分割前の画像の欠落・重複`);
  }
  assert.deepEqual(pages, Array.from({length: 466}, (_, i) => i + 15));
  assert.deepEqual(lessons, Array.from({length: 30}, (_, i) => i + 1));

  for (const original of manifest.originals) {
    await assert.rejects(read(original.archived), {code: 'ENOENT'}, `${original.archived}: 削除対象の旧資料が残っています`);
  }
  console.log('全30回を番号・書籍の題名付きの30ファイルに分割し、本文465ページと目次由来の章扉1ページ、各回の見出し・埋め込み画像が分割前と一致することを確認しました。');
  if (emptyLegacyCount) console.log(`空のlegacyフォルダが${emptyLegacyCount}個残っています（中の資料は削除済み）。`);
}

await checkTranscriptions();
