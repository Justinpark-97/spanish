let loading = false;
async function loadWords() {
  if (loading) return;
  loading = true;
  const status = document.getElementById('status');
  const button = document.getElementById('reload');
  button.disabled = true;
  try {
    const response = await fetch('./daily-words.json', {cache: 'no-store'});
    if (!response.ok) throw new Error('데이터를 아직 사용할 수 없습니다.');
    const data = await response.json();
    const updated = new Date(data.updated_at);
    if (!Array.isArray(data.words) || data.words.length !== 20 || Number.isNaN(updated.getTime())) {
      throw new Error('데이터 형식이 올바르지 않습니다.');
    }
    const rows = document.createDocumentFragment();
    const seen = new Set();
    for (const [index, item] of data.words.entries()) {
      const source = new URL(item.source);
      if (source.protocol !== 'https:' || source.hostname !== 'cnnespanol.cnn.com' ||
          typeof item.spanish !== 'string' || typeof item.korean !== 'string' || seen.has(item.spanish)) {
        throw new Error('단어 데이터를 확인할 수 없습니다.');
      }
      seen.add(item.spanish);
      const card = document.createElement('article');
      for (const [tag, className, text] of [
        ['span', 'number', String(index + 1).padStart(2, '0')],
        ['h2', '', item.spanish], ['p', 'meaning', `EN · ${item.english}`], ['p', 'meaning', `KO · ${item.korean}`]
      ]) {
        const node = document.createElement(tag);
        node.className = className;
        node.textContent = text;
        card.appendChild(node);
      }
      const link = document.createElement('a');
      link.href = source.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = '원문 기사 읽기 ↗';
      link.setAttribute('aria-label', `${item.spanish} 출처 기사 (새 창)`);
      card.appendChild(link);
      rows.appendChild(card);
    }
    document.getElementById('words').replaceChildren(rows);
    const dateFormat = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'});
    const stale = dateFormat.format(updated) !== dateFormat.format(new Date());
    status.textContent = `${data.translation_enabled === false ? '번역 없이 표시 중 · ' : ''}${stale ? '이전 업데이트 자료 · ' : ''}마지막 업데이트: ${updated.toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})} (한국 시간)`;
  } catch (error) {
    const hasData = document.getElementById('words').children.length > 0;
    status.textContent = hasData
      ? '갱신 확인에 실패했습니다. 기존 단어를 표시하며 5분 후 다시 확인합니다.'
      : '아직 단어를 불러올 수 없습니다. 첫 자동 실행 완료 후 표시됩니다. 5분 후 다시 확인합니다.';
    console.error(error);
  } finally {
    loading = false;
    button.disabled = false;
  }
}
document.getElementById('reload').addEventListener('click', loadWords);
loadWords();
setInterval(loadWords, 5 * 60 * 1000);
