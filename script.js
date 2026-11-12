/* KDJ's Internet World - script.js
   Lovingly copy-pasted from nowhere. */

(function () {
  "use strict";

  // ---------- safe storage (works even when localStorage is blocked) ----------
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* oh well */ }
    }
  };
  window.kdjStore = store;

  // ---------- shared sidebar ----------
  var pages = [
    ["index.html", "🏠 Home Sweet Home"],
    ["about.html", "😎 About Me"],
    ["cool.html", "🔥 Cool Stuff"],
    ["links.html", "🔗 Links 2 Click"],
    ["guestbook.html", "📖 Sign My Guestbook!"]
  ];
  var here = location.pathname.split("/").pop() || "index.html";
  if (here.indexOf(".") === -1) here += ".html"; // pretty URLs on Cloudflare

  var sidebar = document.getElementById("sidebar");
  if (sidebar) {
    var nav = pages.map(function (p) {
      return '<a href="' + p[0] + '"' + (p[0] === here ? ' class="here"' : "") + ">" + p[1] + "</a>";
    }).join("");

    sidebar.innerHTML =
      '<div class="box"><div class="title">Navigation<span class="winbtns"><span>_</span><span>□</span><span>x</span></span></div>' +
      '<div class="content nav">' + nav + "</div></div>" +

      '<div class="box blue"><div class="title">You are visitor #</div>' +
      '<div class="content" style="text-align:center"><div class="counter" id="counter"></div>' +
      '<div style="font-size:11px;margin-top:6px">since 09.09.2001</div></div></div>' +

      '<div class="box pink"><div class="title">Now Playing ♫</div>' +
      '<div class="content" style="text-align:center;font-size:12px">' +
      '<div id="np">kdj_theme.mid</div>' +
      '<button class="retro-btn" id="midi" style="margin-top:6px">▶ Play</button></div></div>' +

      '<div class="box green"><div class="title">Mood Meter</div>' +
      '<div class="content" style="font-size:12px;text-align:center" id="mood"></div></div>' +

      '<div style="text-align:center">' +
      '<span class="badge b1">BEST VIEWED IN<br>NETSCAPE 4.7</span>' +
      '<span class="badge b2">800x600<br>OR BUST</span>' +
      '<span class="badge b3">MADE WITH<br>NOTEPAD</span>' +
      '<span class="badge b5">GET<br>WINAMP!!</span>' +
      "</div>";
  }

  // ---------- shared footer ----------
  var footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML =
      '<div class="webring">' +
      '★ This site is a proud member of the <b>Totally Rad Homepage Webring</b> ★<br>' +
      '<a href="#" data-ring="prev">&lt;&lt; Prev</a> | ' +
      '<a href="#" data-ring="random">Random</a> | ' +
      '<a href="#" data-ring="next">Next &gt;&gt;</a></div>' +
      '<p>© 2001-' + new Date().getFullYear() + ' KDJ. All rights reserved. All lefts too.<br>' +
      'Last updated: <span id="updated"></span> &nbsp;|&nbsp; ' +
      '<a href="mailto:kdj@example.com">E-mail me!</a> ✉️<br>' +
      'No animals were harmed in the making of this website. One keyboard was mildly annoyed.</p>';

    var u = document.getElementById("updated");
    if (u) u.textContent = new Date(document.lastModified).toLocaleDateString("en-US");

    footer.addEventListener("click", function (e) {
      var r = e.target.getAttribute && e.target.getAttribute("data-ring");
      if (!r) return;
      e.preventDefault();
      var msgs = {
        prev: "The previous site in the ring went offline in 2004. RIP. 🪦",
        next: "The next site is 'under construction'. It has been for 20 years.",
        random: "Randomly selected... THIS SITE! What are the odds?! 🎲"
      };
      alertBox(msgs[r]);
    });
  }

  // ---------- visitor counter ----------
  var c = document.getElementById("counter");
  if (c) {
    var n = store.get("kdj_visits", 1336 + Math.floor(Math.random() * 40));
    n += 1;
    store.set("kdj_visits", n);
    var s = String(n).padStart(7, "0");
    c.innerHTML = s.split("").map(function (d) { return "<span>" + d + "</span>"; }).join("");
  }

  // ---------- mood meter ----------
  var mood = document.getElementById("mood");
  if (mood) {
    var moods = [
      ["😎", "Totally radical"], ["🤪", "Hyper on Surge soda"], ["😴", "Dial-up speeds"],
      ["🤖", "Beep boop"], ["🥳", "Party mode"], ["🍕", "Thinking about pizza"],
      ["🎮", "One more level..."], ["✨", "Extremely sparkly"]
    ];
    var m = moods[Math.floor(Math.random() * moods.length)];
    mood.innerHTML = '<div style="font-size:34px">' + m[0] + "</div>" + m[1];
  }

  // ---------- fake MIDI player (Web Audio, original tune) ----------
  var midiBtn = document.getElementById("midi");
  var audioCtx = null, playing = false, timer = null;
  var tune = [ // [semitones from A4, beats]
    [3, 1], [7, 1], [10, 1], [15, 2], [14, 1], [10, 1], [12, 2],
    [8, 1], [12, 1], [15, 1], [19, 2], [17, 1], [15, 1], [14, 2],
    [3, 1], [7, 1], [10, 1], [15, 1], [17, 1], [19, 1], [22, 2],
    [20, 1], [19, 1], [17, 1], [15, 1], [14, 1], [10, 1], [15, 4]
  ];
  function playTune() {
    var t = audioCtx.currentTime + 0.05, beat = 0.18;
    tune.forEach(function (n) {
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "square";
      o.frequency.value = 440 * Math.pow(2, n[0] / 12);
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + n[1] * beat * 0.95);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + n[1] * beat);
      t += n[1] * beat;
    });
    var total = tune.reduce(function (a, n) { return a + n[1]; }, 0) * beat;
    timer = setTimeout(function () { if (playing) playTune(); }, total * 1000 + 300);
  }
  if (midiBtn) {
    midiBtn.addEventListener("click", function () {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) { alertBox("Your browser can't play MIDI. Upgrade to Windows ME!"); return; }
      if (!audioCtx) audioCtx = new Ctx();
      playing = !playing;
      midiBtn.textContent = playing ? "■ Stop" : "▶ Play";
      document.getElementById("np").innerHTML = playing
        ? '<span class="blink">♪</span> kdj_theme.mid <span class="blink">♪</span>'
        : "kdj_theme.mid";
      if (playing) playTune(); else clearTimeout(timer);
    });
  }

  // ---------- sparkle cursor trail ----------
  var sparkles = ["✨", "⭐", "💫", "🌟", "✦"];
  var last = 0;
  document.addEventListener("mousemove", function (e) {
    var now = Date.now();
    if (now - last < 45) return;
    last = now;
    var s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    s.style.left = e.clientX + 6 + "px";
    s.style.top = e.clientY + 6 + "px";
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 900);
  });

  // ---------- Windows 98-style popup (instead of real alert()) ----------
  function alertBox(msg) {
    var old = document.getElementById("kdj-alert");
    if (old) old.remove();
    var d = document.createElement("div");
    d.id = "kdj-alert";
    d.className = "box";
    d.style.cssText = "position:fixed;top:30%;left:50%;transform:translateX(-50%);width:320px;max-width:90vw;z-index:10000;background:#c0c0c0;box-shadow:4px 4px 0 #000";
    d.innerHTML = '<div class="title">Message from KDJ<span class="winbtns"><span>x</span></span></div>' +
      '<div class="content" style="font-family:Tahoma,sans-serif;font-size:13px">' +
      '<div style="display:flex;gap:10px;align-items:center"><span style="font-size:28px">ℹ️</span><span></span></div>' +
      '<div style="text-align:center;margin-top:10px"><button class="retro-btn">OK</button></div></div>';
    d.querySelector(".content span:last-child").textContent = msg;
    d.querySelector("button").onclick = function () { d.remove(); };
    d.querySelector(".winbtns span").onclick = function () { d.remove(); };
    document.body.appendChild(d);
  }
  window.alertBox = alertBox;

  // ---------- Konami code easter egg ----------
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], kpos = 0;
  document.addEventListener("keydown", function (e) {
    kpos = (e.keyCode === konami[kpos]) ? kpos + 1 : (e.keyCode === konami[0] ? 1 : 0);
    if (kpos === konami.length) {
      kpos = 0;
      document.body.style.transition = "transform 1s";
      document.body.style.transform = "rotate(360deg)";
      setTimeout(function () { document.body.style.transition = ""; document.body.style.transform = ""; }, 1100);
      alertBox("CHEAT CODE ACTIVATED! +30 lives. Use them wisely. 🕹️");
    }
  });
})();
