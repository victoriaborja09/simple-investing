# Creator Launchpad

An independent, interactive Roblox Creator Hub concept for a developer-funded playtesting marketplace. Not affiliated with Roblox.

## What it does

Developers commission specific playtests with predefined tester requirements and a fixed Robux reward. Players browse and accept assignments, document what they attempted, record friction or explain why none occurred, and submit observations. The developer can inspect reports and flag suspected abuse for independent review, but cannot veto payment merely because feedback is critical.

## The proposed qualification standard

Each test requires a Completed or Blocked outcome and a specific action-and-result log of at least 25 characters for every assigned task. The player must also describe one concrete friction observation or why no issue occurred, give a proposed improvement or explain why none is needed, and identify the test device. Each required text field has a 25-character minimum. Ratings are optional and not part of payment eligibility.

The demo simulates payout when required fields are complete. This **does not verify actual gameplay or truthfulness**. A production system would need evidence verification, fraud controls, dispute handling, and platform-controlled enforcement. The developer's full reward budget and a hypothetical 10% fee are modeled as reserved at campaign publication. No actual Robux are transferred.

## Technical details

One standalone HTML file with embedded CSS, JavaScript, and SVG artwork. No external dependencies, database, sign-in, payments, or Roblox API. Demo state is stored in localStorage and may be reset in the sidebar. Compatible with GitHub Pages.

## Testing the demo

1. In Developer mode, select Create a test to define and fund a playtest.
2. Switch to Player mode, find and accept the campaign, and complete the required task evidence.
3. Visit My rewards to see the simulated payment.
4. Switch back to Developer mode and inspect the submitted report in Playtests.
