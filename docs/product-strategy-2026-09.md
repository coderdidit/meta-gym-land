# MetaGymLand: repeatable movement breaks

Research date: 30 September 2026.

Status: proposed product direction, not a validated business model.
Audience confirmed by Marcin: adults wanting short, fun movement breaks at home
or at a desk. No current usage or retention data is available.

## Recommendation

Build a repeatable five-minute movement break around two or three excellent
existing games. Add saved progress, a weekly goal, and a small set of replayable
challenges before expanding the catalogue. Test a paid offer with returning users.

Proposed promise: **Turn a break at your computer into five minutes of play and
movement. A browser and webcam are enough.**

Start with adults working from home who can comfortably stand near their computer.
An open-plan office, a seated-only experience, and a full fitness programme are
different use cases. Check real desk/camera arrangements before promising that all
games work without moving the laptop. Desktop remains the supported experience.

The product must compete with a short walk, stretching, a free video, and scrolling,
as well as other fitness games. Its advantage needs to be an enjoyable break that
is easy to repeat. Login and payment make this sellable; repeat use makes it worth
buying.

## What the research supports

Competitor pages describe their offers, not independently verified retention or
profitability. The implications below are product judgments, not causal findings.

| Example                                                                                                                                    | Observed product approach                                                                                            | Implication for MetaGymLand                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Nex Playground Play Pass](https://www.nexplayground.com/shop/playpass)                                                                    | US offer: $89/year or $49/three months, a game catalogue, and monthly content updates; requires its hardware.        | A catalogue subscription creates an explicit content commitment. This is an expensive model for a small team to imitate.                                      |
| [FitXR](https://intercom.help/fitxr/en/articles/7883448-how-much-does-a-fitxr-membership-cost)                                             | EU offer: EUR 12.99/month or EUR 107.99/year; workouts, multiple studios, challenges, playlists and multiplayer.     | Recurring value can include structure and repeated practice, but FitXR also invests in new workouts. Do not assume a subscription removes content work.       |
| [Ring Fit Adventure](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Ring-Fit-Adventure-1638708.html)                           | A campaign with character progression plus custom routines combining exercises and minigames.                        | Existing mechanics can serve both an adventure and repeatable sessions. A substantial campaign is still costly to author.                                     |
| [Zwift's progression and replay features](https://news.zwift.com/en-WW/232499-earn-more-rewards-than-ever-before-with-new-zwift-features/) | Its December 2023 announcement describes weekly consistency rewards, unlocks, climb variants and replay comparisons. | A stable activity can support mastery, progression and social reasons to return. These features are inspiration, not proof they will retain our audience.     |
| [MovePlay](https://moveplay.gg/)                                                                                                           | Advertises browser/webcam motion games with free access and paid Pro plans.                                          | Browser access without dedicated hardware already has direct competition. The focused experience must differentiate us; game count alone is weak positioning. |

Prices are regional snapshots checked on the research date, not price targets for
MetaGymLand. The products have different hardware requirements, audiences and
content budgets. No reliable public cohort retention or unit economics were
established in this research.

A [2022 meta-analysis of gamification and physical activity](https://pmc.ncbi.nlm.nih.gov/articles/PMC8767479/)
covered 16 studies and 2,407 participants. It found a small-to-medium effect during
interventions and a smaller effect at follow-up. This supports testing gamification,
but does not establish long-term engagement or willingness to pay for webcam games.

A [2022 micro-break meta-analysis](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0272460)
found small improvements in vigor and fatigue across the included studies, without
a statistically significant overall performance improvement. It studied breaks
broadly, not this app. Position around an enjoyable movement break; do not promise
proven productivity, pain relief, or fitness outcomes from these findings.

## What exists in this repository

- `src/games/index.ts` lists eight minigames, in addition to the gym room.
- `src/components/minigames-page/index.tsx` currently sets `unlocked = true`, while
  the page still tells players to unlock games through progress.
- `src/types/user.ts` provides a mock user whose save logs data; its fetch creates
  a fresh mock user. This is not durable account progression.
- `src/repositories/user-repository/user-repository.ts` contains XP, completion and
  time tracking, but excludes the demo avatar from displayed statistics.
- `src/components/user-progrees/user-progress.tsx` still describes NFT minting as
  an entry requirement. This conflicts with the proposed audience and offer.
- Avatar and webcam preferences are stored locally. That is useful groundwork,
  but not a saved cross-session progression system.

These are code observations, not an assessment of which games users enjoy. No
player funnel or cohort dashboard was identified in the inspected application.

## Alternatives to continually making new games

| Direction                                              | Reason to return                                   | Ongoing work                                      | Recommendation                                |
| ------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| More standalone minigames                              | Novelty and discovery                              | High: design, art, balancing, testing every game  | Add selectively after observing unmet demand  |
| Short sessions assembled from existing games           | A convenient break with variety and a clear finish | Moderate initially, then tuning templates         | Build first                                   |
| Mastery modes and personal bests                       | Improving at familiar mechanics                    | Low-to-moderate, provided scoring is fair         | Build first with comparable scores            |
| A persistent GymBuddy or gym to develop                | Attachment and visible accumulated progress        | Moderate; cosmetic production can grow            | Test a small version after repeat play exists |
| Friends' asynchronous challenges                       | Accountability and shared goals                    | Moderate, plus identity and score integrity       | Later, if players ask to invite friends       |
| Real-time multiplayer                                  | Social play and competition                        | High networking, matchmaking and operational cost | Defer                                         |
| Story chapters, music library or user-generated levels | New authored content                               | High production, licensing or moderation burden   | Defer                                         |

Random combinations are not automatically interesting. Reuse should change a
meaningful objective or decision, not merely recolor the background. A simple game
that remains dull after several rounds will not be rescued by points and badges.

There is no credible zero-maintenance retention system. The aim is to make new
experiences cheaper to produce, while continuing to improve responsiveness,
fairness and the best-liked mechanics.

## The first product experience

1. **Start a five-minute break.** One clear primary action; game selection remains
   available as a secondary option. Test other durations later.
2. **Check the camera once.** Show understandable tracking feedback and a brief
   movement preview. Returning users keep device preferences. Pause the game when
   tracking is lost instead of treating it as failure.
3. **Play two or three timed rounds.** Include transitions and rest in the advertised
   duration. Select games through observed usability and enjoyment, not intuition.
4. **Finish successfully.** Show completed rounds, the week's break count, and a
   personal best only when settings are comparable. Ending early still preserves
   activity already completed.
5. **Save and return.** Offer a free account to keep progress after the first useful
   experience. Let the user choose a weekly target and an optional reminder.

Use a clean ending that respects the break's time budget. Optimizing endless play
would conflict with the reason this audience came to the product.

### Replay without another game

Prototype one game with a few authored configurations, for example:

- A short introductory round with predictable patterns.
- A mastery round with a fixed pattern and personal-best comparison.
- A weekly challenge using a different, tested pattern and objective.

For Chart Squats, a bounded target challenge is a candidate instead of an
open-ended price chase. Validate reliable movement recognition before introducing
repetition goals: a held pose must not count as many completed repetitions.
This is a proposed mode, not functionality already present.

Represent variants as configuration where useful: game, duration, approved pattern,
difficulty, objective and score version. Start with a handful of curated templates.
Only add a generator if maintaining those templates becomes a demonstrated problem.
Separate game difficulty from physical effort; harder play should not simply demand
ever faster or deeper movement. Let players choose comfortable alternatives.

### A possible distinctive layer

Let completed weekly goals gradually develop the player's GymBuddy or a small gym:
choose a decoration, earn an outfit, or complete a small project. Prototype a finite
set of rewards using the existing visual identity before building an economy.

Use this only if players care about their Buddy. Never make it lose progress or
become unhappy when the player misses a day. Start with weekly goals rather than
punishing daily streaks. Completion rewards should not depend on beating others.

## Metrics to add before feature expansion

Primary product metric: **weekly users completing a break on at least two distinct
days**. Report the count and share of activated users, alongside cohort retention.
Do not optimize raw play time or use detected movement as a validated health measure.

| Question                        | Events or measure                                                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Where do people drop out?       | `break_start_clicked`, `camera_permission_result`, `tracking_ready`, `round_started`, `round_completed`, `break_completed` |
| Is setup too much effort?       | Time from start click to first playable round; permission failures; setup exits                                            |
| Is tracking disrupting play?    | Aggregated tracking-loss seconds, load failures and game crashes                                                           |
| Is the break enjoyable?         | Optional one-question rating after selected sessions; interview explanations                                               |
| Which games deserve investment? | Starts, completions, voluntary replays and exits per game, separated by difficulty                                         |
| Do users return?                | Second completed break on another day; week-two and week-four completed-break retention                                    |
| Does the paid offer work?       | Offer viewed, checkout started, server-confirmed payment, renewal, cancellation and refund                                 |

Record app version, game/mode, difficulty, session ID, coarse browser category,
acquisition source and duration. Version score rules so personal bests do not compare
incompatible modes. Keep keyboard/debug sessions separate from camera sessions.
Exclude development traffic and deduplicate completion/payment events.

Start with a single analytics destination and a simple weekly dashboard. Use a
pseudonymous visitor ID before account creation and explicitly join it to the
account so repeat visits are not counted as different people. Guests changing
devices or clearing storage will remain imperfectly measured. Keep camera frames,
video recordings and raw pose coordinates out of analytics; disable webcam session
replay. Collect only the information needed for the decisions above.

Define activation as finishing the first prescribed break. Report the start-to-finish
funnel separately so failed setups do not disappear from retention statistics.
Define week two as days 8-14 after activation and week four as days 22-28, with at
least one completed break in the window. Only include cohorts old enough to qualify.

## Validation and delivery plan

Timing below is a planning envelope for a small team after cleanup, not a delivery
commitment. Four-week retention requires four weeks of observation regardless of
how quickly code is written. Recruitment should begin during development.

| Phase                                        | Deliverable                                                                                                       | Decision it enables                                            |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1. Baseline and discovery, roughly weeks 1-2 | Funnel events; 8-12 interviews and observed sessions in real desk setups; remove misleading NFT/progression copy  | Can people start, enjoy it and explain when they would return? |
| 2. First repeatable break, roughly weeks 2-4 | Two or three selected games, one timed session, clear results, durable guest progress and optional account saving | Does a complete break beat browsing the catalogue?             |
| 3. Returning-user pilot, roughly weeks 4-8   | Recruit 30-50 relevant adults; weekly goal, personal bests, a small challenge rotation                            | Do they return over several weeks, and why?                    |
| 4. Paid pilot, after a repeat-use signal     | One paid offer, hosted checkout, server-side entitlement and cancellation; interview buyers and non-buyers        | Will people pay, continue using it and renew?                  |
| 5. Evidence-led expansion                    | Add the next requested mode, movement option, social feature or game                                              | Which addition earns its maintenance cost?                     |

Recruit home-working adults through the existing community and relevant remote-work
groups where participation is welcome. Do not rely only on friends or developers.
Run observed onboarding first; then give the cohort normal product reminders only.
Record researcher prompting separately so personal follow-ups do not masquerade as
organic retention. Interview people who stopped, not just enthusiastic users.

Ask about their last real break, what they currently do, room/camera constraints,
when the app fits, and what made them stop. "Would you use this?" is weak evidence.
Compare the catalogue and guided-break experience qualitatively first; avoid an
underpowered A/B test when traffic is tiny.

Provisional gates, chosen for this pilot rather than sourced industry benchmarks:

- **Usability:** at least 70% of recruited testers who click Start finish the first
  break; returning-user median setup is below 30 seconds. Also inspect slow cases.
- **Early return:** at least 40% of activated testers finish another break on a
  different day within seven days.
- **Sustained interest:** at least 25% of activated testers complete a break in days
  22-28. For 40 activated users, that is only 10 people, not proof of market fit.
- **Payment signal:** obtain 5-10 genuine purchases from relevant returning users,
  report the full offered-to-paid denominator, and observe a renewal cycle before
  scaling acquisition. Discounted purchases do not prove full-price demand.

Review numbers together with interviews and recruitment bias. If tracking or setup
fails, fix that first. If people enjoy sessions but forget to return, test the cue
and weekly goal. If reliable sessions repeatedly feel boring, improve the mechanic
or replace a weak game. If people return but will not pay, reconsider the offer or
business model instead of assuming more games will solve it.

## Monetization hypothesis

Keep a useful free break and compatibility check. Offer accounts as a way to save
progress. Introduce payment after users have experienced the product working.

| Free foundation                                                                     | Paid hypothesis                                                                                                           |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Introductory break, selected replayable games, basic saved progress and weekly goal | Choose session length/mix, curated multiweek challenges, additional mastery modes, longer history and Buddy customization |

Premium must provide enough recurring usefulness to justify recurring payment.
Basic progress alone is a weak paywall. Do not take away earned records, fundamental
tracking reliability or the ability to stop/pause.

Start testing one simple monthly offer, for example **EUR 5.99/month**. This is an
unvalidated price hypothesis, not a researched optimum. Show what is available now
and use actual purchases as evidence. If people consistently value a finite game
collection rather than a routine, test a one-time pack (for example EUR 19-29)
instead. Do not launch both models at once or promise lifetime future content.

Track retention of paying users, refunds, support effort, payment/platform costs
and revenue after those costs. Avoid paid acquisition until repeat use and renewal
are credible; a low monthly price leaves little room for expensive acquisition.

Later, a small-team break challenge could be a separate workplace offer if users
bring colleagues. Employer purchasing, administration and team participation are
new problems to validate, not automatic benefits of adding a leaderboard.

## Technical work serving the product

- Finish pose-library modernization as its own PR, as already planned. Validate
  tracking in ordinary desktop setups before judging the product's appeal.
- Add a small shared session/result contract for the selected games: start, pause,
  complete, duration, score version and tracking-quality summary. Avoid rewriting
  every minigame before proving the experience.
- Replace mock persistence with guest storage and a durable account backend;
  preserve guest progress when signing up. Add login when saving becomes useful.
- Keep analytics, progression and payment entitlements separate. An authenticated
  backend must validate payment state; hiding a React button is not an entitlement
  system. The static GitHub Pages frontend can call that backend.
- Give each round one completion event, including restart/exit semantics, so rewards
  are not duplicated and abandoned sessions remain visible in the funnel.

## What earns a new minigame

Add one when repeated feedback and behavior identify a specific gap: the most-liked
games lack a comfortable movement option, users want a distinct kind of challenge,
or the polished core has retained players who ask for something genuinely different.

Require a short concept test and a plan to reuse session controls, tracking,
progression and telemetry. A new game should improve the experience or attract the
chosen audience enough to justify supporting it. "The catalogue looks small" is
not sufficient evidence.

The immediate next deliverable should be the measurement plan and first-break
prototype, followed by observed sessions with the target audience. Use those
findings to choose the first three games and refine the paid offer.
