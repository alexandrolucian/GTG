import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { EX, SEQ, GYM_OPTS, RUN, SQUAT, SETS, DEFAULTS } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const WD = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const WDL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const NATIVE = Capacitor.isNativePlatform();

// ---------- estado ----------
let st;
try { st = JSON.parse(localStorage.getItem('treino30') || '{}'); } catch (e) { st = {}; }
st = { ...DEFAULTS, days: {}, gym: {}, ...st };
const save = () => { try { localStorage.setItem('treino30', JSON.stringify(st)); } catch (e) {} };
const dayLog = i => st.days[i] || (st.days[i] = { p: [], s: [], n: 0, r: 0 });

// ---------- plano ----------
const startDate = () => { const [y, m, d] = st.start.split('-').map(Number); return new Date(y, m - 1, d); };
const dateOf = i => { const d = startDate(); d.setDate(d.getDate() + i); return d; };
const today0 = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
const todayIdx = () => Math.round((today0() - startDate()) / 864e5);
const clampIdx = i => Math.max(0, Math.min(29, i));
const week = i => (i < 7 ? 0 : i < 14 ? 1 : i < 21 ? 2 : 3);

function pushReps(i) {
  const w = week(i), m0 = +st.max0 || 13;
  const m2 = +st.max15 || Math.round(m0 * 1.25);
  const r = w === 0 ? m0 * 0.38 : w === 1 ? m0 * 0.46 : w === 2 ? m2 * 0.40 : m2 * 0.45;
  return Math.max(2, Math.round(r));
}

function gyms() {
  let last = SEQ.indexOf(st.anchorGym);
  return Array.from({ length: 30 }, (_, i) => {
    let g = st.gym[i];
    if (!g) { const wd = dateOf(i).getDay(); g = (wd === 0 || wd === 6) ? 'Sem academia' : SEQ[(last + 1) % 5]; }
    if (SEQ.includes(g)) last = SEQ.indexOf(g);
    return g;
  });
}

function plan(i, g) {
  const run = RUN[i], rest = run[0] === 'x';
  if (rest) return { i, rest, run, gym: g, p: null, s: null };
  const w = week(i), c = vol();
  const sets = c.ps[w] ?? SETS[w], reps = c.pr[w] ?? pushReps(i);
  const sq = [c.ss[w] ?? SQUAT[w][0], c.sr[w] ?? SQUAT[w][1]];
  return {
    i, rest, run, gym: g,
    p: g === 'Peito' && c.chestHalf ? [Math.ceil(sets / 2), reps] : [sets, reps],
    s: (g === 'Pernas' && c.legSkip) || sq[0] < 1 ? null : sq
  };
}

// Volume personalizado: null = automático
const NIGHT_DEF = { sets: 2, calf: 15, plank: 30, db: 8, bd: 8 };
function vol() {
  const v = st.vol || (st.vol = {});
  for (const k of ['ps', 'pr', 'ss', 'sr']) if (!Array.isArray(v[k])) v[k] = [null, null, null, null];
  v.night = { ...NIGHT_DEF, ...(v.night || {}) };
  if (v.chestHalf === undefined) v.chestHalf = 1;
  if (v.legSkip === undefined) v.legSkip = 1;
  return v;
}
const nightTxt = g => {
  const n = vol().night, cs = g === 'Pernas' ? n.sets * 2 : n.sets;
  return `Panturrilha ${cs} × ${n.calf} · prancha ${n.sets} × ${n.plank} s · dead bug ${n.sets} × ${n.db} · bird dog ${n.sets} × ${n.bd} · alongamentos`;
};
const allPlans = () => { const G = gyms(); return G.map((g, i) => plan(i, g)); };
const isDone = q => {
  const k = st.days[q.i]; if (!k || q.rest) return false;
  return k.p.filter(Boolean).length >= q.p[0] && (!q.s || k.s.filter(Boolean).length >= q.s[0]) && k.n && k.r;
};
const runTxt = r => r[0] === 'r' ? `Corrida ${r[1]} min${r[2] ? ' ' + r[2] : ''}` : r[0] === 'w' ? 'Caminhada rápida 20 a 30 min' : r[0] === 'wl' ? 'Caminhada leve 20 min' : r[0] === 't' ? 'Teste: 22 a 25 min contínuos' : 'Descanso total';
const runShort = r => r[0] === 'r' ? `${r[1]} min` : r[0] === 't' ? 'Teste' : r[0] === 'x' ? 'Descanso' : 'Caminhada';

