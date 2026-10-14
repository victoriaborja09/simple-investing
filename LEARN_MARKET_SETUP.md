# Simple Investing: Learn market-data connection

The GitHub Pages app now contains:
- Stock/ETF detail views with 1D, 1W, 1M, 3M, YTD, 1Y and All price charts
- A daily-change watchlist (green and red cards)
- A persistent $500 paper-trading account with fractional simulated shares, buy/sell transactions, cash balances and a portfolio chart
- A guided upgrade preview after practice buying three different investments
- English, Spanish, Italian and French interface labels

## Verify and configure quotes and search

The Cloudflare Worker deploys separately from GitHub Pages, so changes to this repository do **not** automatically update the deployed market-data service. Verify the live endpoints before relying on them; if they are missing or returning errors, deploy the Worker version in this repository.

1. Open Cloudflare > Workers & Pages > **simple-investing-market-data** > Edit code.
2. In this repository open `cloudflare-market-worker-v2.js`, choose **Raw**, and copy its entire contents.
3. In Cloudflare replace the old Worker code with the complete new code and click **Deploy**.
4. Keep the existing Cloudflare secret `TWELVE_DATA_API_KEY` unchanged.
5. Keep `ALLOWED_ORIGIN` set to exactly `https://victoriaborja09.github.io`.
6. After deployment, visit:
   - `https://simple-investing-market-data.victoriaborja09.workers.dev/asset?symbol=AAPL&range=1M`
   - `https://simple-investing-market-data.victoriaborja09.workers.dev/quotes?symbols=AAPL,NVDA`
   - `https://simple-investing-market-data.victoriaborja09.workers.dev/search?query=AAPL`
7. Successful endpoints return JSON with historical price `bars`, a `quote`, or matching `results`. API failures return an error, not fabricated prices.
8. Refresh your GitHub Pages prototype and navigate to Learn.

## Scope and assumptions

- This is an educational paper-trading simulator, not a brokerage. The initial virtual buying power is $500.
- Practice buys and sells use the latest available quoted price. They do not place actual orders or change the automated SPYM/VXUS/SGOV portfolio.
- Simulated transactions and watchlist symbols are saved **only in this browser** using localStorage. A different browser or private session will not share them.
- Stock/ETF price series use split-adjusted prices where supported. The paper portfolio currently does **not** separately credit cash dividends, handle fees or taxes, or process stock splits that occur after a hypothetical purchase. These limitations should be addressed before treating long-lived results as a realistic total-return simulation.
- The 1D and 1W views depend on available intraday bars. Unsupported securities or API rate-limit failures may show no chart or quote.
- A refresh is attempted every 10 minutes only while Learn is visible; Cloudflare also caches successful responses.
- Dynamic discovery is limited to eligible U.S.-listed securities covered by the provider, not every investing product. Paid metrics such as detailed fundamentals are not included.
- Twelve Data's free plan currently lists 8 API credits per minute and 800 credits per day. The original three-ETF feed can already consume six credits on a cache miss. Avoid testing many symbols rapidly. Try again after the quota resets if a query is rejected.

## Data display rights

Twelve Data describes its free plan as **internal non-display usage**. Since GitHub Pages is publicly accessible, verify you have the necessary permission/license before exposing a public live-quote experience. A local/private testing environment can be used for development; do not assume the free entitlement permits public redistribution. The app does not expose your API key.

## Frontend files

- `index.html`: original onboarding, Home and Portfolio screens plus Learn script links
- `learn-v2.css`: Learn visual styling
- `learn-v2-core.js`: quote fetching, search, local paper ledger and portfolio calculations
- `learn-v2-ui.js`: stock details, charts, watchlist, paper account
- `cloudflare-market-worker-v2.js`: Cloudflare Worker, including the original portfolio feed and three new market-data routes
