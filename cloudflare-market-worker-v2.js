/**
 * Cloudflare Worker for the Simple Investing prototype.
 * Requires the secret TWELVE_DATA_API_KEY, plus ALLOWED_ORIGIN set to
 * the origin of your static HTML app (for example https://example.github.io).
 *
 * The frontend expects a read-only endpoint returning dividend-adjusted
 * total-return indexes for SPYM, VXUS and SGOV, starting before May 2026.
 *
 * This Worker is an implementation template, NOT currently deployed.
 * Validate the financial data provider's market-data display license before
 * making the endpoint available to public site visitors.
 */

/* Additional free-tier-aware routes for Learn:
   GET /search?query=apple
   GET /quotes?symbols=AAPL,MSFT
   GET /asset?symbol=AAPL&range=1M
   This does not enable public-market-data display rights. Obtain permission
   from the provider before publicly displaying their prices.
*/
const LEARN_WINDOWS={
 '1D':{interval:'15min',outputsize:50,ttl:300},
 '1W':{interval:'1h',outputsize:80,ttl:420},
 '1M':{interval:'1day',outputsize:35,ttl:900},
 '3M':{interval:'1day',outputsize:90,ttl:900},
 'YTD':{interval:'1day',outputsize:310,ttl:900},
 '1Y':{interval:'1day',outputsize:290,ttl:900},
 'All':{interval:'1day',outputsize:4000,ttl:1800}
};
const validSymbol=value=>typeof value==='string'&&/^[A-Za-z0-9.]{1,12}$/.test(value);
async function learnProvider(env,route,params={}){
 const q=new URLSearchParams({...params,apikey:env.TWELVE_DATA_API_KEY});
 const response=await fetch(API_ROOT+'/'+route+'?'+q.toString());
 if(!response.ok)throw Error('Data provider HTTP '+response.status);
 const data=await response.json();
 if(data?.status==='error'||data?.code)throw Error(data?.message||'Market data not provided');
 return data;
}
function learnQuote(raw){
 if(!raw||raw.status==='error')return null;
 const price=Number(raw.close||raw.price);
 if(!(price>0))return null;
 let asOf=null;
 if(Number(raw.timestamp)>1e9)asOf=new Date(Number(raw.timestamp)*1000).toISOString();
 else if(typeof raw.datetime==='string'){
  const v=raw.datetime.trim().replace(' ','T');
  if(/^\d{4}-\d{2}-\d{2}$/.test(v))asOf=v+'T12:00:00Z';
  else if(/^\d{4}-\d{2}-\d{2}T/.test(v))asOf=v+'Z';
 }
 const week=raw.fifty_two_week||{};
 const numeric=v=>v==null||v===''?null:Number.isFinite(Number(v))?Number(v):null;
 return {price,previousClose:numeric(raw.previous_close),change:numeric(raw.change),
  changePercent:numeric(raw.percent_change),
  open:numeric(raw.open),high:numeric(raw.high),low:numeric(raw.low),volume:numeric(raw.volume),
  week52Low:numeric(week.low),week52High:numeric(week.high),
  currency:raw.currency||'USD',asOf};
}
// Reuse successful quotes across the watchlist and asset detail routes.
// Only genuine provider responses are cached; failures are never cached.
async function learnCachedQuote(env,ctx,cache,symbol){
 const key=new Request('https://simple-investing.internal/quote?symbol='+encodeURIComponent(symbol));
 const previous=await cache.match(key);
 if(previous){
   const saved=await previous.json().catch(()=>null);
   if(saved&&Number(saved.price)>0)return saved;
 }
 const quote=learnQuote(await learnProvider(env,'quote',{symbol}));
 if(!quote)throw Error('Quote unavailable');
 const response=new Response(JSON.stringify(quote),{
   headers:{'Content-Type':'application/json','Cache-Control':'public, max-age=600'}
 });
 ctx.waitUntil(cache.put(key,response));
 return quote;
}