// ---------- animações ----------
function anim(id, big) {
  const e = EX.find(x => x.id === id);
  const sp = 'calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"';
  const dur = `${e.dur}s`;
  let bg = '';
  if (e.ground) bg += '<line x1="8" y1="106" x2="212" y2="106" class="g"/>';
  if (e.wall) bg += '<line x1="178" y1="8" x2="178" y2="106" class="g"/>';
  if (e.step) bg += '<rect x="70" y="92" width="80" height="14" rx="3" class="stp"/>';
  return `<svg viewBox="0 0 220 120" class="${big ? 'big' : 'thumb'}${e.run ? ' run' : ''}" role="img" aria-label="${e.name}">${bg}
    <circle r="9" class="h" cx="${e.A.h[0]}" cy="${e.A.h[1]}">
      <animate attributeName="cx" values="${e.A.h[0]};${e.B.h[0]};${e.A.h[0]}" dur="${dur}" repeatCount="indefinite" ${sp}/>
      <animate attributeName="cy" values="${e.A.h[1]};${e.B.h[1]};${e.A.h[1]}" dur="${dur}" repeatCount="indefinite" ${sp}/>
    </circle>
    <path class="s" d="${e.A.d}"><animate attributeName="d" values="${e.A.d};${e.B.d};${e.A.d}" dur="${dur}" repeatCount="indefinite" ${sp}/></path>
  </svg>`;
}

// ---------- telas ----------
let cur = clampIdx(todayIdx());
const view = $('#view');

function rowEx(id, title, sub, extra = '', off = false) {
  return `<div class="row${off ? ' off' : ''}"><a class="thumbbox" href="#ex-${id}" aria-label="Ver ${id}">${anim(id)}</a><div><div class="lab">${title}</div><div class="sub">${sub}</div>${extra}</div></div>`;
}
const dots = (n, k, arr, cls = '') => `<div class="dots">${Array.from({ length: n }, (_, j) => `<button class="dot ${cls}${arr[j] ? ' on' : ''}" data-k="${k}" data-j="${j}" aria-pressed="${!!arr[j]}">${j + 1}</button>`).join('')}</div>`;
const pill = (k, on, cls = '') => `<div class="dots"><button class="dot w ${cls}${on ? ' on' : ''}" data-k="${k}" aria-pressed="${!!on}">${on ? 'Feito ✓' : 'Marcar feito'}</button></div>`;

function hint(g) {
  return ({
    Peito: 'Dia de peito: flexão pela metade hoje.',
    Pernas: 'Dia de perna: sem agachamento, 2 séries extras de panturrilha à noite e corrida bem leve.',
    Folga: 'Sequência pausada. O próximo dia de academia continua de onde parou.',
    'Sem academia': 'Sem academia hoje. Se treinar, escolha o treino aqui.'
  })[g] || 'Treino em casa normal hoje.';
}

