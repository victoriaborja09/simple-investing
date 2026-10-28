# Simple Investing

**An interactive product concept for making the first investing decision easier.**

[Open the prototype](https://victoriaborja09.github.io/simple-investing/) · [Explore the product case study](https://victoriaborja09.github.io/simple-investing/case-study/)

Simple Investing explores how an established brokerage could help first-time investors get started without immediately choosing individual securities or constructing their own portfolio. The experience centers on one decision: how much to contribute regularly. It then explains the preset allocation, illustrates long-term investing concepts, and gives users optional ways to learn more.

This is a **demonstration prototype**, not a brokerage, an investment account, or personalized investment advice.

## The opportunity

Commission-free trades and fractional shares have lowered the cost of entry, but new investors still face unfamiliar decisions about investment selection, allocation, and risk. The product hypothesis is that a preset-first experience, paired with transparent explanations, may reduce onboarding friction without hiding the investment's limitations.

## Experience

- **Contribution-first onboarding:** Select a monthly contribution amount and review the experience before entering a simulated account.
- **Preset ETF portfolio:** Explore a fixed illustrative allocation with **SPYM (56%)**, **VXUS (14%)**, and **SGOV (30%)**, including the role and risks of each holding.
- **Portfolio views:** Distinguish contributions from investment growth and explore available historical chart intervals.
- **Learn & Explore:** Search supported stocks and ETFs, save a watchlist, and use a separate paper-trading account without affecting the preset portfolio.
- **Languages:** Switch among English, Spanish, Italian, and French.
- **Data clarity:** Missing or delayed quotes are labeled; sample performance is not presented as a live account balance.

The fixed allocation is a product design assumption to evaluate, not a recommendation for every investor.

## Product decisions and validation

| Decision | Rationale |
| --- | --- |
| Begin with a contribution amount | Reduce the number of choices required before users understand the core product |
| Use one preset allocation | Explain diversification and risk before offering more complexity |
| Keep learning and paper trading separate | Allow experimentation without confusing simulated trades with the preset strategy |
| Disclose data limitations | Avoid presenting unavailable quotes or modeled balances as verified live results |

**Proposed measures**, not reported product outcomes, include onboarding completion, time to completion, portfolio comprehension, confidence to begin, optional exploration, and market-data reliability. Next-step research would compare this experience with a more choice-heavy investing flow.

## Built with

HTML, CSS, and vanilla JavaScript, hosted on GitHub Pages. A separately deployed Cloudflare Worker interfaces with Twelve Data for supported quotes and historical series. Browser-local storage persists watchlists and paper-trading state.

There are no real deposits, trades, account credentials, or custodial integrations.

## Repository files

| File or folder | Purpose |
| --- | --- |
| `index.html` | Onboarding, simulated account, and primary product interface |
| `learn-v2-core.js`, `learn-v2-ui.js`, `learn-v2.css` | Educational search, investment details, watchlist, paper trading, and styles |
| `cloudflare-market-worker-v2.js` | Source for the independently deployed market-data service |
| `LEARN_MARKET_SETUP.md` | Market-data configuration and endpoint verification |
| `case-study/index.html` | Product case study |

## Run locally

Clone the repository and serve its root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. The public demo and local preview depend on an independently configured Worker for supported market data.

---

*Independent educational product concept. Not affiliated with a brokerage. It does not execute trades, provide investment advice, or guarantee returns.*
