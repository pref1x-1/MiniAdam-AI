(() => {
  const api = 'https://api.github.com/repos/pref1x-1/MiniAdam-AI/releases/latest';
  const releases = 'https://github.com/pref1x-1/MiniAdam-AI/releases';
  const assetName = 'MiniAdam-Setup.exe';
  const langButton = document.getElementById('lang');
  const downloadButton = document.getElementById('downloadButton');
  const finalDownload = document.getElementById('finalDownload');
  const status = document.getElementById('downloadStatus');
  let lang = localStorage.getItem('miniadam-site-language') === 'en' ? 'en' : 'he';

  function applyLanguage(next) {
    lang = next;
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-he][data-en]').forEach((node) => {
      node.innerHTML = node.dataset[next];
    });
    langButton.textContent = next === 'he' ? 'EN' : 'עב';
    langButton.setAttribute('aria-label', next === 'he' ? 'Switch to English' : 'החלף לעברית');
    localStorage.setItem('miniadam-site-language', next);
  }

  function setStatus(available, url) {
    const text = available
      ? { he: 'המתקין זמין ב־GitHub Releases. לחיצה תתחיל את ההורדה.', en: 'The installer is available on GitHub Releases. Click to download.' }
      : { he: 'המתקין עדיין לא צורף ל־GitHub Release. אפשר לבדוק את עמוד הגרסאות הרשמי.', en: 'The installer has not been attached to a GitHub Release yet. Visit the official releases page.' };
    downloadButton.href = url;
    finalDownload.href = url;
    status.textContent = text[lang];
    if (available) {
      downloadButton.setAttribute('download', assetName);
      downloadButton.removeAttribute('aria-disabled');
    } else {
      downloadButton.removeAttribute('download');
    }
  }

  langButton.addEventListener('click', () => applyLanguage(lang === 'he' ? 'en' : 'he'));
  applyLanguage(lang);

  fetch(api, { headers: { Accept: 'application/vnd.github+json' } })
    .then((response) => {
      if (!response.ok) throw new Error('No published release');
      return response.json();
    })
    .then((release) => {
      const asset = Array.isArray(release.assets) ? release.assets.find((item) => item.name === assetName && item.state === 'uploaded') : null;
      setStatus(Boolean(asset), asset ? asset.browser_download_url : releases);
    })
    .catch(() => setStatus(false, releases));
})();