function renderToday() {
  const P = allPlans(), q = P[cur], g = dayLog(cur), d = dateOf(cur);
  const ti = todayIdx(), isT = cur === ti;
  let h = `<header class="top"><div class="kick">${WDL[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}${isT ? ' · hoje' : ''}${ti < 0 && cur === 0 ? ' · começa em breve' : ''}</div>
    <h1>Dia ${cur + 1} <span>de 30</span></h1>
    <div class="sem">Semana ${week(cur) + 1}${isDone(q) ? ' · dia completo ✓' : ''}</div>
    <div class="nav"><button id="prev" ${cur === 0 ? 'disabled' : ''}>‹</button><button id="btoday" class="hoje">Hoje</button><button id="next" ${cur === 29 ? 'disabled' : ''}>›</button></div></header>
    <section class="pad day">`;
  h += `<div class="row gymrow"><div class="gi">${gymIcon()}</div><div><label class="lab" for="gym">Academia: <select id="gym">${GYM_OPTS.map(o => `<option${o === q.gym ? ' selected' : ''}>${o}</option>`).join('')}</select></label><div class="sub">${hint(q.gym)}</div></div></div>`;
  if (q.rest) {
    h += rowEx('alongamento', 'Descanso total', 'Sem flexões e sem corrida. Se quiser, só um alongamento leve. Recuperação também é treino.');
  } else {
    h += rowEx('flexao', `Flexão: ${q.p[0]} séries × ${q.p[1]}`, 'Espalhadas no dia, com 30 a 60 min entre elas. Nunca até a falha.', dots(q.p[0], 'p', g.p));
    h += q.s ? rowEx('agachamento', `Agachamento: ${q.s[0]} séries × ${q.s[1]}`, 'Junto com as primeiras séries de flexão.', dots(q.s[0], 's', g.s))
             : rowEx('agachamento', 'Agachamento: hoje não', 'Suas pernas já trabalham na academia.', '', true);
    h += rowEx('deadbug', 'Bloco da noite', nightTxt(q.gym), pill('n', g.n));
    h += rowEx('corrida', `<span class="runc">${runTxt(q.run)}</span>`, q.run[0] === 'r' || q.run[0] === 't' ? 'Ritmo de conversa. 5 min de caminhada antes e depois.' : 'Passo firme, pode ser com o cachorro.', pill('r', g.r, 'r'));
    if (cur === 14) h += `<div class="note"><b>Reteste:</b> faça o máximo de flexões pela manhã e registre na aba Plano. As semanas 3 e 4 se ajustam ao novo número.</div>`;
    if (cur === 29) h += `<div class="note"><b>Dia final:</b> reteste o máximo de flexões e compare com as ${st.max0} do início (aba Plano).</div>`;
  }
  h += `<a class="adj" href="#volume">Ajustar séries e repetições ›</a><p class="small">Toque na animação para ver como fazer cada exercício.</p></section>`;
  view.innerHTML = h;
  $('#prev').onclick = () => { if (cur > 0) { cur--; renderToday(); } };
  $('#next').onclick = () => { if (cur < 29) { cur++; renderToday(); } };
  $('#btoday').onclick = () => { cur = clampIdx(todayIdx()); renderToday(); };
  $('#gym').onchange = e => { st.gym[cur] = e.target.value; save(); renderToday(); reschedule(); };
  view.querySelector('.day').addEventListener('click', e => {
    const b = e.target.closest('button.dot'); if (!b) return;
    const k = b.dataset.k;
    if (k === 'p' || k === 's') { const j = +b.dataset.j; g[k][j] = !g[k][j]; } else g[k] = g[k] ? 0 : 1;
    save(); renderToday();
  });
}

function gymIcon() { return '<svg viewBox="0 0 220 120" class="thumb"><path class="s" d="M50 60 H170 M50 36 V84 M70 28 V92 M170 36 V84 M150 28 V92"/></svg>'; }

function renderExList() {
  view.innerHTML = `<header class="top slim"><h1>Exercícios</h1></header><section class="pad grid">${EX.map(e => `<a class="card" href="#ex-${e.id}">${anim(e.id, true)}<h3>${e.name}</h3><div class="sub">${e.muscles}</div></a>`).join('')}</section>`;
}

function renderEx(id) {
  const e = EX.find(x => x.id === id); if (!e) return renderExList();
  view.innerHTML = `<header class="top slim"><a class="back" href="#exercicios">‹ Exercícios</a><h1>${e.name}</h1></header>
  <section class="pad">
    <div class="stage">${anim(e.id, true)}</div>
    <p class="lead">${e.desc}</p>
    <div class="facts"><div><b>Músculos</b><span>${e.muscles}</span></div></div>
    <h2>Passo a passo</h2><ol class="steps">${e.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    <h2>Erros comuns</h2><ul class="errs">${e.errors.map(s => `<li>${s}</li>`).join('')}</ul>
    <div class="facts two"><div><b>Mais fácil</b><span>${e.easier}</span></div><div><b>Mais difícil</b><span>${e.harder}</span></div></div>
  </section>`;
}

