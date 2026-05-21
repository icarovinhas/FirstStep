function videoCardHTML(vid) {
  return `<div class="video-card" onclick="openVideo('${vid.id}')">
    <div class="video-thumb">
      <img src="https://img.youtube.com/vi/${vid.id}/mqdefault.jpg" alt="${vid.title}" loading="lazy" />
      <div class="play-overlay">
        <div class="play-btn">
          <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
    </div>
    <div class="video-info">
      <h4>${vid.title}</h4>
      <p>Assistir no YouTube</p>
    </div>
  </div>`;
}

function renderSections(data, activeKey) {
  let html = '';
  const keys = activeKey === 'all' ? Object.keys(data) : [activeKey];
  keys.forEach(k => {
    const sec = data[k];
    html += `<div class="video-section" data-key="${k}">
      <div class="video-section-title">${sec.label}</div>
      <div class="video-section-desc">${sec.desc}</div>
      <div class="videos-grid">
        ${sec.videos.map(v => videoCardHTML(v)).join('')}
      </div>
    </div>`;
  });
  return html;
}

function initCarreira() {
  document.getElementById('carreiraContent').innerHTML = renderSections(CARREIRA_DATA, 'all');
}

function initHumano() {
  document.getElementById('humanoContent').innerHTML = renderSections(HUMANO_DATA, 'all');
}

function initDicas() {
  document.getElementById('dicasGrid').innerHTML = DICAS_DATA.map(v => videoCardHTML(v)).join('');
}

function showSubCat(page, key, btn) {
  const data = page === 'carreira' ? CARREIRA_DATA : HUMANO_DATA;
  document.getElementById(page + 'Content').innerHTML = renderSections(data, key);
  const subNav = document.getElementById(page + 'Sub').querySelectorAll('.sub-nav-btn');
  subNav.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  window.scrollTo({
    top: document.getElementById(page + 'Sub').offsetTop - 70,
    behavior: 'smooth'
  });
}

function openVideo(id) {
  window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener,noreferrer');
}

function closeModal() {}
