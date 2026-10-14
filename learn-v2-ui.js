
/* Learn v2 views: market detail, watchlist, paper brokerage and education. */
function l2graph(bars,period,color){
 if(!Array.isArray(bars)||bars.length<2)return '<div class="empty">'+lt('noHistory')+'</div>';
 // Plot at most 200 actual observations to keep the iPhone chart responsive.
 if(bars.length>200){const step=Math.ceil((bars.length-1)/199);bars=bars.filter((_,i)=>i%step===0||i===bars.length-1)}
 const vals=bars.map(x=>x.close),lo=Math.min(...vals),hi=Math.max(...vals),spread=Math.max(.01,hi-lo);
 const min=Math.max(0,lo-spread*.2),max=hi+spread*.2;
 const W=308,H=170,L=5,R=4,T=10,B=16;
 const xy=bars.map((b,i)=>({x:L+i*(W-L-R)/(bars.length-1),y:T+(max-b.close)/(max-min)*(H-T-B),...b}));
 const path=xy.map(p=>p.x.toFixed(2)+','+p.y.toFixed(2)).join(' ');
 const area=xy[0].x+','+(H-B)+' '+path+' '+xy.at(-1).x+','+(H-B);
 const ts=xy.map(p=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="6" fill="transparent"><title>'+l2safe(p.time)+' · '+l2money(p.close)+'</title></circle>').join('');
 const stroke=color||'#20c876';
 return '<div class="chartframe"><svg class="stockplot" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" role="img" aria-label="'+lt('chart')+'">'+
  '<defs><linearGradient id="l2linefill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+stroke+'" stop-opacity=".2"/><stop offset="100%" stop-color="'+stroke+'" stop-opacity="0"/></linearGradient></defs>'+
  '<polygon points="'+area+'" fill="url(#l2linefill)"/><polyline points="'+path+'" fill="none" stroke="'+stroke+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+
  '<circle cx="'+xy.at(-1).x+'" cy="'+xy.at(-1).y+'" r="4" fill="'+stroke+'" stroke="#fff" stroke-width="1.5"/>'+ts+'</svg>'+
  '<div class="between"><span>'+l2safe(bars[0].time.slice(0,10))+'</span><span>'+l2safe(bars.at(-1).time.slice(0,10))+'</span></div></div>';
}
function l2periods(value,action){const labels={en:['1D','1W','1M','3M','YTD','1Y','All'],es:['1D','1S','1M','3M','Año','1A','Todo'],it:['1G','1S','1M','3M','Anno','1A','Tutto'],fr:['1J','1S','1M','3M','Année','1A','Tout']}[currentLang]||['1D','1W','1M','3M','YTD','1Y','All'];return '<div class="periods">'+L2RANGES.map((p,i)=>
 '<button type="button" class="'+(p===value?'active':'')+'" aria-pressed="'+(p===value)+'" onclick="'+action+'(\''+p+'\')">'+labels[i]+'</button>').join('')+'</div>'}
function l2tickerRow(asset){
 const quote=l2quote(asset.id),saved=learnSaved.includes(asset.id);
 return '<div class="assetrow"><span class="symicon '+(asset.kind==='etf'?'etf':'')+'">'+(asset.kind==='etf'?'ETF':l2safe(asset.id.slice(0,2)))+'</span>'+
 '<button type="button" class="assetname" onclick="l2open(\''+asset.id+'\')"><strong>'+l2safe(asset.name)+'</strong>'+
 '<small>'+asset.id+' · '+lt(asset.kind)+'</small></button>'+
 '<button type="button" class="star '+(saved?'on':'')+'" onclick="l2watch(\''+asset.id+'\')" aria-pressed="'+saved+'" aria-label="'+lt(saved?'saved':'unsave')+'">'+(saved?'★':'☆')+'</button></div>';
}
function l2resultRows(){
 const matches=l2matching();
 const rows=matches.length?matches.map(l2tickerRow).join(''):'<div class="empty">'+lt('noMatch')+'</div>';
 return rows+(L2.search.trim()?'<button type="button" class="linkbtn" onclick="l2openWide()">'+lt('searchMore')+' ↗</button>':'')+
 (L2.searchStatus==='offline'?'<div class="safehint">'+lt('searchUnavailable')+'</div>':'');
}
function l2openWide(){if(L2.search.trim())window.open('https://finance.yahoo.com/lookup/?s='+encodeURIComponent(L2.search.trim()),'_blank','noopener,noreferrer')}
function l2searchBlock(){
 return '<label class="searchbox"><span aria-hidden="true">⌕</span>'+
 '<input type="search" id="l2search" value="'+l2safe(L2.search)+'" placeholder="'+lt('search')+'" aria-label="'+lt('search')+'" oninput="l2searchInput(this.value)" /></label>';
}
function l2lessons(){
 return '<div class="sectionline"><strong>'+lt('what')+'</strong><small>'+lw('minutes')+'</small></div>'+
 learnLessons.map(x=>'<button class="lessonrow" onclick="learnOpenLesson(\''+x[0]+'\')"><span class="emblem">'+x[1]+'</span>'+
 '<span class="words"><strong>'+l2safe(x[2][currentLang]||x[2].en)+'</strong><small>'+l2safe(x[3][currentLang]||x[3].en)+'</small></span>'+
 '<span class="muted">'+(learnReads.includes(x[0])?'✓':'›')+'</span></button>').join('');
}
function l2browse(){
 return '<div class="sectionline"><strong>'+lt('learn')+'</strong></div>'+
 '<div class="chips">'+['AAPL','NVDA','SCHD'].map(x=>'<button type="button" onclick="l2quick(\''+x+'\')">'+x+'</button>').join('')+'</div>'+
 '<div class="sectionline"><strong>'+lt('results')+'</strong><small>'+lt('quote')+'</small></div>'+
 '<div id="l2results">'+l2resultRows()+'</div>'+
 l2lessons()+
 '<div class="safehint">'+lt('hint')+'</div>';
}
function l2quick(q){L2.search=q;l2draw();l2searchMarket(q)}
function l2watchlist(){
 if(!learnSaved.length)return '<div class="empty">'+lt('noWatch')+'</div><div class="safehint">'+lt('cached')+'</div>';
 const blocks=learnSaved.map(symbol=>{
  const a=l2asset(symbol),q=l2quote(symbol),move=q?.changePercent;
  const cls=Number.isFinite(move)?(move>=0?'up':'down'):'';
  return '<button class="watchbox '+cls+'" onclick="l2open(\''+symbol+'\')" aria-label="'+l2safe(a.name)+'">'+
   '<span class="ticker">'+l2safe(symbol)+'</span><small>'+l2safe(a.name)+'</small>'+
   '<span class="price">'+l2money(q?.price)+'</span>'+
   '<span class="move">'+(Number.isFinite(move)?l2pct(move):lt('loading'))+'</span></button>';
 }).join('');
 return '<div class="sectionline"><strong>'+lt('watch')+'</strong><small>'+learnSaved.length+'</small></div>'+
 '<div class="watchgrid">'+blocks+'</div>'+
 '<button class="linkbtn" onclick="l2loadQuotes(learnSaved,true)">'+lt('refresh')+' ↻</button>'+
 '<div class="safehint">'+lt('cached')+'</div>';
}
function l2periodChart(){
 const symbol=L2.selected,key=l2key(symbol,L2.period);
 const rec=L2.marketCache.get(key);
 const waiting=L2.waiting.has(key);
 if(rec?.bars?.length>=2){
  const delta=rec.bars.at(-1).close-rec.bars[0].close;
  return l2graph(rec.bars,L2.period,delta>=0?'#20bc70':'#d85159');
 }
 if(waiting)return '<div class="pending">'+lt('loading')+'</div>';
 return '<div class="empty">'+(L2.error[key]?lt('error'):lt('noHistory'))+'</div>';
}
const l2Overview={"en":{"AAPL":"Apple makes iPhones, Macs, software and services. Sales depend on consumer demand, product cycles and its global ecosystem.","NVDA":"NVIDIA designs graphics processors and computing systems used in AI, gaming and data centers. Demand and valuations can be volatile.","MSFT":"Microsoft provides business software, cloud computing and consumer technology.","SPYM":"This ETF tracks the S&P 500, giving exposure to approximately 500 large U.S. companies.","VXUS":"This ETF invests in thousands of companies outside the United States across developed and emerging markets.","SGOV":"This fund holds very short-term U.S. Treasury bills, which typically fluctuate less than stocks.","SCHD":"This ETF follows a dividend-focused index of established U.S. companies.","QQQ":"This ETF tracks the Nasdaq-100, with significant exposure to large technology-oriented companies.","VOO":"This ETF tracks the S&P 500 index of large U.S. companies.","VTI":"This ETF spans large, medium and small U.S. public companies.","BND":"This ETF holds diversified U.S. investment-grade bonds, which may fall when interest rates rise.","SCHZ":"This ETF holds a broad portfolio of investment-grade U.S. bonds."},"es":{"AAPL":"Apple fabrica iPhone, Mac, software y servicios. Depende de la demanda de consumidores y del ciclo de productos.","NVDA":"NVIDIA diseña procesadores y sistemas para inteligencia artificial, videojuegos y centros de datos.","SPYM":"Este ETF sigue el S&P 500, con exposición a unas 500 grandes empresas estadounidenses.","VXUS":"Este ETF invierte en miles de empresas fuera de Estados Unidos.","SGOV":"Este fondo contiene letras del Tesoro estadounidense a muy corto plazo.","SCHD":"Este ETF sigue un índice de empresas estadounidenses centrado en dividendos."},"it":{"AAPL":"Apple produce iPhone, Mac, software e servizi. Dipende dalla domanda e dai cicli di prodotto.","NVDA":"NVIDIA progetta processori e sistemi per intelligenza artificiale, gaming e centri dati.","SPYM":"Questo ETF replica l'S&P 500, con circa 500 grandi società statunitensi.","VXUS":"Questo ETF investe in migliaia di società fuori dagli Stati Uniti.","SGOV":"Questo fondo detiene titoli del Tesoro USA a brevissimo termine.","SCHD":"Questo ETF segue un indice di società USA con dividendi."},"fr":{"AAPL":"Apple conçoit des iPhone, Mac, logiciels et services. Son activité dépend de la demande et des cycles produits.","NVDA":"NVIDIA conçoit des processeurs et systèmes pour l’IA, les jeux et les centres de données.","SPYM":"Cet ETF suit le S&P 500, soit environ 500 grandes sociétés américaines.","VXUS":"Cet ETF investit dans des milliers de sociétés hors des États-Unis.","SGOV":"Ce fonds détient des bons du Trésor américain à très court terme.","SCHD":"Cet ETF suit un indice américain axé sur les dividendes."}};
function l2assetDetail(){
 const symbol=L2.selected,a=l2asset(symbol),quote=l2quote(symbol),rec=L2.marketCache.get(l2key(symbol,L2.period));
 const change=L2.period==='1D'?(quote?.changePercent??null):
   (rec?.bars?.length>=2?(rec.bars.at(-1).close/rec.bars[0].close-1)*100:null);
 const color=Number.isFinite(change)?(change>=0?'up':'down'):'neutral';
 const pos=l2positions().find(x=>x.symbol===symbol);
 const stats=[
 [lt('previous'),l2money(quote?.previousClose)],
 [lt('open'),l2money(quote?.open)],
 [lt('range'),quote?.low!=null&&quote?.high!=null?l2money(quote.low)+'–'+l2money(quote.high):'—'],
 [lt('volume'),l2displayNum(quote?.volume,0)],
 [lt('week52'),quote?.week52Low!=null&&quote?.week52High!=null?l2money(quote.week52Low)+'–'+l2money(quote.week52High):'—'],
 [lt('source'),rec?.source||'Twelve Data']
 ];
 const details=stats.map(([title,val])=>'<div class="stat"><small>'+l2safe(title)+'</small><strong style="font-size:12px">'+l2safe(val)+'</strong></div>').join('');
 return '<button class="back" onclick="l2back()">‹ '+lt('browse')+'</button>'+
 '<div class="detail-head"><span class="symicon '+(a.kind==='etf'?'etf':'')+'">'+(a.kind==='etf'?'ETF':l2safe(symbol.slice(0,2)))+'</span>'+
 '<div style="min-width:0"><h2>'+l2safe(a.name)+'</h2><small>'+l2safe(symbol)+' · '+lt(a.kind)+'</small></div></div>'+
 '<div class="quotevalue">'+l2money(quote?.price)+'</div>'+
 '<div class="quotedelta '+color+'">'+(Number.isFinite(change)?l2pct(change)+' · '+L2.period:lt('loading'))+'</div>'+
 l2periods(L2.period,'l2range')+
 l2periodChart()+
 '<div class="sectionline"><strong>'+lt('about')+'</strong></div>'+
 '<p class="hint">'+l2safe(l2Overview[currentLang]?.[symbol]||l2Overview.en[symbol]||lt('summary'))+'</p>'+
 '<button class="linkbtn" onclick="window.open(\'https://finance.yahoo.com/quote/'+encodeURIComponent(symbol)+'/\',\'_blank\',\'noopener,noreferrer\')">'+lt('further')+' ↗</button>'+ 
 '<div class="sectionline"><strong>'+lt('basic')+'</strong><small>'+lt('data')+' '+(quote?.asOf?new Date(quote.asOf).toLocaleDateString(l2loc(),{timeZone:'America/New_York',month:'short',day:'numeric',year:'numeric'}):'—')+'</small></div>'+
 '<div class="twocol">'+details+'</div>'+
 (pos?'<div class="safehint">'+lt('shares')+': '+l2displayNum(pos.qty,6)+' · '+lt('cost')+': '+l2money(pos.cost)+'</div>':'')+
 '<div class="detail-actions">'+
 '<button onclick="l2watch(\''+symbol+'\')">'+(learnSaved.includes(symbol)?'★ '+lt('saved'):'☆ '+lt('unsave'))+'</button>'+
 '<button class="primary" onclick="l2openTrade(\'buy\')" '+(!l2fresh(quote)?'disabled':'')+'>'+lt('buy')+'</button>'+
 (pos?'<button onclick="l2openTrade(\'sell\')" '+(!l2fresh(quote)?'disabled':'')+'>'+lt('sell')+'</button>':'')+'</div>'+
 '<div class="safehint">'+(l2fresh(quote)?lt('free'):lt('error'))+' '+lt('footer')+'</div>';
}
function l2tradeTimeNY(iso){
 const pieces=new Intl.DateTimeFormat('en-US',{
  timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',
  hour:'2-digit',minute:'2-digit',hourCycle:'h23'
 }).formatToParts(new Date(iso));
 const get=k=>pieces.find(x=>x.type===k)?.value||'00';
 return get('year')+'-'+get('month')+'-'+get('day')+'T'+get('hour')+':'+get('minute');
}
// A practice account begins with $500 of cash. Before its first purchase it
// therefore has a real, constant value, even though no shares are held yet.
// Transactions add observations at their actual simulated fill prices, so a
// purchase made after the market closes can still appear on the chart.
function l2paperTradeOnly(){
 const trades=[...L2.paper.trades].sort((a,b)=>a.time.localeCompare(b.time));
 if(!trades.length)return [];
 let cash=500,held={},prices={};
 const firstTime=l2tradeTimeNY(trades[0].time);
 const baseline=new Date(trades[0].time).getTime()-60000;
 const baselineNY=l2tradeTimeNY(new Date(baseline).toISOString());
 const points=[{time:baselineNY,close:500}];
 for(const tr of trades){
  const time=l2tradeTimeNY(tr.time);
  if(!(tr.price>0)||!(tr.shares>0))continue;
  prices[tr.symbol]=tr.price;
  held[tr.symbol]=(held[tr.symbol]||0)+(tr.side==='buy'?tr.shares:-tr.shares);
  cash+=tr.side==='buy'?-tr.amount:tr.amount;
  if(Object.entries(held).some(([ticker,qty])=>qty>1e-7&&!(prices[ticker]>0)))continue;
  const value=cash+Object.entries(held).reduce((sum,[ticker,qty])=>sum+Math.max(0,qty)*(prices[ticker]||0),0);
  if(Number.isFinite(value))points.push({time,close:value});
 }
 // A trade-only chart shows valuation at transaction times; it is never
 // represented as a live intraday market-performance series.
 return points;
}
function l2paperHistory(){
 const trades=[...L2.paper.trades].sort((a,b)=>a.time.localeCompare(b.time));
 if(!trades.length)return [];
 const symbols=[...new Set(trades.map(t=>t.symbol))];
 const series={};
 for(const symbol of symbols){
  const rec=L2.marketCache.get(l2key(symbol,L2.paperRange));
  if(!rec?.bars?.length)return l2paperTradeOnly();
  series[symbol]=rec.bars;
 }
 const quoteUpdates=new Map();
 for(const symbol of symbols){
  for(const bar of series[symbol]){
   if(!quoteUpdates.has(bar.time))quoteUpdates.set(bar.time,{});
   quoteUpdates.get(bar.time)[symbol]=bar.close;
  }
 }
 const marketTimes=[...quoteUpdates.keys()].sort();
 if(!marketTimes.length)return l2paperTradeOnly();
 const firstFill=l2tradeTimeNY(trades[0].time);
 let selectedMarketTimes=marketTimes;
 // YTD/1Y/All begin when the paper account is first used, not years before.
 // Keep one observation preceding the first purchase as its $500 baseline.
 if(['YTD','1Y','All'].includes(L2.paperRange)){
  const previous=marketTimes.filter(t=>t<firstFill).at(-1);
  selectedMarketTimes=marketTimes.filter(t=>t>=firstFill);
  if(previous)selectedMarketTimes.unshift(previous);
 }
 const firstTime=selectedMarketTimes[0]||firstFill;
 const tradeTimes=trades.map(t=>l2tradeTimeNY(t.time)).filter(t=>t>=firstTime);
 const times=[...new Set([...selectedMarketTimes,...tradeTimes])].sort();
 const cursors=Object.fromEntries(symbols.map(s=>[s,0]));
 const sortedTrades=trades.map(t=>({...t,localTime:l2tradeTimeNY(t.time)}))
  .sort((a,b)=>a.localTime.localeCompare(b.localTime));
 let cash=500,index=0,shares={},prices={};
 const points=[];
 for(const time of times){
  // Advance each ETF/stock to the most recent actual market observation.
  for(const symbol of symbols){
   const bars=series[symbol];
   while(cursors[symbol]<bars.length&&bars[cursors[symbol]].time<=time){
    prices[symbol]=bars[cursors[symbol]].close;
    cursors[symbol]++;
   }
  }
  while(index<sortedTrades.length&&sortedTrades[index].localTime<=time){
   const tr=sortedTrades[index++];
   shares[tr.symbol]=(shares[tr.symbol]||0)+(tr.side==='buy'?tr.shares:-tr.shares);
   cash+=tr.side==='buy'?-tr.amount:tr.amount;
   // The trade's recorded fill price is an observed quote, not a made-up
   // historical bar. This correctly values trades made after market close.
   prices[tr.symbol]=tr.price;
  }
  const held=symbols.filter(sym=>(shares[sym]||0)>1e-7);
  if(held.some(sym=>!(prices[sym]>0)))continue;
  const value=cash+held.reduce((sum,sym)=>sum+shares[sym]*prices[sym],0);
  if(Number.isFinite(value))points.push({time,close:value});
 }
 return points.length>=2?points:l2paperTradeOnly();
}
function l2practice(){
 const positions=l2positions();
 const quoteMissing=positions.some(p=>!l2quote(p.symbol));
 const total=quoteMissing?null:L2.paper.cash+positions.reduce((sum,p)=>sum+p.qty*l2quote(p.symbol).price,0);
 const pnl=total===null?null:(Math.abs(total-500)<0.005?0:total-500);
 const holdings=positions.map(p=>{
  const q=l2quote(p.symbol),value=q?.price>0?p.qty*q.price:null;
  const profit=value===null?null:(Math.abs(value-p.cost)<0.005?0:value-p.cost);
  return '<div class="holding"><span class="symicon '+(l2asset(p.symbol).kind==='etf'?'etf':'')+'">'+l2safe(p.symbol.slice(0,2))+'</span>'+
   '<button onclick="l2open(\''+p.symbol+'\')"><strong>'+l2safe(p.symbol)+'</strong><small>'+l2displayNum(p.qty,6)+' '+lt('shares')+'</small></button>'+
   '<div class="right"><strong>'+l2money(value)+'</strong><small class="'+(profit===null?'neutral':profit>=0?'up':'down')+'">'+l2money(profit)+'</small></div></div>';
 }).join('');
 const chart=l2paperHistory();
 const milestone=[...new Set(L2.paper.trades.filter(t=>t.side==='buy').map(t=>t.symbol))].length>=3;
 const recent=[...L2.paper.trades].reverse().slice(0,5).map(t=>
  '<div class="record"><span>'+lt(t.side==='buy'?'buy':'sell')+' '+l2safe(t.symbol)+' · '+l2displayNum(t.shares,6)+'</span>'+
  '<strong>'+l2money(t.amount)+'</strong></div>').join('');
 return '<div class="practice-top"><small class="eyebrow">'+lt('portfolio')+'</small>'+
 '<div class="balance">'+l2money(total)+'</div>'+
 '<div class="meta"><span>'+lt('cash')+': '+l2money(L2.paper.cash)+'</span>'+
 '<span class="'+(pnl===null?'neutral':pnl>=0?'up':'down')+'">'+(pnl===null?'—':l2money(pnl))+'</span></div></div>'+
 '<div class="sectionline"><strong>'+lt('past')+'</strong><small>'+lt('footer')+'</small></div>'+
 l2periods(L2.paperRange,'l2paperRange')+
 (chart.length>=2?l2graph(chart,L2.paperRange,pnl===null||pnl>=0?'#21c26e':'#d85159'):
 '<div class="empty">'+(positions.length?lt('noHistory'):lt('noHold'))+'</div>')+
 (positions.length&&chart.length>=2&&l2paperTradeOnly().length>=2&&positions.some(p=>!L2.marketCache.get(l2key(p.symbol,L2.paperRange))?.bars?.length)?'<p class="muted">'+lt('noHistory')+' · '+lt('transactions')+'</p>':'')+
 '<div class="sectionline"><strong>'+lt('holdings')+'</strong><small>'+positions.length+'</small></div>'+
 (positions.length?holdings:'<div class="empty">'+lt('noHold')+'</div>')+
 '<div class="sectionline"><strong>'+lt('transactions')+'</strong></div>'+
 (recent||'<div class="empty">'+lt('noTrades')+'</div>')+
 (milestone?'<div class="banner"><strong>'+lt('ready')+'</strong><p>'+lt('milestone')+'</p><button onclick="l2preview()">'+lt('ready')+' ↗</button></div>':'')+
 '<div class="safehint">'+lt('note')+'</div>'+
 '<button class="linkbtn" onclick="L2.modal=\'reset\';l2draw()">'+lt('reset')+'</button>';
}
function l2tradingModal(){
 if(!L2.modal)return '';
 const symbol=L2.selected,quote=l2quote(symbol),position=l2positions().find(x=>x.symbol===symbol);
 let content='';
 if(L2.modal==='trade'){
  const side=L2.tradeMode,price=quote?.price;
  const available=side==='buy'?L2.paper.cash:(position?.qty||0)*(price||0);
  content='<h3>'+lt(side==='buy'?'buy':'sell')+' · '+l2safe(symbol)+'</h3>'+
  '<p>'+lt('price')+': '+l2money(price)+' · '+lt('cash')+': '+l2money(available)+'</p>'+
  '<div class="amounts">'+[10,25,50].map(n=>'<button class="'+(L2.tradeAmount===n?'active':'')+'" onclick="L2.tradeAmount='+n+';l2draw()">$'+n+'</button>').join('')+'</div>'+
  '<input type="number" min="1" step="0.01" class="custom" value="'+L2.tradeAmount+'" aria-label="'+lt('amount')+'" oninput="L2.tradeAmount=Number(this.value)" />'+
  '<p>'+lt('note')+'</p>'+
  (L2.error.trade?'<div class="err">'+l2safe(L2.error.trade)+'</div>':'')+
  '<button class="confirm" onclick="l2submitTrade()">'+lt('record')+'</button>';
 }else if(L2.modal==='success'){
  content='<h3>'+lt('done')+'</h3><p>'+lt('note')+'</p><button class="confirm" onclick="l2closeModal();l2tab(\'practice\')">'+lt('practice')+'</button>';
 }else if(L2.modal==='reset'){
  content='<h3>'+lt('resetQuestion')+'</h3><p>'+lt('resetBody')+'</p><button class="confirm" onclick="l2reset()">'+lt('reset')+'</button><button class="secondary" onclick="l2closeModal()">'+lt('cancel')+'</button>';
 }else if(L2.modal==='upgrade'){
  content='<h3>'+lt('ready')+'</h3><p>'+lt('preview')+'</p><p>'+lt('milestone')+'</p>'+
   '<div class="safehint">'+lt('footer')+'</div><button class="confirm" onclick="l2closeModal()">'+lt('done')+'</button>';
 }
 return '<div class="modal-bg" id="l2modal" onclick="if(event.target===this)l2closeModal()"><div class="modal-panel" role="dialog" aria-modal="true">'+
 '<button class="close" onclick="l2closeModal()" aria-label="'+lt('cancel')+'">×</button>'+content+'</div></div>';
}
function l2renderPage(){
 const tabs=[['explore','browse'],['saved','watch'],['practice','practice']];
 const controls='<div class="navtabs">'+tabs.map(([id,key])=>'<button class="'+(L2.tab===id?'active':'')+'" aria-pressed="'+(L2.tab===id)+'" onclick="l2tab(\''+id+'\')">'+lt(key)+'</button>').join('')+'</div>';
 const isDetail=L2.view==='detail';
 const body=isDetail?l2assetDetail():L2.tab==='explore'?l2browse():L2.tab==='saved'?l2watchlist():l2practice();
 return '<div class="learn2">'+(isDetail?'':'<span class="eyebrow">'+lt('start')+'</span><h2>'+lt('title')+'</h2><p class="hint">'+lt('intro')+'</p>'+l2searchBlock()+controls)+
 body+(L2.modal?l2tradingModal():'')+'</div>';
}
// Replace the legacy Learn renderer, preserving onboarding and navigation.
renderLearnPage=l2renderPage;