async function learnRoute(request,env,ctx,allow){
 const uri=new URL(request.url);
 const path=uri.pathname;
 let ttl=600;
 const cache=caches.default;
 const cacheKey=new Request(uri.toString(),{method:'GET'});
 const cached=path==='/quotes'?null:await cache.match(cacheKey);
 if(cached){
  const res=new Response(cached.body,cached);
  for(const [key,val] of Object.entries(corsHeaders(allow)))res.headers.set(key,val);
  return res;
 }
 try{
  let payload;
  if(path==='/search'){
   const query=(uri.searchParams.get('query')||'').trim().slice(0,50);
   if(query.length<2)return responseJson({results:[]},200,allow);
   ttl=3600;
   const results=await learnProvider(env,'symbol_search',{symbol:query,outputsize:'20'});
   const items=Array.isArray(results.data)?results.data:[];
   payload={results:items.filter(x=>validSymbol(x.symbol))
    .filter(x=>!x.country||/united states|usa/i.test(x.country))
    .filter(x=>/^(Common Stock|ETF|American Depositary Receipt|REIT|Preferred Stock)$/i.test(x.instrument_type||''))
    .map(x=>({symbol:x.symbol.toUpperCase(),name:x.instrument_name||x.name||x.symbol,
      type:/etf|exchange traded/i.test(x.instrument_type||'')?'etf':'stock',
      exchange:x.exchange||''})).slice(0,15)};
  }else if(path==='/quotes'){
   const input=(uri.searchParams.get('symbols')||'').toUpperCase().split(',');
   const symbols=[...new Set(input)].filter(validSymbol).slice(0,5);
   if(!symbols.length)return responseJson({error:'No valid symbols'},400,allow);
   // Never cache incomplete watchlist batches. Cache successful symbols
   // individually so retrying a failed ticker does not spend credits again.
   const quotes={},unavailable=[];
   for(const symbol of symbols){
     try{quotes[symbol]=await learnCachedQuote(env,ctx,cache,symbol);}
     catch{unavailable.push(symbol);}
   }
   payload={source:'Twelve Data',quotes};
   if(unavailable.length){
     payload.unavailable=unavailable;
     payload.retryAfterSeconds=60;
   }
  }else if(path==='/asset'){
   const symbol=(uri.searchParams.get('symbol')||'').toUpperCase();
   const range=uri.searchParams.get('range')||'1M';
   if(!validSymbol(symbol)||!LEARN_WINDOWS[range])return responseJson({error:'Invalid symbol or range'},400,allow);
   const cfg=LEARN_WINDOWS[range];ttl=cfg.ttl;
   const quote=await learnCachedQuote(env,ctx,cache,symbol);
   if(!quote)return responseJson({error:'Quote unavailable'},503,allow);
   // A quote can still be used to value a paper holding if historical bars
   // are unavailable on this data tier. Never invent bar prices.
   let bars=[],historyError=null;
   try{
    const hist=await learnProvider(env,'time_series',{
      symbol,interval:cfg.interval,outputsize:String(cfg.outputsize),
      order:'ASC',timezone:'America/New_York',adjust:'splits'
    });
    bars=(Array.isArray(hist.values)?hist.values:[]).map(x=>({
      time:String(x.datetime||'').replace(' ','T'),close:Number(x.close),volume:Number(x.volume||0)
    })).filter(x=>x.time&&x.close>0).sort((a,b)=>a.time.localeCompare(b.time));
    if(bars.length&&range!=='All'){
      // outputsize fetches a little extra history. Filter to the user's
      // calendar window rather than showing 35 trading days as "1M".
      const endDay=bars.at(-1).time.slice(0,10);
      const cutoff=new Date(endDay+'T12:00:00Z');
      if(range==='1D'){}
      else if(range==='1W')cutoff.setUTCDate(cutoff.getUTCDate()-7);
      else if(range==='1M')cutoff.setUTCMonth(cutoff.getUTCMonth()-1);
      else if(range==='3M')cutoff.setUTCMonth(cutoff.getUTCMonth()-3);
      else if(range==='YTD')cutoff.setUTCMonth(0,1);
      else if(range==='1Y')cutoff.setUTCFullYear(cutoff.getUTCFullYear()-1);
      const boundary=range==='1D'?endDay:cutoff.toISOString().slice(0,10);
      bars=bars.filter(x=>x.time.slice(0,10)>=boundary);
    }
   }catch(e){historyError='History unavailable for this subscription or ticker';}
   payload={symbol,source:'Twelve Data',quote,bars,range,historyError,
     note:'Price history excludes separate cash dividend credits to the paper account.'};
  }else return responseJson({error:'Not found'},404,allow);
  const headers={'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':path==='/quotes'?'no-store':'public, max-age='+ttl};
  const response=new Response(JSON.stringify(payload),{status:200,headers});
  if(path!=='/quotes')ctx.waitUntil(cache.put(cacheKey,response.clone()));
  for(const [key,val] of Object.entries(corsHeaders(allow)))response.headers.set(key,val);
  return response;
 }catch(error){
  return responseJson({error:'Market data unavailable or rate limit reached',
    details:String(error?.message||'Unavailable')},503,allow);
 }
}

