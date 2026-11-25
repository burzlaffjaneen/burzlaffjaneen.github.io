/* 暮色女士 · 实时天文月相 + 昼夜状态栏 + 暮色星尘浮光 + 锁屏时钟 */
(function () {
  /* 1. 锁屏时钟 */
  var clocks = document.querySelectorAll('[data-clock-time]');
  function tickClock() {
    var n = new Date();
    var hm = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
    clocks.forEach(function (el) { el.textContent = hm; });
  }
  if (clocks.length) {
    tickClock();
    setInterval(tickClock, 10000);
  }

  /* 2. 实时天文月相计算（朔望月 29.53058867 天） */
  function getMoonPhase(date) {
    var ref = Date.UTC(2000, 0, 6, 18, 14, 0);
    var synodic = 29.53058867 * 86400000;
    var phase = (((date.getTime() - ref) % synodic) + synodic) % synodic / synodic;
    var idx = Math.floor(phase * 8 + 0.5) % 8;
    var names = [
      { cn: '新月', en: 'NEW MOON', svg: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".65"/>' },
      { cn: '峨眉月', en: 'WAXING CRESCENT', svg: '<path d="M13.5 4.2a8 8 0 1 0 0 15.6 6.2 6.2 0 0 1 0-15.6z" fill="currentColor"/>' },
      { cn: '上弦月', en: 'FIRST QUARTER', svg: '<path d="M12 4a8 8 0 0 1 0 16V4z" fill="currentColor"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".45"/>' },
      { cn: '盈凸月', en: 'WAXING GIBBOUS', svg: '<circle cx="12" cy="12" r="8" fill="currentColor"/><path d="M9.5 4.4a8 8 0 0 0 0 15.2 5.4 5.4 0 0 1 0-15.2z" fill="#130c1f" opacity=".7"/>' },
      { cn: '绯满月', en: 'FULL MOON', svg: '<circle cx="12" cy="12" r="8" fill="currentColor"/>' },
      { cn: '亏凸月', en: 'WANING GIBBOUS', svg: '<circle cx="12" cy="12" r="8" fill="currentColor"/><path d="M14.5 4.4a8 8 0 0 1 0 15.2 5.4 5.4 0 0 0 0-15.2z" fill="#130c1f" opacity=".7"/>' },
      { cn: '下弦月', en: 'LAST QUARTER', svg: '<path d="M12 4a8 8 0 0 0 0 16V4z" fill="currentColor"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".45"/>' },
      { cn: '残月', en: 'WANING CRESCENT', svg: '<path d="M10.5 4.2a8 8 0 1 1 0 15.6 6.2 6.2 0 0 0 0-15.6z" fill="currentColor"/>' }
    ];
    return names[idx];
  }

  var now = new Date();
  var moon = getMoonPhase(now);
  var moonIcon = document.querySelector('[data-moon-icon]');
  if (moonIcon) {
    moonIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + moon.svg + '</svg>';
    moonIcon.title = moon.cn + ' · ' + moon.en;
  }

  var statusEl = document.querySelector('[data-twilight-status]');
  if (statusEl) {
    var h = now.getHours();
    var phaseText = moon.cn + ' · ' + moon.en;
    if (h >= 17 && h < 20) {
      statusEl.textContent = 'TWILIGHT HOUR：暮色正浓，昼夜交界 · ' + phaseText;
    } else if (h >= 20 || h < 5) {
      statusEl.textContent = 'VESPER WATCH：夜幕垂落，绯月高悬 · ' + phaseText;
    } else if (h >= 5 && h < 9) {
      statusEl.textContent = 'DAWN MIST：薄雾初散，晨昏未明 · ' + phaseText;
    } else {
      statusEl.textContent = 'TWILIGHT SANCTUM：静候黄昏 · ' + phaseText;
    }
  }

  /* 3. 极克制的暮色星尘浮光 */
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var host = document.createElement('div');
    host.className = 'twilight-motes';
    host.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 16; i++) {
      var m = document.createElement('span');
      m.className = 'twilight-mote' + (i % 3 === 0 ? ' rose' : '');
      var sz = 2 + (i % 3) * 1.5;
      m.style.width = sz + 'px';
      m.style.height = sz + 'px';
      m.style.left = ((i * 37 + 11) % 96) + '%';
      m.style.top = ((i * 53 + 17) % 88) + '%';
      m.style.setProperty('--dur', (14 + (i % 5) * 3.5) + 's');
      m.style.setProperty('--del', (-1 * (i * 1.9)) + 's');
      m.style.setProperty('--dx', ((i % 2 ? 1 : -1) * (10 + (i % 4) * 5)) + 'px');
      m.style.setProperty('--op', (0.28 + (i % 3) * 0.12).toFixed(2));
      host.appendChild(m);
    }
    document.body.insertBefore(host, document.body.firstChild);
  }
})();
