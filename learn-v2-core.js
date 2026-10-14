
/* Simple Investing Learn v2. Educational paper trading only. No real orders. */
const L2={
 tab:'explore',view:'list',selected:null,period:'1M',search:'',remote:[],searchStatus:'',metadata:(()=>{try{return JSON.parse(localStorage.getItem('simple_learn_metadata_v2'))||{}}catch{return {}}})(),
 marketCache:new Map(),quoteCache:new Map(),waiting:new Set(),quotePending:new Set(),quoteFailures:{},quoteCooldownUntil:0,error:{},paperRange:'All',
 tradeMode:'buy',tradeAmount:25,modal:null,refreshing:false,searchTimer:null,
 paper:(()=>{try{const v=JSON.parse(localStorage.getItem('simple_learn_paper_v2'));return v&&Number.isFinite(v.cash)&&Array.isArray(v.trades)?v:{cash:500,trades:[]};}catch{return {cash:500,trades:[]}}})()
};
const L2D={
 en:{title:'Learn & Explore',basic:'Basic statistics',portfolio:'Paper portfolio',search:'Find a stock or ETF',browse:'Discover',watch:'Watchlist',practice:'Practice',learn:'Start with something familiar',intro:'A place to explore beyond your automatic portfolio.',results:'Explore investments',what:'Learn the basics',hint:'Your automatic $50 plan stays separate from practice.',cached:'Market quotes update when available.',view:'View details',refresh:'Refresh',cash:'Available cash',balance:'Paper account value',gain:'Total return',holdings:'Your holdings',value:'Holding value',shares:'shares',cost:'Cost basis',profit:'Gain / loss',buy:'Practice buy',sell:'Practice sell',record:'Confirm paper trade',price:'Market price',past:'Past performance',changes:'Price change',previous:'Previous close',open:'Open',range:'Day range',volume:'Volume',week52:'52-week range',about:'About this investment',basic:'Basic market statistics',data:'Quotes as of',missing:'Market data unavailable',loading:'Loading market data…',error:'Market feed upgrade required or data unavailable. No prices have been invented.',free:'Only supported assets with available quotes can be traded.',saved:'Saved',unsave:'Save',quote:'Live data when available',start:'Browse investments',ready:'Explore advanced investing',milestone:'You have tried several investments. You can preview the full experience whenever you want.',preview:'Full-platform tools are a concept only. No real brokerage connection.',whatElse:'Search more symbols',searchUnavailable:'Search currently shows the starter catalog. Expanded lookup requires the Worker upgrade.',noMatch:'No matching investments found.',noWatch:'Your watchlist is empty. Save an investment to follow it.',noHold:'No paper holdings yet. Open a company or ETF and make a practice purchase.',noHistory:'Historical quotes are not available for this period.',noTrades:'Transactions will appear after you practice buying or selling.',transactions:'Recent paper trades',done:'Done',cancel:'Cancel',notEnough:'Not enough simulated cash.',notOwned:'You do not own enough simulated shares.',invalid:'A current market quote is required for an order.',account:'Start with $500 of virtual cash',note:'Practice trades use available quotes and are stored only in this browser. They do not change your recurring investments.',stock:'Stock',etf:'ETF',searchMore:'Search the broader market',source:'Source',sector:'Category',footer:'Educational simulation, not real investing.',chart:'Price history',na:'Not available',all:'All',step:'Next step',feed:'Market feed unavailable',day:'Today'},
 es:{title:'Aprende y explora',basic:'Estadísticas básicas',portfolio:'Cartera de práctica',search:'Buscar acción o ETF',browse:'Descubrir',watch:'Seguimiento',practice:'Practicar',learn:'Empieza por algo conocido',intro:'Explora más allá de tu cartera automática.',results:'Explorar inversiones',what:'Aprende lo esencial',hint:'Tu plan automático de $50 sigue aparte.',cached:'Cotizaciones actualizadas cuando estén disponibles.',view:'Ver detalles',refresh:'Actualizar',cash:'Efectivo disponible',balance:'Valor de la cuenta de práctica',gain:'Rentabilidad total',holdings:'Tus inversiones',value:'Valor de la posición',shares:'acciones',cost:'Costo de compra',profit:'Ganancia / pérdida',buy:'Compra de práctica',sell:'Venta de práctica',record:'Confirmar operación simulada',price:'Precio de mercado',past:'Rendimiento pasado',changes:'Cambio de precio',previous:'Cierre anterior',open:'Apertura',range:'Rango diario',volume:'Volumen',week52:'Rango de 52 semanas',about:'Acerca de esta inversión',basic:'Estadísticas básicas',data:'Cotizaciones del',missing:'Sin datos de mercado',loading:'Cargando cotizaciones…',error:'Datos no disponibles o se requiere actualizar el servicio. No se muestran precios ficticios.',free:'Solo puedes practicar con activos que tengan precios disponibles.',saved:'Guardado',unsave:'Guardar',quote:'Datos actualizados si están disponibles',start:'Explorar inversiones',ready:'Explorar inversión avanzada',milestone:'Has probado varias inversiones. Explora la experiencia completa cuando quieras.',preview:'Las herramientas avanzadas son conceptuales. No hay conexión real.',whatElse:'Buscar otros símbolos',searchUnavailable:'Por ahora se muestra el catálogo inicial. La búsqueda ampliada requiere actualizar el servicio.',noMatch:'No hay inversiones coincidentes.',noWatch:'Tu lista está vacía. Guarda una inversión para seguirla.',noHold:'Aún no tienes inversiones de práctica. Abre una acción o ETF y realiza una compra simulada.',noHistory:'No hay precios históricos para este período.',noTrades:'Aquí aparecerán tus operaciones simuladas.',transactions:'Operaciones recientes',done:'Listo',cancel:'Cancelar',notEnough:'No tienes suficiente efectivo simulado.',notOwned:'No tienes suficientes acciones simuladas.',invalid:'Se necesita una cotización actual para operar.',account:'Comienza con $500 simulados',note:'Las operaciones usan cotizaciones disponibles y se guardan en este navegador. No cambian tu plan mensual.',stock:'Acción',etf:'ETF',searchMore:'Buscar en todo el mercado',source:'Fuente',sector:'Categoría',footer:'Simulación educativa, no inversión real.',chart:'Historial de precios',na:'No disponible',all:'Todo',step:'Siguiente paso',feed:'Sin datos de mercado',day:'Hoy'},
 it:{title:'Impara ed esplora',basic:'Statistiche principali',portfolio:'Portafoglio di prova',search:'Cerca azione o ETF',browse:'Scopri',watch:'Preferiti',practice:'Prova',learn:'Inizia da qualcosa che conosci',intro:'Esplora oltre il portafoglio automatico.',results:'Esplora investimenti',what:'Impara le basi',hint:'Il piano automatico da $50 resta separato.',cached:'Quotazioni aggiornate quando disponibili.',view:'Dettagli',refresh:'Aggiorna',cash:'Contanti disponibili',balance:'Valore del conto di prova',gain:'Rendimento totale',holdings:'I tuoi investimenti',value:'Valore della posizione',shares:'quote',cost:'Costo di acquisto',profit:'Utile / perdita',buy:'Acquisto simulato',sell:'Vendita simulata',record:'Conferma operazione fittizia',price:'Prezzo di mercato',past:'Rendimenti passati',changes:'Variazione di prezzo',previous:'Chiusura precedente',open:'Apertura',range:'Intervallo giornaliero',volume:'Volume',week52:'Intervallo 52 settimane',about:'Questo investimento',basic:'Statistiche di base',data:'Quotazioni al',missing:'Dati non disponibili',loading:'Caricamento dati…',error:'Dati non disponibili o servizio da aggiornare. Nessun prezzo inventato.',free:'Si possono simulare solo titoli con quotazioni disponibili.',saved:'Salvato',unsave:'Salva',quote:'Quotazioni aggiornate se disponibili',start:'Esplora investimenti',ready:'Scopri gli strumenti avanzati',milestone:'Hai provato vari investimenti. Puoi scoprire la versione completa.',preview:'Le funzionalità avanzate sono solo un concetto. Nessun conto reale collegato.',whatElse:'Cerca altri simboli',searchUnavailable:'Al momento viene mostrato il catalogo iniziale. La ricerca estesa richiede il nuovo servizio.',noMatch:'Nessuna corrispondenza.',noWatch:'La lista è vuota. Salva un investimento per seguirlo.',noHold:'Nessun investimento simulato. Apri un titolo e prova ad acquistarlo.',noHistory:'Prezzi storici non disponibili per questo periodo.',noTrades:'Le transazioni simulate appariranno qui.',transactions:'Operazioni recenti',done:'Fatto',cancel:'Annulla',notEnough:'Contanti simulati insufficienti.',notOwned:'Quote simulate insufficienti.',invalid:'Serve una quotazione aggiornata per operare.',account:'Inizia con $500 virtuali',note:'Le operazioni usano i prezzi disponibili e sono salvate solo nel browser. Non modificano il piano mensile.',stock:'Azione',etf:'ETF',searchMore:'Cerca nel mercato completo',source:'Fonte',sector:'Categoria',footer:'Simulazione educativa, non investimento reale.',chart:'Storico dei prezzi',na:'Non disponibile',all:'Tutto',step:'Prossimo passo',feed:'Dati indisponibili',day:'Oggi'},
 fr:{title:'Apprendre et explorer',basic:'Statistiques essentielles',portfolio:'Portefeuille fictif',search:'Rechercher une action ou un ETF',browse:'Explorer',watch:'Suivi',practice:'Essayer',learn:'Commencez par ce que vous connaissez',intro:'Explorez au-delà de votre portefeuille automatique.',results:'Explorer les placements',what:'Apprendre les bases',hint:'Votre plan automatique de 50 $ reste distinct.',cached:'Cours mis à jour quand disponibles.',view:'Voir les détails',refresh:'Actualiser',cash:'Espèces disponibles',balance:'Valeur du compte fictif',gain:'Rendement total',holdings:'Vos positions',value:'Valeur de la position',shares:'parts',cost:'Coût de revient',profit:'Gain / perte',buy:'Achat fictif',sell:'Vente fictive',record:'Confirmer la transaction fictive',price:'Cours de marché',past:'Performance passée',changes:'Variation du cours',previous:'Clôture précédente',open:'Ouverture',range:'Fourchette du jour',volume:'Volume',week52:'Fourchette 52 semaines',about:'À propos de ce placement',basic:'Statistiques essentielles',data:'Cours au',missing:'Données indisponibles',loading:'Chargement des cours…',error:'Flux indisponible ou mise à jour nécessaire. Aucun prix inventé.',free:'Seuls les titres avec des cours disponibles peuvent être simulés.',saved:'Enregistré',unsave:'Enregistrer',quote:'Données à jour si disponibles',start:'Explorer les placements',ready:'Découvrir les outils avancés',milestone:'Vous avez essayé plusieurs placements. Découvrez la version complète quand vous le souhaitez.',preview:'Les outils avancés sont conceptuels. Aucun compte réel lié.',whatElse:'Rechercher plus de titres',searchUnavailable:'Le catalogue initial est affiché. La recherche élargie exige une mise à jour du service.',noMatch:'Aucun placement correspondant.',noWatch:'Votre liste est vide. Enregistrez un placement pour le suivre.',noHold:'Aucune position fictive. Ouvrez une action ou un ETF et essayez un achat.',noHistory:'Aucun historique disponible pour cette période.',noTrades:'Vos transactions fictives apparaîtront ici.',transactions:'Transactions récentes',done:'Terminé',cancel:'Annuler',notEnough:'Espèces fictives insuffisantes.',notOwned:'Parts fictives insuffisantes.',invalid:'Un cours récent est nécessaire pour passer un ordre.',account:'Commencez avec 500 $ fictifs',note:'Les transactions utilisent les cours disponibles et sont enregistrées dans ce navigateur. Votre plan mensuel reste inchangé.',stock:'Action',etf:'ETF',searchMore:'Chercher dans tout le marché',source:'Source',sector:'Catégorie',footer:'Simulation éducative, pas un investissement réel.',chart:'Historique du cours',na:'Indisponible',all:'Tout',step:'Étape suivante',feed:'Flux indisponible',day:'Aujourd’hui'}
};
const L2EXTRA={"en":{"reset":"Reset practice account","resetQuestion":"Reset practice account?","resetBody":"Clear all virtual positions and return to $500 in practice cash.","amount":"Practice amount","further":"More on Yahoo Finance","summary":"Detailed company profiles require additional market-data coverage.","holdingsValue":"In holdings","quoteUnavailable":"Quote unavailable"},"es":{"reset":"Reiniciar cuenta de práctica","resetQuestion":"¿Reiniciar la cuenta?","resetBody":"Borra todas las posiciones simuladas y vuelve a $500 de efectivo.","amount":"Cantidad de práctica","further":"Más detalles en Yahoo Finance","summary":"Los perfiles completos requieren más datos de mercado.","holdingsValue":"En inversiones","quoteUnavailable":"Cotización no disponible"},"it":{"reset":"Reimposta il conto di prova","resetQuestion":"Reimpostare il conto?","resetBody":"Cancella tutte le posizioni e ripristina $500 virtuali.","amount":"Importo di prova","further":"Altre informazioni su Yahoo Finance","summary":"I profili completi richiedono altri dati di mercato.","holdingsValue":"Investito","quoteUnavailable":"Quotazione non disponibile"},"fr":{"reset":"Réinitialiser le compte fictif","resetQuestion":"Réinitialiser le compte ?","resetBody":"Efface les positions fictives et rétablit 500 $ virtuels.","amount":"Montant fictif","further":"En savoir plus sur Yahoo Finance","summary":"Les profils détaillés nécessitent des données supplémentaires.","holdingsValue":"En placements","quoteUnavailable":"Cours indisponible"}};
const lt=k=>L2EXTRA[currentLang]?.[k]||L2D[currentLang]?.[k]||L2EXTRA.en[k]||L2D.en[k]||k;
const L2RANGES=['1D','1W','1M','3M','YTD','1Y','All'];
const l2safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const l2money=x=>Number.isFinite(x)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(x):'—';
const l2num=x=>Number.isFinite(Number(x))?Number(x):null;
const l2pct=x=>Number.isFinite(x)?(x>=0?'+':'')+x.toFixed(2)+'%':'—';
const l2origin='https://simple-investing-market-data.victoriaborja09.workers.dev';
const l2loc=()=>({en:'en-US',es:'es-ES',it:'it-IT',fr:'fr-FR'})[currentLang]||'en-US';
const l2now=()=>Date.now();
const l2isLearn=()=>typeof homeTab!=='undefined'&&homeTab==='learn'&&screens[screenIndex]==='home';
function l2draw(){if(l2isLearn())renderScreen();}
function l2persist(){try{localStorage.setItem('simple_learn_paper_v2',JSON.stringify(L2.paper));}catch{}}
function l2key(symbol,range){return symbol+'|'+range}
function l2asset(symbol){return learnAssets.find(a=>a.id===symbol)||L2.remote.find(a=>a.id===symbol)||L2.metadata[symbol]||L2.paper.trades.find(t=>t.symbol===symbol)?.asset||{id:symbol,name:symbol,kind:'stock',sector:''}}
function l2positions(){
 const out={};
 for(const t of L2.paper.trades){
   if(!out[t.symbol])out[t.symbol]={symbol:t.symbol,qty:0,cost:0};
   const p=out[t.symbol];
   if(t.side==='buy'){p.qty+=t.shares;p.cost+=t.amount;}
   else if(t.side==='sell'&&p.qty>0){const fraction=Math.min(1,t.shares/p.qty);p.cost*=(1-fraction);p.qty-=t.shares;}
   if(p.qty<1e-8){p.qty=0;p.cost=0}
 }
 return Object.values(out).filter(p=>p.qty>1e-7);
}
function l2quote(symbol){
 const o=L2.quoteCache.get(symbol);
 return o?.quote||null;
}
function l2fresh(quote){
 if(!quote||!(quote.price>0)||!quote.asOf)return false;
 const d=new Date(quote.asOf);
 return Number.isFinite(d.getTime())&&Date.now()-d.getTime()<=7*86400000&&d.getTime()<=Date.now()+3600000;
}
function l2normalizeQuote(q){
 if(!q)return null;
 const price=l2num(q.price);
 if(!(price>0))return null;
 return {price,previousClose:l2num(q.previousClose),change:l2num(q.change),
  changePercent:l2num(q.changePercent),open:l2num(q.open),high:l2num(q.high),low:l2num(q.low),
  volume:l2num(q.volume),week52Low:l2num(q.week52Low),week52High:l2num(q.week52High),
  asOf:q.asOf||null,currency:q.currency||'USD'};
}
function l2loadAsset(symbol,range,force=false){
 if(!/^[A-Z0-9.]{1,12}$/.test(symbol))return;
 const key=l2key(symbol,range),existing=L2.marketCache.get(key);
 if(!force&&existing&&l2now()-existing.stored<600000)return;
 if(L2.waiting.has(key))return;
 L2.waiting.add(key);L2.error[key]='';l2draw();
 const url=l2origin+'/asset?symbol='+encodeURIComponent(symbol)+'&range='+encodeURIComponent(range);
 fetch(url,{cache:'no-store'}).then(async r=>{
   const json=await r.json().catch(()=>({}));
   if(!r.ok||!json.quote||!Array.isArray(json.bars))throw Error(json.error||'Market prices unavailable');
   const quote=l2normalizeQuote(json.quote);
   if(!quote)throw Error('Invalid market price');
   const bars=json.bars.map(b=>({time:String(b.time||''),close:l2num(b.close)}))
    .filter(b=>b.time&&b.close>0).sort((a,b)=>a.time.localeCompare(b.time));
   L2.quoteCache.set(symbol,{quote,stored:l2now()});
   L2.marketCache.set(key,{bars,quote,stored:l2now(),symbol,range,source:json.source||'Twelve Data'});
   delete L2.error[key];
 }).catch(e=>{L2.error[key]=e.message||'Unavailable';}).finally(()=>{L2.waiting.delete(key);l2draw()});
}
function l2loadQuotes(symbols,force=false){
 const unique=[...new Set(symbols.map(s=>s.toUpperCase()))].filter(s=>/^[A-Z0-9.]{1,12}$/.test(s));
 const todo=unique.filter(s=>force||!L2.quoteCache.has(s)||l2now()-L2.quoteCache.get(s).stored>600000);
 if(!todo.length||L2.refreshing||(!force&&l2now()<L2.quoteCooldownUntil))return;
 L2.refreshing=true;
 todo.forEach(s=>{L2.quotePending.add(s);delete L2.quoteFailures[s];});
 l2draw();
 (async()=>{
   // Small batches keep the free-tier provider from receiving a burst of requests.
   for(let i=0;i<todo.length;i+=4){
     const slice=todo.slice(i,i+4);
     try{
       const r=await fetch(l2origin+'/quotes?symbols='+encodeURIComponent(slice.join(',')),{cache:'no-store'});
       const json=await r.json().catch(()=>({}));
       if(!r.ok||!json.quotes)throw Error('Quote service unavailable');
       const received=new Set();
       for(const [symbol,raw] of Object.entries(json.quotes)){
         if(!slice.includes(symbol))continue;
         const q=l2normalizeQuote(raw);
         if(q){L2.quoteCache.set(symbol,{quote:q,stored:l2now()});received.add(symbol);delete L2.quoteFailures[symbol];}
       }
       const missing=slice.filter(s=>!received.has(s));
       for(const symbol of missing)L2.quoteFailures[symbol]='Quote unavailable';
       if(missing.length&&json.retryAfterSeconds){
         L2.quoteCooldownUntil=Math.max(L2.quoteCooldownUntil,l2now()+Number(json.retryAfterSeconds)*1000);
       }
     }catch(e){
       for(const symbol of slice)L2.quoteFailures[symbol]=e.message||'Quote unavailable';
       L2.error.quotes='Market quote service unavailable';
     }finally{
       for(const symbol of slice)L2.quotePending.delete(symbol);
       l2draw();
     }
   }
 })().finally(()=>{L2.refreshing=false;l2draw();});
}
function l2searchMarket(q){
 if(q.length<2){L2.remote=[];L2.searchStatus='';return}
 const token=q.toLowerCase();
 L2.searchStatus='loading';
 fetch(l2origin+'/search?query='+encodeURIComponent(q)).then(async r=>{
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!Array.isArray(j.results))throw Error('unavailable');
  if(L2.search.toLowerCase()!==token)return;
  L2.remote=j.results.filter(x=>/^[A-Z0-9.]{1,12}$/.test(x.symbol||'')).map(x=>({
   id:x.symbol,name:x.name||x.symbol,kind:x.type==='etf'?'etf':'stock',sector:''
  })).slice(0,12);
  for(const asset of L2.remote)L2.metadata[asset.id]=asset;
  try{localStorage.setItem('simple_learn_metadata_v2',JSON.stringify(L2.metadata))}catch{}
  L2.searchStatus='ok';
 }).catch(()=>{if(L2.search.toLowerCase()===token)L2.searchStatus='offline';})
 .finally(()=>{if(L2.search.toLowerCase()===token)l2draw()});
}
function l2searchInput(value){
 L2.search=value.slice(0,55);
 const el=document.getElementById('l2results');
 if(el)el.innerHTML=l2resultRows();
 clearTimeout(L2.searchTimer);
 if(L2.search.trim().length>=2)L2.searchTimer=setTimeout(()=>l2searchMarket(L2.search.trim()),480);
}
function l2matching(){
 const q=L2.search.trim().toLowerCase();
 const fromLocal=learnAssets.filter(a=>!q||(a.id+' '+a.name).toLowerCase().includes(q));
 const remote=q?L2.remote.filter(a=>(a.id+' '+a.name).toLowerCase().includes(q)):[];
 return [...new Map([...fromLocal,...remote].map(a=>[a.id,a])).values()].slice(0,q?15:5);
}
function l2open(symbol){
 if(!/^[A-Z0-9.]{1,12}$/.test(symbol))return;
 L2.selected=symbol;L2.view='detail';L2.period='1M';
 l2draw();l2loadAsset(symbol,'1M');
}
function l2back(){L2.view='list';L2.selected=null;l2draw();}
function l2tab(tab){
 L2.tab=tab;L2.view='list';L2.selected=null;l2draw();
 if(tab==='saved')l2loadQuotes(learnSaved);
 if(tab==='practice'){l2loadQuotes(l2positions().map(x=>x.symbol));l2loadPaperSeries();}
}
function l2range(period){if(!L2RANGES.includes(period))return;L2.period=period;l2draw();l2loadAsset(L2.selected,period)}
function l2paperRange(period){if(!L2RANGES.includes(period))return;L2.paperRange=period;l2draw();l2loadPaperSeries()}
function l2loadPaperSeries(){
 const symbols=[...new Set(L2.paper.trades.map(t=>t.symbol))].slice(0,6);
 if(!symbols.length)return;
 const p=L2.paperRange;
 // Run sequentially to respect Twelve Data's free plan.
 symbols.forEach((symbol,i)=>setTimeout(()=>l2loadAsset(symbol,p),i*1900));
}
function l2watch(symbol){
 if(!learnAssets.some(x=>x.id===symbol)&&!L2.remote.some(x=>x.id===symbol))L2.remote.push(l2asset(symbol));
 learnSaved=learnSaved.includes(symbol)?learnSaved.filter(s=>s!==symbol):[...learnSaved,symbol];
 storeL('saved',learnSaved);
 l2draw();
 if(learnSaved.includes(symbol))l2loadQuotes([symbol]);
}
function l2moneyToShares(amount,price){return Math.floor(amount/price*1e6)/1e6;}
function l2trade(side,symbol,amount){
 const quote=l2quote(symbol),price=quote?.price;
 if(!l2fresh(quote))return {error:lt('invalid')};
 if(!(amount>0)||!Number.isFinite(amount))return {error:lt('invalid')};
 amount=Math.round(amount*100)/100;
 const pos=l2positions().find(x=>x.symbol===symbol);
 if(side==='buy'&&amount>L2.paper.cash+0.001)return {error:lt('notEnough')};
 if(side==='sell'&&(!pos||amount>pos.qty*price+.001))return {error:lt('notOwned')};
 const shares=l2moneyToShares(amount,price);
 if(!(shares>0))return {error:lt('invalid')};
 const value=Math.round(shares*price*100)/100;
 if(side==='buy'){L2.paper.cash=Math.max(0,L2.paper.cash-value);}
 else{L2.paper.cash+=value;}
 L2.paper.cash=Math.round(L2.paper.cash*100)/100;
 L2.paper.trades.push({symbol,side,shares,price,amount:value,time:new Date().toISOString(),asset:l2asset(symbol)});
 l2persist();
 l2draw();l2loadPaperSeries();
 return {success:true,value,shares};
}
function l2openTrade(side){
 if(!L2.selected)return;
 L2.tradeMode=side;L2.tradeAmount=25;L2.modal='trade';l2draw();
}
function l2closeModal(){L2.modal=null;l2draw();}
function l2submitTrade(){
 const result=l2trade(L2.tradeMode,L2.selected,L2.tradeAmount);
 if(result.error){L2.error.trade=result.error;l2draw();return}
 delete L2.error.trade;L2.modal='success';l2draw();
}
function l2reset(){L2.paper={cash:500,trades:[]};l2persist();L2.modal=null;l2draw()}
function l2preview(){L2.modal=null;openHomeTab('you')}
function l2displayNum(n,dp=2){
 return Number.isFinite(n)?new Intl.NumberFormat(l2loc(),{maximumFractionDigits:dp}).format(n):'—';
}

// Refresh only while Learn is visible, conserving free API credits.
setInterval(()=>{if(document.hidden||!l2isLearn())return;
 if(L2.view==='detail'&&L2.selected)l2loadAsset(L2.selected,L2.period,true);
 else if(L2.tab==='saved')l2loadQuotes(learnSaved,true);
 else if(L2.tab==='practice')l2loadQuotes(l2positions().map(x=>x.symbol),true);
},600000);
