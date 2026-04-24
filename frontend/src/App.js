/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, useCallback } from 'react';
import { authAPI, eventsAPI } from './api';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#080e2b;--bg2:#0f1a48;--gold:#f4b942;
      --red:#e84545;--green:#2ec97e;--blue:#3a8dde;
      --cyan:#22d3ee;--purple:#8b5cf6;--orange:#fb923c;
      --g:rgba(255,255,255,.07);--gb:rgba(255,255,255,.13);
      --tp:#f0e9d8;--tm:#8c9ab7
    }
    body{background:var(--bg);color:var(--tp);font-family:'DM Sans',sans-serif;min-height:100vh}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px}

    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes bgpan{0%{background-position:0% 50%}100%{background-position:100% 50%}}
    @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}

    .fu {animation:fadeUp .45s ease both}
    .fu2{animation:fadeUp .45s .1s ease both}
    .fu3{animation:fadeUp .45s .18s ease both}
    .fu4{animation:fadeUp .45s .26s ease both}
    .fu5{animation:fadeUp .45s .34s ease both}
    .fi {animation:fadeIn .3s ease both}

    /* ── AUTH ── */
    .auth-root{min-height:100vh;display:flex}
    .auth-left{flex:1;position:relative;overflow:hidden;display:none}
    @media(min-width:900px){.auth-left{display:block}}
    .auth-bg{
      position:absolute;inset:0;
      background:linear-gradient(160deg,rgba(8,14,43,.65),rgba(10,20,50,.4)),
        linear-gradient(135deg,#0d2137,#1a3a5c 20%,#0a2a1a 40%,#1c3a10 55%,#0d2a40 75%,#08142b);
      background-size:400% 400%;animation:bgpan 14s ease infinite alternate
    }
    .auth-scene{position:absolute;bottom:0;left:0;right:0;height:54%}
    .bldg{position:absolute;bottom:0;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);border-bottom:none;border-radius:4px 4px 0 0}
    .bldg-wins{position:absolute;top:10px;left:6px;right:6px;display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
    .bwin{height:8px;border-radius:1px;background:rgba(255,230,120,.18)}
    .bwin.lit{background:rgba(255,230,120,.72)}
    .auth-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,14,43,.92),transparent 55%);display:flex;flex-direction:column;justify-content:flex-end;padding:3rem}
    .apanel-logo{position:absolute;top:2.5rem;left:2.5rem;display:flex;align-items:center;gap:.75rem}
    .apanel-box{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-size:1rem}
    .apanel-txt{font-size:1.15rem;font-weight:700;color:#fff}
    .apanel-txt em{color:var(--cyan);font-style:normal}
    .auth-quote{font-family:'Fraunces',serif;font-size:2rem;font-weight:700;color:#fff;line-height:1.25;margin-bottom:.7rem}
    .auth-quote em{color:var(--gold);font-style:italic}
    .auth-quote-sub{color:rgba(255,255,255,.5);font-size:.9rem}
    .adots{display:flex;gap:.4rem;margin-top:1rem}
    .adot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.22)}
    .adot.on{background:var(--gold);width:22px;border-radius:4px}

    .auth-right{width:100%;max-width:490px;min-height:100vh;background:rgba(8,14,43,.98);display:flex;flex-direction:column;justify-content:center;padding:2.5rem;overflow-y:auto;border-left:1px solid var(--gb)}
    @media(max-width:899px){.auth-right{max-width:100%;border-left:none}}

    .mob-logo{display:flex;align-items:center;gap:.65rem;margin-bottom:1.75rem}
    @media(min-width:900px){.mob-logo{display:none}}
    .mob-box{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.88rem;color:#fff}
    .mob-txt{font-weight:700;color:#fff}
    .mob-txt em{color:var(--cyan);font-style:normal}

    .ah{font-family:'Fraunces',serif;font-size:1.9rem;font-weight:700;margin-bottom:.3rem}
    .as{color:var(--tm);font-size:.875rem;margin-bottom:1.5rem}

    .google-btn{width:100%;padding:.72rem 1.2rem;background:var(--g);border:1.5px solid var(--gb);border-radius:12px;color:var(--tp);font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.75rem;transition:all .2s;margin-bottom:1.2rem}
    .google-btn:hover{background:rgba(255,255,255,.1)}
    .g-ico{width:22px;height:22px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.78rem;color:#4285F4;flex-shrink:0}
    .or-div{display:flex;align-items:center;gap:.9rem;margin-bottom:1.2rem}
    .or-line{flex:1;height:1px;background:var(--gb)}
    .or-txt{font-size:.76rem;color:var(--tm);white-space:nowrap}

    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
    .fg{margin-bottom:.88rem}
    .fl{display:block;font-size:.72rem;font-weight:600;color:var(--tm);margin-bottom:.36rem;letter-spacing:.04em;text-transform:uppercase}
    .fi{width:100%;padding:.68rem 1rem;border-radius:11px;background:rgba(255,255,255,.05);border:1.5px solid var(--gb);color:var(--tp);font-family:'DM Sans',sans-serif;font-size:.875rem;transition:all .2s;outline:none}
    .fi:focus{border-color:var(--blue);background:rgba(58,141,222,.06);box-shadow:0 0 0 3px rgba(58,141,222,.12)}
    .fi::placeholder{color:var(--tm)}
    .fi.chg{border-color:rgba(244,185,66,.55) !important;background:rgba(244,185,66,.06) !important}
    select.fi option{background:var(--bg2)}
    textarea.fi{resize:vertical}

    .role-pills{display:flex;gap:.45rem}
    .rpill{flex:1;padding:.58rem .4rem;border-radius:10px;border:1.5px solid var(--gb);background:rgba(255,255,255,.04);color:var(--tm);font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s;text-align:center}
    .rpill.on{background:rgba(37,99,235,.18);border-color:#3b82f6;color:#93c5fd}

    .pw-wrap{position:relative}
    .pw-eye{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--tm);cursor:pointer;display:flex;padding:0}
    .pw-bars{display:flex;gap:3px;margin-top:.38rem}
    .pw-bar{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.09);transition:background .3s}

    .abtn{width:100%;padding:.78rem;background:linear-gradient(135deg,#2563eb,#1d4ed8);border:none;border-radius:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.93rem;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.5rem;box-shadow:0 6px 22px rgba(37,99,235,.3)}
    .abtn:hover:not(:disabled){transform:translateY(-2px)}
    .abtn:disabled{opacity:.6;cursor:not-allowed}

    .a-switch{text-align:center;margin-top:1.1rem;font-size:.86rem;color:var(--tm)}
    .lnk{background:none;border:none;color:#60a5fa;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.86rem;padding:0}
    .lnk:hover{text-decoration:underline}

    .demo-box{margin-top:.85rem;padding:.7rem 1rem;background:rgba(244,185,66,.06);border:1px solid rgba(244,185,66,.15);border-radius:10px}
    .demo-box p{font-size:.73rem}
    .demo-box p:first-child{color:var(--tm)}
    .demo-box p+p{color:var(--gold);margin-top:.2rem}

    .err-box{padding:.62rem 1rem;background:rgba(232,69,69,.12);border:1px solid rgba(232,69,69,.3);border-radius:10px;color:#f87272;font-size:.82rem;margin-bottom:.82rem;display:flex;align-items:center;gap:.5rem}
    .info-box{padding:.62rem 1rem;background:rgba(58,141,222,.1);border:1px solid rgba(58,141,222,.28);border-radius:10px;color:#6ab4f5;font-size:.82rem;margin-bottom:.82rem}
    .ok-box{padding:.62rem 1rem;background:rgba(46,201,126,.1);border:1px solid rgba(46,201,126,.28);border-radius:10px;color:var(--green);font-size:.82rem;margin-bottom:.82rem}

    /* ── MAIN APP ── */
    .stars-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 20% 60%,#1a1060,transparent 50%),radial-gradient(ellipse at 80% 10%,#102050,transparent 40%),var(--bg)}
    .app{min-height:100vh;display:flex;flex-direction:column;position:relative}

    /* NAV */
    .nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;height:62px;background:rgba(8,14,43,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--gb)}
    @media(max-width:768px){.nav{padding:0 1rem}}
    .nav-logo{display:flex;align-items:center;gap:.6rem}
    .nav-logo-box{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.9rem;color:#fff}
    .nav-logo-txt{font-weight:700;font-size:1rem;color:#fff}
    .nav-logo-txt em{color:var(--cyan);font-style:normal}
    .nav-right{display:flex;align-items:center;gap:.75rem}
    .nav-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#c47f00);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.78rem;color:var(--bg);border:2px solid rgba(244,185,66,.38)}
    .nav-name{font-size:.84rem;font-weight:600}
    .nav-badge{font-size:.67rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:2px 8px;border-radius:20px}
    .ba{background:rgba(244,185,66,.14);color:var(--gold);border:1px solid rgba(244,185,66,.28)}
    .bs{background:rgba(58,141,222,.14);color:#6ab4f5;border:1px solid rgba(58,141,222,.28)}
    .btn-icon{width:33px;height:33px;border-radius:8px;border:1px solid var(--gb);background:var(--g);color:var(--tm);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .btn-icon:hover{background:rgba(232,69,69,.12);color:#f87272}

    /* MAIN */
    .main{flex:1;padding:2rem 2.5rem;max-width:1400px;margin:0 auto;width:100%;position:relative;z-index:1}
    @media(max-width:768px){.main{padding:1rem}}

    /* HERO */
    .hero{border-radius:20px;padding:2.5rem 3rem;background:linear-gradient(135deg,#1a2860,#0d1840);border:1px solid var(--gb);margin-bottom:2rem;position:relative;overflow:hidden}
    .hero::before{content:'';position:absolute;top:-40%;right:-8%;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(244,185,66,.09),transparent 70%)}
    .hero-t{font-family:'Fraunces',serif;font-size:2rem;font-weight:700;line-height:1.2;margin-bottom:.5rem}
    .hero-t em{color:var(--gold);font-style:italic}
    .hero-s{color:var(--tm);font-size:.875rem;max-width:460px}
    .hero-stats{display:flex;gap:2rem;margin-top:1.35rem;flex-wrap:wrap}
    .hs-n{font-family:'Fraunces',serif;font-size:1.7rem;font-weight:700;color:var(--gold)}
    .hs-l{font-size:.72rem;color:var(--tm)}
    @media(max-width:600px){.hero{padding:1.5rem}.hero-t{font-size:1.5rem}}

    /* SEARCH */
    .sw{position:relative;margin-bottom:1.2rem}
    .sw svg{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--tm)}
    .sinp{width:100%;padding:.7rem 1rem .7rem 2.7rem;border-radius:12px;border:1.5px solid var(--gb);background:rgba(255,255,255,.05);color:var(--tp);font-family:'DM Sans',sans-serif;font-size:.875rem;outline:none;transition:all .2s}
    .sinp:focus{border-color:var(--blue)}
    .sinp::placeholder{color:var(--tm)}

    /* CHIPS */
    .chips{display:flex;flex-wrap:wrap;gap:.48rem;margin-bottom:1.35rem}
    .chip{padding:.3rem .82rem;border-radius:20px;border:1.5px solid var(--gb);background:var(--g);color:var(--tm);font-size:.77rem;font-weight:500;cursor:pointer;transition:all .2s}
    .chip:hover{border-color:var(--gold);color:var(--gold)}
    .chip.on{background:rgba(244,185,66,.12);border-color:var(--gold);color:var(--gold)}

    /* SEC HDR */
    .sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.05rem;flex-wrap:wrap;gap:.5rem}
    .sec-t{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:700}
    .sec-t em{color:var(--gold);font-style:italic}
    .sec-c{font-size:.76rem;color:var(--tm);background:var(--g);padding:3px 10px;border-radius:20px;border:1px solid var(--gb)}

    /* TABS */
    .tabs{display:flex;gap:2px;background:rgba(0,0,0,.25);border-radius:12px;padding:4px;margin-bottom:1.7rem;width:fit-content;flex-wrap:wrap}
    .tab{padding:.46rem 1.1rem;border-radius:9px;border:none;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:600;cursor:pointer;transition:all .2s;color:var(--tm);background:transparent;position:relative}
    .tab.on{background:rgba(244,185,66,.13);color:var(--gold);border:1px solid rgba(244,185,66,.2)}
    .tab:hover:not(.on){color:var(--tp);background:var(--g)}
    .tab-badge{position:absolute;top:-5px;right:-5px;width:17px;height:17px;border-radius:50%;background:var(--red);color:#fff;font-size:.6rem;font-weight:700;display:flex;align-items:center;justify-content:center}

    /* BTNs */
    .btn{display:inline-flex;align-items:center;gap:.42rem;padding:.5rem 1.1rem;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:.83rem;font-weight:600;cursor:pointer;transition:all .2s}
    .btn:disabled{opacity:.5;cursor:not-allowed}
    .btn-gold{background:linear-gradient(135deg,var(--gold),#d4940a);color:var(--bg);box-shadow:0 4px 14px rgba(244,185,66,.24)}
    .btn-gold:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(244,185,66,.34)}
    .btn-blue{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff}
    .btn-blue:hover:not(:disabled){transform:translateY(-1px)}
    .btn-ghost{background:var(--g);color:var(--tp);border:1px solid var(--gb)}
    .btn-ghost:hover:not(:disabled){background:rgba(255,255,255,.1)}
    .btn-danger{background:rgba(232,69,69,.13);color:#f87272;border:1px solid rgba(232,69,69,.27)}
    .btn-danger:hover:not(:disabled){background:rgba(232,69,69,.23)}
    .btn-success{background:rgba(46,201,126,.12);color:var(--green);border:1px solid rgba(46,201,126,.26)}
    .btn-edit{background:rgba(58,141,222,.13);color:#6ab4f5;border:1px solid rgba(58,141,222,.27)}
    .btn-edit:hover:not(:disabled){background:rgba(58,141,222,.23)}
    .btn-dl{background:rgba(139,92,246,.13);color:#c084fc;border:1px solid rgba(139,92,246,.27)}
    .btn-dl:hover:not(:disabled){background:rgba(139,92,246,.23)}
    .btn-approve{background:rgba(46,201,126,.13);color:var(--green);border:1px solid rgba(46,201,126,.27)}
    .btn-reject{background:rgba(232,69,69,.13);color:#f87272;border:1px solid rgba(232,69,69,.27)}
    .btn-sm{padding:.3rem .78rem;font-size:.76rem}
    .btn-lg{padding:.72rem 1.7rem;font-size:.93rem;border-radius:12px}
    .btn-full{width:100%;justify-content:center}

    /* EVENT GRID */
    .evgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:1.1rem}
    .evcard{background:rgba(10,18,60,.85);border:1px solid var(--gb);border-radius:18px;overflow:hidden;transition:all .25s;cursor:pointer;position:relative}
    .evcard:hover{transform:translateY(-4px);border-color:rgba(244,185,66,.28);box-shadow:0 14px 42px rgba(0,0,0,.38)}
    .ev-banner{height:118px;display:flex;align-items:center;justify-content:center;font-size:2.7rem;position:relative}
    .ev-body{padding:1.05rem}
    .ev-cat{display:inline-flex;align-items:center;gap:.38rem;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem}
    .dot6{width:6px;height:6px;border-radius:50%;display:inline-block;flex-shrink:0}
    .ev-title{font-family:'Fraunces',serif;font-size:.98rem;font-weight:700;margin-bottom:.35rem;line-height:1.3}
    .ev-meta{color:var(--tm);font-size:.76rem;display:flex;flex-direction:column;gap:.2rem;margin-bottom:.8rem}
    .ev-mr{display:flex;align-items:center;gap:.35rem}
    .capbw{height:4px;background:rgba(255,255,255,.07);border-radius:2px;margin-bottom:.42rem}
    .capb{height:100%;border-radius:2px;transition:width .4s}
    .capt{font-size:.68rem;color:var(--tm)}
    .ev-foot{display:flex;align-items:center;justify-content:space-between}
    .reg-badge{position:absolute;top:.65rem;right:.65rem;background:rgba(46,201,126,.18);color:var(--green);border:1px solid rgba(46,201,126,.35);border-radius:20px;padding:2px 9px;font-size:.67rem;font-weight:700}
    .past-badge{position:absolute;top:.65rem;right:.65rem;background:rgba(0,0,0,.35);color:var(--tm);border:1px solid var(--gb);border-radius:20px;padding:2px 9px;font-size:.67rem;font-weight:700}
    .fb-badge{position:absolute;top:.65rem;left:.65rem;background:rgba(139,92,246,.2);color:#c084fc;border:1px solid rgba(139,92,246,.35);border-radius:20px;padding:2px 9px;font-size:.67rem;font-weight:700}

    /* MODAL */
    .mo{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1.5rem}
    .mbox{width:100%;max-width:540px;max-height:92vh;overflow-y:auto;background:#0d1848;border:1px solid var(--gb);border-radius:22px;padding:1.7rem;box-shadow:0 28px 70px rgba(0,0,0,.6);animation:fadeUp .3s ease}
    .mbox-lg{max-width:640px}
    .m-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.2rem}
    .m-title{font-family:'Fraunces',serif;font-size:1.35rem;font-weight:700}
    .m-close{width:30px;height:30px;border-radius:7px;border:1px solid var(--gb);background:var(--g);color:var(--tm);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
    .m-close:hover{background:rgba(232,69,69,.14);color:var(--red)}
    .m-banner{height:148px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:3.7rem;margin-bottom:1.05rem}
    .igrid{display:grid;grid-template-columns:1fr 1fr;gap:.62rem;margin-bottom:1.05rem}
    @media(max-width:500px){.igrid{grid-template-columns:1fr}}
    .ibox{background:rgba(255,255,255,.04);border:1px solid var(--gb);border-radius:9px;padding:.62rem .88rem}
    .ilbl{font-size:.67rem;text-transform:uppercase;letter-spacing:.06em;color:var(--tm);margin-bottom:.16rem}
    .ival{font-size:.86rem;font-weight:600}
    .ev-desc{color:var(--tm);font-size:.84rem;line-height:1.65;margin-bottom:1.05rem}
    .divider{border:none;border-top:1px solid var(--gb);margin:1.2rem 0}

    /* FORM GRID */
    .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:.82rem}
    @media(max-width:560px){.cgrid{grid-template-columns:1fr}}
    .csec{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--tm);margin-bottom:.6rem;padding-bottom:.38rem;border-bottom:1px solid var(--gb);grid-column:1/-1}
    .chg-badge{margin-left:.5rem;font-size:.65rem;font-weight:700;background:rgba(244,185,66,.18);color:var(--gold);border:1px solid rgba(244,185,66,.3);border-radius:20px;padding:1px 7px;vertical-align:middle}

    /* STATS */
    .stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:.88rem;margin-bottom:1.55rem}
    @media(max-width:800px){.stat-row{grid-template-columns:1fr 1fr}}
    .sc{background:rgba(10,18,60,.85);border:1px solid var(--gb);border-radius:15px;padding:1.1rem 1.3rem}
    .slbl{font-size:.7rem;color:var(--tm);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.22rem}
    .sval{font-family:'Fraunces',serif;font-size:1.85rem;font-weight:700}
    .ssub{font-size:.7rem;color:var(--tm);margin-top:.18rem}

    /* TABLE */
    .tbl-wrap{background:rgba(10,18,60,.85);border:1px solid var(--gb);border-radius:16px;overflow:hidden;overflow-x:auto}
    .tbl{width:100%;border-collapse:collapse}
    .tbl th{padding:.82rem 1.05rem;text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--tm);border-bottom:1px solid var(--gb);background:rgba(255,255,255,.02);white-space:nowrap}
    .tbl td{padding:.82rem 1.05rem;border-bottom:1px solid rgba(255,255,255,.04);font-size:.84rem;vertical-align:middle}
    .tbl tr:last-child td{border-bottom:none}
    .tbl tr:hover td{background:rgba(255,255,255,.02)}
    .sbadge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:.68rem;font-weight:700;text-transform:uppercase}
    .sb-pub{background:rgba(46,201,126,.1);color:var(--green);border:1px solid rgba(46,201,126,.2)}
    .sb-past{background:rgba(100,100,100,.12);color:#888;border:1px solid rgba(100,100,100,.18)}
    .sb-dft{background:rgba(244,185,66,.09);color:var(--gold);border:1px solid rgba(244,185,66,.2)}
    .sb-pend{background:rgba(251,146,60,.12);color:var(--orange);border:1px solid rgba(251,146,60,.25)}

    /* REG LIST */
    .reg-list{display:flex;flex-direction:column;gap:.52rem}
    .reg-item{display:flex;align-items:center;gap:.88rem;padding:.82rem 1.05rem;background:rgba(255,255,255,.03);border:1px solid var(--gb);border-radius:11px}
    .reg-av{width:35px;height:35px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.78rem;color:#fff;flex-shrink:0}
    .reg-name{font-weight:600;font-size:.86rem}
    .reg-email{font-size:.73rem;color:var(--tm)}

    /* FEEDBACK */
    .fb-card{background:rgba(255,255,255,.03);border:1px solid var(--gb);border-radius:12px;padding:1rem 1.1rem;margin-bottom:.6rem}
    .fb-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem}
    .fb-name{font-weight:600;font-size:.88rem}
    .fb-date{font-size:.72rem;color:var(--tm)}
    .fb-stars{display:flex;gap:2px;margin-bottom:.45rem}
    .fb-comment{font-size:.84rem;color:var(--tm);line-height:1.6}
    .avg-row{display:flex;align-items:center;gap:.6rem;margin-bottom:1rem;padding:.75rem 1rem;background:rgba(244,185,66,.07);border:1px solid rgba(244,185,66,.18);border-radius:10px}
    .avg-num{font-family:'Fraunces',serif;font-size:2rem;font-weight:700;color:var(--gold)}
    .star-picker{display:flex;gap:.5rem;margin:.5rem 0}
    .star-btn{font-size:1.8rem;background:none;border:none;cursor:pointer;transition:transform .15s;line-height:1;padding:0}
    .star-btn:hover{transform:scale(1.2)}

    /* APPROVAL CARD */
    .appr-card{background:rgba(10,18,60,.85);border:1px solid rgba(251,146,60,.3);border-radius:14px;padding:1rem 1.2rem;display:flex;align-items:center;gap:1rem;margin-bottom:.6rem;flex-wrap:wrap}
    .appr-av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--orange),#c2410c);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;flex-shrink:0}
    .appr-info{flex:1;min-width:0}
    .appr-name{font-weight:700;font-size:.95rem}
    .appr-email{font-size:.78rem;color:var(--tm);margin-top:.1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .appr-date{font-size:.72rem;color:var(--tm);margin-top:.2rem}
    .appr-btns{display:flex;gap:.5rem;flex-shrink:0}

    /* PENDING PAGE */
    .pending-page{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}
    .pending-card{max-width:440px;text-align:center;padding:3rem 2.5rem;background:rgba(10,18,60,.9);border:1px solid rgba(251,146,60,.25);border-radius:24px;box-shadow:0 24px 60px rgba(0,0,0,.5)}
    .pending-icon{font-size:3.5rem;margin-bottom:1rem;animation:pulse 2.5s ease infinite}
    .pending-title{font-family:'Fraunces',serif;font-size:1.7rem;color:var(--orange);margin-bottom:.75rem}
    .pending-sub{color:var(--tm);font-size:.9rem;line-height:1.65;margin-bottom:1.5rem}

    /* TOAST */
    .toast-wrap{position:fixed;top:70px;right:1.2rem;z-index:300;display:flex;flex-direction:column;gap:.42rem}
    .toast{padding:.68rem 1.1rem;border-radius:11px;font-size:.84rem;font-weight:500;min-width:250px;max-width:320px;border:1px solid;box-shadow:0 6px 20px rgba(0,0,0,.4);animation:fadeUp .3s ease;display:flex;align-items:center;gap:.52rem}
    .tok{background:rgba(46,201,126,.13);border-color:rgba(46,201,126,.3);color:var(--green)}
    .ter{background:rgba(232,69,69,.13);border-color:rgba(232,69,69,.3);color:#f87272}
    .tin{background:rgba(58,141,222,.13);border-color:rgba(58,141,222,.3);color:#6ab4f5}

    /* MISC */
    .empty{text-align:center;padding:3.5rem 2rem}
    .empty-icon{font-size:2.9rem;margin-bottom:.85rem;animation:float 3s ease infinite}
    .empty-title{font-family:'Fraunces',serif;font-size:1.15rem;margin-bottom:.38rem}
    .empty-sub{color:var(--tm);font-size:.86rem}
    .spinner{border:2.5px solid rgba(255,255,255,.14);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
    .page-load{display:flex;align-items:center;justify-content:center;min-height:60vh;flex-direction:column;gap:1rem}
  `}</style>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const CATS = [
  { id:'all',      label:'All Events', color:'#f4b942' },
  { id:'tech',     label:'Tech',       color:'#3a8dde' },
  { id:'cultural', label:'Cultural',   color:'#8b5cf6' },
  { id:'sports',   label:'Sports',     color:'#2ec97e' },
  { id:'academic', label:'Academic',   color:'#f87272' },
  { id:'workshop', label:'Workshop',   color:'#fb923c' },
];
const BANNERS = {
  tech:     { bg:'linear-gradient(135deg,#0f3460,#1a6098)', e:'💻' },
  cultural: { bg:'linear-gradient(135deg,#3a0060,#7c00a0)', e:'🎭' },
  sports:   { bg:'linear-gradient(135deg,#004d26,#007a3d)', e:'⚽' },
  academic: { bg:'linear-gradient(135deg,#600000,#9e0000)', e:'🎓' },
  workshop: { bg:'linear-gradient(135deg,#5a2d00,#a05a00)', e:'🛠️' },
};
const isPast  = d => new Date(d) < new Date(new Date().toDateString());
const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
const ini     = n => n ? n.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : '?';
const todayStr = () => new Date().toISOString().slice(0,10);

// ─── useToast ─────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, set] = useState([]);
  const add = (msg, type) => {
    const id = Date.now();
    set(t => [...t, { id, msg, type }]);
    setTimeout(() => set(t => t.filter(x => x.id !== id)), 4000);
  };
  return { toasts, ok: m => add(m,'ok'), err: m => add(m,'er'), inf: m => add(m,'in') };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  eye:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></svg>,
  eyeOff: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1={1} y1={1} x2={23} y2={23}/></svg>,
  x:      () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>,
  plus:   () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg>,
  logout: () => <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1={21} y1={12} x2={9} y2={12}/></svg>,
  users:  () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  trash:  () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  edit:   () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  dl:     () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1={12} y1={15} x2={12} y2={3}/></svg>,
  search: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/></svg>,
  msg:    () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  check:  () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  cal:    () => <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={4} width={18} height={18} rx={2}/><line x1={3} y1={10} x2={21} y2={10}/></svg>,
  pin:    () => <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx={12} cy={10} r={3}/></svg>,
};

// ─── Small components ─────────────────────────────────────────────────────────
function Toasts({ toasts }) {
  const ic = { ok:'✅', er:'❌', in:'ℹ️' };
  return (
    <div className="toast-wrap">
      {toasts.map(t => <div key={t.id} className={`toast t${t.type}`}>{ic[t.type]} {t.msg}</div>)}
    </div>
  );
}

function PwStrength({ pw }) {
  const s = !pw ? 0 : pw.length < 5 ? 1 : pw.length < 8 ? 2 : /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? 4 : 3;
  const c = ['','#ef4444','#f97316','#eab308','#22c55e'];
  return <div className="pw-bars">{[1,2,3,4].map(i => <div key={i} className="pw-bar" style={{ background: i<=s ? c[s] : undefined }}/>)}</div>;
}

function Stars({ r, size = 15 }) {
  return <div className="fb-stars">{[1,2,3,4,5].map(i => <span key={i} style={{ fontSize:size, opacity: i<=r ? 1 : .2 }}>★</span>)}</div>;
}

function Spin({ size = 18 }) {
  return <span className="spinner" style={{ width:size, height:size }}/>;
}

// ─── Campus left panel ────────────────────────────────────────────────────────
function CampusPanel() {
  const B = [{l:'4%',w:'16%',h:'52%',n:12},{l:'21%',w:'20%',h:'70%',n:18},{l:'43%',w:'15%',h:'46%',n:9},{l:'60%',w:'22%',h:'63%',n:15},{l:'84%',w:'14%',h:'40%',n:6}];
  return (
    <div className="auth-left">
      <div className="auth-bg"/>
      <div className="auth-scene">
        {B.map((b,i) => (
          <div key={i} className="bldg" style={{ left:b.l, width:b.w, height:b.h }}>
            <div className="bldg-wins">{Array.from({length:b.n}).map((_,j) => <div key={j} className={`bwin ${Math.random()>.45?'lit':''}`}/>)}</div>
          </div>
        ))}
      </div>
      <div className="apanel-logo"><div className="apanel-box">CE</div><span className="apanel-txt">Campus<em>Events</em></span></div>
      <div className="auth-overlay">
        <p className="auth-quote">Discover <em>amazing</em> events on your campus</p>
        <p className="auth-quote-sub">Register, explore, and never miss what's happening.</p>
        <div className="adots"><div className="adot on"/><div className="adot"/><div className="adot"/></div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  SIGNUP
// ══════════════════════════════════════════════════════════════════════════════
function Signup({ onSwitch, onLogin, toast }) {
  const [f, sf]           = useState({ name:'', email:'', mobile:'', password:'', role:'student' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setL]   = useState(false);
  const [err, setErr]     = useState('');
  const [pending, setPend] = useState(false);

  const set = (k, v) => { sf(p => ({...p,[k]:v})); setErr(''); };

  const submit = async () => {
    if (!f.name||!f.email||!f.mobile||!f.password) return setErr('All fields are required.');
    if (!/^\d{10}$/.test(f.mobile)) return setErr('Mobile must be 10 digits.');
    if (f.password.length < 6) return setErr('Password must be at least 6 characters.');
    setL(true);
    try {
      const d = await authAPI.signup(f);
      if (d.requiresApproval) { setPend(true); return; }
      localStorage.setItem('cem_token', d.token);
      toast.ok(`Welcome, ${d.user.name.split(' ')[0]}! 🎉`);
      onLogin(d.user);
    } catch (e) { setErr(e.message); }
    finally { setL(false); }
  };

  if (pending) return (
    <div className="pending-page">
      <CSS/>
      <div className="pending-card fu">
        <div className="pending-icon">⏳</div>
        <h2 className="pending-title">Approval Pending</h2>
        <p className="pending-sub">Your admin account has been created and is waiting for approval from an existing admin. You'll be able to login once approved.</p>
        <button className="abtn" style={{ maxWidth:200 }} onClick={onSwitch}>Back to Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="auth-root">
      <CSS/>
      <CampusPanel/>
      <div className="auth-right">
        <div className="mob-logo fu"><div className="mob-box">CE</div><span className="mob-txt">Campus<em>Events</em></span></div>
        <h1 className="ah fu">Create account</h1>
        <p className="as fu">Register to access college events</p>
        {err && <div className="err-box fi">⚠️ {err}</div>}
        <div className="form-row fu2">
          <div className="fg">
            <label className="fl">Full Name *</label>
            <input className="fi" placeholder="Rahul Verma" value={f.name} onChange={e=>set('name',e.target.value)}/>
          </div>
          <div className="fg">
            <label className="fl">Role</label>
            <div className="role-pills">
              <button className={`rpill ${f.role==='student'?'on':''}`} onClick={()=>set('role','student')}> Student</button>
              <button className={`rpill ${f.role==='admin'?'on':''}`}   onClick={()=>set('role','admin')}> Teacher</button>
            </div>
          </div>
        </div>
        <div className="fg fu2">
          <label className="fl">Email Address *</label>
          <input className="fi" type="email" placeholder="you@college.edu" value={f.email} onChange={e=>set('email',e.target.value)}/>
        </div>
        <div className="fg fu3">
          <label className="fl">Mobile *</label>
          <div className="pw-wrap">
            <span style={{position:'absolute',left:'1rem',top:'50%',transform:'translateY(-50%)',color:'var(--tm)',fontSize:'.84rem',fontWeight:600}}>+91</span>
            <input className="fi" placeholder="98765 43210" style={{paddingLeft:'3.2rem'}}
              value={f.mobile} onChange={e=>set('mobile',e.target.value.replace(/\D/g,'').slice(0,10))}/>
          </div>
        </div>
        <div className="fg fu3">
          <label className="fl">Password * <span style={{color:'var(--tm)',textTransform:'none',letterSpacing:0,fontWeight:400}}>(min 6 chars)</span></label>
          <div className="pw-wrap">
            <input className="fi" type={showPw?'text':'password'} placeholder="••••••••" style={{paddingRight:'2.8rem'}}
              value={f.password} onChange={e=>set('password',e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}/>
            <button className="pw-eye" onClick={()=>setShowPw(v=>!v)}>{showPw?<Ic.eyeOff/>:<Ic.eye/>}</button>
          </div>
          {f.password && <PwStrength pw={f.password}/>}
        </div>
        {f.role==='admin' && <div className="info-box fu3">ℹ️ Admin accounts need approval from an existing admin before login.</div>}
        <button className="abtn fu4" onClick={submit} disabled={loading}>{loading?<Spin/>:'Create Account →'}</button>
        <p className="a-switch fu5">Already registered? <button className="lnk" onClick={onSwitch}>Sign in</button></p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function Login({ onSwitch, onLogin, toast }) {
  const [email, setEmail]     = useState('');
  const [pw, setPw]           = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setL]       = useState(false);
  const [err, setErr]         = useState('');

  const submit = async () => {
    if (!email||!pw) return setErr('Please fill both fields.');
    setL(true);
    try {
      const d = await authAPI.login({ email, password: pw });
      localStorage.setItem('cem_token', d.token);
      toast.ok(`Welcome back, ${d.user.name.split(' ')[0]}! 👋`);
      onLogin(d.user);
    } catch (e) { setErr(e.message); }
    finally { setL(false); }
  };

  return (
    <div className="auth-root">
      <CSS/>
      <CampusPanel/>
      <div className="auth-right">
        <div className="mob-logo fu"><div className="mob-box">CE</div><span className="mob-txt">Campus<em>Events</em></span></div>
        <h1 className="ah fu">Welcome back</h1>
        <p className="as fu">Sign in to your campus account</p>
        <button className="google-btn fu2" onClick={()=>toast.inf('Google sign-in coming soon!')}>
          <div className="g-ico">G</div>Continue with Google
        </button>
        <div className="or-div fu2"><div className="or-line"/><span className="or-txt">or sign in with email</span><div className="or-line"/></div>
        {err && <div className="err-box fi">⚠️ {err}</div>}
        <div className="fg fu3">
          <label className="fl">Email Address</label>
          <input className="fi" type="email" placeholder="you@college.edu"
            value={email} onChange={e=>{setEmail(e.target.value);setErr('');}}/>
        </div>
        <div className="fg fu3">
          <label className="fl">Password</label>
          <div className="pw-wrap">
            <input className="fi" type={showPw?'text':'password'} placeholder="••••••••" style={{paddingRight:'2.8rem'}}
              value={pw} onChange={e=>{setPw(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&submit()}/>
            <button className="pw-eye" onClick={()=>setShowPw(v=>!v)}>{showPw?<Ic.eyeOff/>:<Ic.eye/>}</button>
          </div>
        </div>
        <button className="abtn fu4" onClick={submit} disabled={loading}>{loading?<Spin/>:'Sign In →'}</button>
        <p className="a-switch fu5">No account? <button className="lnk" onClick={onSwitch}>Create one</button></p>
        <div className="demo-box fu5">
          <p>💡 Sign up above to create your account.</p>
          <p>Admin accounts need approval from existing admins.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ ev, uid, role, onOpen, onReg }) {
  const cat  = CATS.find(c => c.id === ev.category);
  const bn   = BANNERS[ev.category] || BANNERS.tech;
  const past = isPast(ev.date);
  const regd = ev.registrations?.some(r => (r.user?._id||r.user) === uid);
  const full = (ev.registrations?.length||0) >= ev.capacity;
  const pct  = Math.round(((ev.registrations?.length||0)/ev.capacity)*100);
  const hasFb = ev.feedback?.some(f => (f.user?._id||f.user) === uid);
  return (
    <div className="evcard fu" onClick={() => onOpen(ev)}>
      <div className="ev-banner" style={{ background:bn.bg }}>
        {bn.e}
        {regd && !past && <span className="reg-badge">✓ Registered</span>}
        {past && regd && !hasFb && <span className="fb-badge">📝 Feedback</span>}
        {past && !regd && <span className="past-badge">Past</span>}
      </div>
      <div className="ev-body">
        <div className="ev-cat" style={{ color:cat?.color }}>
          <span className="dot6" style={{ background:cat?.color }}/>{cat?.label}
        </div>
        <h3 className="ev-title">{ev.title}</h3>
        <div className="ev-meta">
          <div className="ev-mr"><Ic.cal/> {fmtDate(ev.date)} · {ev.time}</div>
          <div className="ev-mr"><Ic.pin/> {ev.venue}</div>
        </div>
        <div className="capbw"><div className="capb" style={{ width:`${pct}%`, background:pct>85?'var(--red)':pct>60?'var(--gold)':'var(--green)' }}/></div>
        <div className="ev-foot">
          <span className="capt">{ev.registrations?.length||0}/{ev.capacity} seats</span>
          {role==='student' && !past && (
            <button className={`btn btn-sm ${regd?'btn-danger':full?'btn-ghost':'btn-gold'}`}
              style={full&&!regd?{opacity:.5,cursor:'not-allowed'}:{}}
              onClick={e=>{e.stopPropagation();if(!full||regd)onReg(ev);}}>
              {regd?'Unregister':full?'Full':'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Event Detail Modal ───────────────────────────────────────────────────────
function EventModal({ ev, uid, role, onClose, onReg, onFeedback }) {
  const cat  = CATS.find(c => c.id === ev.category);
  const bn   = BANNERS[ev.category] || BANNERS.tech;
  const past = isPast(ev.date);
  const regd = ev.registrations?.some(r => (r.user?._id||r.user) === uid);
  const full = (ev.registrations?.length||0) >= ev.capacity;
  const pct  = Math.round(((ev.registrations?.length||0)/ev.capacity)*100);
  const hasFb = ev.feedback?.some(f => (f.user?._id||f.user) === uid);
  return (
    <div className="mo" onClick={onClose}>
      <div className="mbox" onClick={e=>e.stopPropagation()}>
        <div className="m-hdr"><h2 className="m-title">{ev.title}</h2><button className="m-close" onClick={onClose}><Ic.x/></button></div>
        <div className="m-banner" style={{ background:bn.bg }}>{bn.e}</div>
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.85rem' }}>
          <span className="dot6" style={{ background:cat?.color, width:8, height:8 }}/>
          <span style={{ color:cat?.color, fontSize:'.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em' }}>{cat?.label}</span>
          <span className={`sbadge ${past?'sb-past':ev.published?'sb-pub':'sb-dft'}`} style={{ marginLeft:'auto' }}>{past?'Past':ev.published?'Upcoming':'Draft'}</span>
        </div>
        <p className="ev-desc">{ev.description}</p>
        <div className="igrid">
          {[['📅 Date',fmtDate(ev.date)],['🕐 Time',ev.time],['📍 Venue',ev.venue],['🏛️ Organizer',ev.organizer]].map(([l,v])=>(
            <div key={l} className="ibox"><div className="ilbl">{l}</div><div className="ival">{v}</div></div>
          ))}
        </div>
        <div className="capbw" style={{ height:6, borderRadius:3 }}>
          <div className="capb" style={{ width:`${pct}%`, background:pct>85?'var(--red)':pct>60?'var(--gold)':'var(--green)', borderRadius:3 }}/>
        </div>
        <p className="capt" style={{ margin:'.32rem 0 1rem' }}>{ev.registrations?.length||0}/{ev.capacity} seats ({pct}%)</p>
        {role==='student' && !past && (
          <button className={`btn btn-full btn-lg ${regd?'btn-danger':full?'btn-ghost':'btn-gold'}`}
            style={full&&!regd?{opacity:.5,cursor:'not-allowed'}:{}}
            onClick={()=>{ if(!full||regd){onReg(ev);onClose();} }}>
            {regd?'❌ Cancel Registration':full?'Event is Full':'✅ Register for this Event'}
          </button>
        )}
        {role==='student' && past && regd && !hasFb && (
          <button className="btn btn-full btn-lg btn-edit" style={{ marginTop:'.5rem' }}
            onClick={()=>{ onFeedback(ev); onClose(); }}>
            📝 Give Feedback
          </button>
        )}
        {role==='student' && past && regd && hasFb && (
          <div className="ok-box" style={{ textAlign:'center', marginTop:'.5rem' }}>✅ Feedback already submitted for this event.</div>
        )}
      </div>
    </div>
  );
}

// ─── Feedback Modal (Student) ─────────────────────────────────────────────────
function FeedbackModal({ ev, onClose, onDone, toast }) {
  const [rating, setR] = useState(0);
  const [hover, setH]  = useState(0);
  const [comment, setC] = useState('');
  const [loading, setL] = useState(false);
  const submit = async () => {
    if (!rating) return toast.err('Select a rating.');
    if (!comment.trim()) return toast.err('Write a comment.');
    setL(true);
    try {
      await eventsAPI.submitFeedback(ev._id, { rating, comment });
      toast.ok('Feedback submitted! 🙏');
      onDone(); onClose();
    } catch (e) { toast.err(e.message); }
    finally { setL(false); }
  };
  return (
    <div className="mo" onClick={onClose}>
      <div className="mbox" onClick={e=>e.stopPropagation()}>
        <div className="m-hdr">
          <div><h2 className="m-title">📝 Event Feedback</h2><p style={{ fontSize:'.8rem', color:'var(--tm)', marginTop:'.12rem' }}>{ev.title}</p></div>
          <button className="m-close" onClick={onClose}><Ic.x/></button>
        </div>
        <div className="fg">
          <label className="fl">Your Rating *</label>
          <div className="star-picker">
            {[1,2,3,4,5].map(s => (
              <button key={s} className="star-btn"
                onMouseEnter={()=>setH(s)} onMouseLeave={()=>setH(0)}
                onClick={()=>setR(s)}
                style={{ opacity:(hover||rating)>=s?1:.25 }}>★</button>
            ))}
          </div>
          {rating > 0 && <p style={{ fontSize:'.78rem', color:'var(--gold)' }}>{['','😞 Poor','😐 Fair','🙂 Good','😊 Very Good','🤩 Excellent!'][rating]}</p>}
        </div>
        <div className="fg">
          <label className="fl">Comment * <span style={{ color:'var(--tm)', textTransform:'none', letterSpacing:0, fontWeight:400 }}>(max 500 chars)</span></label>
          <textarea className="fi" rows={4} placeholder="Share your experience…"
            value={comment} onChange={e=>setC(e.target.value.slice(0,500))}/>
          <p style={{ fontSize:'.72rem', color:'var(--tm)', marginTop:'.3rem' }}>{comment.length}/500</p>
        </div>
        <hr className="divider"/>
        <div style={{ display:'flex', gap:'.62rem' }}>
          <button className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold btn-full" onClick={submit} disabled={loading||!rating||!comment.trim()}>
            {loading?<Spin/>:'Submit Feedback →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  STUDENT DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function StudentDash({ user, toast }) {
  const [events, setEvents] = useState([]);
  const [loading, setL]     = useState(true);
  const [search, setSearch] = useState('');
  const [catF, setCatF]     = useState('all');
  const [tab, setTab]       = useState('discover');
  const [selEv, setSelEv]   = useState(null);
  const [fbEv, setFbEv]     = useState(null);

  const load = useCallback(async () => {
    try { const d = await eventsAPI.getAll(); setEvents(d.data); }
    catch (e) { toast.err('Failed to load events: ' + e.message); }
    finally { setL(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleReg = async (ev) => {
    try { const d = await eventsAPI.register(ev._id); toast.ok(d.message); load(); }
    catch (e) { toast.err(e.message); }
  };

  const upcoming = events.filter(e => e.published && !isPast(e.date));
  const pastEvs  = events.filter(e => e.published && isPast(e.date));
  const myRegs   = events.filter(e => e.registrations?.some(r => (r.user?._id||r.user) === user._id));
  const pool     = tab==='discover' ? upcoming : tab==='past' ? pastEvs : myRegs;
  const filtered = pool.filter(e => (catF==='all'||e.category===catF) && e.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="page-load"><Spin size={40}/><p style={{ color:'var(--tm)' }}>Loading events…</p></div>;

  return (
    <>
      <div className="hero fu">
        <div className="hero-t">Discover <em>amazing</em> campus events</div>
        <p className="hero-s">Register for events, attend them, and share your feedback.</p>
        <div className="hero-stats">
          <div><div className="hs-n">{upcoming.length}</div><div className="hs-l">Upcoming</div></div>
          <div><div className="hs-n">{myRegs.length}</div><div className="hs-l">My Registrations</div></div>
          <div><div className="hs-n">{pastEvs.filter(e=>e.registrations?.some(r=>(r.user?._id||r.user)===user._id)).length}</div><div className="hs-l">Attended</div></div>
        </div>
      </div>
      <div className="tabs fu2">
        <button className={`tab ${tab==='discover'?'on':''}`} onClick={()=>setTab('discover')}>🔭 Discover</button>
        <button className={`tab ${tab==='past'?'on':''}`}     onClick={()=>setTab('past')}>📋 Past</button>
        <button className={`tab ${tab==='mine'?'on':''}`}     onClick={()=>setTab('mine')}>🎟️ My Tickets ({myRegs.length})</button>
      </div>
      <div className="sw fu2"><Ic.search/><input className="sinp" placeholder="Search events…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {tab !== 'mine' && (
        <div className="chips fu3">
          {CATS.map(c => (
            <button key={c.id} className={`chip ${catF===c.id?'on':''}`}
              style={catF===c.id?{borderColor:c.color,color:c.color,background:`${c.color}14`}:{}}
              onClick={()=>setCatF(c.id)}>{c.label}
            </button>
          ))}
        </div>
      )}
      <div className="sec-hdr fu3">
        <h2 className="sec-t">{tab==='discover'?<><span>Upcoming </span><em>Events</em></>:tab==='past'?'Past Events':<><span>My </span><em>Tickets</em></>}</h2>
        <span className="sec-c">{filtered.length} events</span>
      </div>
      {filtered.length === 0
        ? <div className="empty"><div className="empty-icon">{tab==='mine'?'🎟️':'🔍'}</div><h3 className="empty-title">{tab==='mine'?'No registrations yet':'No events found'}</h3><p className="empty-sub">Try a different search or filter.</p></div>
        : <div className="evgrid">{filtered.map(e => <EventCard key={e._id} ev={e} uid={user._id} role="student" onOpen={setSelEv} onReg={handleReg}/>)}</div>
      }
      {selEv && <EventModal ev={selEv} uid={user._id} role="student" onClose={()=>setSelEv(null)} onReg={handleReg} onFeedback={setFbEv}/>}
      {fbEv  && <FeedbackModal ev={fbEv} onClose={()=>setFbEv(null)} onDone={load} toast={toast}/>}
    </>
  );
}

// ─── Event Form Modal (Create / Edit) ─────────────────────────────────────────
function EventFormModal({ ev, onClose, onSave, toast }) {
  const isEdit = !!ev;
  const [f, sf] = useState({
    title:       ev?.title       || '',
    category:    ev?.category    || 'tech',
    date:        ev?.date        || '',
    time:        ev?.time        || '10:00 AM',
    venue:       ev?.venue       || '',
    organizer:   ev?.organizer   || '',
    capacity:    ev?.capacity    || 100,
    description: ev?.description || '',
    published:   ev?.published   ?? false,
  });
  const [loading, setL] = useState(false);
  const set  = (k,v) => sf(p => ({...p,[k]:v}));
  const chg  = k => isEdit && String(f[k]) !== String(ev[k]);
  const nChg = isEdit ? ['title','category','date','time','venue','organizer','capacity','description'].filter(chg).length : 0;
  const ic   = k => `fi${chg(k)?' chg':''}`;

  const submit = async () => {
    if (!f.title||!f.venue||!f.organizer||!f.description||!f.date) { toast.err('Fill all required fields.'); return; }
    setL(true);
    try {
      const payload = { ...f, capacity: Number(f.capacity) };
      const d = isEdit ? await eventsAPI.update(ev._id, payload) : await eventsAPI.create(payload);
      toast.ok(d.message);
      onSave();
      onClose();
    } catch (e) { toast.err(e.message); }
    finally { setL(false); }
  };

  return (
    <div className="mo" onClick={onClose}>
      <div className="mbox mbox-lg" onClick={e=>e.stopPropagation()}>
        <div className="m-hdr">
          <div>
            <h2 className="m-title">
              {isEdit ? '✏️ Edit Event' : '✨ Create Event'}
              {nChg > 0 && <span className="chg-badge">{nChg} change{nChg>1?'s':''}</span>}
            </h2>
            {isEdit && <p style={{ fontSize:'.8rem', color:'var(--tm)', marginTop:'.12rem' }}>Gold = modified field</p>}
          </div>
          <button className="m-close" onClick={onClose}><Ic.x/></button>
        </div>
        <div className="cgrid">
          <div className="csec">📝 Basic Info</div>
          <div className="fg" style={{ gridColumn:'1/-1' }}>
            <label className="fl">Title *</label>
            <input className={ic('title')} placeholder="e.g. Spring Tech Conference" value={f.title} onChange={e=>set('title',e.target.value)}/>
          </div>
          <div className="fg"><label className="fl">Category</label>
            <select className={ic('category')} value={f.category} onChange={e=>set('category',e.target.value)}>
              {CATS.filter(c=>c.id!=='all').map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="fg"><label className="fl">Organizer *</label>
            <input className={ic('organizer')} placeholder="CS Department" value={f.organizer} onChange={e=>set('organizer',e.target.value)}/>
          </div>
          <div className="csec">📅 Schedule</div>
          <div className="fg"><label className="fl">Date *</label>
            <input type="date" className={ic('date')} min={isEdit?undefined:todayStr()} value={f.date} onChange={e=>set('date',e.target.value)}/>
          </div>
          <div className="fg"><label className="fl">Time *</label>
            <input className={ic('time')} placeholder="10:00 AM" value={f.time} onChange={e=>set('time',e.target.value)}/>
          </div>
          <div className="fg" style={{ gridColumn:'1/-1' }}><label className="fl">Venue *</label>
            <input className={ic('venue')} placeholder="Main Auditorium" value={f.venue} onChange={e=>set('venue',e.target.value)}/>
          </div>
          <div className="csec">🎟️ Capacity & Visibility</div>
          <div className="fg">
            <label className="fl">Capacity * {isEdit && ev?.registrations?.length > 0 && <span style={{ color:'var(--tm)', textTransform:'none', letterSpacing:0, fontWeight:400 }}>(min {ev.registrations.length})</span>}</label>
            <input type="number" className={ic('capacity')} min={isEdit?(ev?.registrations?.length||1):1} max={5000}
              value={f.capacity} onChange={e=>set('capacity',e.target.value)}/>
          </div>
          <div className="fg">
            <label className="fl">Visibility</label>
            <div style={{ display:'flex', alignItems:'center', gap:'.65rem', padding:'.7rem 1rem', background:'rgba(255,255,255,.04)', border:`1.5px solid ${f.published?'rgba(46,201,126,.3)':'var(--gb)'}`, borderRadius:11, cursor:'pointer' }}
              onClick={()=>set('published',!f.published)}>
              <input type="checkbox" checked={f.published} onChange={e=>set('published',e.target.checked)} style={{ accentColor:'var(--green)', width:16, height:16, cursor:'pointer' }} readOnly/>
              <div>
                <div style={{ fontSize:'.85rem', fontWeight:600 }}>{f.published?'Published':'Draft'}</div>
                <div style={{ fontSize:'.72rem', color:'var(--tm)' }}>{f.published?'Visible to students':'Hidden'}</div>
              </div>
            </div>
          </div>
          <div className="csec">📄 Description</div>
          <div className="fg" style={{ gridColumn:'1/-1' }}><label className="fl">Description *</label>
            <textarea className={ic('description')} rows={3} placeholder="Brief description…" value={f.description} onChange={e=>set('description',e.target.value)}/>
          </div>
        </div>
        <hr className="divider"/>
        <div style={{ display:'flex', gap:'.62rem' }}>
          <button className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold btn-full" onClick={submit}
            disabled={loading||(isEdit&&nChg===0)}
            style={isEdit&&nChg===0?{opacity:.5,cursor:'not-allowed'}:{}}>
            {loading ? <Spin/> : isEdit ? `Save Changes →` : 'Create Event →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Registrations Modal ──────────────────────────────────────────────────────
function RegsModal({ ev, onClose, onDownload }) {
  const [dlLoad, setDl] = useState(false);
  const dl = async () => {
    setDl(true);
    try { await onDownload(); }
    finally { setDl(false); }
  };
  return (
    <div className="mo" onClick={onClose}>
      <div className="mbox" onClick={e=>e.stopPropagation()}>
        <div className="m-hdr">
          <div><h2 className="m-title">Registrations</h2><p style={{ fontSize:'.8rem', color:'var(--tm)', marginTop:'.12rem' }}>{ev.title}</p></div>
          <button className="m-close" onClick={onClose}><Ic.x/></button>
        </div>
        <div style={{ display:'flex', gap:'.62rem', marginBottom:'1rem' }}>
          {[['Registered',(ev.registrations?.length||0),'var(--green)'],['Capacity',ev.capacity,'var(--tp)'],['Available',ev.capacity-(ev.registrations?.length||0),'var(--gold)']].map(([l,v,c])=>(
            <div key={l} className="ibox" style={{ flex:1 }}><div className="ilbl">{l}</div><div className="ival" style={{ color:c }}>{v}</div></div>
          ))}
        </div>
        <button className="btn btn-dl btn-full" style={{ marginBottom:'1rem' }}
          onClick={dl} disabled={dlLoad||!(ev.registrations?.length)}>
          {dlLoad ? <><Spin size={14}/> Generating…</> : <><Ic.dl/> Download Excel (.xlsx)</>}
        </button>
        {!(ev.registrations?.length)
          ? <div className="empty" style={{ padding:'2rem' }}><div className="empty-icon">👤</div><h3 className="empty-title">No registrations yet</h3></div>
          : <div className="reg-list">
              {ev.registrations.map((r,i) => (
                <div key={i} className="reg-item">
                  <div className="reg-av">{ini(r.user?.name||'?')}</div>
                  <div>
                    <div className="reg-name">{r.user?.name||'Unknown'}</div>
                    <div className="reg-email">{r.user?.email}</div>
                    {r.user?.mobile && <div className="reg-email">📱 {r.user.mobile}</div>}
                  </div>
                  <span style={{ marginLeft:'auto', fontSize:'.72rem', color:'var(--green)' }}>✓</span>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ─── Feedback View Modal (Admin) ──────────────────────────────────────────────
function FeedbackViewModal({ ev, onClose }) {
  const [fb, setFb]     = useState([]);
  const [avg, setAvg]   = useState(null);
  const [loading, setL] = useState(true);
  useEffect(() => {
    eventsAPI.getFeedback(ev._id)
      .then(d => { setFb(d.data); setAvg(d.averageRating); })
      .catch(()=>{})
      .finally(()=>setL(false));
  }, [ev._id]);
  return (
    <div className="mo" onClick={onClose}>
      <div className="mbox mbox-lg" onClick={e=>e.stopPropagation()}>
        <div className="m-hdr">
          <div><h2 className="m-title">💬 Student Feedback</h2><p style={{ fontSize:'.8rem', color:'var(--tm)', marginTop:'.12rem' }}>{ev.title}</p></div>
          <button className="m-close" onClick={onClose}><Ic.x/></button>
        </div>
        {loading ? <div className="page-load" style={{ minHeight:200 }}><Spin size={32}/></div> : (
          <>
            {avg && (
              <div className="avg-row">
                <span className="avg-num">{avg}</span>
                <div><Stars r={Math.round(Number(avg))} size={18}/><p style={{ fontSize:'.78rem', color:'var(--tm)', marginTop:'.2rem' }}>{fb.length} response{fb.length!==1?'s':''}</p></div>
              </div>
            )}
            {fb.length === 0
              ? <div className="empty"><div className="empty-icon">💬</div><h3 className="empty-title">No feedback yet</h3><p className="empty-sub">Students can submit after event ends.</p></div>
              : fb.map((f,i) => (
                  <div key={i} className="fb-card">
                    <div className="fb-hdr">
                      <span className="fb-name">{f.userName||f.user?.name||'Student'}</span>
                      <span className="fb-date">{f.submittedAt?new Date(f.submittedAt).toLocaleDateString('en-IN'):''}</span>
                    </div>
                    <Stars r={f.rating}/>
                    <p className="fb-comment">{f.comment}</p>
                  </div>
                ))
            }
          </>
        )}
      </div>
    </div>
  );
}

// ─── Admin Approvals Panel ────────────────────────────────────────────────────
function ApprovalsPanel({ toast, onRefresh }) {
  const [list, setList] = useState([]);
  const [loading, setL] = useState(true);
  const [acting, setAct] = useState(null);

  useEffect(() => {
    authAPI.pendingAdmins()
      .then(d => setList(d.data))
      .catch(()=>{})
      .finally(()=>setL(false));
  }, []);

  const act = async (id, action) => {
    setAct(id+action);
    try {
      const d = await authAPI.approveAdmin(id, action);
      toast.ok(d.message);
      setList(l => l.filter(x => x._id !== id));
      onRefresh();
    } catch (e) { toast.err(e.message); }
    finally { setAct(null); }
  };

  if (loading) return <div className="page-load" style={{ minHeight:200 }}><Spin/></div>;
  if (!list.length) return (
    <div className="empty" style={{ padding:'2rem' }}>
      <div className="empty-icon">✅</div>
      <h3 className="empty-title">No pending requests</h3>
      <p className="empty-sub">All admin requests have been handled.</p>
    </div>
  );
  return (
    <div>
      {list.map(u => (
        <div key={u._id} className="appr-card">
          <div className="appr-av">{ini(u.name)}</div>
          <div className="appr-info">
            <div className="appr-name">{u.name}</div>
            <div className="appr-email">{u.email} · {u.mobile}</div>
            <div className="appr-date">Requested {new Date(u.createdAt).toLocaleDateString('en-IN')}</div>
          </div>
          <div className="appr-btns">
            <button className="btn btn-approve btn-sm" disabled={!!acting}
              onClick={()=>act(u._id,'approve')}>
              {acting===u._id+'approve'?<Spin size={12}/>:<><Ic.check/> Approve</>}
            </button>
            <button className="btn btn-reject btn-sm" disabled={!!acting}
              onClick={()=>act(u._id,'reject')}>
              {acting===u._id+'reject'?<Spin size={12}/>:<><Ic.x/> Reject</>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function AdminDash({ user, toast }) {
  const [events,   setEvents]   = useState([]);
  const [students, setStudents] = useState([]);
  const [loading,  setL]        = useState(true);
  const [tab,      setTab]      = useState('events');
  const [search,   setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editEv,   setEditEv]   = useState(null);
  const [regEv,    setRegEv]    = useState(null);
  const [fbEv,     setFbEv]     = useState(null);
  const [pendCnt,  setPendCnt]  = useState(0);

  const load = useCallback(async () => {
    try {
      const [ed, sd, pd] = await Promise.all([
        eventsAPI.getAll(),
        authAPI.students(),
        authAPI.pendingAdmins()
      ]);
      setEvents(ed.data);
      setStudents(sd.data);
      setPendCnt(pd.data.length);
    } catch (e) { toast.err('Load failed: ' + e.message); }
    finally { setL(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleDelete    = async id => { try { await eventsAPI.remove(id); toast.inf('Event deleted.'); load(); } catch(e){ toast.err(e.message); } };
  const handleTogglePub = async ev => {
    try { await eventsAPI.update(ev._id, { ...ev, published:!ev.published }); load(); }
    catch(e){ toast.err(e.message); }
  };
  const handleDownload  = async ev => {
    try { await eventsAPI.download(ev._id, ev.title); toast.ok('Excel downloaded!'); }
    catch(e){ toast.err('Download failed: ' + e.message); }
  };

  const totalReg = events.reduce((s,e)=>s+(e.registrations?.length||0),0);
  const upcoming = events.filter(e=>!isPast(e.date)).length;
  const pubCount = events.filter(e=>e.published).length;
  const filtered = events.filter(e=>e.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="page-load"><Spin size={40}/><p style={{ color:'var(--tm)' }}>Loading…</p></div>;

  return (
    <>
      <div className="hero fu" style={{ background:'linear-gradient(135deg,#1a0f40,#2a1460)' }}>
        <div className="hero-t">Admin <em>Control Panel</em></div>
        <p className="hero-s">Manage events, approve admins, view feedback, download registrations.</p>
      </div>
      <div className="stat-row fu2">
        {[['Total Events',events.length,'var(--gold)',`${upcoming} upcoming`],
          ['Published',pubCount,'var(--green)',`${events.length-pubCount} drafts`],
          ['Total Registrations',totalReg,'#60a5fa','across all events'],
          ['Students',students.length,'#c084fc','registered accounts']].map(([l,v,c,s])=>(
          <div key={l} className="sc"><div className="slbl">{l}</div><div className="sval" style={{ color:c }}>{v}</div><div className="ssub">{s}</div></div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.05rem', flexWrap:'wrap', gap:'.5rem' }}>
        <div className="tabs" style={{ margin:0 }}>
          <button className={`tab ${tab==='events'?'on':''}`}    onClick={()=>setTab('events')}>📋 Events</button>
          <button className={`tab ${tab==='students'?'on':''}`}  onClick={()=>setTab('students')}>👥 Students ({students.length})</button>
          <button className={`tab ${tab==='approvals'?'on':''}`} onClick={()=>setTab('approvals')} style={{ position:'relative' }}>
            🔔 Approvals
            {pendCnt>0 && <span className="tab-badge">{pendCnt}</span>}
          </button>
        </div>
        {tab==='events' && <button className="btn btn-gold" onClick={()=>setShowForm(true)}><Ic.plus/> Create Event</button>}
      </div>

      {/* EVENTS TAB */}
      {tab==='events' && (
        <>
          <div className="sw" style={{ marginBottom:'1rem' }}><Ic.search/><input className="sinp" placeholder="Search events…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <div className="tbl-wrap fu3">
            <table className="tbl">
              <thead><tr><th>Event</th><th>Category</th><th>Date</th><th>Seats</th><th>Feedback</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(e => {
                  const cat  = CATS.find(c=>c.id===e.category);
                  const past = isPast(e.date);
                  return (
                    <tr key={e._id}>
                      <td><span style={{ fontWeight:600 }}>{e.title}</span><br/><span style={{ fontSize:'.72rem', color:'var(--tm)' }}>by {e.organizer}</span></td>
                      <td><span className="dot6" style={{ background:cat?.color, marginRight:'.38rem' }}/>{cat?.label}</td>
                      <td style={{ fontSize:'.78rem' }}>{fmtDate(e.date)}<br/><span style={{ color:'var(--tm)' }}>{e.time}</span></td>
                      <td><button className="btn btn-ghost btn-sm" onClick={()=>setRegEv(e)}><Ic.users/> {e.registrations?.length||0}/{e.capacity}</button></td>
                      <td>{past?<button className="btn btn-sm" style={{ background:'rgba(139,92,246,.13)', color:'#c084fc', border:'1px solid rgba(139,92,246,.27)' }} onClick={()=>setFbEv(e)}><Ic.msg/> {e.feedback?.length||0}</button>:<span style={{ color:'var(--tm)', fontSize:'.78rem' }}>—</span>}</td>
                      <td><span className={`sbadge ${past?'sb-past':e.published?'sb-pub':'sb-dft'}`}>{past?'Past':e.published?'Published':'Draft'}</span></td>
                      <td>
                        <div style={{ display:'flex', gap:'.3rem', flexWrap:'wrap' }}>
                          <button className="btn btn-edit btn-sm" onClick={()=>setEditEv(e)}><Ic.edit/></button>
                          {!past && <button className={`btn btn-sm ${e.published?'btn-ghost':'btn-success'}`} onClick={()=>handleTogglePub(e)}>{e.published?'Unpub':'Publish'}</button>}
                          <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(e._id)}><Ic.trash/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* STUDENTS TAB */}
      {tab==='students' && (
        <div className="tbl-wrap fu3">
          <table className="tbl">
            <thead><tr><th>Student</th><th>Email</th><th>Mobile</th><th>Events</th><th>Joined</th></tr></thead>
            <tbody>
              {students.map(u => {
                const cnt = events.filter(e=>e.registrations?.some(r=>(r.user?._id||r.user)===u._id)).length;
                return (
                  <tr key={u._id}>
                    <td><div style={{ display:'flex', alignItems:'center', gap:'.65rem' }}><div className="reg-av" style={{ width:31, height:31, fontSize:'.74rem' }}>{ini(u.name)}</div><span style={{ fontWeight:600 }}>{u.name}</span></div></td>
                    <td style={{ color:'var(--tm)', fontSize:'.8rem' }}>{u.email}</td>
                    <td style={{ color:'var(--tm)', fontSize:'.8rem' }}>{u.mobile||'—'}</td>
                    <td><span style={{ color:cnt>0?'var(--green)':'var(--tm)', fontWeight:600 }}>{cnt} event{cnt!==1?'s':''}</span></td>
                    <td style={{ color:'var(--tm)', fontSize:'.78rem' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* APPROVALS TAB */}
      {tab==='approvals' && (
        <div className="fu3">
          <div style={{ marginBottom:'1.2rem', padding:'1rem 1.2rem', background:'rgba(251,146,60,.07)', border:'1px solid rgba(251,146,60,.2)', borderRadius:12 }}>
            <p style={{ fontSize:'.875rem', lineHeight:1.6, color:'var(--tm)' }}>
              🔒 <strong style={{ color:'var(--tp)' }}>Admin Approval System</strong> — When someone signs up as Admin, they appear here. Approve to grant full access.
            </p>
          </div>
          <ApprovalsPanel toast={toast} onRefresh={load}/>
        </div>
      )}

      {showForm && <EventFormModal ev={null}   onClose={()=>setShowForm(false)} onSave={load} toast={toast}/>}
      {editEv   && <EventFormModal ev={editEv} onClose={()=>setEditEv(null)}   onSave={load} toast={toast}/>}
      {regEv    && <RegsModal ev={regEv} onClose={()=>setRegEv(null)} onDownload={()=>handleDownload(regEv)}/>}
      {fbEv     && <FeedbackViewModal ev={fbEv} onClose={()=>setFbEv(null)}/>}
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, onLogout }) {
  return (
    <nav className="nav">
      <div className="nav-logo"><div className="nav-logo-box">CE</div><span className="nav-logo-txt">Campus<em>Events</em></span></div>
      <div className="nav-right">
        <div className="nav-av">{ini(user.name)}</div>
        <div>
          <div className="nav-name">{user.name}</div>
          <span className={`nav-badge ${user.role==='admin'?'ba':'bs'}`}>{user.role==='admin'?'🔧 Admin':'👨‍🎓 Student'}</span>
        </div>
        <button className="btn-icon" onClick={onLogout} title="Logout"><Ic.logout/></button>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,  setScreen]  = useState('login');
  const [user,    setUser]    = useState(null);
  const [booting, setBoot]    = useState(true);
  const toast = useToast();

  // Auto-login from saved token
  useEffect(() => {
    const token = localStorage.getItem('cem_token');
    if (!token) { setBoot(false); return; }
    authAPI.me()
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem('cem_token'))
      .finally(() => setBoot(false));
  }, []);

  const handleLogin  = u  => setUser(u);
  const handleLogout = () => { localStorage.removeItem('cem_token'); setUser(null); setScreen('login'); };

  if (booting) return (
    <>
      <CSS/>
      <div className="page-load" style={{ minHeight:'100vh' }}>
        <Spin size={44}/>
        <p style={{ color:'var(--tm)' }}>Loading CampusEvents…</p>
      </div>
    </>
  );

  // Not logged in
  if (!user) return (
    <>
      {screen==='login'
        ? <Login  onSwitch={()=>setScreen('signup')} onLogin={handleLogin} toast={toast}/>
        : <Signup onSwitch={()=>setScreen('login')}  onLogin={handleLogin} toast={toast}/>
      }
      <Toasts toasts={toast.toasts}/>
    </>
  );

  // Logged in
  return (
    <>
      <CSS/>
      <div className="stars-bg"/>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout}/>
        <div className="main">
          {user.role==='student'
            ? <StudentDash user={user} toast={toast}/>
            : <AdminDash   user={user} toast={toast}/>
          }
        </div>
      </div>
      <Toasts toasts={toast.toasts}/>
    </>
  );
}
