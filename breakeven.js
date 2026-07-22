/* LabelBudget — Pivot B : Simulateur de break-even avant dépense
 * Répond à la douleur : "si j'investis X en studio/clip/promo, combien de
 * streams / ventes / shows il faut pour récupérer mon cash ?"
 * Utilise les payouts réels du marché (2025) :
 *   Spotify  ~0.0032 €/stream | Apple ~0.008 € | YouTube ~0.0045 €
 *   Ventes titre ~0.80 € | Album ~6 € | Show ~300 € (net artiste)
 */
const PAYOUTS = {
  spotify: 0.0032,
  apple:   0.0080,
  youtube: 0.0045
};
const SALE = { single: 0.80, album: 6.00, show: 300.00 };

const $ = id => document.getElementById(id);

function fmt(n){ return n.toLocaleString('fr-FR',{maximumFractionDigits:0}); }
function eur(n){ return (n<0?'-':'') + Math.abs(n).toLocaleString('fr-FR',{minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }

function compute(){
  const invest = parseFloat($('inv').value) || 0;
  const mixS = +$('mixS').value/100;   // part streaming
  const mixV = +$('mixV').value/100;   // part ventes
  const mixShow = +$('mixSh').value/100; // part shows
  // répartition must sum ~100, on normalise
  const tot = mixS+mixV+mixShow || 1;
  const s=mixS/tot, v=mixV/tot, sh=mixShow/tot;

  const revPerStream = (PAYOUTS.spotify*s + PAYOUTS.apple*s*0 + 0); // simplified base
  // On calcule par source pour l'affichage
  const streamsNeeded = invest*s / PAYOUTS.spotify;
  const singlesNeeded = invest*v / SALE.single;
  const albumsNeeded  = invest*v / SALE.album;
  const showsNeeded   = invest*sh / SALE.show;

  // Hypothèse de conversion : 1% des écoutes = achat ; 1 show pour 5000 auditeurs
  // On donne surtout le chiffre clé : streams nécessaires au break-even global
  const blended = invest / (PAYOUTS.spotify*s + (SALE.single*0.01)*v + SALE.show*0.0002*sh || 1);
  const streamsGlobal = invest / (PAYOUTS.spotify*s + (SALE.single*0.01)*v || 1);

  $('outStreams').textContent = fmt(streamsNeeded) + ' streams';
  $('outSingles').textContent = fmt(singlesNeeded) + ' titres';
  $('outAlbums').textContent  = fmt(albumsNeeded) + ' albums';
  $('outShows').textContent   = fmt(showsNeeded) + ' concerts';
  $('outHead').textContent    = 'Pour récupérer ' + eur(invest) + ' d\'investissement :';
  // jauge de faisabilité (heuristique : < 500k streams = réaliste pour un single promu)
  const real = streamsNeeded < 500000;
  const bar = $('feas');
  bar.textContent = real ? '🟢 Réaliste pour un projet promu' : '🔴 Ambitieux — réfléchis avant de dépenser';
  bar.className = 'feas ' + (real?'ok':'warn');

  // mini scénario : si 50k streams/mois, temps de récup
  const perMonth = 50000 * PAYOUTS.spotify;
  const months = perMonth>0 ? invest/perMonth : Infinity;
  $('outMonths').textContent = isFinite(months) ? '≈ ' + months.toFixed(1) + ' mois à 50k streams/mois' : '—';
}

['inv','mixS','mixV','mixSh'].forEach(id=> $(id).addEventListener('input', compute));
compute();
