(() => {
  const api = 'https://api.github.com/repos/pref1x-1/MiniAdam-AI/releases/latest';
  const releasesPage = 'https://github.com/pref1x-1/MiniAdam-AI/releases';
  const installerPattern = /^miniadam[-_ ]setup.*\.exe$/i;
  const langButton = document.getElementById('lang');
  const downloadButton = document.getElementById('downloadButton');
  const finalDownload = document.getElementById('finalDownload');
  const status = document.getElementById('downloadStatus');

  let lang = localStorage.getItem('miniadam-site-language') === 'en' ? 'en' : 'he';
  let downloadState = 'checking';
  let selectedAsset = null;

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
    renderDownloadState();
  }

  function renderDownloadState() {
    const messages = {
      checking: {
        he: 'בודק את זמינות המתקין ב־GitHub Releases…',
        en: 'Checking GitHub Releases for the installer…'
      },
      available: {
        he: selectedAsset
          ? 'המתקין זמין: ' + selectedAsset.name + ' · לחיצה תתחיל את ההורדה.'
          : 'המתקין זמין ב־GitHub Releases.',
        en: selectedAsset
          ? 'Installer available: ' + selectedAsset.name + ' · Click to download.'
          : 'The installer is available on GitHub Releases.'
      },
      missing: {
        he: 'לא נמצא קובץ Setup בגרסה האחרונה. אפשר לפתוח את עמוד הגרסאות הרשמי.',
        en: 'No Setup installer was found in the latest release. Open the official releases page.'
      },
      error: {
        he: 'לא הצלחנו לבדוק כרגע את GitHub. אפשר לפתוח ישירות את עמוד הגרסאות.',
        en: 'GitHub could not be checked right now. You can open the Releases page directly.'
      }
    };

    const available = downloadState === 'available' && selectedAsset && selectedAsset.browser_download_url;
    const url = available ? selectedAsset.browser_download_url : releasesPage;
    downloadButton.href = url;
    finalDownload.href = url;
    status.textContent = messages[downloadState][lang];
    downloadButton.dataset.downloadState = downloadState;
    finalDownload.dataset.downloadState = downloadState;

    if (available) {
      downloadButton.setAttribute('aria-label', lang === 'he'
        ? 'הורד את ' + selectedAsset.name
        : 'Download ' + selectedAsset.name);
    } else {
      downloadButton.setAttribute('aria-label', lang === 'he'
        ? 'פתח את עמוד הגרסאות של MINI ADAM'
        : 'Open MINI ADAM releases');
    }
  }

  langButton.addEventListener('click', () => applyLanguage(lang === 'he' ? 'en' : 'he'));
  applyLanguage(lang);

  fetch(api, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store'
  })
    .then((response) => {
      if (!response.ok) throw new Error('GitHub Releases request failed: ' + response.status);
      return response.json();
    })
    .then((release) => {
      const assets = Array.isArray(release.assets) ? release.assets : [];
      selectedAsset = assets
        .filter((asset) => asset.state === 'uploaded' && installerPattern.test(asset.name || '') && asset.browser_download_url)
        .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))[0] || null;
      downloadState = selectedAsset ? 'available' : 'missing';
      renderDownloadState();
    })
    .catch((error) => {
      console.warn('[MINI ADAM site] Could not check GitHub Releases:', error);
      selectedAsset = null;
      downloadState = 'error';
      renderDownloadState();
    });
})();