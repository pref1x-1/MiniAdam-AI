(() => {
  'use strict';

  const releaseApi='https://api.github.com/repos/pref1x-1/MiniAdam-AI/releases/latest';
  const releasesPage='https://github.com/pref1x-1/MiniAdam-AI/releases';
  const installerPattern=/^miniadam[-_ ]setup.*\.exe$/i;
  const root=document.documentElement;
  const langButton=document.getElementById('lang');
  const downloadButton=document.getElementById('downloadButton');
  const finalDownload=document.getElementById('finalDownload');
  const downloadStatus=document.getElementById('downloadStatus');
  const statusText=downloadStatus?.querySelector('span:last-child');
  const versionBadge=document.getElementById('versionBadge');
  const menuToggle=document.getElementById('menuToggle');
  const siteNav=document.getElementById('siteNav');
  const a11yTrigger=document.getElementById('a11yTrigger');
  const a11yPanel=document.getElementById('a11yPanel');
  const a11yClose=document.getElementById('a11yClose');
  const a11yScale=document.getElementById('a11yScale');
  const a11yFeedback=document.getElementById('a11yFeedback');

  let language='he';
  let releaseAsset=null;
  let releaseInfo=null;
  let downloadState='checking';
  const defaults={scale:1,contrast:false,links:false,readable:false,grayscale:false,motion:false,spacing:false};
  let accessibility={...defaults};

  function readStorage(key,fallback){
    try{const value=localStorage.getItem(key);return value===null?fallback:value}catch{return fallback}
  }
  function writeStorage(key,value){try{localStorage.setItem(key,value)}catch{/* Storage is optional. */}}

  function applyLanguage(next){
    language=next==='en'?'en':'he';
    root.lang=language;
    root.dir=language==='he'?'rtl':'ltr';
    document.querySelectorAll('[data-he][data-en]').forEach(node=>{
      const value=node.dataset[language];
      if(value!==undefined)node.innerHTML=value;
    });
    if(langButton){
      langButton.textContent=language==='he'?'EN':'עב';
      langButton.setAttribute('aria-label',language==='he'?'Switch to English':'החלף לעברית');
    }
    renderDownload();
    a11yTrigger?.setAttribute('aria-label',language==='he'?'פתח תפריט נגישות':'Open accessibility menu');
    a11yClose?.setAttribute('aria-label',language==='he'?'סגירת תפריט נגישות':'Close accessibility menu');
    menuToggle?.setAttribute('aria-label',language==='he'?'פתח תפריט ניווט':'Open navigation');
    writeStorage('miniadam-site-language',language);
  }

  function loadAccessibility(){
    try{
      const saved=JSON.parse(readStorage('miniadam-a11y','null'));
      if(saved&&typeof saved==='object')accessibility={...defaults,...saved};
    }catch{accessibility={...defaults}}
    applyAccessibility(false);
  }
  function saveAccessibility(){writeStorage('miniadam-a11y',JSON.stringify(accessibility))}
  function applyAccessibility(announce=true){
    const classes={
      contrast:'a11y-contrast',links:'a11y-links',readable:'a11y-readable-font',
      grayscale:'a11y-grayscale',motion:'a11y-reduced-motion',spacing:'a11y-spacing'
    };
    Object.entries(classes).forEach(([key,className])=>root.classList.toggle(className,!!accessibility[key]));
    const scale=Math.min(1.5,Math.max(1,Number(accessibility.scale)||1));
    root.style.setProperty('--a11y-zoom',String(scale));
    if(a11yScale)a11yScale.textContent=Math.round(scale*100)+'%';
    document.querySelectorAll('[data-a11y-toggle]').forEach(button=>{
      const key=button.dataset.a11yToggle;
      button.setAttribute('aria-pressed',String(!!accessibility[key]));
    });
    saveAccessibility();
    if(announce&&a11yFeedback){
      a11yFeedback.textContent=language==='he'?'העדפות הנגישות עודכנו ונשמרו בדפדפן.':'Accessibility preferences updated and saved in this browser.';
    }
  }
  function openAccessibility(){
    if(!a11yPanel||!a11yTrigger)return;
    a11yPanel.hidden=false;
    a11yTrigger.setAttribute('aria-expanded','true');
    a11yClose?.focus();
  }
  function closeAccessibility(returnFocus=true){
    if(!a11yPanel||!a11yTrigger)return;
    a11yPanel.hidden=true;
    a11yTrigger.setAttribute('aria-expanded','false');
    if(returnFocus)a11yTrigger.focus();
  }

  function formatBytes(bytes){
    if(!Number.isFinite(bytes)||bytes<=0)return '';
    return bytes>=1024*1024?(bytes/(1024*1024)).toFixed(1)+' MB':Math.round(bytes/1024)+' KB';
  }
  function updateStatus(){
    if(!downloadStatus||!statusText)return;
    const messages={
      checking:{he:'בודק את המתקין הרשמי…',en:'Checking the official installer…'},
      available:{he:releaseAsset?'המתקין זמין · '+formatBytes(releaseAsset.size)+' · הורדה מאובטחת מ־GitHub':'המתקין זמין ב־GitHub Releases',en:releaseAsset?'Installer available · '+formatBytes(releaseAsset.size)+' · hosted on GitHub':'Installer available on GitHub Releases'},
      missing:{he:'לא נמצא מתקין בגרסה האחרונה. ניתן לעיין בכל הגרסאות.',en:'No installer was found in the latest release. Browse all releases.'},
      error:{he:'לא ניתן לבדוק כרגע את GitHub. אפשר לעבור לעמוד הגרסאות.',en:'GitHub could not be checked right now. Open the Releases page.'}
    };
    statusText.textContent=messages[downloadState][language];
    downloadStatus.dataset.state=downloadState;
  }
  function renderDownload(){
    if(!downloadButton||!finalDownload)return;
    const available=downloadState==='available'&&releaseAsset?.browser_download_url;
    const url=available?releaseAsset.browser_download_url:releasesPage;
    downloadButton.href=url;
    finalDownload.href=url;
    if(versionBadge)versionBadge.textContent=available?(releaseInfo?.tag_name||'SETUP'):'SETUP';
    downloadButton.title=available?releaseAsset.name:(language==='he'?'פתיחת עמוד הגרסאות':'Open releases page');
    finalDownload.title=downloadButton.title;
    updateStatus();
  }
  async function checkLatestRelease(){
    if(!downloadButton||!finalDownload)return;
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),8000);
    try{
      const response=await fetch(releaseApi,{headers:{Accept:'application/vnd.github+json'},cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error('GitHub API returned '+response.status);
      const release=await response.json();
      const assets=Array.isArray(release.assets)?release.assets:[];
      releaseAsset=assets
        .filter(asset=>asset&&asset.state==='uploaded'&&installerPattern.test(asset.name||'')&&typeof asset.browser_download_url==='string')
        .sort((a,b)=>new Date(b.updated_at||b.created_at||0)-new Date(a.updated_at||a.created_at||0))[0]||null;
      releaseInfo=release;
      downloadState=releaseAsset?'available':'missing';
    }catch(error){
      console.warn('[MINI ADAM] Release lookup failed:',error);
      releaseAsset=null;releaseInfo=null;downloadState='error';
    }finally{
      window.clearTimeout(timeout);
      renderDownload();
    }
  }

  function initNavigation(){
    menuToggle?.addEventListener('click',()=>{
      const open=menuToggle.getAttribute('aria-expanded')!=='true';
      menuToggle.setAttribute('aria-expanded',String(open));
      siteNav?.classList.toggle('is-open',open);
      menuToggle.setAttribute('aria-label',language==='he'?(open?'סגור תפריט ניווט':'פתח תפריט ניווט'):(open?'Close navigation':'Open navigation'));
      const menuIcon=menuToggle.querySelector('.icon');
      if(menuIcon)menuIcon.textContent=open?'close':'menu';
    });
    siteNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      siteNav.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded','false');
      menuToggle?.setAttribute('aria-label',language==='he'?'פתח תפריט ניווט':'Open navigation');
      const menuIcon=menuToggle?.querySelector('.icon');
      if(menuIcon)menuIcon.textContent='menu';
    }));
  }
  function initAccessibility(){
    if(!a11yTrigger||!a11yPanel)return;
    a11yTrigger.addEventListener('click',()=>{
      const open=a11yTrigger.getAttribute('aria-expanded')==='true';
      if(open)closeAccessibility(false);else openAccessibility();
    });
    a11yClose?.addEventListener('click',()=>closeAccessibility(true));
    a11yPanel.addEventListener('click',event=>{
      const toggle=event.target.closest('[data-a11y-toggle]');
      const action=event.target.closest('[data-a11y-action]');
      if(toggle){
        const key=toggle.dataset.a11yToggle;
        if(Object.prototype.hasOwnProperty.call(accessibility,key)){
          accessibility[key]=!accessibility[key];
          applyAccessibility();
        }
      }
      if(action){
        switch(action.dataset.a11yAction){
          case 'increase':accessibility.scale=Math.min(1.5,Math.round((accessibility.scale+.1)*100)/100);break;
          case 'decrease':accessibility.scale=Math.max(1,Math.round((accessibility.scale-.1)*100)/100);break;
          case 'reset':accessibility={...defaults};break;
        }
        applyAccessibility();
      }
    });
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!a11yPanel.hidden)closeAccessibility(true);
    });
    document.addEventListener('pointerdown',event=>{
      if(a11yPanel.hidden)return;
      if(a11yTrigger.contains(event.target))return;
      if(!a11yPanel.contains(event.target))closeAccessibility(false);
    });
    loadAccessibility();
  }

  function initReveal(){
    const items=[...document.querySelectorAll('[data-reveal]')];
    if(!items.length)return;
    if(!('IntersectionObserver'in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(item=>item.classList.add('is-visible'));return}
    root.classList.add('js-ready');
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    items.forEach(item=>observer.observe(item));
  }
  function initParallax(){
    const stage=document.getElementById('deviceStage');
    if(!stage||root.classList.contains('a11y-reduced-motion')||!window.matchMedia('(pointer:fine)').matches||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const visual=stage.closest('.hero-visual');
    visual?.addEventListener('pointermove',event=>{
      const rect=visual.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      stage.style.setProperty('--tilt-y',(x*2.5).toFixed(2)+'deg');
      stage.style.setProperty('--tilt-x',(-y*1.5).toFixed(2)+'deg');
    });
    visual?.addEventListener('pointerleave',()=>{
      stage.style.setProperty('--tilt-x','0deg');
      stage.style.setProperty('--tilt-y','0deg');
    });
  }
  function initFaq(){
    document.querySelectorAll('.faq-list details').forEach(item=>{
      item.addEventListener('toggle',()=>{
        if(!item.open)return;
        document.querySelectorAll('.faq-list details[open]').forEach(other=>{if(other!==item)other.open=false});
      });
    });
  }

  langButton?.addEventListener('click',()=>applyLanguage(language==='he'?'en':'he'));
  language=readStorage('miniadam-site-language','he')==='en'?'en':'he';
  applyLanguage(language);
  initNavigation();
  initAccessibility();
  initReveal();
  initParallax();
  initFaq();
  checkLatestRelease();
})();