function renderPlan() {
  const P = allPlans(), ti = todayIdx();
  view.innerHTML = `<header class="top slim"><h1>Os 30 dias</h1></header><section class="pad">
    <div class="tests">
      <label>Máximo inicial<input type="number" inputmode="numeric" id="m0" value="${st.max0 ?? ''}"></label>
      <label>Reteste dia 15<input type="number" inputmode="numeric" id="m15" value="${st.max15 ?? ''}" placeholder="-"></label>
      <label>Reteste dia 30<input type="number" inputmode="numeric" id="m30" value="${st.max30 ?? ''}" placeholder="-"></label>
    </div>
    ${st.max30 ? `<p class="win">De ${st.max0} para ${st.max30} flexões: ${st.max30 - st.max0 >= 0 ? '+' : ''}${st.max30 - st.max0}.</p>` : ''}
    <a class="adj" href="#volume" style="margin-bottom:12px">Ajustar séries e repetições ›</a>
    <div class="scroll"><table><thead><tr><th>Dia</th><th>Data</th><th>Academia</th><th>Flexão</th><th>Agach.</th><th>Corrida</th><th>✓</th></tr></thead><tbody>
    ${P.map(q => { const d = dateOf(q.i); return `<tr data-i="${q.i}" class="${q.i === ti ? 'cur' : ''}${q.rest ? ' off' : ''}"><td>${q.i + 1}</td><td>${WD[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}</td><td>${q.gym === 'Sem academia' ? '-' : q.gym}</td><td>${q.p ? q.p[0] + '×' + q.p[1] : '-'}</td><td>${q.s ? q.s[0] + '×' + q.s[1] : '-'}</td><td>${runShort(q.run)}</td><td class="ck">${isDone(q) ? '✓' : ''}</td></tr>`; }).join('')}
    </tbody></table></div>
    <h2>Regras</h2>
    <div class="rules">
      <div><h3>Grease the Groove</h3><ul><li>Séries espalhadas no dia, 30 a 60 min entre elas</li><li>Cada série deve parecer fácil: nunca até a falha</li><li>Se a técnica piorar, pare ali</li></ul></div>
      <div><h3>Dor na canela, joelho ou pé</h3><ul><li><b>0 a 2 de 10</b>, some no dia seguinte: segue</li><li><b>3 a 4</b>, ou continua na manhã seguinte: repete o treino anterior</li><li><b>5 ou mais</b>, ou dor num ponto só do osso: para e procura um fisioterapeuta</li></ul></div>
      <div><h3>Com Mounjaro</h3><ul><li>Água ao longo do dia, eletrólitos nos dias de corrida</li><li>Tontura: pare e sente ou deite até passar</li><li>Náusea forte depois da aplicação: troque a corrida por caminhada</li><li>Proteína em todas as refeições</li></ul></div>
    </div></section>`;
  view.querySelector('tbody').onclick = e => { const t = e.target.closest('tr'); if (!t) return; cur = +t.dataset.i; location.hash = '#hoje'; };
  for (const [id, key] of [['m0', 'max0'], ['m15', 'max15'], ['m30', 'max30']]) {
    $('#' + id).onchange = e => { const v = parseInt(e.target.value, 10); st[key] = Number.isFinite(v) && v > 0 ? v : (key === 'max0' ? 13 : null); save(); renderPlan(); reschedule(); };
  }
}

function renderVolume() {
  const v = vol(), wi = [0, 7, 14, 21];
  const cell = (k, w, auto) => `<td><input type="number" inputmode="numeric" min="0" max="99" data-k="${k}" data-w="${w}" value="${v[k][w] ?? ''}" placeholder="${auto}" aria-label="${k} semana ${w + 1}"></td>`;
  const nf = (k, label, unit = '') => `<div class="slot nf"><label for="n_${k}">${label}</label><input type="number" inputmode="numeric" min="0" max="300" id="n_${k}" data-n="${k}" value="${v.night[k]}">${unit ? `<span class="small">${unit}</span>` : '<span></span>'}</div>`;
  view.innerHTML = `<header class="top slim"><a class="back" href="#hoje">‹ Hoje</a><h1>Séries e repetições</h1></header><section class="pad">
    <p class="lead">Ajuste a quantidade de cada semana. Campo vazio usa o valor automático, que aparece em cinza.</p>
    <h2>Grease the Groove</h2>
    <div class="scroll"><table class="vol"><thead><tr><th></th><th colspan="2">Flexão</th><th colspan="2">Agachamento</th></tr><tr><th>Semana</th><th>Séries</th><th>Reps</th><th>Séries</th><th>Reps</th></tr></thead><tbody>
    ${[0, 1, 2, 3].map(w => `<tr><td><b>${w + 1}</b><span class="small"> dias ${wi[w] + 1} a ${w === 3 ? 30 : wi[w] + 7}</span></td>${cell('ps', w, SETS[w])}${cell('pr', w, pushReps(wi[w]))}${cell('ss', w, SQUAT[w][0])}${cell('sr', w, SQUAT[w][1])}</tr>`).join('')}
    </tbody></table></div>
    <p class="small">Mais séries que horários de lembrete? Adicione horários na aba Lembretes.</p>
    <div class="slots">
      <div class="slot"><input type="checkbox" id="ch" ${v.chestHalf ? 'checked' : ''}><label for="ch">Flexão pela metade no dia de peito</label></div>
      <div class="slot"><input type="checkbox" id="lg" ${v.legSkip ? 'checked' : ''}><label for="lg">Sem agachamento no dia de perna</label></div>
    </div>
    <h2>Bloco da noite</h2>
    <div class="slots">${nf('sets', 'Séries de cada exercício')}${nf('calf', 'Panturrilha', 'reps')}${nf('plank', 'Prancha', 'seg')}${nf('db', 'Dead bug', 'cada lado')}${nf('bd', 'Bird dog', 'cada lado')}</div>
    <div class="btns" style="margin-top:20px"><button id="reset">Restaurar padrão</button></div>
  </section>`;
  view.querySelectorAll('table.vol input').forEach(inp => inp.onchange = e => {
    const n = parseInt(e.target.value, 10);
    v[e.target.dataset.k][+e.target.dataset.w] = Number.isFinite(n) && n >= 0 ? Math.min(n, 99) : null;
    save(); reschedule();
  });
  view.querySelectorAll('[data-n]').forEach(inp => inp.onchange = e => {
    const n = parseInt(e.target.value, 10), k = e.target.dataset.n;
    v.night[k] = Number.isFinite(n) && n >= 0 ? n : NIGHT_DEF[k]; save(); renderVolume(); reschedule();
  });
  $('#ch').onchange = e => { v.chestHalf = e.target.checked ? 1 : 0; save(); reschedule(); };
  $('#lg').onchange = e => { v.legSkip = e.target.checked ? 1 : 0; save(); reschedule(); };
  $('#reset').onclick = () => { delete st.vol; save(); renderVolume(); reschedule(); };
}

function renderSettings() {
  const slot = (s, i) => `<div class="slot"><input type="checkbox" id="sc${i}" ${s[1] ? 'checked' : ''} aria-label="Ativar horário ${i + 1}"><label for="sc${i}">Série ${i + 1}</label><input type="time" id="st${i}" value="${s[0]}"></div>`;
  view.innerHTML = `<header class="top slim"><h1>Lembretes</h1></header><section class="pad">
    <p class="lead">O app avisa na hora de cada série, do bloco da noite e da corrida. As notificações se reorganizam sozinhas quando você muda o treino da academia.</p>
    <div class="status" id="status">${NATIVE ? (st.reminders ? 'Lembretes ativos.' : 'Lembretes desligados.') : 'Os lembretes funcionam no app Android instalado.'}</div>
    <div class="btns"><button id="act" class="primary">${st.reminders ? 'Atualizar lembretes' : 'Ativar lembretes'}</button>${st.reminders ? '<button id="off">Desligar</button>' : ''}<button id="test">Testar em 5 s</button></div>
    <h2>Horários das séries</h2>
    <p class="small">Dias com menos séries usam os primeiros horários marcados. Precisa de mais séries? Adicione horários.</p>
    <div class="slots">${st.slots.map(slot).join('')}</div>
    <div class="btns" style="margin-top:10px"><button id="addslot">+ Horário</button>${st.slots.length > 1 ? '<button id="delslot">Remover último</button>' : ''}</div>
    <h2>Outros avisos</h2>
    <div class="slots">
      <div class="slot"><input type="checkbox" id="nc" ${st.night[1] ? 'checked' : ''}><label for="nc">Bloco da noite</label><input type="time" id="nt" value="${st.night[0]}"></div>
      <div class="slot"><input type="checkbox" id="rc" ${st.run[1] ? 'checked' : ''}><label for="rc">Corrida / caminhada</label><input type="time" id="rt" value="${st.run[0]}"></div>
    </div>
    <h2>Plano</h2>
    <div class="slots"><div class="slot"><label for="sd">Data do dia 1</label><input type="date" id="sd" value="${st.start}"></div></div>
    <p class="small">Mudar a data recomeça a contagem. Suas marcações ficam guardadas por número do dia.</p>
  </section>`;
  st.slots.forEach((s, i) => {
    $('#sc' + i).onchange = e => { s[1] = e.target.checked ? 1 : 0; save(); reschedule(); };
    $('#st' + i).onchange = e => { s[0] = e.target.value || s[0]; st.slots.sort((a, b) => a[0].localeCompare(b[0])); save(); renderSettings(); reschedule(); };
  });
  $('#addslot').onclick = () => { const l = st.slots[st.slots.length - 1][0].split(':').map(Number); const m = Math.min(23 * 60 + 30, l[0] * 60 + l[1] + 60); st.slots.push([`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`, 1]); save(); renderSettings(); reschedule(); };
  const ds = $('#delslot'); if (ds) ds.onclick = () => { st.slots.pop(); save(); renderSettings(); reschedule(); };
  $('#nc').onchange = e => { st.night[1] = e.target.checked ? 1 : 0; save(); reschedule(); };
  $('#nt').onchange = e => { st.night[0] = e.target.value || st.night[0]; save(); reschedule(); };
  $('#rc').onchange = e => { st.run[1] = e.target.checked ? 1 : 0; save(); reschedule(); };
  $('#rt').onchange = e => { st.run[0] = e.target.value || st.run[0]; save(); reschedule(); };
  $('#sd').onchange = e => { if (e.target.value) { st.start = e.target.value; save(); cur = clampIdx(todayIdx()); reschedule(); } };
  $('#act').onclick = activate;
  const off = $('#off'); if (off) off.onclick = async () => { st.reminders = 0; save(); await cancelAll(); renderSettings(); };
  $('#test').onclick = testNotif;
}

// ---------- notificações ----------
const say = t => { const s = $('#status'); if (s) s.textContent = t; };

async function ensurePerms() {
  if (!NATIVE) { say('Os lembretes funcionam no app Android instalado.'); return false; }
  let p = await LocalNotifications.checkPermissions();
  if (p.display !== 'granted') p = await LocalNotifications.requestPermissions();
  if (p.display !== 'granted') { say('Permissão de notificação negada. Libere nas configurações do Android.'); return false; }
  try {
    await LocalNotifications.createChannel({ id: 'treino', name: 'Treino', description: 'Séries, bloco da noite e corrida', importance: 5, visibility: 1, vibration: true, lights: true, lightColor: '#D9411B' });
  } catch (e) {}
  try {
    const ex = await LocalNotifications.checkExactNotificationSetting();
    if (ex.exact_alarm !== 'granted') { say('Para avisar na hora certa, permita "Alarmes e lembretes" na tela que vai abrir.'); await LocalNotifications.changeExactNotificationSetting(); }
  } catch (e) {}
  return true;
}

async function activate() {
  if (!(await ensurePerms())) return;
  st.reminders = 1; save();
  const n = await reschedule();
  say(`Lembretes ativos: ${n} avisos agendados para os próximos 7 dias.`);
  const b = $('#act'); if (b) b.textContent = 'Atualizar lembretes';
}

async function testNotif() {
  if (!(await ensurePerms())) return;
  await LocalNotifications.schedule({ notifications: [{ id: 9999, title: 'Teste do GTG', body: 'Se você está vendo isto, os lembretes funcionam.', channelId: 'treino', schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true } }] });
  say('Notificação de teste agendada para daqui a 5 segundos.');
}