const SYMBOLS = ['SPYM', 'VXUS', 'SGOV'];
const START_DATE = '2026-04-25';
const API_ROOT = 'https://api.twelvedata.com';
const cacheTTL = 10 * 60;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Vary': 'Origin',
  };
}
function responseJson(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {...corsHeaders(origin), 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'public, max-age=600'},
  });
}
async function timeSeries(env, symbol, interval, extra={}) {
  const q = new URLSearchParams({
    apikey: env.TWELVE_DATA_API_KEY,
    symbol,
    interval,
    timezone:'America/New_York',
    order:'ASC',
    ...extra,
  });
  const r = await fetch(`${API_ROOT}/time_series?${q.toString()}`, { cf: { cacheTtl: 600 } });
  if (!r.ok) throw new Error(`${symbol} ${interval}: HTTP ${r.status}`);
  const json=await r.json();
  if(json.status==='error'||json.code||!Array.isArray(json.values)) {
    throw new Error(`${symbol} ${interval}: ${json.message || 'provider did not return historical bars'}`);
  }
  return json.values;
}
function ymd(stamp){return stamp.slice(0,10);}
function numericClose(bar){return Number(bar.close);}
function makeRows(series, field) {
  const allDates = series.flatMap(r=>r[field].map(x=>x.date));
  const dates=[...new Set(allDates)].sort();
  return dates.map(date=>{
    const entry={date};
    for(const r of series){
      const found=r[field].find(p=>p.date===date);
      if(!found)return null;
      entry[r.symbol]=found.value;
    }
    return entry;
  }).filter(Boolean);
}
export default {
  async fetch(request, env, ctx) {
    const origin=request.headers.get('Origin') || '';
    const allowed=env.ALLOWED_ORIGIN;
    // With a fixed origin this remains usable from your GitHub Pages app.
    if(!allowed) return new Response('ALLOWED_ORIGIN must be configured', {status:500});
    const allow=allowed==='*'? '*':allowed;
    if(origin && allowed!=='*' && origin!==allowed){return new Response('Origin not permitted',{status:403});}
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:corsHeaders(allow)});
    if(request.method!=='GET')return new Response('Method not allowed',{status:405});
    const endpoint=new URL(request.url).pathname;
    if(!['/portfolio-feed','/search','/quotes','/asset'].includes(endpoint))return new Response('Not found',{status:404});
    if(!env.TWELVE_DATA_API_KEY)return responseJson({error:'TWELVE_DATA_API_KEY is not set'},503,allow);
    if(endpoint!=='/portfolio-feed')return learnRoute(request,env,ctx,allow);

    const cache=caches.default;
    const cacheRequest=new Request(new URL('/portfolio-feed',request.url),{method:'GET'});
    const cached=await cache.match(cacheRequest);
    if(cached){
      const result=new Response(cached.body,cached);
      // Cache represents a public response; CORS is set at the edge by request.
      Object.entries(corsHeaders(allow)).forEach(([k,v])=>result.headers.set(k,v));
      return result;
    }
    try {
      // Twelve Data's daily adjust=all asks for split and dividend adjusted
      // prices; normalized indexes represent dividends reinvested in each ETF.
      // Intraday bars are converted to the same scale using the best available daily close ratio.
      const series=await Promise.all(SYMBOLS.map(async symbol=>{
        const [dailyRaw,intraRaw] = await Promise.all([
          timeSeries(env,symbol,'1day',{start_date:START_DATE,outputsize:'700',adjust:'all'}),
          timeSeries(env,symbol,'15min',{outputsize:'400',adjust:'splits'}),
        ]);
        const daily=dailyRaw.filter(b=>b.datetime>=START_DATE && numericClose(b)>0)
          .map(b=>({date:ymd(b.datetime),close:numericClose(b)}));
        if(!daily.length)throw new Error(symbol+' missing daily prices');
        const anchor=daily[0].close;
        const adjustedDaily=new Map(daily.map(b=>[b.date,b.close]));
        // Match each completed day's latest intraday price against the day's
        // dividend-adjusted close. For the current open session, use the last
        // completed trading day's close as the price-ratio anchor.
        const rawByDay=new Map();
        for(const bar of intraRaw.filter(b=>numericClose(b)>0).sort((a,b)=>a.datetime.localeCompare(b.datetime))) {
          rawByDay.set(ymd(bar.datetime), numericClose(bar));
        }
        const intraday=intraRaw.filter(b=>numericClose(b)>0).map(b=>{
          const date=ymd(b.datetime);
          const rawPrice=numericClose(b);
          let adjBase=adjustedDaily.get(date);
          let rawBase=rawByDay.get(date);
          if(!adjBase){
            const previous=daily.filter(x=>x.date<date).at(-1);
            if(!previous)return null;
            adjBase=previous.close;
            rawBase=rawByDay.get(previous.date);
          }
          if(!(rawBase>0))return null;
          return {date,time:b.datetime.replace(' ','T'),value:100*(adjBase/anchor)*(rawPrice/rawBase)};
        }).filter(Boolean);
        return {symbol,daily:daily.map(b=>({date:b.date,value:b.close/anchor*100})),intraday};
      }));
      const daily=makeRows(series,'daily');
      const grouped=new Map();
      for(const s of series){for(const p of s.intraday){
        let row=grouped.get(p.time);
        if(!row){row={time:p.time};grouped.set(p.time,row);}
        row[s.symbol]=p.value;
      }}
      const intraday=[...grouped.values()].filter(row=>SYMBOLS.every(t=>Number(row[t])>0)).sort((a,b)=>a.time.localeCompare(b.time));
      const payload={source:'Twelve Data',asOf:new Date().toISOString(),daily,intraday,
        note:'Split and dividend adjusted daily ETF prices. Intraday values approximate reinvested-return indexes; values are a simulation.'};
      const body=JSON.stringify(payload);
      const out=new Response(body,{status:200,headers:{'Content-Type':'application/json', 'Cache-Control':`public, max-age=${cacheTTL}`}});
      ctx.waitUntil(cache.put(cacheRequest,out.clone()));
      return responseJson(payload,200,allow);
    }catch(err){return responseJson({error:'Market feed error',details:String(err?.message||err)},503,allow);}
  },
};