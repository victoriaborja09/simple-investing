# Simple Investing
### Product Requirements Document (PRD)

**Stage:** Interactive MVP prototype  
**Product type:** Beginner-investing experience proposed for integration into an existing brokerage  
**Platform:** Mobile-first web prototype  
**Status:** Demonstrable product concept; not a live investment service

[**Explore the prototype ↗**](https://victoriaborja09.github.io/simple-investing/) · [**View the product case study ↗**](https://victoriaborja09.github.io/simple-investing/case-study/) · [**Read the market research ↗**](https://victoriaborja09.github.io/simple-investing/case-study/market-research.html)

## 1. Product summary

**Simple Investing helps investing-curious beginners take a first step without having to construct a portfolio.**

The experience removes asset selection from initial onboarding. Instead, users choose a recurring contribution amount, review **one transparent preset ETF portfolio**, and explore an illustrative account. Stock discovery and paper trading remain available in a separate, optional learning environment.

The longer-term product concept is a simplified entry point **within an established brokerage**, not a new standalone broker or a replacement for its full investment platform.

## 2. Problem and opportunity

Fractional shares and commission-free trades make investing more accessible, but a new user can still face several unfamiliar decisions before ever investing: what to buy, how much to allocate, which account to use, and whether a choice is sufficiently diversified. More options do not necessarily translate into greater confidence.

**Product hypothesis:** For people who are interested in investing but hesitate because of complexity, reducing the initial decisions to a single contribution amount—while clearly explaining the investment and its risks—may improve understanding and onboarding completion.

This is a **hypothesis to validate**, not a demonstrated causal outcome. The accompanying [market research](https://victoriaborja09.github.io/simple-investing/case-study/market-research.html) examines the broader participation gap and competitive context.

## 3. Audience and jobs to be done

**Primary audience:** First-time or early-stage investors who have discretionary funds, are interested in long-term investing, and feel unprepared to choose securities or build an allocation.

**Secondary audience:** Existing brokerage customers who prefer an intentionally narrow, lower-decision starting experience before using more advanced tools.

**Core job to be done:** "When I want to start investing but don't know what to buy, help me understand a simple starting option and choose an amount I can maintain, without making me learn portfolio construction first."

Age alone does not define suitability. A preset portfolio may be inappropriate for some goals, time horizons, liquidity needs, or risk tolerances.

## 4. Product goals and boundaries

| Goals | Non-goals for this prototype |
| --- | --- |
| Reduce cognitive load during first-time onboarding | Support real deposits, brokerage accounts, or trades |
| Make the preset portfolio and its risks understandable | Offer customized investment advice or suitability assessments |
| Show how recurring contributions and portfolio changes work | Promise returns or imply that a sample account is live |
| Provide optional, risk-free exploration of other investments | Replace a brokerage's full trading and research platform |
| Demonstrate accessible language and clear interface states | Deliver a production market-data or custody system |

### MVP design decision: one preset portfolio

| Holding | Target weight | Role |
| --- | ---: | --- |
| **SPYM** | 56% | Broad U.S. equity exposure |
| **VXUS** | 14% | Developed and emerging non-U.S. equity exposure |
| **SGOV** | 30% | Short-term U.S. Treasury-bill exposure |
| **Total** | **100%** | Fixed illustrative allocation |

Users **do not choose individual ETFs or change these weights** during setup. The allocation is a product-design assumption to test, not a personalized recommendation or a universally appropriate portfolio.

## 5. User experience and functional requirements

### Primary user journey

1. **Understand the proposition.** A concise introduction explains automated contributions, the preset allocation, and investment risk.
2. **Select a monthly amount.** The default is **$50/month**, with $10, $25, $50, and $100 presets plus a custom amount from $1 to $10,000 in the prototype.
3. **Review the investment.** Users can inspect the three ETF components, their weights, diversification role, and limitations.
4. **Complete the simulated setup.** An example account illustrates portfolio value and contributions. No account or payment is created.
5. **Explore optionally.** Learn & Explore offers stock/ETF lookup, saved investments, educational explainers, and a separate paper portfolio.
6. **Preview a next step.** A full-platform page illustrates how the simplified product might lead into a larger brokerage.

### MVP requirements

| ID | Priority | Requirement | Acceptance criteria |
| --- | --- | --- | --- |
| **PR-01** | P0 | **Single preset portfolio** | Onboarding presents the fixed 56/14/30 allocation; the user is not required to choose securities or weights. |
| **PR-02** | P0 | **Contribution selection** | Presets and custom entry work; the chosen amount propagates through summary and simulated account views. |
| **PR-03** | P0 | **Portfolio transparency** | Each ETF has an understandable description, percentage weight, and relevant risk context. |
| **PR-04** | P0 | **Illustrative account** | Home and Portfolio views distinguish contributions from investment growth, label simulations, and provide historical charts when data is available. |
| **PR-05** | P1 | **Investment discovery** | Users can search supported stocks/ETFs and open a detail view with price history and available basic statistics. |
| **PR-06** | P1 | **Watchlist** | Users can save and remove symbols; selections persist in the same browser; unavailable quotes do not leave indefinite loading indicators. |
| **PR-07** | P1 | **Paper trading** | A separate account starts with **$500 virtual cash**; simulated buys/sells adjust cash and holdings without affecting the preset portfolio. |
| **PR-08** | P0 | **Localization** | English, Spanish, Italian, and French support is available throughout the principal flows; selection persists in the same browser. |
| **PR-09** | P0 | **Honest data states** | Missing or delayed market data is clearly indicated; the app never substitutes invented live quotes or silently portrays historical samples as current. |
| **PR-10** | P1 | **Progressive exploration** | A clear, conceptual transition to full-platform tools is available, without implying an actual account upgrade. |

**Chart intervals demonstrated:** 1D, 1W, 1M, 3M, YTD, 1Y, and All, subject to data coverage and rate limits. Educational search and paper-trading views are deliberately separate from the automatic investing concept.

## 6. Design principles

- **One primary decision:** Start with the contribution amount; show complexity only when it helps understanding.
- **Transparency over false simplicity:** Explain what is held, why it is held, and what can go wrong.
- **Learn without consequences:** Keep research and fictional practice trading separate from the automatic portfolio.
- **Progressive disclosure:** Introduce detailed statistics and broader products on demand rather than during setup.
- **Credible financial information:** Prefer an explicit unavailable-data state over an inaccurate or misleading price.
- **Accessible by default:** Use readable labels, clear navigation, keyboard-friendly controls, and localized copy.

## 7. Measurement and validation plan

These are **proposed metrics for future research and instrumentation**, not claims of observed adoption or conversion.

| Measure | Definition | Why it matters |
| --- | --- | --- |
| **Primary: onboarding completion** | Completed simulated setup ÷ users who begin onboarding | Tests whether a lower-decision flow helps people reach the product's core value |
| **Time to completion** | Time from starting the flow to reaching the summary | Measures friction and efficiency |
| **Portfolio comprehension** | Share of research participants who correctly identify diversification, investment risk, and the preset nature of the portfolio | Ensures simplicity does not sacrifice understanding |
| **Confidence to begin** | Pre/post research response about comfort taking a first investing step | Tests whether the experience addresses the stated user problem |
| **Optional exploration rate** | Users opening Learn, a stock/ETF detail, or paper trading ÷ completed simulated setups | Indicates interest in progression without making exploration mandatory |
| **Market-data reliability** | Valid quote responses, unavailable states, and age of displayed data | Protects trust in the prototype |

**Validation approach:** Conduct moderated usability tests and a structured concept survey with investing-curious beginners; compare this preset-first journey against a more choice-heavy alternative. Segment feedback by prior investing experience and readiness, not only by age. Define targets only after establishing a baseline.

## 8. Current implementation

The repository contains a **static, mobile-first educational prototype**, built in HTML, CSS, and vanilla JavaScript and published through GitHub Pages. It includes:

- Simulated onboarding and example account with a configurable monthly contribution.
- Home and Portfolio views with a fixed three-ETF allocation and market-data-aware historical illustrations.
- Learn & Explore, including stock/ETF search, watchlist, explanatory content, and a browser-local paper-trading ledger.
- Four-language interface and a conceptual full-platform preview.
- A separately deployed Cloudflare Worker that connects to Twelve Data for eligible market quotes and historical series. Sample/historical fallbacks are labeled where used.

**Persistence:** Browser-local storage is used for watchlist symbols and paper-trading activity; there is no user authentication or shared database. The Cloudflare Worker deploys independently from GitHub Pages.

### Repository structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main prototype: onboarding, simulated Home and Portfolio, navigation |
| `learn-v2-core.js` | Learn state, search/quote requests, watchlist, paper ledger |
| `learn-v2-ui.js` | Learn, details, charts, watchlist, and practice interface |
| `learn-v2.css` | Styles for Learn & Explore |
| `cloudflare-market-worker-v2.js` | Cloudflare market-data service source |
| `case-study/index.html` | Product case study |
| `case-study/market-research.html` | Secondary research and source links |
| `LEARN_MARKET_SETUP.md` | Market-data operations, deployment, and verification |
| `README.md` | This product requirements document |

### Local preview

Run a local static server from the repository directory:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`. Market-data functionality depends on the separately configured service. For Worker deployment details and endpoint checks, refer to [LEARN_MARKET_SETUP.md](LEARN_MARKET_SETUP.md).

## 9. Risks, dependencies, and open questions

| Area | Risk or unresolved question |
| --- | --- |
| **Suitability** | Can a single fixed allocation be presented responsibly without personalized advice, and who should be directed to a more appropriate experience? |
| **Customer demand** | Does removing portfolio construction improve completion and confidence relative to assisted portfolio selection? |
| **Trust and comprehension** | What disclosures, ETF explanations, and downside examples are necessary before making a recurring-investment choice? |
| **Market-data availability** | Twelve Data coverage and free-tier request limits can produce missing or delayed quotes; backend caching and explicit error states reduce but do not eliminate that dependency. |
| **Data licensing** | Rights to publicly display or redistribute provider quotes must be verified against the applicable plan before treating public real-time data as a supported product feature. |
| **Product integration** | Actual brokerage integration, account verification, orders, compliance, and suitability controls are outside this prototype's scope. |
| **Performance methodology** | Illustrative account values depend on stated assumptions and data availability; historical outcomes are not forecasts and do not represent a user's actual returns. |

## 10. Release acceptance and next steps

**Prototype acceptance checklist:** A reviewer can complete onboarding, see the selected contribution reflected in the example account, inspect the fixed ETF portfolio, navigate Home/Portfolio/Learn, search supported symbols, place and reset paper trades, switch languages, and understand when market data is unavailable—all without entering payment details or believing they have opened a brokerage account.

**Next validation work:** Test user comprehension and confidence, instrument onboarding events with consent, benchmark against a more guided alternative, and revisit the allocation/suitability trade-off based on observed research.

---

*Simple Investing is an educational product prototype. It does not provide investment advice, custody assets, execute trades, or guarantee returns. The broader brokerage integration is a product concept, not a partnership.*