async function cancelAll() {
  if (!NATIVE) return;
  const p = await LocalNotifications.getPending();
  if (p.notifications.length) await LocalNotifications.cancel({ notifications: p.notifications.map(n => ({ id: n.id })) });
}

const at = (d, hhmm) => { const [h, m] = hhmm.split(':').map(Number); const x = new Date(d); x.setHours(h, m, 0, 0); return x; };

async function reschedule() {
  if (!NATIVE || !st.reminders) return 0;
  await cancelAll();
  const P = allPlans(), now = Date.now(), t0 = Math.max(0, todayIdx()), list = [];
  const slots = st.slots.filter(s => s[1]).map(s => s[0]).sort();
  for (let i = t0; i < Math.min(30, t0 + 7); i++) {
    const q = P[i], d = dateOf(i); if (q.rest) continue;
    const n = Math.max(q.p[0], q.s ? q.s[0] : 0);
    for (let k = 0; k < Math.min(n, slots.length, 40); k++) {
      const parts = [];
      if (k < q.p[0]) parts.push(`${q.p[1]} flexões`);
      if (q.s && k < q.s[0]) parts.push(`${q.s[1]} agachamentos`);
      list.push({ id: (i + 1) * 100 + k, title: `Série ${k + 1} de ${n}`, body: `${parts.join(' + ')}. Fácil e perfeito, sem falha.`, at: at(d, slots[k]) });
    }
    if (st.night[1]) list.push({ id: (i + 1) * 100 + 50, title: 'Bloco da noite', body: nightTxt(q.gym) + '.', at: at(d, st.night[0]) });
    if (st.run[1]) list.push({ id: (i + 1) * 100 + 60, title: runTxt(q.run), body: q.run[0] === 'r' || q.run[0] === 't' ? 'Ritmo de conversa. 5 min de caminhada antes.' : 'Caminhada de hoje.', at: at(d, st.run[0]) });
  }
  const notifications = list.filter(x => +x.at > now + 30000).map(x => ({ id: x.id, title: x.title, body: x.body, channelId: 'treino', schedule: { at: x.at, allowWhileIdle: true }, extra: { day: Math.floor(x.id / 100) - 1 } }));
  if (notifications.length) await LocalNotifications.schedule({ notifications });
  return notifications.length;
}

// ---------- rotas ----------
function route() {
  const h = location.hash.slice(1) || 'hoje';
  document.querySelectorAll('.tabs a').forEach(a => a.classList.toggle('on', h.startsWith(a.dataset.t)));
  if (h === 'hoje') renderToday();
  else if (h === 'exercicios') renderExList();
  else if (h.startsWith('ex-')) renderEx(h.slice(3));
  else if (h === 'plano') renderPlan();
  else if (h === 'ajustes') renderSettings();
  else if (h === 'volume') renderVolume();
  else renderToday();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { cur = clampIdx(todayIdx()); if ((location.hash || '#hoje') === '#hoje') renderToday(); reschedule(); } });
if (NATIVE) {
  LocalNotifications.addListener('localNotificationActionPerformed', a => { const d = a.notification?.extra?.day; if (Number.isFinite(d)) cur = clampIdx(d); location.hash = '#hoje'; route(); }).catch(() => {});
}
route();
reschedule().catch(() => {});
