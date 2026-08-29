import React, { useState, useRef, useEffect, useCallback } from "react";

// カラートークン ── 精密計測機器 / クロノグラフの世界観
const C = {
  bg0: "#0d1117",
  bg1: "#161d29",
  ring: "#232c3a",
  face: "#f2efe6",   // 温白色の文字盤
  faint: "#5c6675",  // 補助
  live: "#ff5a3c",   // 走行中(秒針の赤)
  idle: "#3a86c4",   // 停止/待機
  best: "#4ac48a",   // 最速ラップ / タイマー
  worst: "#ff6b57",  // 最遅ラップ
};

const pad = (n, len = 2) => String(n).padStart(len, "0");

function splitTime(ms) {
  const t = Math.max(0, Math.floor(ms));
  const cs = Math.floor((t % 1000) / 10);
  const s = Math.floor(t / 1000) % 60;
  const m = Math.floor(t / 60000) % 60;
  const h = Math.floor(t / 3600000);
  return { h, m, s, cs };
}
function fmt(ms) {
  const { h, m, s, cs } = splitTime(ms);
  const main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  return { main, cs: pad(cs) };
}
const fullStr = (ms) => { const f = fmt(ms); return `${f.main}.${f.cs}`; };

// アラート音（Web Audio）
function beep(times = 3) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    for (let i = 0; i < times; i++) {
      const t = ctx.currentTime + i * 0.5;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      o.start(t); o.stop(t + 0.4);
    }
  } catch (e) { /* 無音でも続行 */ }
}

// 永続ストレージ（利用不可でもクラッシュしない）
const store = {
  async get(k) {
    try { const r = await window.storage.get(k); return r ? r.value : null; }
    catch (e) { return null; }
  },
  async set(k, v) {
    try { await window.storage.set(k, v); } catch (e) { /* skip */ }
  },
};
const KEY = "timer-suite:records";

