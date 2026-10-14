# Simple Investing

**A beginner-first investing prototype designed as an entry point within an existing brokerage platform.**

[**Try the interactive prototype ↗**](https://victoriaborja09.github.io/simple-investing/)

## The opportunity

Commission-free trading and fractional shares have reduced the financial threshold for investing, but unfamiliar portfolio choices, trading interfaces, and financial terminology can still discourage prospective investors. Simple Investing explores a narrower starting experience: one preset ETF portfolio, one monthly contribution decision, and an optional environment for learning and practice.

This is an **interactive product prototype**, not a live brokerage. No real accounts, bank connections, deposits, or securities transactions are supported.

## Product experience

| Feature | What the prototype demonstrates |
| --- | --- |
| **Simplified onboarding** | Choose a monthly contribution and explore how an automatic plan would work, without constructing a portfolio. |
| **One preset portfolio** | 56% SPYM (U.S. equities), 14% VXUS (international equities), and 30% SGOV (short-term U.S. Treasuries), with explanations of each holding. |
| **Portfolio transparency** | Interactive allocations, historical contribution illustrations, and a simulated portfolio dashboard. Past performance is not a forecast. |
| **Learn & Explore** | Stock and ETF discovery, investment details, watchlists, and short educational lessons. |
| **Risk-free practice** | A separate paper-trading account starting with $500 in virtual funds; practice orders do not affect the preset portfolio. |
| **Accessible progression** | English, Spanish, Italian, and French interfaces, plus a preview of broader investing tools offered by a future integrating brokerage. |

## Product rationale

The concept investigates whether reducing the initial number of decisions, while maintaining transparent explanations and a separate practice environment, can help people who want to invest but feel unprepared. The intended audience is defined by **investment readiness rather than age**. The full-platform transition is a proposed integration strategy, not an existing brokerage partnership.

## Technology

- **Frontend:** HTML, CSS, and JavaScript, deployed through GitHub Pages.
- **Learn experience:** `learn-v2-core.js`, `learn-v2-ui.js`, and `learn-v2.css`.
- **Market-data prototype:** Optional Cloudflare Worker integration with Twelve Data, with historical/sample fallbacks when live data is unavailable. See [market-data setup notes](LEARN_MARKET_SETUP.md).
- **Practice state:** Browser-local storage; clearing browser storage resets saved practice activity.

### Run locally

```bash
git clone https://github.com/victoriaborja09/simple-investing.git
cd simple-investing
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Some market-data screens require a separately configured service and may show unavailable-data states.

## Status and limitations

This is a portfolio demonstration of product design and prototyping, **not investment advice, personalized portfolio management, or real-money trading**. A single allocation is not appropriate for every investor or time horizon; underlying ETFs have their own expenses and risks. The full-platform experience is a conceptual preview. The sample account and historical simulations do not establish future returns or real customer adoption.

Market-data redistribution and public-display rights must be checked against the applicable provider agreement before making live quotes available to external viewers.

---

**Project focus:** Product discovery · Competitive analysis · Beginner onboarding · Financial education · Interactive prototyping