export default function App() {
  const [mode, setMode] = useState("stopwatch");
  const [records, setRecords] = useState([]);

  // 記録のロード
  useEffect(() => {
    (async () => {
      const raw = await store.get(KEY);
      if (raw) { try { setRecords(JSON.parse(raw)); } catch (e) {} }
    })();
  }, []);

  const addRecord = useCallback((rec) => {
    setRecords((prev) => {
      const next = [{ ...rec, id: Date.now() + Math.random(), at: Date.now() }, ...prev].slice(0, 50);
      store.set(KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const removeRecord = useCallback((id) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id);
      store.set(KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const clearRecords = useCallback(() => {
    setRecords([]); store.set(KEY, JSON.stringify([]));
  }, []);

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .ts-btn { transition: transform .12s ease, background .2s, border-color .2s, color .2s; }
        .ts-btn:active { transform: scale(.94); }
        .ts-btn:focus-visible { outline: 2px solid ${C.face}; outline-offset: 3px; }
        .ts-in { animation: tsIn .28s ease; }
        @keyframes tsIn { from { opacity:0; transform:translateY(-6px);} to{opacity:1;transform:none;} }
        @keyframes tsFlash { 0%,100%{opacity:1;} 50%{opacity:.35;} }
        .ts-scroll::-webkit-scrollbar { width:6px; }
        .ts-scroll::-webkit-scrollbar-thumb { background:${C.ring}; border-radius:3px; }
        @media (prefers-reduced-motion: reduce){ .ts-btn,.ts-in{transition:none;animation:none;} }
      `}</style>

      <div style={S.card}>
        {/* モード切替 */}
        <div style={S.tabs}>
          {[["stopwatch", "ストップウォッチ"], ["timer", "タイマー"], ["memory", "メモリー"]].map(([k, label]) => (
            <button
              key={k}
              className="ts-btn"
              onClick={() => setMode(k)}
              style={{
                ...S.tab,
                background: mode === k ? "rgba(242,239,230,.08)" : "transparent",
                color: mode === k ? C.face : C.faint,
                borderColor: mode === k ? C.ring : "transparent",
              }}
            >
              {label}{k === "memory" && records.length > 0 ? ` ${records.length}` : ""}
            </button>
          ))}
        </div>

        {mode === "stopwatch" && <Stopwatch onSave={addRecord} />}
        {mode === "timer" && <Timer onSave={addRecord} />}
        {mode === "memory" && (
          <Memory records={records} onRemove={removeRecord} onClear={clearRecords} onGo={setMode} />
        )}
      </div>
    </div>
  );
}

/* ─────────── 共通の文字盤 ─────────── */
function Dial({ progress, accent, running, children }) {
  const R = 132, CIRC = 2 * Math.PI * R;
  const dash = CIRC * Math.max(0, Math.min(1, progress));
  return (
    <div style={S.dialWrap}>
      <svg width="300" height="300" viewBox="0 0 300 300" style={{ display: "block" }}>
        <circle cx="150" cy="150" r={R} fill="none" stroke={C.ring} strokeWidth="3" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
          const major = i % 5 === 0;
          const r1 = major ? R - 12 : R - 6;
          return (
            <line
              key={i}
              x1={150 + Math.cos(a) * r1} y1={150 + Math.sin(a) * r1}
              x2={150 + Math.cos(a) * R} y2={150 + Math.sin(a) * R}
              stroke={major ? C.faint : C.ring} strokeWidth={major ? 2 : 1}
            />
          );
        })}
        <circle
          cx="150" cy="150" r={R} fill="none"
          stroke={accent} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRC}`}
          transform="rotate(-90 150 150)"
          style={{ transition: running ? "none" : "stroke-dasharray .3s, stroke .3s" }}
        />
      </svg>
      <div style={S.readout}>{children}</div>
    </div>
  );
}

function StatusRow({ accent, running, text }) {
  return (
    <div style={S.eyebrow}>
      <span style={{ ...S.dot, background: accent, boxShadow: running ? `0 0 10px ${accent}` : "none" }} />
      <span>{text}</span>
    </div>
  );
}

/* ─────────── ストップウォッチ ─────────── */
function Stopwatch({ onSave }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const accumRef = useRef(0), startRef = useRef(0), rafRef = useRef(null);

  const tick = useCallback(() => {
    setElapsed(accumRef.current + (performance.now() - startRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);
  const start = useCallback(() => {
    if (rafRef.current) return;
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    setRunning(true);
  }, [tick]);
  const stop = useCallback(() => {
    if (!rafRef.current) return;
    cancelAnimationFrame(rafRef.current); rafRef.current = null;
    accumRef.current += performance.now() - startRef.current;
    setElapsed(accumRef.current); setRunning(false);
  }, []);
  const toggle = useCallback(() => (running ? stop() : start()), [running, start, stop]);
  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null; accumRef.current = 0; startRef.current = 0;
    setElapsed(0); setLaps([]); setRunning(false);
  }, []);
  const lap = useCallback(() => {
    if (!running) return;
    setLaps((p) => [...p, accumRef.current + (performance.now() - startRef.current)]);
  }, [running]);

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "BUTTON" && e.code === "Space") return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.key.toLowerCase() === "l") lap();
      else if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, lap, reset]);

  const disp = fmt(elapsed);
  const accent = running ? C.live : elapsed > 0 ? C.idle : C.faint;
  const segments = laps.map((c, i) => c - (i === 0 ? 0 : laps[i - 1]));
  let bestIdx = -1, worstIdx = -1;
  if (segments.length > 1) {
    let mn = Infinity, mx = -Infinity;
    segments.forEach((v, i) => { if (v < mn) { mn = v; bestIdx = i; } if (v > mx) { mx = v; worstIdx = i; } });
  }
  const [saved, setSaved] = useState(false);
  const save = () => {
    if (elapsed === 0) return;
    onSave({ kind: "stopwatch", time: elapsed, laps: segments });
    setSaved(true); setTimeout(() => setSaved(false), 1400);
  };

  return (
    <>
      <StatusRow accent={accent} running={running}
        text={running ? "計測中" : elapsed > 0 ? "一時停止" : "待機"} />
      <Dial progress={(elapsed % 60000) / 60000} accent={accent} running={running}>
        <div style={S.time}>
          <span>{disp.main}</span><span style={S.cs}>.{disp.cs}</span>
        </div>
        {laps.length > 0 && <div style={S.sub}>ラップ {laps.length}</div>}
      </Dial>

      <div style={S.controls}>
        <button className="ts-btn" onClick={running ? lap : reset}
          disabled={!running && elapsed === 0}
          style={{ ...S.side, opacity: !running && elapsed === 0 ? 0.4 : 1,
            cursor: !running && elapsed === 0 ? "default" : "pointer" }}>
          {running ? "ラップ" : "リセット"}
        </button>
        <button className="ts-btn" onClick={toggle}
          style={{ ...S.primary,
            background: running ? "rgba(255,90,60,.14)" : "rgba(58,134,196,.16)",
            borderColor: running ? C.live : C.idle, color: running ? C.live : C.idle }}>
          {running ? "ストップ" : elapsed > 0 ? "再開" : "スタート"}
        </button>
      </div>

      {elapsed > 0 && !running && (
        <button className="ts-btn ts-in" onClick={save} style={S.saveBtn}>
          {saved ? "メモリーに保存しました" : "この記録をメモリーに保存"}
        </button>
      )}

      {laps.length > 0 && (
        <div className="ts-scroll" style={S.laps}>
          {segments.map((seg, i) => {
            const col = i === bestIdx ? C.best : i === worstIdx ? C.worst : C.face;
            const sd = fmt(seg);
            return (
              <div key={i} className="ts-in" style={S.lapRow}>
                <span style={{ ...S.lapNo, color: col }}>{pad(i + 1)}</span>
                {i === bestIdx && <span style={{ ...S.tag, color: C.best }}>最速</span>}
                {i === worstIdx && <span style={{ ...S.tag, color: C.worst }}>最遅</span>}
                <span style={{ ...S.lapSeg, color: col }}>{sd.main}<span style={S.csSm}>.{sd.cs}</span></span>
                <span style={S.lapCum}>{fullStr(laps[i])}</span>
              </div>
            );
          })}
        </div>
      )}
      <div style={S.hint}>Space 開始/停止 ・ L ラップ ・ R リセット</div>
    </>
  );
}

/* ─────────── カウントダウンタイマー ─────────── */
const PRESETS = [
  ["30秒", 30_000], ["1分", 60_000], ["3分", 180_000],
  ["5分", 300_000], ["10分", 600_000], ["25分", 1_500_000],
];

function Timer({ onSave }) {
  const [duration, setDuration] = useState(300_000);
  const [remaining, setRemaining] = useState(300_000);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const targetRef = useRef(0), rafRef = useRef(null);

  const clearRaf = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };

  const finish = useCallback(() => {
    clearRaf(); setRemaining(0); setRunning(false); setFinished(true); beep(3);
  }, []);
  const tick = useCallback(() => {
    const rem = targetRef.current - performance.now();
    if (rem <= 0) { finish(); return; }
    setRemaining(rem);
    rafRef.current = requestAnimationFrame(tick);
  }, [finish]);
  const start = useCallback(() => {
    if (rafRef.current || remaining <= 0) return;
    targetRef.current = performance.now() + remaining;
    rafRef.current = requestAnimationFrame(tick);
    setRunning(true); setFinished(false);
  }, [remaining, tick]);
  const pause = useCallback(() => {
    if (!rafRef.current) return;
    clearRaf(); setRemaining(Math.max(0, targetRef.current - performance.now())); setRunning(false);
  }, []);
  const toggle = useCallback(() => (running ? pause() : start()), [running, pause, start]);
  const resetTimer = useCallback(() => {
    clearRaf(); setRunning(false); setFinished(false); setRemaining(duration);
  }, [duration]);
  const applyDuration = useCallback((ms) => {
    clearRaf(); setRunning(false); setFinished(false);
    setDuration(ms); setRemaining(ms);
  }, []);
  const bump = (deltaMs) => applyDuration(Math.max(0, Math.min(24 * 3600_000, duration + deltaMs)));

  useEffect(() => () => clearRaf(), []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "BUTTON" && e.code === "Space") return;
      if (e.code === "Space") { e.preventDefault(); finished ? resetTimer() : toggle(); }
      else if (e.key.toLowerCase() === "r") resetTimer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, resetTimer, finished]);

  const disp = fmt(remaining);
  const accent = finished ? C.worst : running ? C.best : remaining < duration ? C.idle : C.faint;
  const progress = duration > 0 ? remaining / duration : 0;
  const editing = !running && !finished && remaining === duration;

  return (
    <>
      <StatusRow accent={accent} running={running}
        text={finished ? "時間です" : running ? "カウントダウン中" : editing ? "時間を設定" : "一時停止"} />

      <div style={{ animation: finished ? "tsFlash 0.9s ease-in-out infinite" : "none" }}>
        <Dial progress={progress} accent={accent} running={running}>
          <div style={{ ...S.time, color: finished ? C.worst : C.face }}>
            <span>{disp.main}</span><span style={S.cs}>.{disp.cs}</span>
          </div>
          <div style={S.sub}>{finished ? "終了" : `設定 ${fmt(duration).main}`}</div>
        </Dial>
      </div>

      {editing && (
        <>
          <div style={S.stepRow}>
            <Stepper label="分" onMinus={() => bump(-60_000)} onPlus={() => bump(60_000)} />
            <Stepper label="秒" onMinus={() => bump(-10_000)} onPlus={() => bump(10_000)} />
          </div>
          <div style={S.presetRow}>
            {PRESETS.map(([lbl, ms]) => (
              <button key={ms} className="ts-btn" onClick={() => applyDuration(ms)}
                style={{ ...S.chip, borderColor: duration === ms ? C.idle : C.ring,
                  color: duration === ms ? C.idle : C.faint }}>
                {lbl}
              </button>
            ))}
          </div>
        </>
      )}

      <div style={S.controls}>
        <button className="ts-btn" onClick={resetTimer}
          disabled={editing}
          style={{ ...S.side, opacity: editing ? 0.4 : 1, cursor: editing ? "default" : "pointer" }}>
          リセット
        </button>
        {finished ? (
          <button className="ts-btn" onClick={resetTimer}
            style={{ ...S.primary, background: "rgba(255,107,87,.16)", borderColor: C.worst, color: C.worst }}>
            停止
          </button>
        ) : (
          <button className="ts-btn" onClick={toggle} disabled={remaining <= 0}
            style={{ ...S.primary, opacity: remaining <= 0 ? 0.4 : 1,
              background: running ? "rgba(255,90,60,.14)" : "rgba(74,196,138,.16)",
              borderColor: running ? C.live : C.best, color: running ? C.live : C.best }}>
            {running ? "一時停止" : remaining < duration ? "再開" : "スタート"}
          </button>
        )}
      </div>

      {(finished || (!running && remaining < duration)) && (
        <button className="ts-btn ts-in"
          onClick={() => onSave({ kind: "timer", time: duration, note: finished ? "完了" : "途中" })}
          style={S.saveBtn}>
          このタイマーをメモリーに保存
        </button>
      )}
      <div style={S.hint}>Space 開始/停止 ・ R リセット</div>
    </>
  );
}

function TimeField({ value, label, max, onChange }) {
  const up = () => onChange(value + 1 > max ? 0 : value + 1);
  const down = () => onChange(value - 1 < 0 ? max : value - 1);
  const onInput = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(-2);
    const n = digits === "" ? 0 : parseInt(digits, 10);
    onChange(Math.min(max, n));
  };
  return (
    <div style={S.field}>
      <button className="ts-btn" onClick={up} style={S.spin} aria-label={`${label}を増やす`}>＋</button>
      <input
        value={pad(value)} onChange={onInput}
        onFocus={(e) => e.target.select()}
        inputMode="numeric" maxLength={2}
        aria-label={label}
        style={S.fieldInput}
      />
      <button className="ts-btn" onClick={down} style={S.spin} aria-label={`${label}を減らす`}>−</button>
      <span style={S.fieldLabel}>{label}</span>
    </div>
  );
}

/* ─────────── メモリー ─────────── */
function Memory({ records, onRemove, onClear, onGo }) {
  if (records.length === 0) {
    return (
      <div style={S.empty}>
        <div style={S.emptyTitle}>保存した記録はまだありません</div>
        <div style={S.emptyText}>
          ストップウォッチやタイマーで計測したあと、「メモリーに保存」を押すとここに残ります。記録はこのブラウザに保持されます。
        </div>
        <div style={S.controls}>
          <button className="ts-btn" onClick={() => onGo("stopwatch")} style={{ ...S.side, flex: 1 }}>
            ストップウォッチ
          </button>
          <button className="ts-btn" onClick={() => onGo("timer")}
            style={{ ...S.primary, background: "rgba(74,196,138,.16)", borderColor: C.best, color: C.best }}>
            タイマー
          </button>
        </div>
      </div>
    );
  }
  const dt = (t) => {
    const d = new Date(t);
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  return (
    <>
      <div style={{ ...S.eyebrow, marginTop: 4 }}>
        <span>保存済み {records.length} 件</span>
        <button className="ts-btn" onClick={onClear} style={S.clearBtn}>すべて削除</button>
      </div>
      <div className="ts-scroll" style={{ ...S.laps, maxHeight: 380, marginTop: 4, borderTop: "none" }}>
        {records.map((r) => (
          <div key={r.id} className="ts-in" style={S.memRow}>
            <span style={{ ...S.kindDot, background: r.kind === "timer" ? C.best : C.idle }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              <span style={S.memTime}>{fullStr(r.time)}</span>
              <span style={S.memMeta}>
                {r.kind === "timer" ? "タイマー" : "ストップウォッチ"}
                {r.kind === "stopwatch" && r.laps?.length ? ` ・ ラップ${r.laps.length}` : ""}
                {r.kind === "timer" && r.note ? ` ・ ${r.note}` : ""}
                {` ・ ${dt(r.at)}`}
              </span>
            </div>
            <button className="ts-btn" onClick={() => onRemove(r.id)} style={S.del} aria-label="削除">×</button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────── スタイル ─────────── */
const mono = "'Space Grotesk', ui-monospace, 'SF Mono', Menlo, monospace";
const S = {
  root: {
    minHeight: "100%", width: "100%",
    background: `radial-gradient(120% 90% at 50% 0%, ${C.bg1} 0%, ${C.bg0} 62%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "26px 16px", fontFamily: mono, color: C.face,
  },
  card: { width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 },
  tabs: { display: "flex", gap: 6, width: "100%", background: "rgba(0,0,0,.2)", padding: 4, borderRadius: 14 },
  tab: {
    flex: 1, padding: "9px 4px", borderRadius: 10, border: "1px solid",
    fontFamily: mono, fontSize: 12.5, fontWeight: 500, cursor: "pointer", letterSpacing: "0.01em",
  },
  eyebrow: {
    display: "flex", alignItems: "center", gap: 9, width: "100%", justifyContent: "center",
    fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.faint, fontWeight: 500,
  },
  dot: { width: 8, height: 8, borderRadius: "50%", transition: "all .3s" },
  dialWrap: { position: "relative", width: 300, height: 300 },
  readout: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 },
  time: { display: "flex", alignItems: "baseline", fontSize: 46, fontWeight: 500, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums", color: C.face },
  cs: { fontSize: 22, color: C.faint, fontWeight: 400, marginLeft: 2 },
  sub: { fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.faint },
  controls: { display: "flex", gap: 12, width: "100%" },
  side: { flex: "0 0 108px", height: 54, borderRadius: 14, background: "transparent", border: `1px solid ${C.ring}`, color: C.face, fontFamily: mono, fontSize: 14, letterSpacing: "0.04em" },
  primary: { flex: 1, height: 54, borderRadius: 14, border: "1px solid", fontFamily: mono, fontSize: 16, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer" },
  saveBtn: { width: "100%", height: 44, borderRadius: 12, background: "transparent", border: `1px dashed ${C.ring}`, color: C.faint, fontFamily: mono, fontSize: 13, cursor: "pointer", letterSpacing: "0.03em" },
  muteBtn: { display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 20, background: "transparent", border: "1px solid", fontFamily: mono, fontSize: 12, letterSpacing: "0.04em", cursor: "pointer", alignSelf: "center" },
  fieldRow: { display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 6, width: "100%" },
  field: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  spin: { width: 46, height: 30, borderRadius: 8, background: "transparent", border: `1px solid ${C.ring}`, color: C.faint, fontSize: 16, cursor: "pointer", fontFamily: mono, lineHeight: 1 },
  fieldInput: { width: 62, height: 56, textAlign: "center", background: "rgba(0,0,0,.22)", border: `1px solid ${C.ring}`, borderRadius: 10, color: C.face, fontFamily: mono, fontSize: 30, fontWeight: 500, fontVariantNumeric: "tabular-nums", padding: 0 },
  fieldLabel: { fontSize: 11, color: C.faint, letterSpacing: "0.14em" },
  colon: { fontSize: 30, color: C.faint, alignSelf: "center", marginTop: 22 },
  presetRow: { display: "flex", flexWrap: "wrap", gap: 8, width: "100%", justifyContent: "center" },
  chip: { padding: "8px 14px", borderRadius: 20, background: "transparent", border: "1px solid", fontFamily: mono, fontSize: 13, cursor: "pointer" },
  laps: { width: "100%", maxHeight: 208, overflowY: "auto", display: "flex", flexDirection: "column", borderTop: `1px solid ${C.ring}` },
  lapRow: { display: "flex", alignItems: "center", gap: 10, padding: "11px 4px", borderBottom: `1px solid ${C.bg1}`, fontVariantNumeric: "tabular-nums" },
  lapNo: { fontSize: 13, fontWeight: 600, minWidth: 22 },
  tag: { fontSize: 10, letterSpacing: "0.1em", fontWeight: 600 },
  lapSeg: { marginLeft: "auto", fontSize: 17, fontWeight: 500 },
  csSm: { fontSize: 12, color: C.faint },
  lapCum: { fontSize: 12, color: C.faint, minWidth: 78, textAlign: "right" },
  memRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: `1px solid ${C.bg1}`, fontVariantNumeric: "tabular-nums" },
  kindDot: { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },
  memTime: { fontSize: 19, fontWeight: 500, color: C.face },
  memMeta: { fontSize: 11, color: C.faint, letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  del: { marginLeft: "auto", width: 32, height: 32, borderRadius: 8, background: "transparent", border: `1px solid ${C.ring}`, color: C.faint, fontSize: 18, cursor: "pointer", flexShrink: 0 },
  clearBtn: { marginLeft: "auto", background: "transparent", border: "none", color: C.faint, fontFamily: mono, fontSize: 11, letterSpacing: "0.05em", cursor: "pointer", textDecoration: "underline" },
  empty: { display: "flex", flexDirection: "column", gap: 16, width: "100%", padding: "24px 0", textAlign: "center" },
  emptyTitle: { fontSize: 15, color: C.face, fontWeight: 500 },
  emptyText: { fontSize: 13, color: C.faint, lineHeight: 1.7 },
  hint: { fontSize: 11, color: C.faint, letterSpacing: "0.05em", textAlign: "center" },
};
