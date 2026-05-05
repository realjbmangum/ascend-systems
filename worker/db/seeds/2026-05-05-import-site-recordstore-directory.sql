-- =============================================================================
-- Import: project resources from site-recordstore-directory → "RecordStops"
-- Generated: 2026-05-05T16:23:34.304Z
-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/2026-05-05-import-site-recordstore-directory.sql
--
-- 11 resources found.
-- =============================================================================

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', '30 Day Content Calendar', '# RecordStops — 30-Day Social Media Content Calendar

> [!info] Feb 10 — Mar 11, 2026
> Ready to paste into GHL Social Planner. Each post includes platform,
> copy, image guidance, and hashtags. Posts marked with a camera icon
> need a generated or sourced image — prompts included.

---

## Posting Schedule

| Platform | Frequency | Best Times (EST) |
|----------|-----------|-------------------|
| Instagram | Daily | 11am or 7pm |
| Facebook | 5x/week | 10am or 1pm |
| X/Twitter | Daily | 9am or 12pm |

---

## Content Pillars

| Pillar | Icon | Description |
|--------|------|-------------|
| Store Spotlight | SS | Feature a specific store with photo + story |
| Album of the Week | AW | Personal take on a vinyl album |
| City Guide | CG | Promote a city guide page |
| Community | CO | Question, poll, or engagement post |
| New Releases / Charts | NR | Friday drops, chart data |
| Value / Tips | VT | Vinyl tips, value checker promo |
| Behind the Scenes | BTS | Building RecordStops, founder story |

---

## Week 1: Feb 10–16

### Day 1 — Monday, Feb 10

**Instagram** — SS
> Meet Horizon Records in Greenville, SC. Open since 1975, it''s the
> oldest record store in South Carolina. Walls of vinyl from floor to
> ceiling, a staff that actually knows their stuff, and the kind of
> place where you walk in for one album and leave with five.
>
> Find them on RecordStops: recordstops.com/stores/south-carolina/horizon-records
>
> Know a store we should feature? Link in bio.
>
> #recordstops #vinylrecords #recordstore #greenvillesc #vinylcommunity
> #cratedigging #indierecordstore #supportlocal #vinyllife #horizonrecords

Image: Use Horizon Records photo from R2 (`stores/horizon-records/`)

**X/Twitter** — SS
> Horizon Records in Greenville, SC has been open since 1975. 50 years of vinyl.
>
> The oldest record store in South Carolina, and still one of the best.
>
> recordstops.com/stores/south-carolina/horizon-records

---

### Day 2 — Tuesday, Feb 11

**Instagram** — AW
> Album of the Week: Fleetwood Mac — Rumours (1977)
>
> Everyone owns this record. Not everyone owns an original pressing.
> The difference is in the warmth. The bass on "The Chain" hits
> different on a first press — heavier, fuller, like the studio is
> in your living room.
>
> If you only own one classic rock album on vinyl, make it this one.
> If you already own it, you know exactly what I''m talking about.
>
> What''s your go-to "everyone should own this" album?
>
> #recordstops #vinylrecords #fleetwoodmac #rumours #vinylcollection
> #nowspinning #classicrock #vinyloftheday #cratedigging #albumoftheweek

Image prompt: `A warm, moody flat-lay photograph of the Fleetwood Mac "Rumours" vinyl record on a wooden turntable, soft golden light from the left, shallow depth of field, cozy living room background slightly blurred, vintage aesthetic, 4:5 aspect ratio for Instagram`

**Facebook** — CG
> Planning a trip to Richmond? We put together a guide to the best
> record stores in the city.
>
> Steady Sounds, Plan 9 Music, Deep Groove Records — Richmond''s vinyl
> scene is no joke. Plus live venues, local music history, and a
> full-day crate digging itinerary.
>
> Check it out: recordstops.com/cities/richmond

---

### Day 3 — Wednesday, Feb 12

**X/Twitter** — VT
> Your parents'' record collection might be worth more than you think.
>
> We built a free vinyl value checker — search any album, get real
> marketplace prices from Discogs.
>
> No signup. No email. Just search.
>
> recordstops.com/vinyl-value

**Instagram** — VT
> How to check what your vinyl is worth (free):
>
> 1. Go to recordstops.com/vinyl-value
> 2. Search any album by name or barcode
> 3. See real marketplace prices from Discogs
>
> No signup. No email required. Just search and see what your
> collection is actually worth.
>
> We''ve seen records go for $50 that people thought were worth $5.
> And records people thought were worth hundreds that go for $12.
>
> The only way to know is to check.
>
> #recordstops #vinylrecords #vinylvalue #recordcollector
> #vinylcollection #cratedigging #discogs #vinylcommunity
> #vinyllife #recordcollecting

Image prompt: `Clean screenshot-style graphic showing a vinyl record price lookup interface, dark background (#1a1918), orange accent color (#f97316), showing an album search result with price "$47.50", modern minimal design, 4:5 aspect ratio`

---

### Day 4 — Thursday, Feb 13

**Facebook** — CO
> Question for the vinyl heads:
>
> What''s the one album you''ve been hunting for but still haven''t
> found in the wild?
>
> Not online — in an actual store, flipping through the bins.
>
> Drop it below. Someone might know where to find it.

**X/Twitter** — CO
> What album have you been hunting for in the bins but still haven''t found?
>
> I''ve been looking for an original pressing of Tribe Called Quest — Midnight Marauders for two years.

---

### Day 5 — Friday, Feb 14

**Instagram** — NR
> New vinyl Friday. Here''s what dropped this week:
>
> Every Friday, new records hit the shelves. We track them so you
> don''t have to. Check what''s new and what''s coming soon on
> RecordStops.
>
> See the full list: recordstops.com/new-releases
>
> What are you picking up this week?
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #recordstoreday #cratedigging #vinyllife

Image prompt: `Flat-lay of 4-5 brand new sealed vinyl records spread on a clean white surface, modern albums with colorful covers, crisp overhead lighting, one record slightly pulled from its sleeve showing the edge of black vinyl, editorial photography style, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl out today. What are you picking up?
>
> Full list of this week''s releases + what''s coming soon:
> recordstops.com/new-releases

**Facebook** — NR
> It''s New Vinyl Friday. Here''s what hit the shelves this week.
>
> We track new vinyl releases every Friday so you can plan your
> weekend crate digging. See the full list + what''s coming soon.
>
> recordstops.com/new-releases
>
> What are you grabbing this weekend?

---

### Day 6 — Saturday, Feb 15

**Instagram** — CG
> Charlotte, NC has one of the best record store scenes in the
> Southeast. And most people don''t know it.
>
> Lunchbox Records. Manifest Discs. Repo Records. GoodWill Vinyl.
> Each one with its own vibe, its own specialty, its own reason to
> make the drive.
>
> We wrote the guide: recordstops.com/cities/charlotte
>
> Tag someone who needs a Charlotte crate digging trip.
>
> #recordstops #charlottemusic #vinylrecords #recordstore #charlotte
> #charlottenc #cratedigging #vinylcommunity #indierecordstore
> #supportlocal

Image: Use Charlotte city guide hero image from `public/cities/charlotte.webp`

---

### Day 7 — Sunday, Feb 16

**X/Twitter** — BTS
> I built RecordStops because I got tired of Googling "record stores near me" and getting Walmart.
>
> 296 independent record stores across 5 states. Every single one verified.
>
> recordstops.com

**Facebook** — BTS
> A little background on why RecordStops exists:
>
> I moved to the Carolinas and wanted to find independent record
> stores. Every search led to big box stores, closed shops, or
> outdated lists. So I built what I was looking for — a directory
> of every real, independent record store with photos, hours,
> directions, and honest descriptions.
>
> 296 stores across 5 states and growing. If you know a shop we''re
> missing, tell us: recordstops.com/submit

---

## Week 2: Feb 17–23

### Day 8 — Monday, Feb 17

**Instagram** — SS
> Store Spotlight: Papa Jazz Record Shoppe in Columbia, SC.
>
> Open since 1979. Over 100,000 albums. The largest record store
> in the Southeast, tucked into Five Points near the University
> of South Carolina campus.
>
> If you''ve never been, put it on the list. If you have, you
> already know.
>
> recordstops.com/stores/south-carolina/papa-jazz-record-shoppe
>
> #recordstops #vinylrecords #recordstore #columbiascmusic
> #papajazz #vinylcommunity #cratedigging #indierecordstore
> #vinyllife #southcarolina

Image: Use Papa Jazz photo from R2 (`stores/papa-jazz/`)

**X/Twitter** — SS
> Papa Jazz Record Shoppe in Columbia, SC.
>
> Open since 1979. 100,000+ albums. The largest record store in the Southeast.
>
> recordstops.com/stores/south-carolina/papa-jazz-record-shoppe

---

### Day 9 — Tuesday, Feb 18

**Instagram** — AW
> Album of the Week: Kendrick Lamar — good kid, m.A.A.d city (2012)
>
> This album was made to be listened to front to back. On vinyl, you
> have to. No skipping, no shuffle. Side A into Side B. The skits
> land different when you can''t fast forward through them.
>
> The deluxe 2LP pressing with the van cover is the one to get.
>
> What''s your favorite Kendrick album on wax?
>
> #recordstops #vinylrecords #kendricklamar #gkmc #hiphopvinyl
> #vinylcollection #nowspinning #vinyloftheday #cratedigging
> #albumoftheweek

Image prompt: `A close-up photograph of a hip-hop vinyl record being placed on a turntable, hands visible, moody blue-purple lighting, urban apartment setting, bokeh lights in background, authentic vinyl collector aesthetic, 4:5 aspect ratio`

**Facebook** — CO
> Settle this:
>
> When you walk into a record store for the first time, do you:
>
> A) Head straight to your favorite genre section
> B) Start at the front and work your way through
> C) Ask the staff what they recommend
> D) Go straight to the dollar bin
>
> No wrong answers. (It''s D.)

---

### Day 10 — Wednesday, Feb 19

**X/Twitter** — CG
> Washington DC gave us Minor Threat, Fugazi, Bad Brains, and go-go music.
>
> The record stores match the history. Our DC guide covers the best shops, venues, and a full-day itinerary.
>
> recordstops.com/cities/washington-dc

**Instagram** — CG
> Washington, DC: Punk''s Capital City.
>
> The city that gave us Minor Threat, Fugazi, Bad Brains, and
> Dischord Records has record stores worthy of that legacy.
>
> Songbyrd Record Cafe. Smash Records. Red Onion Records. Our
> guide covers the best stores, the venues, the history, and a
> full-day crate digging itinerary.
>
> recordstops.com/cities/washington-dc
>
> #recordstops #dcmusic #vinylrecords #washingtondc #recordstore
> #punkrock #vinylcommunity #cratedigging #fugazi #minorthreat

Image: Use DC city guide hero image from `public/cities/washington-dc.webp`

---

### Day 11 — Thursday, Feb 20

**Facebook** — VT
> Pro tip for new vinyl collectors:
>
> Before you buy a "rare" record at a flea market or estate sale,
> check what it''s actually worth. We built a free tool that pulls
> real marketplace prices from Discogs.
>
> Search any album. No signup required.
>
> recordstops.com/vinyl-value

**X/Twitter** — VT
> Estate sale tip: that "rare" Beatles album might be a $3 record club pressing.
>
> Check before you buy. Our free vinyl value tool pulls real Discogs prices:
> recordstops.com/vinyl-value

---

### Day 12 — Friday, Feb 21

**Instagram** — NR
> New Vinyl Friday. What dropped this week?
>
> Check the full list of new releases + what''s coming next week
> on RecordStops.
>
> recordstops.com/new-releases
>
> Drop what you''re picking up in the comments.
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #cratedigging #vinyllife #fridayvinyl

Image prompt: `Overhead shot of a record store new arrivals bin with colorful vinyl record covers visible, warm fluorescent store lighting, slightly worn wooden dividers with genre labels, authentic record store atmosphere, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl out today.
>
> Full list + what''s dropping next Friday:
> recordstops.com/new-releases

---

### Day 13 — Saturday, Feb 22

**Instagram** — SS
> Store Spotlight: Monster Music & Movies in Charleston, SC.
>
> The largest record store in the Carolinas. Not just vinyl — tapes,
> CDs, movies, posters. The kind of store you lose an afternoon in
> and don''t regret it.
>
> If you''re in Charleston, this is a mandatory stop.
>
> recordstops.com/stores/south-carolina/monster-music-movies
>
> #recordstops #vinylrecords #recordstore #charlestonsc #charleston
> #vinylcommunity #cratedigging #indierecordstore #monstermusic
> #supportlocal

Image: Use Monster Music photo from R2

**Facebook** — SS
> Monster Music & Movies in Charleston might be the best record store
> in the Carolinas.
>
> Massive inventory across every format. The kind of place where you
> walk in planning to spend 20 minutes and leave 2 hours later with
> a stack of records you didn''t know you needed.
>
> recordstops.com/stores/south-carolina/monster-music-movies

---

### Day 14 — Sunday, Feb 23

**X/Twitter** — CO
> Hot take: the dollar bin is the most underrated section of any record store.
>
> I''ve found original pressings of Steely Dan, Coltrane, and Tom Petty for $1 each.
>
> What''s your best dollar bin find?

**Facebook** — CO
> Dollar bin stories. Let''s hear them.
>
> What''s the best record you''ve ever pulled out of a dollar bin?
> I once found an original pressing of Steely Dan''s Aja for $1 at
> a shop in Durham. Still one of my best finds.
>
> Your turn.

---

## Week 3: Feb 24 — Mar 2

### Day 15 — Monday, Feb 24

**Instagram** — CG
> Asheville, NC. The best small city for vinyl in the Southeast.
>
> Harvest Records. Voltage Records. Top of the Mountain. Three
> stores, each with a completely different vibe, all within
> walking distance downtown.
>
> We wrote the full guide with a walking itinerary:
> recordstops.com/cities/asheville
>
> #recordstops #ashevillemusic #vinylrecords #recordstore #asheville
> #ashevillenc #vinylcommunity #cratedigging #blueridgemountains
> #indierecordstore

Image: Use Asheville city guide hero image from `public/cities/asheville.webp`

**X/Twitter** — CG
> Asheville has 3 record stores within walking distance downtown.
>
> Harvest, Voltage, Top of the Mountain. Our guide has a full walking itinerary:
> recordstops.com/cities/asheville

---

### Day 16 — Tuesday, Feb 25

**Instagram** — AW
> Album of the Week: Miles Davis — Kind of Blue (1959)
>
> The best-selling jazz album of all time. On vinyl, you hear
> things the digital version hides. The room. The breathing.
> The space between the notes.
>
> If you''re getting into jazz on vinyl, start here. There''s a
> reason this album has been in print for 65 years.
>
> #recordstops #vinylrecords #milesdavis #kindofblue #jazzvinyl
> #vinylcollection #nowspinning #vinyloftheday #jazzrecords
> #albumoftheweek

Image prompt: `A moody, intimate photograph of a jazz vinyl record on a turntable in a dimly lit room, warm amber lamp light, wisps of atmosphere, a glass of whiskey slightly out of focus in the background, vintage mid-century modern aesthetic, 4:5 aspect ratio`

**Facebook** — BTS
> Fun fact: RecordStops now has 296 record stores listed across
> North Carolina, South Carolina, Virginia, Maryland, and DC.
>
> Every single store is independently verified. No chains, no
> big box stores, no stores that closed 3 years ago.
>
> If we''re missing a store you know about, add it:
> recordstops.com/submit

---

### Day 17 — Wednesday, Feb 26

**X/Twitter** — SS
> Steady Sounds in Richmond, VA might be the most curated record store on the East Coast.
>
> Small shop, huge taste. Every record in there was hand-selected.
>
> recordstops.com/stores/virginia/steady-sounds

**Facebook** — VT
> Vinyl collecting tip: condition grades matter more than rarity.
>
> A VG+ copy of a common album will sound better than a Fair copy
> of something rare. When you''re shopping, always ask about
> condition — especially for used records.
>
> The Goldmine grading scale (Mint, NM, VG+, VG, G+, G, Fair, Poor)
> is the standard. VG+ is the sweet spot for most collectors — plays
> great, priced fair.
>
> Want to check what a record is worth before buying?
> recordstops.com/vinyl-value

---

### Day 18 — Thursday, Feb 27

**Instagram** — CO
> You can only keep 5 albums from your collection. Everything else
> is gone. What makes the cut?
>
> Mine:
> 1. Fleetwood Mac — Rumours
> 2. OutKast — Aquemini
> 3. Miles Davis — Kind of Blue
> 4. Radiohead — OK Computer
> 5. Marvin Gaye — What''s Going On
>
> This is harder than it sounds. Drop yours below.
>
> #recordstops #vinylrecords #vinylcollection #vinylcommunity
> #recordcollector #top5albums #nowspinning #vinyllife
> #cratedigging #musiclover

Image prompt: `Five vinyl records fanned out on a hardwood floor, shot from above, each showing a different colorful album cover, warm natural light from a window, cozy home setting, clean and editorial, 4:5 aspect ratio`

**X/Twitter** — CO
> 5 albums. Rest of your collection disappears. What stays?
>
> Go.

---

### Day 19 — Friday, Feb 28

**Instagram** — NR
> New Vinyl Friday. Another week of fresh wax.
>
> See what dropped today and what''s coming next Friday:
> recordstops.com/new-releases
>
> Planning a weekend record run? Find stores near you:
> recordstops.com/stores
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #cratedigging #vinyllife #fridayvinyl

Image prompt: `A person carrying a brown paper bag with vinyl records sticking out the top, walking on a sidewalk in front of a record store with a neon "OPEN" sign, golden hour lighting, candid street photography style, warm tones, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl Friday. What are you picking up?
>
> This week''s releases: recordstops.com/new-releases

**Facebook** — NR
> Happy Friday. New vinyl is on the shelves.
>
> Check what dropped this week + what''s coming next:
> recordstops.com/new-releases
>
> Planning a record run this weekend? Find stores near you at
> recordstops.com/stores

---

### Day 20 — Saturday, Mar 1

**Instagram** — SS
> Store Spotlight: Sound Garden in Baltimore.
>
> Open since 1993. If you''re a vinyl collector in the DMV and you
> haven''t made the trip to Fells Point, you''re missing out. Huge
> selection, fair prices, and the kind of bins you can get lost in.
>
> recordstops.com/stores/maryland/sound-garden
>
> #recordstops #vinylrecords #recordstore #baltimore #baltimormusic
> #soundgarden #vinylcommunity #cratedigging #indierecordstore
> #dmvmusic

Image: Use Sound Garden photo from R2

**X/Twitter** — SS
> Sound Garden in Baltimore. Open since 1993. One of the best record stores in the entire DMV.
>
> recordstops.com/stores/maryland/sound-garden

---

### Day 21 — Sunday, Mar 2

**Facebook** — CO
> Sunday morning question:
>
> What''s the album you put on when you want to do absolutely nothing?
>
> No agenda. Just coffee and vinyl. What''s spinning?

**X/Twitter** — BTS
> RecordStops by the numbers:
>
> 296 stores
> 5 states
> 16 city guides
> 1,078 releases tracked
> 1 free vinyl value checker
>
> All free. All independent stores. No chains.
>
> recordstops.com

---

## Week 4: Mar 3–9

### Day 22 — Monday, Mar 3

**Instagram** — CG
> Baltimore''s record store scene doesn''t get enough credit.
>
> Sound Garden. Celebrated Summer. Normals Books and Records. Three
> very different stores in a city with serious music history — Billie
> Holiday, Beach House, Animal Collective, Future Islands.
>
> Our Baltimore guide has the stores, the venues, and the itinerary:
> recordstops.com/cities/baltimore
>
> #recordstops #baltimoremusic #vinylrecords #recordstore #baltimore
> #charmcity #vinylcommunity #cratedigging #beachhouse #indierecordstore

Image: Use Baltimore city guide hero image from `public/cities/baltimore.webp`

**X/Twitter** — CG
> Baltimore gave us Billie Holiday, Beach House, and Animal Collective.
>
> The record stores match. Our guide:
> recordstops.com/cities/baltimore

---

### Day 23 — Tuesday, Mar 4

**Instagram** — AW
> Album of the Week: Stevie Wonder — Songs in the Key of Life (1976)
>
> Double LP plus a bonus 7-inch EP. This album is an event on vinyl.
> Four sides of music that moves between funk, soul, jazz, and pop
> without ever losing the thread.
>
> "As" might be the most perfect love song ever recorded. On vinyl
> the bass line wraps around you.
>
> #recordstops #vinylrecords #steviewonder #songsinthekeyoflife
> #soulvinyl #vinylcollection #nowspinning #vinyloftheday
> #classicvinyl #albumoftheweek

Image prompt: `A vintage-styled photograph of a double vinyl LP gatefold open on a mid-century credenza, warm afternoon light streaming through sheer curtains, a potted plant nearby, retro 1970s interior design, warm color palette, 4:5 aspect ratio`

**Facebook** — CG
> If you''re anywhere near Raleigh-Durham, we built a guide to the
> best record stores in the Triangle.
>
> Schoolkids Records, Nice Price Books, Bull City Records — each
> one worth the trip for different reasons.
>
> Full guide with itinerary: recordstops.com/cities/raleigh-durham

---

### Day 24 — Wednesday, Mar 5

**X/Twitter** — VT
> Vinyl collecting doesn''t have to be expensive.
>
> The dollar bin exists. Used bins are gold. And your local store would rather sell you a $5 record than not sell it at all.
>
> Start with what you love, not what''s "collectible."

**Instagram** — VT
> Vinyl collecting on a budget. It''s easier than people think.
>
> 1. Start with the dollar bin. Seriously. Hidden gems live there.
> 2. Buy used. A VG+ used record sounds 95% as good as mint.
> 3. Talk to the staff. They know what''s underpriced.
> 4. Check the value before you overpay: recordstops.com/vinyl-value
> 5. Collect what you love, not what''s "valuable."
>
> The best collection is the one you actually listen to.
>
> #recordstops #vinylrecords #vinylcollection #budgetvinyl
> #vinylcommunity #cratedigging #recordcollector #vinyllife
> #vinyltips #supportlocal

Image prompt: `A colorful spread of vinyl records being browsed in a dollar bin at a record store, hands flipping through the records, overhead angle, price stickers visible showing $1-$3, warm store lighting, authentic and candid, 4:5 aspect ratio`

---

### Day 25 — Thursday, Mar 6

**Facebook** — CO
> Controversial question:
>
> Is it okay to play records at a party, or is vinyl strictly a
> solo/small group activity?
>
> I''ve seen people put on a $200 first pressing at a house party
> and it gave me anxiety. But also... that''s what records are for?
>
> Where do you stand?

**X/Twitter** — CO
> Vinyl at a party: yes or no?
>
> I''ve seen someone put a $200 first pressing on at a house party and it physically hurt me.

---

### Day 26 — Friday, Mar 7

**Instagram** — NR
> New Vinyl Friday. End of the week, start of the digging.
>
> See what''s new + what''s dropping next week:
> recordstops.com/new-releases
>
> And if you''re heading out this weekend, find a store near you:
> recordstops.com/stores
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #cratedigging #vinyllife #weekendplans

Image prompt: `Interior of a cozy independent record store, vinyl bins in foreground, warm overhead string lights, band posters on walls, a customer browsing in the background slightly blurred, inviting weekend atmosphere, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl Friday.
>
> See what dropped + what''s coming:
> recordstops.com/new-releases

**Facebook** — NR
> Friday means new vinyl.
>
> Check this week''s releases and plan your weekend record run:
> recordstops.com/new-releases
>
> Find a store near you: recordstops.com/stores

---

### Day 27 — Saturday, Mar 8

**Instagram** — SS
> Store Spotlight: Lunchbox Records in Charlotte, NC.
>
> One of Charlotte''s best. Great curation, fair prices, and a
> staff that genuinely cares about helping you find what you''re
> looking for — even if you don''t know what that is yet.
>
> recordstops.com/stores/north-carolina/lunchbox-records
>
> #recordstops #vinylrecords #recordstore #charlottenc #charlotte
> #lunchboxrecords #vinylcommunity #cratedigging #indierecordstore
> #supportlocal

Image: Use Lunchbox Records photo from R2

---

### Day 28 — Sunday, Mar 9

**X/Twitter** — BTS
> Every store on RecordStops was verified by hand. No scraping random listings and calling it a directory.
>
> If a store closed, we remove it. If a store opens, we add it.
>
> Know a store we''re missing? recordstops.com/submit

**Facebook** — CO
> What''s spinning this Sunday morning?
>
> I''m on Side B of Al Green — Let''s Stay Together. Perfect Sunday
> morning album.
>
> Drop your Sunday spin below.

---

## Week 5: Mar 10–11

### Day 29 — Monday, Mar 10

**Instagram** — CG
> Charleston, SC. Where history meets the beat.
>
> The city that gave us the Charleston dance in the 1920s has a
> modern music scene to match. Monster Music & Movies. Keep It Wheel.
> Spoleto Festival USA.
>
> Our Charleston guide covers all of it:
> recordstops.com/cities/charleston
>
> #recordstops #charlestonsc #vinylrecords #recordstore #charleston
> #lowcountry #vinylcommunity #cratedigging #spoletofestival
> #southcarolina

Image: Use Charleston city guide hero image from `public/cities/charleston.webp`

**X/Twitter** — CG
> Charleston, SC gave us the Charleston dance. The record store scene lives up to the history.
>
> Our guide: recordstops.com/cities/charleston

---

### Day 30 — Tuesday, Mar 11

**Instagram** — AW
> Album of the Week: Outkast — Aquemini (1998)
>
> "Return of the G" into "Rosa Parks" into "Skew It on the Bar-B."
> The first three tracks alone are worth the price of the 3LP
> pressing.
>
> This album proved Southern hip-hop could be weird and hard at the
> same time. Vinyl is the only way to give it the time it deserves.
>
> #recordstops #vinylrecords #outkast #aquemini #hiphopvinyl
> #vinylcollection #nowspinning #vinyloftheday #southernhiphop
> #albumoftheweek

Image prompt: `A stylish flat-lay of a hip-hop vinyl triple LP with all three discs spread out, colorful album artwork visible, turntable partially in frame, urban apartment setting with exposed brick, warm directional lighting, 4:5 aspect ratio`

**Facebook** — BTS
> One month in. Here''s what we''ve built so far with RecordStops:
>
> 296 stores across 5 states. 16 city guides. Weekly vinyl charts.
> A free value checker. A newsletter. And a growing community of
> people who still believe in going to a store, flipping through
> bins, and finding something unexpected.
>
> Thanks for being here. If you know someone who''d love this,
> tag them or share this page.
>
> recordstops.com

**X/Twitter** — BTS
> One month of RecordStops on social.
>
> 296 stores. 16 city guides. Free tools. Growing community.
>
> Thanks for being here. Tell a vinyl friend:
> recordstops.com

---

## Image Generation Prompts — Quick Reference

| Day | Platform | Subject | Prompt |
|-----|----------|---------|--------|
| 2 | IG | Fleetwood Mac — Rumours | Warm flat-lay of Rumours vinyl on wooden turntable, golden light, shallow DOF, cozy room, vintage aesthetic, 4:5 |
| 3 | IG | Vinyl Value Checker | Screenshot-style graphic, dark bg #1a1918, orange #f97316, album search showing "$47.50", minimal, 4:5 |
| 12 | IG | New arrivals bin | Overhead shot of record store new arrivals bin, colorful covers, wooden dividers, warm fluorescent light, 4:5 |
| 16 | IG | Jazz vinyl | Moody jazz vinyl on turntable, amber lamp, whiskey glass blurred bg, mid-century modern, 4:5 |
| 18 | IG | Top 5 albums | Five vinyl records fanned on hardwood floor, overhead, colorful covers, warm window light, editorial, 4:5 |
| 19 | IG | Record store bag | Person carrying bag with records, sidewalk, neon OPEN sign, golden hour, candid street photo, 4:5 |
| 23 | IG | Double LP gatefold | Vintage double LP gatefold open on credenza, afternoon light, sheer curtains, 70s interior, 4:5 |
| 24 | IG | Dollar bin browsing | Hands flipping through dollar bin, overhead angle, $1-3 stickers visible, warm store light, candid, 4:5 |
| 26 | IG | Record store interior | Cozy indie store, bins foreground, string lights, posters, customer browsing blurred, weekend vibe, 4:5 |
| 30 | IG | Triple LP spread | Hip-hop triple LP spread out, turntable in frame, exposed brick apartment, warm directional light, 4:5 |

---

## Notes for GHL Scheduling

- **Copy/paste** each post directly into GHL Social Planner
- **Hashtags** are included in IG captions — GHL will post them inline
- **Images from R2:** Download store photos from the R2 bucket
  (`pub-6a29216cfc6b4a8d8657f0e9c3e7d857.r2.dev/stores/{id}/`)
- **City guide images:** Use the `.webp` files from `public/cities/`
  (convert to `.jpg` if GHL requires it)
- **Generated images:** Use the prompts above with your preferred AI
  image tool (Gemini, Midjourney, DALL-E)
- **X/Twitter** does not connect to GHL — post manually or use a
  separate scheduler
- Adjust dates if you start later than Feb 10
', 20, 'site-recordstore-directory/marketing/30-day-content-calendar.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', '60 Day Content Calendar', '# RecordStops — 60-Day Social Media Content Calendar

> [!info] Mar 12 — May 10, 2026
> Continuation of 30-day calendar (Feb 10 — Mar 11). Covers weeks 5-12.
> Biggest moment: **Record Store Day — April 18, 2026.**
> Ready to paste into GHL Social Planner CSVs.

---

## Posting Schedule

| Platform | Frequency | Best Times (EST) |
|----------|-----------|-------------------|
| Instagram | Daily | 11am or 7pm |
| Facebook | 5x/week (Mon, Wed, Thu, Fri, Sun) | 10am or 1pm |
| X/Twitter | Daily | 9am or 12pm |

---

## Content Pillars

| Pillar | Icon | Description |
|--------|------|-------------|
| Store Spotlight | SS | Feature a specific store with photo + story |
| Album of the Week | AW | Personal take on a vinyl album |
| City Guide | CG | Promote a city guide page |
| Community | CO | Question, poll, or engagement post |
| New Releases / Charts | NR | Friday drops, chart data |
| Value / Tips | VT | Vinyl tips, value checker promo |
| Record Store Day | RSD | Special RSD content (Apr 4-25 arc) |

---

## Stores to Spotlight (8 new)

| Week | Store | ID | City, State |
|------|-------|----|-------------|
| 5 | Plan 9 Music | 462 | Richmond, VA |
| 6 | Harvest Records | 276 | Asheville, NC |
| 7 | CD Cellar | 432 | Falls Church, VA |
| 8 | Repo Record | 289 | Charlotte, NC |
| 9 | Schoolkids Records | 13 | Raleigh, NC |
| 10 | Scratch N Spin | 252 | West Columbia, SC |
| 11 | AFK Books & Records | 477 | Virginia Beach, VA |
| 12 | Screaming For Vintage | 339 | Pittsboro, NC |

## Albums of the Week (8 new)

| Week | Album | Year |
|------|-------|------|
| 5 | Pink Floyd — The Dark Side of the Moon | 1973 |
| 6 | Marvin Gaye — What''s Going On | 1971 |
| 7 | Radiohead — OK Computer | 1997 |
| 8 | A Tribe Called Quest — The Low End Theory | 1991 |
| 9 | Joni Mitchell — Blue | 1971 |
| 10 | Nirvana — Nevermind | 1991 |
| 11 | D''Angelo — Voodoo | 2000 |
| 12 | The Beatles — Abbey Road | 1969 |

## City Guides to Promote (9 remaining)

| Week | City | Slug |
|------|------|------|
| 5 | Columbia, SC | columbia |
| 6 | Greenville, SC | greenville |
| 7 | Chapel Hill, NC | chapel-hill |
| 8 | Durham, NC | durham |
| 9 | Greensboro, NC | greensboro |
| 10 | Wilmington, NC | wilmington |
| 11 | Winston-Salem, NC | winston-salem |
| 12 | Fayetteville, NC | fayetteville |
| (bonus) | High Point, NC | high-point |

---

## Week 5: Mar 12-18

### Day 31 — Wednesday, Mar 12

**Instagram** — CG
> Columbia, SC. The South''s record vault.
>
> Papa Jazz Record Shoppe has over 100,000 albums and has been open since
> 1979. Scratch N Spin in West Columbia is packed with crates. Ikie Lu
> Record Club is a vinyl listening bar with high-fidelity sound and wine.
>
> Our Columbia guide covers all of it plus jazz venues, live music, and
> a full itinerary: recordstops.com/cities/columbia
>
> #recordstops #columbiascmusic #vinylrecords #recordstore #columbiasc
> #vinylcommunity #cratedigging #papajazz #indierecordstore #sodacity

Image: Use Columbia city guide hero from R2 (`social/city-columbia.png`)

**X/Twitter** — CG
> Columbia, SC has Papa Jazz Record Shoppe — 100,000+ albums since 1979.
>
> Plus Scratch N Spin, a jazz kissa, and a vinyl scene most people don''t know about.
>
> Our guide: recordstops.com/cities/columbia

**Facebook** — CG
> If you''re in the Columbia, SC area and looking for records, we wrote
> a guide covering every store worth visiting.
>
> Papa Jazz Record Shoppe (since 1979, 100,000+ albums), Scratch N Spin,
> Manifest Discs, and more. Plus live jazz at The Joint and Chayz Lounge.
>
> Full guide with itinerary: recordstops.com/cities/columbia

---

### Day 32 — Thursday, Mar 13

**Facebook** — CO
> What''s the album that made you start collecting vinyl?
>
> Not what you think you should say. The actual one. The record that made
> you think "I need to own this on wax."
>
> Mine was Stevie Wonder — Songs in the Key of Life. Heard it on a
> friend''s turntable and everything clicked.

**X/Twitter** — CO
> What album made you start collecting vinyl?
>
> The actual one, not the cool answer.
>
> Mine: Stevie Wonder — Songs in the Key of Life. Heard it on a friend''s
> turntable and I was done.

---

### Day 33 — Friday, Mar 14

**Instagram** — NR
> New Vinyl Friday. March is stacked with releases.
>
> Check what dropped today and what''s coming next week:
> recordstops.com/new-releases
>
> Planning a weekend record run? Find a store near you:
> recordstops.com/stores
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #cratedigging #vinyllife #fridayvinyl

Image prompt: `A stack of brand new sealed vinyl records on a record store counter, colorful spines visible, a hand reaching for the top one, warm overhead store lighting, authentic record store atmosphere, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl out today. Spring release season is heating up.
>
> Full list + what''s coming next Friday:
> recordstops.com/new-releases

**Facebook** — NR
> It''s Friday and new vinyl is on the shelves.
>
> Check this week''s releases and plan your weekend trip:
> recordstops.com/new-releases
>
> Find a store near you: recordstops.com/stores

---

### Day 34 — Saturday, Mar 15

**Instagram** — VT
> How to find rare records without paying rare prices:
>
> 1. Visit stores on weekdays. New stock hits the bins before the
>    weekend crowd shows up.
> 2. Ask the owner what just came in. Most stores get collections
>    weekly and don''t always put everything out immediately.
> 3. Check smaller towns. The best finds are in stores where nobody''s
>    looking.
> 4. Be patient. The grail shows up when you stop forcing it.
> 5. Use the value checker to know what''s fair: recordstops.com/vinyl-value
>
> #recordstops #vinylrecords #vinylcollection #vinyltips
> #vinylcommunity #cratedigging #recordcollector #vinyllife
> #rarecords #supportlocal

Image prompt: `A vinyl collector flipping through a dense bin of records in a small-town store, golden afternoon light through a window, dust particles visible in the light, intimate and authentic atmosphere, 4:5 aspect ratio`

---

### Day 35 — Sunday, Mar 16

**X/Twitter** — CO
> Sunday morning vinyl. What''s on the turntable?
>
> I''m listening to Marvin Gaye — What''s Going On. Still sounds like it
> was recorded yesterday.

**Facebook** — CO
> Sunday morning question:
>
> You''re cleaning the house. What album goes on the turntable?
>
> Something with energy? Something mellow? Tell me your cleaning day
> album.

---

### Day 36 — Monday, Mar 17

**Instagram** — SS
> Store Spotlight: Plan 9 Music in Richmond, VA.
>
> 752 reviews and counting. One of the most respected record stores on
> the East Coast. They''ve been the heartbeat of Richmond''s music scene
> for decades. Massive selection, knowledgeable staff, and the kind of
> store that makes you drive an hour out of your way.
>
> If you''re in the DMV or anywhere near Richmond, this is a must-visit.
>
> recordstops.com/stores/virginia/plan-9-music
>
> #recordstops #vinylrecords #recordstore #richmondva #rva
> #plan9music #vinylcommunity #cratedigging #indierecordstore
> #supportlocal

Image: Use Plan 9 Music photo from R2 (`stores/462/0.jpg`)

**X/Twitter** — SS
> Plan 9 Music in Richmond, VA. 752 reviews. One of the most respected
> record stores on the East Coast.
>
> If you''re anywhere near RVA, go.
>
> recordstops.com/stores/virginia/plan-9-music

---

### Day 37 — Tuesday, Mar 18

**Instagram** — AW
> Album of the Week: Pink Floyd — The Dark Side of the Moon (1973)
>
> You''ve probably heard this album a hundred times. But on vinyl, with
> headphones, lights off? It''s a completely different experience. The
> transitions between tracks are seamless. The bass on "Money" shakes
> your chest. The heartbeat at the end of "Eclipse" fades like someone
> walking out of the room.
>
> This is the album that sells turntables. If you''re buying your first
> record player, this should be sitting next to it.
>
> #recordstops #vinylrecords #pinkfloyd #darksideofthemoon #progrock
> #vinylcollection #nowspinning #vinyloftheday #classicvinyl
> #albumoftheweek

Image prompt: `A moody close-up of a vinyl record spinning on a turntable with a prism of light casting a rainbow across the frame, dark room, single warm light source, atmospheric and cinematic, 4:5 aspect ratio`

**Facebook** — SS
> Plan 9 Music in Richmond, VA is one of the most well-known independent
> record stores on the East Coast. Over 750 Google reviews with a stellar
> rating.
>
> If you''re in the Richmond area, you already know. If you haven''t been
> yet, add it to the list.
>
> recordstops.com/stores/virginia/plan-9-music

---

## Week 6: Mar 19-25

### Day 38 — Wednesday, Mar 19

**Instagram** — CG
> Greenville, SC. The upstate''s rising sound.
>
> Horizon Records has been open since 1975 — the oldest record store in
> South Carolina. Pharmacy Records and Cabin Floor Records round out a
> downtown scene that punches above its weight.
>
> Our Greenville guide has stores, venues, and a full itinerary:
> recordstops.com/cities/greenville
>
> #recordstops #greenvillesc #vinylrecords #recordstore #greenville
> #vinylcommunity #cratedigging #horizonrecords #upstatesc
> #indierecordstore

Image: Use Greenville city guide hero from R2 (`social/city-greenville.png`)

**X/Twitter** — CG
> Greenville, SC: Home of Horizon Records, open since 1975. The oldest
> record store in South Carolina.
>
> Our full Greenville guide: recordstops.com/cities/greenville

**Facebook** — CG
> Greenville, SC has a vinyl scene that doesn''t get enough credit.
>
> Horizon Records (open since 1975), Pharmacy Records, Cabin Floor
> Records. Three solid stores plus great live music venues.
>
> Full guide: recordstops.com/cities/greenville

---

### Day 39 — Thursday, Mar 20

**Facebook** — CO
> First day of spring. Time for a road trip.
>
> If you could plan a record store road trip hitting 3 stores in one
> day, which 3 would you pick?
>
> Doesn''t have to be stores on RecordStops (but it should be).

**X/Twitter** — CO
> First day of spring. Perfect weather for a crate digging road trip.
>
> If you could hit 3 record stores in one day, which 3 are you picking?

---

### Day 40 — Friday, Mar 21

**Instagram** — NR
> New Vinyl Friday. Spring is officially here and the releases keep
> coming.
>
> See what dropped today: recordstops.com/new-releases
>
> Find a store to visit this weekend: recordstops.com/stores
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #cratedigging #vinyllife #springvinyl

Image prompt: `Bright spring-themed image of vinyl records displayed in a sunny record store window, warm natural daylight, flowers in a pot nearby, inviting storefront vibes, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl Friday. Spring releases are here.
>
> What are you picking up this weekend?
> recordstops.com/new-releases

**Facebook** — NR
> Happy first day of spring. New vinyl on the shelves.
>
> This week''s releases + what''s coming next:
> recordstops.com/new-releases
>
> Perfect weather for a record store trip: recordstops.com/stores

---

### Day 41 — Saturday, Mar 22

**Instagram** — CO
> Tax refund season is here. What''s the first record you''re buying
> with yours?
>
> Don''t be responsible. Buy the grail.
>
> #recordstops #vinylrecords #vinylcollection #taxrefund
> #vinylcommunity #cratedigging #treatyourself #vinyllife
> #recordcollector #newvinyl

Image prompt: `A person fanning out cash/dollar bills next to a small stack of vinyl records on a store counter, humorous and lighthearted vibe, bright store lighting, playful composition, 4:5 aspect ratio`

---

### Day 42 — Sunday, Mar 23

**X/Twitter** — VT
> Vinyl tip: "180 gram" doesn''t automatically mean better sound. It
> means the vinyl is heavier and more durable.
>
> The mastering matters more than the weight. A great master on standard
> vinyl beats a bad master on 180g every time.

**Facebook** — CO
> Honest question: do you organize your records alphabetically, by
> genre, or just chaos?
>
> No wrong answer. (Alphabetical by genre is the right answer.)

---

### Day 43 — Monday, Mar 24

**Instagram** — SS
> Store Spotlight: Harvest Records in Asheville, NC.
>
> 4.8 stars with 636 reviews. Right in the heart of downtown Asheville,
> surrounded by music venues and breweries. The kind of store where the
> staff''s recommendations are as good as the bins.
>
> If you''re visiting Asheville for the music or the mountains, Harvest
> is the record store you hit.
>
> recordstops.com/stores/north-carolina/harvest-records
>
> #recordstops #vinylrecords #recordstore #ashevillenc #asheville
> #harvestrecords #vinylcommunity #cratedigging #indierecordstore
> #blueridgemountains

Image: Use Harvest Records photo from R2 (`stores/276/0.jpg`)

**X/Twitter** — SS
> Harvest Records in Asheville, NC. 4.8 stars. 636 reviews. Downtown
> Asheville, surrounded by venues and breweries.
>
> If you''re in Asheville, this is where you go.
>
> recordstops.com/stores/north-carolina/harvest-records

---

### Day 44 — Tuesday, Mar 25

**Instagram** — AW
> Album of the Week: Marvin Gaye — What''s Going On (1971)
>
> This album changed everything. It was the first time a major label
> artist used a full album to say something real. War, poverty, ecology,
> God. And it sounds gorgeous. The strings on "Mercy Mercy Me" still give
> me chills.
>
> Motown didn''t want to release it. Marvin insisted. It became the
> greatest soul album ever made.
>
> If you own one soul record, it should be this one.
>
> #recordstops #vinylrecords #marvingaye #whatsgoingon #soulmusic
> #vinylcollection #nowspinning #vinyloftheday #classicvinyl
> #albumoftheweek

Image prompt: `A warm, intimate photograph of a soul vinyl record on a turntable, soft amber light, a cup of coffee nearby, morning light through window blinds casting horizontal shadows, contemplative mood, 4:5 aspect ratio`

**Facebook** — SS
> Harvest Records in Asheville is one of those stores that makes you
> understand why people love record stores.
>
> 4.8 stars, 636 reviews, right in downtown Asheville. Go for the
> records, stay for the staff recommendations.
>
> recordstops.com/stores/north-carolina/harvest-records

---

## Week 7: Mar 26 — Apr 1

### Day 45 — Wednesday, Mar 26

**Instagram** — CG
> Chapel Hill, NC. Where indie rock grew up.
>
> Superchunk. Merge Records. Cat''s Cradle. This college town punches
> so far above its weight in music history it''s ridiculous.
>
> Schoolkids Records has been the go-to shop for UNC students and locals
> for years. Our guide covers the stores, the venues, and the full
> history.
>
> recordstops.com/cities/chapel-hill
>
> #recordstops #chapelhillmusic #vinylrecords #recordstore #chapelhill
> #vinylcommunity #cratedigging #superchunk #mergerecords
> #indierecordstore

Image: Use Chapel Hill city guide hero from R2 (`social/city-chapel-hill.png`)

**X/Twitter** — CG
> Chapel Hill gave us Superchunk, Merge Records, and a college-town
> vinyl scene that influenced indie rock for 30 years.
>
> Our guide: recordstops.com/cities/chapel-hill

**Facebook** — CG
> Chapel Hill is one of those towns where the music history is way bigger
> than the population.
>
> Merge Records. Cat''s Cradle. Schoolkids Records. If you''re in the
> Triangle, our Chapel Hill guide covers all of it.
>
> recordstops.com/cities/chapel-hill

---

### Day 46 — Thursday, Mar 27

**Facebook** — CO
> Name an album where Side B is better than Side A.
>
> This is harder than it sounds. Most albums front-load the hits.
> But some records save the best for the flip.
>
> I''ll go first: Led Zeppelin IV. "Stairway to Heaven" starts Side B.

**X/Twitter** — CO
> Name an album where Side B is better than Side A.
>
> Led Zeppelin IV. "Stairway to Heaven" starts Side B. Good luck beating that.

---

### Day 47 — Friday, Mar 28

**Instagram** — NR
> New Vinyl Friday. Four weeks until Record Store Day.
>
> Start your wishlist now. See what''s already out and what''s coming:
> recordstops.com/new-releases
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #recordstoreday #rsd2026 #cratedigging #vinyllife

Image prompt: `Vinyl records being unpacked from a shipping box in a record store back room, brown packing paper, colorful album covers being revealed, behind-the-scenes store atmosphere, warm lighting, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl out today. And Record Store Day is exactly 3 weeks away.
>
> Start planning: recordstops.com/new-releases

**Facebook** — NR
> Friday. New vinyl. And Record Store Day is just 3 weeks away.
>
> Check this week''s releases: recordstops.com/new-releases
>
> Start planning your RSD store visits now. Find stores near you:
> recordstops.com/stores

---

### Day 48 — Saturday, Mar 29

**Instagram** — VT
> The most common mistake new vinyl collectors make: buying reissues
> without checking who did the mastering.
>
> Not all reissues are equal. Some are pressed from original analog
> masters. Some are pressed from digital files. The difference is night
> and day.
>
> Quick tip: look for "AAA" on the packaging. That means analog
> recording, analog mixing, analog mastering. That''s the gold standard.
>
> #recordstops #vinylrecords #vinylcollection #vinyltips
> #vinylcommunity #audiophile #analogvsdigital #vinyllife
> #recordcollector #cratedigging

Image prompt: `Close-up of a vinyl record inner sleeve showing production credits and mastering information, magnifying glass over the text, warm desk lamp lighting, educational and informative feel, 4:5 aspect ratio`

---

### Day 49 — Sunday, Mar 30

**X/Twitter** — CO
> Unpopular opinion: the record store experience is better alone than
> with a group.
>
> You need silence to flip through bins. Fight me.

**Facebook** — CO
> Sunday question: are you a morning vinyl person or a late night
> vinyl person?
>
> Morning crew says there''s nothing better than coffee and a record.
> Night crew says vinyl is for 11pm with the lights low.
>
> Which side are you on?

---

### Day 50 — Monday, Mar 31

**Instagram** — SS
> Store Spotlight: CD Cellar in Falls Church, VA.
>
> Don''t let the name fool you. CD Cellar has one of the best vinyl
> selections in the DMV. 575 reviews and a loyal following of DC-area
> collectors who know this is where the good stuff lives.
>
> Tucked into a strip mall in Falls Church, it''s the kind of store you
> drive past a dozen times before someone tells you about it. Then you
> never stop going back.
>
> recordstops.com/stores/virginia/cd-cellar
>
> #recordstops #vinylrecords #recordstore #fallschurchva #dmvmusic
> #cdcellar #vinylcommunity #cratedigging #novarecordstores
> #indierecordstore

Image: Use CD Cellar photo from R2 (`stores/432/0.jpg`)

**X/Twitter** — SS
> CD Cellar in Falls Church, VA. Don''t let the name fool you. One of the
> best vinyl selections in the entire DMV.
>
> 575 reviews. Loyal local following.
>
> recordstops.com/stores/virginia/cd-cellar

---

### Day 51 — Tuesday, Apr 1

**Instagram** — AW
> Album of the Week: Radiohead — OK Computer (1997)
>
> This album predicted the future. "Fitter Happier." "Paranoid Android."
> "No Surprises." It all sounds more relevant now than it did in ''97.
>
> On vinyl, the production reveals itself. The layers in "Lucky." The
> space in "Let Down." You hear the room the band was in, not just the
> final mix.
>
> If you grew up in the 90s, you already own this. If you didn''t, this
> is the introduction to that decade you need.
>
> #recordstops #vinylrecords #radiohead #okcomputer #altrock
> #vinylcollection #nowspinning #vinyloftheday #90smusic
> #albumoftheweek

Image prompt: `A 90s-inspired moody photograph of a vinyl record on a turntable in a dimly lit room, blue-tinted light from a computer monitor in the background, alienated suburban aesthetic, slightly unsettling, 4:5 aspect ratio`

**Facebook** — AW
> Album of the Week: Radiohead — OK Computer (1997)
>
> Sounded like the future in 1997. Sounds like the present now.
> On vinyl, the production details you miss on streaming come through
> in layers.
>
> The 90s vinyl renaissance favorite. If you haven''t picked this one up
> yet, now''s the time.

---

## Week 8: Apr 2-8

### Day 52 — Wednesday, Apr 2

**Instagram** — CG
> Durham, NC. Bull City vinyl.
>
> Bull City Records. Nice Price Books and Records. A city with a music
> scene that''s been building for years, right next to Chapel Hill and
> Raleigh.
>
> If you''re doing a Triangle record store crawl, Durham is a mandatory
> stop. Our guide has everything you need:
> recordstops.com/cities/durham
>
> #recordstops #durhammusic #vinylrecords #recordstore #durhamnc
> #bullcity #vinylcommunity #cratedigging #trianglemusic
> #indierecordstore

Image: Use Durham city guide hero from R2 (`social/city-durham.png`)

**X/Twitter** — CG
> Durham''s vinyl scene doesn''t get enough credit. Bull City Records,
> Nice Price Books — solid stores in a city with serious music culture.
>
> Our Durham guide: recordstops.com/cities/durham

**Facebook** — CG
> Durham, NC — right in the heart of the Triangle, with a growing
> vinyl scene.
>
> Bull City Records, Nice Price Books, and more. If you''re doing a
> Triangle record crawl, Durham has to be on the list.
>
> Full guide: recordstops.com/cities/durham

---

### Day 53 — Thursday, Apr 3

**Facebook** — CO
> We''re 15 days from Record Store Day (April 18).
>
> What''s on your RSD wishlist this year?
>
> Drop the releases you''re hunting for. Let''s see who''s going after
> the same ones.

**X/Twitter** — RSD
> Record Store Day is 15 days away. April 18, 2026.
>
> What''s on your wishlist? What store are you hitting?
>
> Find RSD stores near you: recordstops.com/stores

---

### Day 54 — Friday, Apr 4

**Instagram** — RSD (pre-countdown begins)
> Record Store Day is 2 weeks away. April 18, 2026.
>
> This is the biggest day of the year for independent record stores.
> Exclusive releases. Early morning lines. The whole community shows up.
>
> Start planning now. Know which store you''re hitting. Check what''s
> dropping. Get there early.
>
> Find a store near you: recordstops.com/stores
>
> #recordstops #recordstoreday #rsd2026 #vinylrecords #vinylcommunity
> #indierecordstore #supportlocal #cratedigging #vinyllife
> #exclusivereleases

Image prompt: `Bold graphic design showing "RECORD STORE DAY APRIL 18" in large retro typography, vinyl record motif, warm orange and black color scheme matching RecordStops brand, countdown energy, 4:5 aspect ratio`

**X/Twitter** — RSD
> 2 weeks until Record Store Day 2026.
>
> April 18. Independent stores only. Exclusive releases.
>
> Find your store: recordstops.com/stores

**Facebook** — RSD
> Mark your calendar: Record Store Day is April 18, 2026.
>
> This is the biggest day of the year for independent record stores.
> Exclusive releases you can''t get anywhere else. Lines out the door
> before opening. The whole vinyl community shows up.
>
> Start planning now. Find stores near you: recordstops.com/stores

---

### Day 55 — Saturday, Apr 5

**Instagram** — RSD
> How to prepare for Record Store Day like a pro:
>
> 1. Check the official RSD release list when it drops. Mark what you
>    want. Prioritize.
> 2. Call your store. Ask what they''re getting. Not all stores get
>    every release.
> 3. Get there early. Popular releases sell out in the first hour.
> 4. Bring cash. Some stores move faster with cash on RSD.
> 5. Enjoy it. This is the one day a year where the line outside a
>    record store is part of the experience.
>
> 13 days to go.
>
> #recordstops #recordstoreday #rsd2026 #vinylrecords #rsdtips
> #vinylcommunity #indierecordstore #supportlocal #cratedigging
> #vinyllife

Image prompt: `Illustrated infographic showing "RSD PREP GUIDE" with 5 numbered tips, record store day themed icons, retro color palette with orange and black, clean and shareable design, 4:5 aspect ratio`

---

### Day 56 — Sunday, Apr 6

**X/Twitter** — RSD
> Record Store Day tip: call your local store this week and ask what
> RSD releases they''re stocking.
>
> Not every store gets every release. Planning ahead saves you from
> showing up at 7am for something they never had.
>
> Find stores: recordstops.com/stores

**Facebook** — RSD
> Record Store Day is less than 2 weeks away.
>
> Pro tip: call your local store this week and ask what exclusive
> releases they''re carrying. Not every store gets everything. Planning
> ahead saves disappointment.
>
> Find stores near you: recordstops.com/stores

---

### Day 57 — Monday, Apr 7

**Instagram** — SS
> Store Spotlight: Repo Record in Charlotte, NC.
>
> Charlotte has a growing vinyl scene and Repo Record is right in the
> middle of it. Gritty, real, and packed with records that other stores
> don''t carry. If you like digging for the unexpected, this is your
> spot.
>
> recordstops.com/stores/north-carolina/repo-record
>
> #recordstops #vinylrecords #recordstore #charlottenc #charlotte
> #reporecord #vinylcommunity #cratedigging #indierecordstore
> #supportlocal

Image: Use Repo Record photo from R2 (`stores/289/0.jpg`)

**X/Twitter** — SS
> Repo Record in Charlotte, NC. Gritty, real, and packed with vinyl
> other stores don''t carry. Charlotte''s underground pick.
>
> recordstops.com/stores/north-carolina/repo-record

---

### Day 58 — Tuesday, Apr 8

**Instagram** — AW
> Album of the Week: A Tribe Called Quest — The Low End Theory (1991)
>
> Jazz samples over boom-bap drums. "Excursions." "Check the Rhime."
> "Scenario." This album is the blueprint for jazz-rap, and on vinyl
> the bass literally shakes the room.
>
> Ron Carter played upright bass on this record. A jazz legend on a
> hip-hop album. It shouldn''t have worked. It became one of the greatest
> albums ever made.
>
> #recordstops #vinylrecords #atribecalledquest #lowendtheory
> #hiphopvinyl #vinylcollection #nowspinning #jazzrap #vinyloftheday
> #albumoftheweek

Image prompt: `An overhead shot of a hip-hop vinyl record on a turntable next to an upright bass leaning against a wall, warm jazz club lighting, wood floor, fusion of jazz and hip-hop aesthetics, 4:5 aspect ratio`

**Facebook** — AW
> A Tribe Called Quest — The Low End Theory (1991)
>
> Jazz samples. Boom-bap drums. Ron Carter on upright bass. This album
> invented a genre and still sounds ahead of its time.
>
> If you own one hip-hop album on vinyl, make it this one.

---

## Week 9: Apr 9-15 (Pre-Record Store Day)

### Day 59 — Wednesday, Apr 9

**Instagram** — CG
> Greensboro, NC. More vinyl than you''d expect.
>
> Remember When Records has over 150,000 albums. Dictator Records is a
> local favorite. The Greensboro scene is quietly one of the best in
> North Carolina.
>
> Our guide: recordstops.com/cities/greensboro
>
> #recordstops #greensboromusic #vinylrecords #recordstore #greensboro
> #vinylcommunity #cratedigging #triadmusic #indierecordstore
> #northcarolina

Image: Use Greensboro city guide hero from R2 (`social/city-greensboro.png`)

**X/Twitter** — CG
> Greensboro, NC: Remember When Records has 150,000+ albums. Dictator
> Records is a local staple.
>
> Our Greensboro guide: recordstops.com/cities/greensboro

**Facebook** — CG
> Greensboro, NC has a vinyl scene that flies under the radar.
>
> Remember When Records (150,000+ albums) and Dictator Records are both
> worth the trip. Our guide covers everything.
>
> recordstops.com/cities/greensboro

---

### Day 60 — Thursday, Apr 10

**Facebook** — RSD
> 8 days until Record Store Day.
>
> What store are you going to? Have you checked if they''re carrying the
> releases you want?
>
> Find stores near you: recordstops.com/stores

**X/Twitter** — RSD
> Record Store Day is 8 days away. Have you called your store yet?
>
> Not all stores get every release. Find your store:
> recordstops.com/stores

---

### Day 61 — Friday, Apr 11

**Instagram** — RSD
> One week until Record Store Day. April 18.
>
> This is the single biggest day for independent record stores all year.
> Exclusive vinyl releases that only come out once. Lines before sunrise.
> The community showing up together.
>
> Do you know which store you''re going to? Find one:
> recordstops.com/stores
>
> #recordstops #recordstoreday #rsd2026 #vinylrecords #oneweek
> #vinylcommunity #indierecordstore #supportlocal #exclusivevinyl
> #cratedigging

Image prompt: `Energetic countdown graphic showing "1 WEEK" in bold retro typography with a vinyl record as the "0", record store day themed, orange and black brand colors, excitement and urgency, 4:5 aspect ratio`

**X/Twitter** — RSD
> ONE WEEK. Record Store Day 2026 is next Saturday.
>
> Find your store now: recordstops.com/stores

**Facebook** — RSD
> One week until Record Store Day (April 18).
>
> If you haven''t figured out your game plan, now''s the time.
> Which stores are you hitting? Which releases are you after?
>
> Find stores near you: recordstops.com/stores

---

### Day 62 — Saturday, Apr 12

**Instagram** — RSD
> What''s on your Record Store Day 2026 wishlist?
>
> Drop the releases you''re hoping to grab next Saturday. Let''s see
> what the community is chasing.
>
> Every year there''s that one release everyone wants and nobody can find.
> What''s this year''s white whale?
>
> #recordstops #recordstoreday #rsd2026 #rsdwishlist #vinylrecords
> #vinylcommunity #indierecordstore #exclusivevinyl #cratedigging
> #vinyllife

Image prompt: `A person writing a handwritten list on paper next to a turntable, "RSD WISHLIST" visible at the top, pen in hand, warm cozy lighting, anticipation and planning mood, 4:5 aspect ratio`

---

### Day 63 — Sunday, Apr 13

**X/Twitter** — RSD
> 5 days until Record Store Day.
>
> Reminder: get there early. The best stuff goes fast.
>
> Find a store near you: recordstops.com/stores

**Facebook** — RSD
> 5 days until Record Store Day 2026.
>
> We love seeing the community show up for indie stores. This is the
> day that keeps small stores alive.
>
> Have you picked your store yet? recordstops.com/stores

---

### Day 64 — Monday, Apr 14

**Instagram** — SS
> Store Spotlight: Schoolkids Records in Raleigh, NC.
>
> One of the longest-running record stores in the country. The Triangle''s
> first stop for vinyl. They''ve won the Independent Weekly''s Best Record
> Store award 15 years in a row.
>
> Heading to Raleigh for Record Store Day this Saturday? Schoolkids
> should be your first stop.
>
> recordstops.com/stores/north-carolina/schoolkids-records-raleigh
>
> #recordstops #vinylrecords #recordstore #raleighnc #raleigh
> #schoolkidsrecords #vinylcommunity #recordstoreday #rsd2026
> #indierecordstore

Image: Use Schoolkids Records photo from R2 (`stores/13/0.jpg`)

**X/Twitter** — SS
> Schoolkids Records in Raleigh, NC. One of the longest-running record
> stores in the country. 15 straight Best Record Store awards.
>
> Perfect RSD pick if you''re in the Triangle.
>
> recordstops.com/stores/north-carolina/schoolkids-records-raleigh

---

### Day 65 — Tuesday, Apr 15

**Instagram** — AW
> Album of the Week: Joni Mitchell — Blue (1971)
>
> This is as intimate as music gets. No production hiding behind. Just
> voice, piano, guitar, and lyrics that cut to the bone.
>
> "A Case of You." "River." "California." On vinyl, you feel like
> you''re sitting in the room with her. The needle drops and the world
> gets smaller.
>
> Perfect Record Store Day week pick. Grab this if you see it Saturday.
>
> #recordstops #vinylrecords #jonimitchell #blue #folkmusic
> #vinylcollection #nowspinning #vinyloftheday #singersongwriter
> #albumoftheweek

Image prompt: `A intimate, soft-lit photograph of a folk vinyl record on a turntable with a window showing rain outside, warm blanket draped over a chair nearby, contemplative and quiet, acoustic guitar leaning against the wall, 4:5 aspect ratio`

**Facebook** — RSD
> 3 days. Record Store Day is Saturday.
>
> We''ll be sharing stores and highlights all week. In the meantime,
> find a store near you and make your plan:
>
> recordstops.com/stores

---

## Week 10: Apr 16-22 (RECORD STORE DAY WEEK)

### Day 66 — Wednesday, Apr 16

**Instagram** — RSD
> Record Store Day is THIS SATURDAY. April 18.
>
> 2 days away. Here''s your checklist:
>
> Know your store. Know what you want. Get there early.
>
> If you''re in NC, SC, VA, MD, or DC — we''ve got 296 stores. Find
> the one closest to you: recordstops.com/stores
>
> #recordstops #recordstoreday #rsd2026 #vinylrecords #2daysaway
> #vinylcommunity #indierecordstore #supportlocal #cratedigging
> #vinyllife

Image prompt: `Bold graphic "THIS SATURDAY" with Record Store Day branding, vinyl record graphic, urgent and exciting energy, countdown style, RecordStops orange and black colors, 4:5 aspect ratio`

**X/Twitter** — RSD
> Record Store Day is THIS SATURDAY.
>
> 296 stores across 5 states. Find yours:
> recordstops.com/stores

**Facebook** — RSD
> 2 days away. Record Store Day is this Saturday, April 18.
>
> Do you know which store you''re going to? We''ve got 296 independent
> record stores across NC, SC, VA, MD, and DC.
>
> Find your store: recordstops.com/stores

---

### Day 67 — Thursday, Apr 17

**Facebook** — RSD
> Tomorrow is Record Store Day Eve. Saturday is the day.
>
> Some stores open early. Some have live music. Some have free coffee
> in line.
>
> Call your local store tonight and find out what they have planned.
>
> recordstops.com/stores

**X/Twitter** — RSD
> Record Store Day is TOMORROW.
>
> Which store are you hitting? What''s the #1 release on your list?
>
> recordstops.com/stores

---

### Day 68 — Friday, Apr 18 — RECORD STORE DAY

**Instagram** (Morning — 9:00 AM) — RSD
> HAPPY RECORD STORE DAY 2026!
>
> This is it. The biggest day of the year for independent record stores.
> Right now, people are lining up outside their favorite shops. Exclusive
> releases are on the shelves. The community is showing up.
>
> Whether you''re grabbing one record or filling a bag, today is about
> supporting the stores that keep vinyl culture alive.
>
> Find a store near you: recordstops.com/stores
>
> Show us what you grab. Tag @recordstops.
>
> #recordstops #recordstoreday #rsd2026 #vinylrecords #happyrsd
> #vinylcommunity #indierecordstore #supportlocal #exclusivevinyl
> #cratedigging

Image prompt: `Celebratory Record Store Day image with "HAPPY RECORD STORE DAY 2026" in bold typography, vinyl records, confetti, record store storefront, festive energy, orange and black brand colors, 4:5 aspect ratio`

**Instagram** (Afternoon — 3:00 PM) — RSD
> How''s your Record Store Day going?
>
> What did you grab? Drop your haul in the comments.
>
> Whether it''s one record or twenty, today is about the experience.
> The line. The hunt. The find.
>
> #recordstops #recordstoreday #rsd2026 #rsdhaul #vinylrecords
> #vinylcommunity #indierecordstore #whatdidyouget #cratedigging
> #vinyllife

Image prompt: `A spread of vinyl records on a table, shopping bags from record stores visible, someone holding up an album cover proudly, bright celebratory lighting, Record Store Day energy, 4:5 aspect ratio`

**X/Twitter** (Morning) — RSD
> HAPPY RECORD STORE DAY 2026!
>
> Support your local independent record store today. Find one near you:
> recordstops.com/stores
>
> What did you grab? Show us.

**X/Twitter** (Afternoon) — RSD
> Record Store Day 2026 is happening right now.
>
> What did you find? What was already gone?
>
> Show us your haul.

**Facebook** — RSD
> HAPPY RECORD STORE DAY!
>
> The biggest day of the year for independent record stores is here.
> Lines out the door. Exclusive releases. The whole community showing up.
>
> If you''re out at a store right now, we want to see your haul. Drop
> your finds below.
>
> Find a store: recordstops.com/stores

---

### Day 69 — Saturday, Apr 19

**Instagram** — RSD (post-RSD)
> Record Store Day recap.
>
> Show us what you grabbed yesterday. Tag @recordstops or drop your
> haul in the comments.
>
> Every purchase supports an independent store. That''s what this is
> about.
>
> #recordstops #recordstoreday #rsd2026 #rsdhaul #vinylrecords
> #vinylcommunity #indierecordstore #showusyourhaul #cratedigging
> #vinyllife

Image prompt: `A collection of vinyl records spread out on a wooden floor, some still in shopping bags, RSD stickers visible, warm home lighting, satisfying haul display, 4:5 aspect ratio`

---

### Day 70 — Sunday, Apr 20

**X/Twitter** — RSD
> Missed Record Store Day? These stores are open every day. Independent
> record stores don''t just need your support one day a year.
>
> Find a store near you: recordstops.com/stores

**Facebook** — RSD
> If you missed Record Store Day, don''t worry. Every day is record store
> day if you want it to be.
>
> Independent record stores are open all year. Find one near you and
> go support it: recordstops.com/stores

---

### Day 71 — Monday, Apr 21

**Instagram** — SS
> Store Spotlight: Scratch N Spin in West Columbia, SC.
>
> 644 reviews. Packed with crates in a town most people drive through
> on the way to Columbia. Don''t sleep on this store. If you did Record
> Store Day at Papa Jazz, Scratch N Spin should be your next stop.
>
> recordstops.com/stores/south-carolina/scratch-n-spin
>
> #recordstops #vinylrecords #recordstore #westcolumbia #southcarolina
> #scratchnspin #vinylcommunity #cratedigging #indierecordstore
> #supportlocal

Image: Use Scratch N Spin photo from R2 (`stores/252/0.jpg`)

**X/Twitter** — SS
> Scratch N Spin in West Columbia, SC. 644 reviews. One of the most
> crate-packed stores in South Carolina.
>
> recordstops.com/stores/south-carolina/scratch-n-spin

---

### Day 72 — Tuesday, Apr 22

**Instagram** — AW
> Album of the Week: Nirvana — Nevermind (1991)
>
> The album that changed rock music overnight. On vinyl, "Smells Like
> Teen Spirit" hits like a wall. The quiet-loud dynamic that defined
> grunge was built for the format. Side A alone is worth the price.
>
> If you were alive in 1991, you remember where you were when you first
> heard this. If you weren''t, the vinyl pressing is still the best way
> to understand why it mattered.
>
> #recordstops #vinylrecords #nirvana #nevermind #grunge
> #vinylcollection #nowspinning #vinyloftheday #90srock
> #albumoftheweek

Image prompt: `A grunge-inspired photograph of a vinyl record on a turntable in a raw, slightly messy room, flannel shirt draped over a chair, warm tungsten lighting, 90s nostalgia aesthetic, 4:5 aspect ratio`

**Facebook** — CO
> Post-Record Store Day check-in:
>
> Did you go? What did you find? What was already gone by the time
> you got there?
>
> Every year there''s a story. Tell us yours.

---

## Week 11: Apr 23-29

### Day 73 — Wednesday, Apr 23

**Instagram** — CG
> Wilmington, NC. Beach town vinyl.
>
> A coastal city with a surprisingly deep music scene and record stores
> worth the drive. Yellowdog Discs and the Wilmington vinyl scene are
> waiting for your next beach trip.
>
> Our guide: recordstops.com/cities/wilmington
>
> #recordstops #wilmingtonmusic #vinylrecords #recordstore #wilmington
> #vinylcommunity #cratedigging #coastalcarolina #indierecordstore
> #northcarolina

Image: Use Wilmington city guide hero from R2 (`social/city-wilmington.png`)

**X/Twitter** — CG
> Wilmington, NC: beach town with a real vinyl scene. Record stores
> worth the drive.
>
> Our guide: recordstops.com/cities/wilmington

**Facebook** — CG
> Heading to Wilmington this spring? Check out the record stores
> while you''re there.
>
> Our guide covers the stores, the music scene, and why Wilmington is
> worth a stop for vinyl heads.
>
> recordstops.com/cities/wilmington

---

### Day 74 — Thursday, Apr 24

**Facebook** — CO
> Road trip season is here.
>
> What''s the best record store you''ve ever visited outside your home
> state? The one you tell everyone about.
>
> Looking for ideas for your next trip? Browse stores by state:
> recordstops.com/stores

**X/Twitter** — CO
> Spring road trip season. What''s the best record store you''ve visited
> outside your home state?
>
> Browse stores by state: recordstops.com/stores

---

### Day 75 — Friday, Apr 25

**Instagram** — NR
> New Vinyl Friday. Post-RSD, the releases keep coming.
>
> See what''s new this week: recordstops.com/new-releases
>
> Still riding the RSD high? Hit a store this weekend:
> recordstops.com/stores
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #cratedigging #vinyllife #springvinyl

Image prompt: `A sunny spring scene through a record store window, vinyl records visible inside, cherry blossom branch visible outside, warm inviting atmosphere, post-RSD energy, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl out today. Post-RSD releases hitting the shelves.
>
> recordstops.com/new-releases

**Facebook** — NR
> New vinyl Friday. The post-Record Store Day releases are here.
>
> Check what dropped: recordstops.com/new-releases
>
> Find a store: recordstops.com/stores

---

### Day 76 — Saturday, Apr 26

**Instagram** — VT
> Spring cleaning your vinyl collection? Here''s how to store your
> records properly:
>
> 1. Store vertically. Always. Never stack flat.
> 2. Keep them out of direct sunlight and away from heat.
> 3. Use inner sleeves. Poly-lined or MoFi-style anti-static.
> 4. Don''t pack too tight. Records need a little breathing room.
> 5. Clean before storing. A quick brush removes surface dust.
>
> Your records will last 50+ years if you treat them right.
>
> #recordstops #vinylrecords #vinylcollection #vinyltips #vinylcare
> #vinylcommunity #recordstorage #vinyllife #recordcollector
> #audiophile

Image prompt: `A well-organized vinyl record shelf with records stored vertically, warm home lighting, clean and orderly collection, some album covers facing outward as display, aspirational storage goals, 4:5 aspect ratio`

---

### Day 77 — Sunday, Apr 27

**X/Twitter** — BTS
> RecordStops is now the most comprehensive independent record store
> directory in the Southeast.
>
> 296 stores. 5 states. 16 city guides. Free tools. All independent,
> all verified.
>
> recordstops.com

**Facebook** — CO
> If you could only shop at one record store for the rest of your life,
> which one would it be?
>
> Rules: it has to be a store you''ve actually been to. No hypotheticals.
>
> Go.

---

### Day 78 — Monday, Apr 28

**Instagram** — SS
> Store Spotlight: AFK Books & Records in Virginia Beach, VA.
>
> Virginia Beach isn''t the first place you think of for record stores.
> That''s what makes AFK special. A dedicated vinyl spot in a beach city,
> with a loyal following of collectors.
>
> If you''re at the coast, don''t skip this one.
>
> recordstops.com/stores/virginia/afk-books-records
>
> #recordstops #vinylrecords #recordstore #virginiabeach #hampton
> #afkbooks #vinylcommunity #cratedigging #beachcityvinyl
> #indierecordstore

Image: Use AFK Books & Records photo from R2 (`stores/477/0.jpg`)

**X/Twitter** — SS
> AFK Books & Records in Virginia Beach, VA. A real vinyl shop in a
> beach city. Not what you expect to find, but exactly what you need.
>
> recordstops.com/stores/virginia/afk-books-records

---

### Day 79 — Tuesday, Apr 29

**Instagram** — AW
> Album of the Week: D''Angelo — Voodoo (2000)
>
> This is a deep cut pick. If you know, you know. If you don''t, you''re
> about to find your new favorite album.
>
> "Untitled (How Does It Feel)" on vinyl is a religious experience.
> The bass on "Playa Playa." The drums throughout. Questlove played on
> this record and you can feel every hit.
>
> Vinyl heads love this album because it was made by people who
> understood sound. Not just music. Sound.
>
> #recordstops #vinylrecords #dangelo #voodoo #neosoul
> #vinylcollection #nowspinning #vinyloftheday #questlove
> #albumoftheweek

Image prompt: `A moody, dimly-lit photograph of a neo-soul vinyl record on a turntable, purple and amber lighting, candles in the background, velvet texture nearby, sensual and smooth aesthetic, 4:5 aspect ratio`

**Facebook** — AW
> D''Angelo — Voodoo (2000)
>
> If you haven''t heard this album on vinyl, you''re missing the full
> experience. Questlove on drums. The bass rattles the room.
>
> The deep cut pick for vinyl heads. If you know, you know.

---

## Week 12: Apr 30 — May 10 (Final Week + Mother''s Day)

### Day 80 — Wednesday, Apr 30

**Instagram** — CG
> Winston-Salem, NC. Where tradition meets new sound.
>
> A city with deep roots in music, from old-time Appalachian traditions
> to a modern arts scene. Our guide covers the record stores, venues,
> and everything that makes Winston-Salem worth visiting with vinyl in
> mind.
>
> recordstops.com/cities/winston-salem
>
> #recordstops #winstonsalem #vinylrecords #recordstore #wsnc
> #vinylcommunity #cratedigging #triadmusic #indierecordstore
> #northcarolina

Image: Use Winston-Salem city guide hero from R2 (`social/city-winston-salem.png`)

**X/Twitter** — CG
> Winston-Salem: deep musical roots and a growing vinyl scene.
>
> Our guide: recordstops.com/cities/winston-salem

**Facebook** — CG
> Winston-Salem, NC — tradition meets new sound.
>
> Music roots that go deep and a vinyl scene that''s growing. Our guide
> covers the stores and the culture.
>
> recordstops.com/cities/winston-salem

---

### Day 81 — Thursday, May 1

**Facebook** — CO
> Happy May. The best month for road trips.
>
> If you could plan a 3-day record store road trip through the Southeast,
> what''s your route?
>
> We''ll help you map it: recordstops.com/stores

**X/Twitter** — CO
> May. Road trip season. What''s your 3-day crate digging route?
>
> 296 stores across 5 states to choose from: recordstops.com/stores

---

### Day 82 — Friday, May 2

**Instagram** — NR
> New Vinyl Friday. May is here and the releases are strong.
>
> See what dropped today: recordstops.com/new-releases
>
> Hit a store this weekend: recordstops.com/stores
>
> #recordstops #newvinyl #vinylrecords #newreleases #vinylcommunity
> #nowspinning #vinyloftheday #cratedigging #vinyllife #mayreleases

Image prompt: `Bright, colorful flat-lay of new vinyl records on a clean surface, spring flowers nearby, fresh and energetic spring vibes, modern and clean composition, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl Friday. May releases are here.
>
> recordstops.com/new-releases

**Facebook** — NR
> Happy Friday. New vinyl on the shelves for May.
>
> See what''s new: recordstops.com/new-releases
> Find a store: recordstops.com/stores

---

### Day 83 — Saturday, May 3

**Instagram** — CO
> Summer is coming. What''s your "windows down, driving to a record
> store" album?
>
> The album you put on when you''re on the road heading somewhere good.
>
> #recordstops #vinylrecords #vinylcollection #roadtripmusic
> #vinylcommunity #cratedigging #summervinyl #vinyllife
> #recordcollector #drivingmusic

Image prompt: `A car passenger holding a vinyl record out the window with a scenic road in the background, warm golden hour light, road trip vibes, freedom and music aesthetic, 4:5 aspect ratio`

---

### Day 84 — Sunday, May 4

**X/Twitter** — VT
> Vinyl tip: if a record skips, it''s not always damaged.
>
> Try cleaning it first. Static, dust, and fingerprints cause most
> skipping. A carbon fiber brush before every play prevents 90% of
> issues.
>
> If it still skips after cleaning, check your stylus pressure.

**Facebook** — CO
> Sunday vinyl moment:
>
> What''s the one album you''ve bought the most copies of?
>
> Whether it''s because you wore it out, gave it away, or upgraded to
> a better pressing. We all have that one album we keep buying.

---

### Day 85 — Monday, May 5

**Instagram** — SS
> Store Spotlight: Screaming For Vintage in Pittsboro, NC.
>
> Small town. Big personality. Pittsboro isn''t where you''d expect to find
> a record store, and that''s exactly what makes Screaming For Vintage
> special. The owners are passionate, the vibe is welcoming, and the
> prices are fair.
>
> If you''re in the Triangle area and want a change of scenery, the
> drive to Pittsboro is worth it.
>
> recordstops.com/stores/north-carolina/screaming-for-vintage
>
> #recordstops #vinylrecords #recordstore #pittsboronc #pittsboro
> #screamingforvintage #vinylcommunity #cratedigging #smalltownvinyl
> #indierecordstore

Image: Use Screaming For Vintage photo from R2 (`stores/339/0.jpg`)

**X/Twitter** — SS
> Screaming For Vintage in Pittsboro, NC. Small town store with big
> personality. The drive from the Triangle is worth it.
>
> recordstops.com/stores/north-carolina/screaming-for-vintage

---

### Day 86 — Tuesday, May 6

**Instagram** — AW
> Album of the Week: The Beatles — Abbey Road (1969)
>
> The last album they recorded together. "Come Together." "Something."
> The entire Side B medley. On vinyl, the transitions in the medley are
> seamless. It was made for the format.
>
> If you''re looking for a Mother''s Day gift for someone who loves music,
> this is the safest and best bet. Everyone loves Abbey Road.
>
> #recordstops #vinylrecords #thebeatles #abbeyroad #classicrock
> #vinylcollection #nowspinning #vinyloftheday #mothersdaygift
> #albumoftheweek

Image prompt: `A warm, gift-giving themed photograph of a vinyl record wrapped with a bow on a table next to flowers and a Mother''s Day card, soft morning light, warm and heartfelt, 4:5 aspect ratio`

**Facebook** — AW
> The Beatles — Abbey Road (1969)
>
> The last album they recorded. The Side B medley is one of the greatest
> stretches of music ever put on vinyl.
>
> Mother''s Day is Sunday. This is the gift.

---

### Day 87 — Wednesday, May 7

**Instagram** — CG
> Fayetteville, NC. Military city with a vinyl heart.
>
> Fort Bragg''s hometown has a music scene that goes beyond what most
> people expect. Our guide covers the stores and the culture.
>
> recordstops.com/cities/fayetteville
>
> Bonus: check out our High Point guide too:
> recordstops.com/cities/high-point
>
> #recordstops #fayettevillemusic #vinylrecords #recordstore
> #fayettevillenc #vinylcommunity #cratedigging #militarycity
> #indierecordstore #northcarolina

Image: Use Fayetteville city guide hero from R2 (`social/city-fayetteville.png`)

**X/Twitter** — CG
> Fayetteville, NC: military city with a vinyl scene worth exploring.
>
> Our guide: recordstops.com/cities/fayetteville
> Plus High Point: recordstops.com/cities/high-point

**Facebook** — CG
> Two new city guides this week:
>
> Fayetteville, NC — military town with a music scene that surprises.
> High Point, NC — the furniture city has vinyl too.
>
> recordstops.com/cities/fayetteville
> recordstops.com/cities/high-point

---

### Day 88 — Thursday, May 8

**Facebook** — CO (Mother''s Day angle)
> Mother''s Day is Sunday.
>
> If your mom (or wife, or any woman in your life) loves music, vinyl
> is the gift. It''s personal. It''s thoughtful. It takes 30 seconds to
> figure out their favorite album and 5 minutes to find it at a local
> store.
>
> Find a store near you: recordstops.com/stores
>
> What album would your mom love on vinyl?

**X/Twitter** — CO
> Mother''s Day is Sunday. If she loves music, vinyl is the perfect gift.
>
> Go to your local record store. Find her favorite album. Done.
>
> recordstops.com/stores

---

### Day 89 — Friday, May 9

**Instagram** — NR (Mother''s Day angle)
> New Vinyl Friday. And tomorrow is the last day to grab a Mother''s Day
> gift from your local record store.
>
> Not sure what to get? Ask the staff. They''ll point you in the right
> direction. That''s what they''re there for.
>
> Find a store: recordstops.com/stores
>
> New releases this week: recordstops.com/new-releases
>
> #recordstops #newvinyl #vinylrecords #newreleases #mothersdaygift
> #vinylcommunity #nowspinning #lastminutegift #vinyllife
> #supportlocal

Image prompt: `A vinyl record in a gift bag with tissue paper and flowers, bright and warm Mother''s Day aesthetic, a handwritten card visible, clean and giftable presentation, 4:5 aspect ratio`

**X/Twitter** — NR
> New vinyl out today. And one more day to grab a vinyl gift for
> Mother''s Day.
>
> recordstops.com/new-releases
> recordstops.com/stores

**Facebook** — NR
> New vinyl Friday. And a reminder that Mother''s Day is Sunday.
>
> Local record stores have the perfect last-minute gift. Find one:
> recordstops.com/stores
>
> New releases: recordstops.com/new-releases

---

### Day 90 — Saturday, May 10 — Mother''s Day

**Instagram** — CO (Mother''s Day)
> Happy Mother''s Day.
>
> To every mom who introduced their kids to good music. Who had a record
> collection before it was cool again. Who put on Fleetwood Mac at every
> dinner party and Joni Mitchell on every road trip.
>
> Music runs in families. If you got it from your mom, thank her today.
>
> #recordstops #mothersday #vinylrecords #vinylcommunity #thankmom
> #musicfamily #vinyllife #recordcollector #sundayvinyl #momknowsbest

Image prompt: `Warm, heartfelt photograph of a mother and child looking through a vinyl record collection together, soft natural light, cozy home setting, intergenerational music bonding, 4:5 aspect ratio`

**Facebook** — CO
> Happy Mother''s Day from RecordStops.
>
> To every mom who raised their kids on good music. The collections
> we love started with the records our moms played.
>
> What album did your mom always have on? Tell us below.

**X/Twitter** — CO
> Happy Mother''s Day.
>
> What''s the album your mom always had on the turntable?

---

## Image Generation Summary

### AI-Generated Images Needed (~25)

| Date | Type | Subject | Prompt Summary |
|------|------|---------|----------------|
| Mar 14 | NR | New records stack | Stack of sealed vinyl on counter |
| Mar 15 | VT | Rare records tips | Collector flipping through bins in small-town store |
| Mar 18 | AW | Pink Floyd | Prism light on spinning turntable |
| Mar 22 | CO | Tax refund | Cash fanned out next to vinyl records |
| Mar 25 | AW | Marvin Gaye | Soul record on turntable, coffee, morning light |
| Mar 28 | NR | Record unpacking | Records unpacked from shipping box |
| Mar 29 | VT | Mastering tips | Inner sleeve close-up with magnifying glass |
| Apr 1 | AW | Radiohead | 90s moody turntable, blue computer light |
| Apr 4 | RSD | Countdown 2 weeks | "RECORD STORE DAY APRIL 18" bold typography |
| Apr 5 | RSD | Prep guide | Infographic with 5 RSD tips |
| Apr 8 | AW | Tribe Called Quest | Hip-hop vinyl next to upright bass |
| Apr 11 | RSD | 1 week countdown | "1 WEEK" bold countdown graphic |
| Apr 12 | RSD | Wishlist | Person writing RSD wishlist |
| Apr 15 | AW | Joni Mitchell | Folk vinyl with rainy window |
| Apr 16 | RSD | This Saturday | "THIS SATURDAY" bold graphic |
| Apr 18 AM | RSD | Happy RSD! | Celebratory RSD image |
| Apr 18 PM | RSD | RSD haul | Records spread on table with bags |
| Apr 19 | RSD | RSD recap | Vinyl spread on floor, haul display |
| Apr 22 | AW | Nirvana | Grunge room, flannel, turntable |
| Apr 25 | NR | Spring releases | Cherry blossom + record store window |
| Apr 26 | VT | Storage tips | Well-organized vinyl shelf |
| Apr 29 | AW | D''Angelo | Neo-soul moody turntable, candles |
| May 2 | NR | May releases | Bright flat-lay with spring flowers |
| May 3 | CO | Road trip album | Record held out car window |
| May 6 | AW | Beatles gift | Vinyl wrapped with bow, Mother''s Day |
| May 9 | NR | Mother''s Day gift | Vinyl in gift bag with flowers |
| May 10 | CO | Mother''s Day | Mom and child looking through records |

### City Guide Images (convert from webp, upload to R2)

| City | Source | R2 Path |
|------|--------|---------|
| Columbia | public/cities/columbia.webp | social/city-columbia.png |
| Greenville | public/cities/greenville.webp | social/city-greenville.png |
| Chapel Hill | public/cities/chapel-hill.webp | social/city-chapel-hill.png |
| Durham | public/cities/durham.webp | social/city-durham.png |
| Greensboro | public/cities/greensboro.webp | social/city-greensboro.png |
| Wilmington | public/cities/wilmington.webp | social/city-wilmington.png |
| Winston-Salem | public/cities/winston-salem.webp | social/city-winston-salem.png |
| Fayetteville | public/cities/fayetteville.webp | social/city-fayetteville.png |
| High Point | public/cities/high-point.webp | social/city-high-point.png |

### Store Photos (already on R2)

| Store | R2 Path |
|-------|---------|
| Plan 9 Music | stores/462/0.jpg |
| Harvest Records | stores/276/0.jpg |
| CD Cellar | stores/432/0.jpg |
| Repo Record | stores/289/0.jpg |
| Schoolkids Records | stores/13/0.jpg |
| Scratch N Spin | stores/252/0.jpg |
| AFK Books & Records | stores/477/0.jpg |
| Screaming For Vintage | stores/339/0.jpg |

---

## R2 Upload Commands (City Hero Images)

```bash
npx wrangler r2 object put "recordstops-images/social/city-columbia.png" --file="data/social-images/cities/city-columbia.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-greenville.png" --file="data/social-images/cities/city-greenville.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-chapel-hill.png" --file="data/social-images/cities/city-chapel-hill.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-durham.png" --file="data/social-images/cities/city-durham.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-greensboro.png" --file="data/social-images/cities/city-greensboro.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-wilmington.png" --file="data/social-images/cities/city-wilmington.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-winston-salem.png" --file="data/social-images/cities/city-winston-salem.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-fayetteville.png" --file="data/social-images/cities/city-fayetteville.png" --remote
npx wrangler r2 object put "recordstops-images/social/city-high-point.png" --file="data/social-images/cities/city-high-point.png" --remote
```

---

## Notes for GHL Scheduling

- **Copy/paste** each post directly into GHL Social Planner
- **Hashtags** are included in IG captions — GHL will post them inline
- **Images from R2:** Store photos at `pub-6a29216cfc6b4a8d8657f0e9c3e7d857.r2.dev/stores/{id}/0.jpg`
- **City guide images:** Upload converted PNGs to R2 social/ path
- **Generated images:** Use the prompts above with Gemini API
- **X/Twitter** does not connect to GHL — post manually
- Record Store Day (Apr 18) has extra posts (morning + afternoon IG, 2x Twitter)
- Mother''s Day (May 10) has vinyl gift angle across all platforms
', 20, 'site-recordstore-directory/marketing/60-day-content-calendar.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'LAUNCH KIT', '# RecordStops Marketing Launch Kit

## Quick Stats (for press/social)
- **170 record stores** across North & South Carolina
- **1,078 vinyl releases** tracked with real-time pricing
- **10 city guides** with curated store recommendations
- **Free vinyl value checker** powered by Discogs data

---

## 1. Social Launch Posts

### Twitter/X - Launch Thread

**Tweet 1 (Main announcement):**
```
🎵 Introducing RecordStops - the ultimate guide to independent record stores in the Carolinas.

Find your local groove:
✓ 170 stores with photos, hours & directions
✓ Weekly vinyl charts
✓ Free record value checker
✓ City guides for music lovers

https://recordstops.com
```

**Tweet 2:**
```
🔥 This week''s best-selling vinyl:

1. Tyler, The Creator - Chromakopia
2. Charli XCX - Brat
3. Frank Ocean - Blonde
4. Taylor Swift - TTPD

See the full chart → recordstops.com/charts
```

**Tweet 3:**
```
💰 Got records collecting dust?

Check what they''re worth with our free Vinyl Value tool.

Search any album, get real Discogs marketplace prices instantly.

→ recordstops.com/vinyl-value
```

**Tweet 4:**
```
📍 Planning a crate-digging trip?

Our city guides cover the best record stores in:
• Asheville
• Charlotte
• Raleigh-Durham
• Wilmington
...and more

→ recordstops.com/cities
```

---

### Instagram Captions

**Launch Post:**
```
🎵 RecordStops is LIVE!

We built the directory we wished existed - a comprehensive guide to every independent record store in the Carolinas.

What you''ll find:
📍 170 stores with photos, hours & maps
📊 Weekly vinyl charts (best sellers + most valuable)
💰 Free tool to check what your records are worth
🗺️ City guides for the best music cities

Whether you''re a seasoned collector or just starting your vinyl journey, we''ve got you covered.

Link in bio 👆

#vinyl #recordstore #vinylcollection #cratedigging #recordstops #northcarolina #southcarolina #vinylcommunity #supportlocal
```

**Value Checker Post:**
```
💰 Ever wondered what your vinyl collection is worth?

Our free Value Checker lets you search any album and see real marketplace prices from Discogs.

Just type in the artist + album and get:
• Current lowest price
• Number of copies for sale
• Collector demand (have/want stats)

Perfect for:
✓ Pricing records to sell
✓ Making offers at shops
✓ Insurance documentation
✓ Pure curiosity 😄

Try it free → link in bio

#vinylvalue #recordcollection #vinylcommunity #discogs #vinylrecords
```

---

## 2. Content Calendar (First 8 Weeks)

### Week 1: Launch
- [ ] Publish launch announcement on all socials
- [ ] Email newsletter to existing subscribers
- [ ] Submit to Product Hunt
- [ ] Post in r/vinyl, r/VinylCollectors, r/Charlotte, r/triangle (NC)

### Week 2: City Spotlight - Asheville
- [ ] Blog: "The Complete Guide to Record Stores in Asheville"
- [ ] Instagram carousel: Top 5 Asheville record stores
- [ ] Twitter thread: Asheville music scene overview

### Week 3: Value Content
- [ ] Blog: "How to Grade Your Vinyl Records (And Why It Matters)"
- [ ] Infographic: Vinyl grading scale (M to G)
- [ ] Social: "What''s your most valuable record?"

### Week 4: City Spotlight - Charlotte
- [ ] Blog: "Charlotte''s Best Record Stores for Every Genre"
- [ ] Instagram: Charlotte store photos roundup
- [ ] Partner post with Charlotte record store

### Week 5: Charts Focus
- [ ] Blog: "This Month''s Most Wanted Vinyl"
- [ ] Weekly chart social posts (automate?)
- [ ] Twitter poll: "What''s your most anticipated vinyl release?"

### Week 6: City Spotlight - Raleigh/Durham
- [ ] Blog: "Triangle Record Store Guide"
- [ ] Instagram Stories: Day trip itinerary
- [ ] Local press outreach

### Week 7: Gear Content
- [ ] Blog: "Best Turntables Under $500 (2026)"
- [ ] Instagram: Setup inspiration photos
- [ ] Affiliate product roundup

### Week 8: Community
- [ ] User-submitted store photos feature
- [ ] "Store of the Month" spotlight
- [ ] Newsletter with month-in-review

---

## 3. Blog Post Ideas (SEO Keywords)

### High-Intent Keywords
1. "record stores near me [city]" - Create city pages ✅
2. "best turntables 2026" - Gear guide
3. "how much is my vinyl worth" - Value checker landing ✅
4. "vinyl record price guide" - Grading + pricing content
5. "record store day 2026" - Event coverage

### Long-Tail Content
1. "best record stores in asheville nc"
2. "where to sell vinyl records charlotte"
3. "vinyl record grading guide"
4. "how to start a vinyl collection"
5. "best jazz vinyl 2026"
6. "record stores with listening stations"
7. "rare vinyl records worth money"
8. "best hip hop vinyl releases"

### Evergreen Guides
1. "The Beginner''s Guide to Vinyl Collecting"
2. "How to Care for Your Vinyl Records"
3. "Understanding Vinyl Pressings: 180g, Colored, Limited"
4. "Record Store Etiquette: An Unwritten Rules Guide"
5. "Building Your First Turntable Setup"

---

## 4. Press Kit / One-Pager

### About RecordStops

**What:** The most comprehensive directory of independent record stores in North & South Carolina.

**Why:** Vinyl sales hit $1.9B in 2024 (6.8% growth). Yet finding local record stores still means scattered Google searches and outdated Yelp listings. We built what collectors actually need.

**Features:**
- 168 verified record stores with photos, hours, and specialties
- Weekly vinyl charts tracking best sellers and valuable releases
- Free vinyl value checker powered by Discogs marketplace data
- Curated city guides for music-focused travel
- Newsletter with weekly chart updates

**Founder:** [Your name/bio]

**Launch:** January 2026

**Contact:** hello@recordstops.com

### Key Stats
| Metric | Value |
|--------|-------|
| Stores Listed | 170 |
| Cities Covered | 50+ |
| Releases Tracked | 1,078 |
| Weekly Chart Updates | Yes |
| Mobile Friendly | Yes |

### Screenshots
- Homepage hero
- Store detail page with photos
- Vinyl value checker results
- Charts page
- City guide

### Press Mentions
*(Add as you get coverage)*

---

## 5. Outreach Targets

### Local Press
- [ ] Charlotte Observer
- [ ] Raleigh News & Observer
- [ ] Asheville Citizen-Times
- [ ] Charleston Post and Courier
- [ ] Triangle Business Journal
- [ ] Charlotte Agenda

### Music/Vinyl Blogs
- [ ] Vinyl Me, Please (blog section)
- [ ] The Vinyl Factory
- [ ] Discogs blog
- [ ] Pitchfork (local scene coverage)
- [ ] Stereogum

### Podcasts
- [ ] Vinyl Guide (vinyl collecting)
- [ ] Record Store Day Podcast
- [ ] Sound Opinions
- [ ] Local NPR music segments

### Reddit Communities
- [ ] r/vinyl (380k members)
- [ ] r/VinylCollectors
- [ ] r/VinylDeals
- [ ] r/Charlotte, r/triangle, r/asheville

---

## 6. Email Sequences

### Welcome Email (New Subscriber)
**Subject:** Welcome to RecordStops! 🎵

```
Hey there,

Thanks for joining the RecordStops community!

Here''s what you can expect:
• Weekly vinyl charts (best sellers + most valuable)
• New store additions
• Occasional gear recommendations

Quick links to get started:
→ Find stores near you: recordstops.com/stores
→ Check your vinyl''s value: recordstops.com/vinyl-value
→ Explore city guides: recordstops.com/cities

Happy crate digging!

- The RecordStops Team
```

### Re-engagement Email (30 days inactive)
**Subject:** Miss us? Here''s what''s new at RecordStops

```
Hey,

It''s been a while! Here''s what you might have missed:

🔥 This week''s #1 best seller: [Album]
💰 Most valuable new release: [Album] ($XX)
🏪 New stores added: [Count]

Come back and explore →

See you in the stacks,
RecordStops
```

---

## 7. Hashtag Strategy

### Primary (always use)
#recordstops #vinylcommunity #cratedigging #supportlocal

### Secondary (rotate)
#vinyl #vinylrecords #vinylcollection #nowspinning #recordstore #vinyloftheday #vinylgram #recordcollection

### Location-based
#charlottenc #raleighnc #asheville #durham #wilmington #trianglenc #charlotte #northcarolina #southcarolina

### Niche
#vinylhead #vinyladdiction #vinylporn #33rpm #vinyljunkie #recordstoreday

---

## Quick Wins Checklist

- [ ] Claim Google Business Profile (if applicable)
- [ ] Set up Google Analytics 4 ✅
- [ ] Submit sitemap to Google Search Console ✅
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Enable IndexNow ✅
- [ ] Create Pinterest account (high vinyl content engagement)
- [ ] Set up Twitter/X @recordstops
- [ ] Create Instagram @recordstops
- [ ] Add site to relevant directories (Indie Hackers, etc.)

---

*Last updated: January 2026*
', 20, 'site-recordstore-directory/marketing/LAUNCH-KIT.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Album Cover Post', '# Album Cover of the Day - Post Generator

## How to Use
1. Fill in YOUR INPUT below with album details and raw listening notes
2. Tell Claude: "write up today''s album cover post"
3. Get back a ready-to-post caption with your voice but polished

---

## YOUR INPUT

**Album:**
**Artist:**
**Year:**
**Cover Designer:** (if known)

**My Notes After Listening:**
```
(dump your raw thoughts here - stream of consciousness, favorite tracks, vibes, whatever hit you)


```

---

## OUTPUT FORMAT

Claude will generate:

### Twitter/X Post
```
Album Cover of the Day: [ALBUM] by [ARTIST] ([YEAR])

[2-3 sentences - hip, punchy, personal take on the album and how the cover reflects the music]

[Optional: 1 sentence about cover designer/art if notable]

[Animated cover video]

#AlbumCoverOfTheDay #VinylArt #[Artist] #[Genre]
```

### Instagram Caption (longer version)
```
[Album cover image/animation]

[ALBUM] — [ARTIST] ([YEAR])

[3-4 sentences expanding on the vibe, standout tracks, and the cover art connection]

[Cover art credit if known]

What''s your take on this one? Drop it below.

#AlbumCoverOfTheDay #VinylArt #RecordCovers #NowSpinning #[Genre] #[Artist]
```

---

## Style Guide for Claude

**Tone:** Music nerd who''s genuinely passionate, not pretentious. Like recommending an album to a friend at a bar, not writing for Pitchfork.

**Voice:**
- Confident but not arrogant
- Specific details > vague praise ("that fuzz bass on track 3" not "great instrumentation")
- Short punchy sentences mixed with longer flowing ones
- Okay to be weird/poetic if the album calls for it
- Reference the cover art and how it connects to the sound

**Avoid:**
- "Masterpiece", "iconic", "legendary" (overused)
- Generic praise without specifics
- Sounding like a press release
- Over-explaining - trust the reader knows music

**Good examples of tone:**
- "The cover is chaos and so is the music. You don''t listen to this, you survive it."
- "Three listens in and I''m still finding new corners. That''s the mark."
- "Sounds like what the cover looks like. Neon haze at 2am."

---

## Archive (Completed Posts)

<!-- Add completed posts here for reference -->

### Day 1 - [Date]
**Album:**
**Posted:** [link]

---
', 20, 'site-recordstore-directory/marketing/album-cover-post.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Social Media Setup', '# RecordStops — Facebook & Instagram Account Setup

> [!info] Goal: Create branded FB + IG accounts, then connect them to
> GHL Social Planner so all posts can be scheduled from one place.

---

## 1. Instagram Account

### Create the Account

1. Download Instagram (or go to instagram.com)
2. Tap **Sign Up** with the RecordStops email
3. Username: **@recordstops**
4. Full name: **RecordStops**

### Profile Setup

| Field | Value |
|-------|-------|
| **Username** | @recordstops |
| **Display Name** | RecordStops |
| **Bio** | Find your next favorite record store. 296+ shops across 5 states. City guides, vinyl charts, and a free value checker. |
| **Website** | https://recordstops.com |
| **Category** | Music / Entertainment |
| **Profile Photo** | Use `logo-badge.webp` (the circular vinyl logo) |
| **Contact Email** | hello@recordstops.com |

### Switch to Professional Account

1. Go to **Settings → Account → Switch to professional account**
2. Select **Business** (not Creator)
3. Category: **Music**
4. Connect to the Facebook Page (do this after creating the FB page below)

### First 5 Posts (have these ready before going live)

| # | Type | Content Idea |
|---|------|-------------|
| 1 | Carousel | "5 record stores you need to visit in Charlotte" — 5 slides, one store each, link in bio |
| 2 | Single image | Album cover of the week (continue the Twitter series) |
| 3 | Reel/Story | Quick 15-sec walkthrough of the site on mobile — show browse, city guide, value checker |
| 4 | Single image | Store spotlight — feature a store with a great photo from R2, tag them |
| 5 | Carousel | "How to check what your vinyl is worth (free)" — 3-4 slides showing the value checker |

### Hashtag Strategy

Use 10-15 per post, mixing broad and niche:

**Always use:**
`#recordstops` `#vinylrecords` `#recordstore` `#vinylcommunity` `#cratedigging`

**Rotate in:**
`#vinylcollection` `#recordcollector` `#supportlocal` `#indierecordstore`
`#vinyloftheday` `#nowspinning` `#vinyllife` `#recordstoreday`

**City-specific (tag when relevant):**
`#charlottemusic` `#raleighmusic` `#ashevillemusic` `#richmondva`
`#dcmusic` `#baltimoremusic` `#charlestonsc` `#greenvillesc`

---

## 2. Facebook Page

### Create the Page

1. Go to facebook.com/pages/create
2. Select **Business or Brand**
3. Page name: **RecordStops**
4. Category: **Music**

### Page Setup

| Field | Value |
|-------|-------|
| **Page Name** | RecordStops |
| **Category** | Music |
| **Bio/Intro** | The guide to independent record stores. 296+ shops across 5 states with city guides, vinyl charts, and a free value checker. |
| **Website** | https://recordstops.com |
| **Email** | hello@recordstops.com |
| **Profile Photo** | Same circular vinyl logo (`logo-badge.webp`) |
| **Cover Photo** | Use `og-default.png` or create a wide banner (1640x856) showing the site hero |
| **CTA Button** | "Learn More" → https://recordstops.com |
| **Username** | @recordstops (claim the vanity URL) |

### Page Details to Fill In

- **About section:** "RecordStops helps vinyl lovers find independent record stores. We cover 296+ stores across North Carolina, South Carolina, Virginia, Maryland, and DC with honest city guides, weekly vinyl charts, and a free value checker powered by Discogs data. Built by a vinyl collector, for vinyl collectors."
- **Location:** Remote / Online business
- **Hours:** Always open (it''s a website)
- **Founded:** 2026

### Facebook Groups to Join (for organic reach)

Join these, engage for a few days, then share relevant city guides:

**North Carolina:**
- Vinyl Record Collectors of NC
- Charlotte Music Scene
- Triangle Music Community (Raleigh/Durham/Chapel Hill)
- Asheville Music Scene

**Virginia / DC / Maryland:**
- RVA Music Scene
- DC Music Scene
- DMV Vinyl Collectors
- Baltimore Music Scene
- Charm City Vinyl

**South Carolina:**
- Charleston Music Scene
- Columbia SC Music Scene
- Greenville SC Music Scene
- Upstate SC Music

**General vinyl groups:**
- Vinyl Record Collectors (large group, 100k+ members)
- Vinyl Community
- Record Collecting

> [!warning] Do not spam groups. Join, like a few posts, leave a
> comment or two, then share a city guide 2-3 days later. Frame it as
> helpful content, not promotion.

---

## 3. Connect to GHL Social Planner

Once both accounts are live:

1. Open GHL → **Marketing → Social Planner**
2. Click **Connect Accounts**
3. **Facebook:** Sign in, select the RecordStops page, grant permissions
4. **Instagram:** Connect via the linked Facebook page (IG Business accounts connect through FB)
5. Verify both show as connected with green checkmarks

### Content Calendar (first week)

| Day | Platform | Post |
|-----|----------|------|
| Mon | FB + IG | Store Spotlight — pick one of the 13 verified stores, use their R2 photo, tag them |
| Tue | IG | Album cover of the week (reuse Twitter series) |
| Wed | FB | City guide share — link to a city guide with a short personal intro |
| Thu | IG | "Did you know?" fact about vinyl or a local store |
| Fri | FB + IG | New releases post — "What dropped on vinyl this Friday" |
| Sat | FB | Community question — "What was the last record you bought?" |
| Sun | IG Story | Poll: "Vinyl or streaming?" or "What genre are you spinning today?" |

### Content Pillars

1. **Store Spotlights** — feature a different store each week with photo + story
2. **Album of the Week** — personal take on an album, continue existing series
3. **City Guide Promos** — share guides with local hooks
4. **Community Questions** — engagement bait that actually works for vinyl people
5. **Vinyl Charts/New Releases** — weekly content that writes itself from the site data

---

## 4. Quick Reference

| Platform | Username | URL |
|----------|----------|-----|
| Twitter/X | @recordstops | https://x.com/recordstops |
| Instagram | @recordstops | https://instagram.com/recordstops |
| Facebook | RecordStops | https://facebook.com/recordstops |

**Brand Assets Location:**
- Logo (circular): `public/logo-badge.webp`
- Logo (white, for dark bg): `public/logo-white.png`
- OG image: `public/og-default.png`
- Store photos: R2 bucket `recordstops-images` → `stores/{id}/`

---

## Checklist

- [ ] Create Instagram @recordstops
- [ ] Switch to Business account
- [ ] Fill in profile (bio, website, photo, category)
- [ ] Create Facebook page RecordStops
- [ ] Fill in page details (bio, cover photo, CTA, about, username)
- [ ] Prepare 5 posts before going live on each platform
- [ ] Connect Facebook to GHL Social Planner
- [ ] Connect Instagram to GHL Social Planner (via FB)
- [ ] Schedule first week of content in GHL
- [ ] Join 5+ Facebook groups (don''t post yet, just engage)
- [ ] After 2-3 days in groups, share first city guide
', 20, 'site-recordstore-directory/marketing/social-media-setup.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Market Research', '# Market Research: Vinyl Record Store Directory

> [!info] Date: 2026-05-03 · Pairs with [PRD.md](./PRD.md). Replaces archived market notes inside the legacy PRDs.

The question this answers: **does a regional curated US vinyl directory have a defensible position alongside Discogs, Yelp, and Google Maps — and what''s actually proven about willingness-to-pay?**

Short answer: yes, in the sense that the audience exists and is searchable, but the path to monetizing the audience is **B2B Featured Listings**, not B2C subscriptions or transactional commerce. Discogs owns marketplace; Google Maps owns transactional location lookup; nobody owns *editorial regional curation*. RecordStops sits in that slot.

---

## 1. Market size & motion

- **Vinyl LP industry, US:** ~$1.9B retail (2024); 6.8% CAGR through 2030 (RIAA + IFPI data).
- **Independent record stores (US, brick-and-mortar):** ~1,500 active members of the Coalition of Independent Music Stores (CIMS) + ~700 RSD-participating stores not in CIMS = ~2,200 nationwide.
- **Record Store Day:** Apr 19 (saturday). Single biggest day for indie-store revenue and traffic (often 20–35% of annual gross). Black Friday RSD on Nov 28 is a smaller secondary peak.
- **Vinyl enthusiast audience size:** Discogs has 8M+ users. Reddit r/vinyl has 800K members. r/RecordCollecting + r/VinylCollectors add another ~300K.

---

## 2. The four competitor buckets

### 2.1 Marketplaces (transaction-anchored)

| Player | What it is | Why it doesn''t compete with RecordStops directly |
|---|---|---|
| **Discogs** | Global vinyl database + marketplace. 8M+ users, 600M+ inventory items. | Transactional. People go there to BUY a specific record, not to find a store to visit. Discogs lists stores but the directory is buried and not curated. |
| **eBay vinyl** | Massive long-tail marketplace | Same — buy-side, not visit-side |
| **Reverb LP** | Audio-gear marketplace expanding into vinyl | Niche, gear-led, not store-discovery |

### 2.2 Mass directories (commodity location lookup)

| Player | Why it doesn''t compete |
|---|---|
| **Google Maps** | Owns "record stores near me" head-term traffic. RecordStops cannot beat Google on that query. Different positioning needed: regional curation + city guides, not transactional lookup. |
| **Yelp** | Generic; vinyl shops blend in with thrift stores. Reviews skew angry. |
| **TripAdvisor** | Tourist-anchored — actually a near-competitor for the "tourist visiting town wants vinyl shop" use case. Weak vinyl curation. |

### 2.3 Editorial / community (closest analogues)

| Player | Geography | What it does | Status |
|---|---|---|---|
| **Vinyl Hub** (vinylhub.com) | Global | User-submitted store database. Volunteer-edited. ~9,000 listings. | Living but stagnant; UI from 2014. |
| **Record Store Day site** | Global | Lists ~1,400 RSD-participating stores. | Annual-event-anchored, not a daily destination. |
| **The Vinyl Factory** | Global | Magazine + occasional store guides | Editorial brand, not a directory. |
| **Crate Diggers / Decibel Geek** | Niche | Podcast / community | Audience overlap, not competition. |
| **Reddit r/vinyl + r/RecordCollecting** | Community | Threads asking "best record stores in [city]" appear weekly. **Direct demand signal.** | RecordStops should be in those threads as the answer. |

### 2.4 Regional / single-city directories

There are city-specific lists ("best record stores in Austin", "Chicago''s vinyl scene") published by local alt-weeklies and Reddit guides. **These are exactly what RecordStops''s city guides should outrank.** Each one is a moat-by-moat win.

---

## 3. Where RecordStops actually fits

**The slot:** *editorial, US-regional, multi-state, store-curated directory with city guides*. Specifically owns the long tail:
- "Best record stores in Asheville NC"
- "Record stores in Charleston SC"
- "Independent vinyl shops Charlotte"
- "Record stores open Sundays Raleigh"

These are **buyer-intent queries** the head-term competitors (Google Maps, Yelp) don''t optimize for. They are exactly what RecordStops''s 16 city guides are pointed at.

The position to defend: **the editorial pick of the regional curator.** Not "all record stores" (Vinyl Hub does that). Not "best-rated" (Yelp does that). **Best for vinyl, regionally vetted by someone who actually went there.**

This is also the position the FEATURED LISTING value prop runs through: "the curator put us at the top of his Asheville guide" is a story a store owner can tell.

---

## 4. Pricing landscape (what record stores already pay for)

| Channel | Cost | Real outcome for stores |
|---|---|---|
| Yelp Ads | $300–$1,000/mo | High intent, high cost, dilutes brand. Stores hate Yelp. |
| Google Local Service Ads | $5–$50/lead | Possible but high CPCs; usually for service categories not retail |
| Instagram Ads | $50–$500/mo | Brand awareness, not foot traffic |
| Bandcamp seller fees | 15% of digital, 10% of physical | Revenue split, not advertising |
| **RecordStops Featured @ $15/mo** | $15/mo | Untested. Comparable to a Yelp ad spend for a single tier above free. |

**Implication:** $15/mo is a coffee. The buying decision is purely "do I trust this drives 1 incremental customer/month?" If the pitch can quantify even a single tourist visit, the price justifies itself. Track and report visits; that''s the killer feature.

---

## 5. Buyer-intent demand signals (data we have)

- **Patrick Foster** (Rockin'' the Suburbs Podcast): inbound DM, requested an interview about RecordStops. Path closed (no response after Brian''s reply) but proves the audience adjacent to the product is interested.
- **Reddit r/vinyl threads** like "Where should I go in Charlotte for records?" appear ~weekly. Currently answered by random redditors, not a directory.
- **Google Search Console** for recordstops.com: 336 indexed pages, traffic at 683/mo. Indexing trend positive. Top queries include long-tail "record store in [city]" forms.
- **Instagram engagement** on the album-cover Saturday post series (Feb 2): consistent 40–80 likes per post on a small base, indicating audience exists if cadence resumes.
- **GHL contact list** has stores who were imported from outreach lists — many of which respond to the email-send if it actually goes out.

---

## 6. The B2B sales reality

**Indie record store owners are notoriously hard to sell to.** They''re price-sensitive (low-margin business), distrust marketing platforms, hate Yelp, and have been pitched on every "increase your foot traffic" SaaS for a decade. Most pitches die.

**What works (per CIMS forums + indie retailer interviews):**
- Be a fellow vinyl person, not a salesperson. Reference an actual record from their inventory.
- Lead with traffic delivered, not features promised. "We sent 47 visits to your listing in March" beats "we have a Featured tier."
- Offer a free month before charging. The test of value, not the promise.
- Recognize Record Store Day. April-week pitches get higher open rates than off-season ones.
- Don''t email-blast. 5 personalized > 50 templated.

**What kills pitches:**
- Generic "we''ll help you reach more customers" intro
- Asking for the credit card before showing 1 visit delivered
- Pitching during their busiest weeks (Saturdays, RSD week, Christmas)
- No mention of a specific record they sell

These rules are baked into the [DESIGN-BRIEF.md](./DESIGN-BRIEF.md) voice section.

---

## 7. The Mediavine ceiling

Display ads via Mediavine require **50K monthly sessions** (recently raised from 5K — note: spec''d 5K above; verify before committing). At 683/mo, Mediavine is far away. AdSense direct works at any volume but yields ~$0.50–$2 per 1,000 visits → at 683/mo, ~$1/mo. Not material until traffic is 50–100x larger.

**Implication:** display ads are not a meaningful revenue path until 25K+ monthly users. Don''t optimize for them. Featured Listings + affiliate are the lanes.

---

## 8. The real moat (and the threat)

**Moat** = editorial curation + 16 city guides ranking + 296-store database with photos and verified hours, much of which is hard to scrape and impossible to fake at scale. Competitors would have to do the same legwork.

**Threat** = Vinyl Hub (the global volunteer directory) decides to add city-guide editorial. They have the listings; they don''t have the curation or SEO. Probability inside 12 months: low. They''ve been static for 8 years.

**Bigger threat** = Brian getting bored and not selling. The technical moat is fine; the founder execution is the variable.

---

## 9. Sources & evidence
- [RIAA Year-End Music Industry Revenue Report](https://www.riaa.com/u-s-sales-database/) (vinyl growth data)
- [Coalition of Independent Music Stores (CIMS)](https://www.cims.com/) (independent store count)
- [Record Store Day directory](https://recordstoreday.com/Stores) (RSD-participating stores)
- [Discogs scale](https://www.discogs.com/about) (8M users, 600M items)
- [Vinyl Hub](https://www.vinylhub.com/) (closest analogue editorial directory)
- [Mediavine eligibility](https://www.mediavine.com/journey-to-publish/eligibility/) (current monthly-session minimum)
- Reddit r/vinyl + r/RecordCollecting (demand signal)
- RecordStops internal: D1 outreach status, Google Search Console
', 30, 'site-recordstore-directory/tasks/MARKET-RESEARCH.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Design Brief', '# Design Brief: RecordStops

> [!info] Date: 2026-05-03 · Pairs with [PRD.md](./PRD.md) and [MARKET-RESEARCH.md](./MARKET-RESEARCH.md)

The website''s visual design is **already done and live** — Astro + Tailwind, vinyl-aesthetic, working photo carousels, mobile-responsive, 336 indexed pages. Don''t touch it without a strong reason.

This brief defines **voice**: the way RecordStops talks to the two audiences it has to convince — independent record store owners (paying customers) and vinyl enthusiasts (the audience). Voice is the bottleneck. Visual design is not.

---

## 1. Brand posture

> **The vinyl person who happens to know how to build websites.** Not a SaaS founder selling stores something. A guy who walks into the shop, knows what''s in the new-arrivals bin, and has a directory because he wishes one existed.

Not: a tech bro. Not a directory marketer. Not Yelp. Not a "platform." Not "we''re building the future of vinyl discovery."

Closest cultural reference points:
- **Aquarium Drunkard** (newsletter / magazine — the way they talk about records)
- **Daptone Records** Instagram (analog warmth, no startup energy)
- **The Vinyl Factory** longform (tone, not visual)
- **Anthony Bourdain''s Parts Unknown intros** (curator-explorer voice)

---

## 2. Voice — outreach emails to store owners (B2B)

This is the most important voice of the entire product because it''s what determines whether stores pay $15/mo or trash the email.

### Voice principles
1. **Open with a record, not a pitch.** "Saw you got the Daptones 7-inch in stock last week." Specific. Real. Verifiable.
2. **Acknowledge their existence.** "I added you to RecordStops a couple months ago — here''s your listing." (Link.)
3. **Be a peer.** "I''ve been collecting since 2014. Started this directory because I couldn''t find a good list of stores when I drove through Asheville last fall."
4. **Lead with a number, not a feature.** "Your listing got 23 visits last month. That''s around 1 a day."
5. **One ask. No menu.** "Want to be the Featured pick for Charlotte? It''s $15/mo. First month free, no card."
6. **Sign with a name.** Not "the RecordStops team." Brian. With a phone number.

### Sample outreach (use as the template for the manual ones this week)

> Subject: Saw you have the new Khruangbin 12-inch
>
> Hey [name],
>
> Brian from RecordStops here — built the directory for vinyl shops in NC/SC/VA/MD/DC because I kept getting asked "where should I go for records in Charlotte" and there wasn''t a clean answer.
>
> Quick note: [Store Name] is on the site (here''s your page: [URL]). Got 23 visits in March from people searching things like "record store in [city]" and "best vinyl shop near me."
>
> Most stores are at the free tier. We have a Featured option that pins you at the top of [State Name] and adds your Instagram + photo gallery — $15/mo, first month free, no card. Around 1 in 4 stores who try it stay on.
>
> Want to try it for May? Reply yes and I''ll set it up tonight, no payment until you''ve seen the traffic for a week.
>
> Brian
> recordstops.com / brian@recordstops.com

### Words we never use (in outreach)
- "Platform"
- "Solution"
- "Drive foot traffic" (everyone says this)
- "Synergy", "leverage", "ecosystem"
- "Limited time offer", "act now"
- "Hi there", "Hello [first name]"
- "I hope this email finds you well"

---

## 3. Voice — vinyl enthusiast site copy (B2C)

The site is already written this way mostly. Reference for any new copy:

- **Curator, not aggregator.** "We picked these 11 shops because each one does something specific." Not "Browse 296 shops!"
- **Specific over generic.** "Big Love Vinyl in Charlotte has the best new-arrivals section north of Atlanta." Not "Top-rated record store!"
- **Informed-but-not-snobbish.** Reference a record without naming-dropping. "If you love jazz reissues like the Tone Poet series, [store] is the move."
- **Local, not national.** Always anchor to a specific city, neighborhood, or record event happening that month.

---

## 4. Voice — social (Instagram + Twitter/X)

The 60-day calendar in `marketing/60-day-content-calendar.md` already has 105 posts written. Don''t rewrite. **Just publish.** When you DO write new posts:

### Instagram
- Album cover + a single sentence about why it matters at the moment ("This week''s most-asked-for new-arrival in Asheville: ___")
- Behind-counter shots from real stores (with permission, credit)
- Saturday album cover post (existing series — keep going)
- City spotlight every two weeks: 1 store, 1 record they have, 1 reason to drive there

### Twitter/X
- Reply to r/vinyl-style questions. "Where in Charlotte?" → answer with the link.
- New-arrivals roundups every Friday based on Discogs data we already pull
- RSD-related posts ramping March–April

### What we never post
- "Top 10" lists (Yelpy)
- Quote graphics with vinyl-themed quotes (cliché)
- Carousels with stock vinyl images (use real store photos only)
- Inspirational entrepreneur content
- Paid-ad-style "DM us!" CTAs

---

## 5. Voice — newsletter (broken right now)

The newsletter worker exists at `workers/newsletter-digest/` and currently sends the same content every week (bug per Brian). When fixed, the voice should be:

- One real new arrival from one real store this week
- One city guide highlighted
- One record-related thing happening (RSD, anniversary release, local event)
- That''s it. Three things. No "from the editor" intro paragraph.

Subject line formula: `This week''s vinyl finds + [specific store name]`

---

## 6. Visual system (already established — minor notes)

The site is **already designed**. Tailwind, vinyl-grooves background, photo galleries, Mapbox embeds. Don''t touch it.

Two future polish items worth noting:
- **Default OG image** — currently sitewide OG falls back to nothing. Brand the OG with the wordmark + a record photo. ~30 min of work.
- **Featured Listing visual differentiation** — current Featured tier is "pinned + badge." Consider adding a thicker border, a richer hero, or an embedded latest-Instagram-post block to make the upgrade obvious to the BUYER.

Both are nice-to-have. Neither blocks revenue.

---

## 7. Brand promises (write these on the wall)

1. **We never list a store we wouldn''t visit.** Editorial credibility is the moat.
2. **We never trade reviews for money.** Featured Listings buy placement, not endorsement.
3. **We always credit the store.** Their photo, their name, their voice. We are the directory; they are the destination.
4. **We never spam record store owners.** One pitch, one follow-up, then we stop.

---

## 8. Open design questions

1. **Featured Listing badge** — current "Featured" is text-only. Worth a small icon (vinyl sleeve corner?) to make it visually unmistakable in lists?
2. **Outreach email signature image** — does Brian want a small headshot in the signature? Adds trust ("this is a real person") but costs render reliability across email clients.
3. **OG image variants per state** — auto-generate one per state with the state name + a record from that state''s most-Featured store? ~2 hr to build, compounds across hundreds of pages.
', 31, 'site-recordstore-directory/tasks/DESIGN-BRIEF.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'Technical Spec', '# Technical Spec: RecordStops

> [!info] Date: 2026-05-03 · Pairs with [PRD.md](./PRD.md). Replaces archived `RECORDSTOPS-TECHNICAL-SPEC.md`. Documents what''s deployed AND the bugs/gaps the founder identified.

This spec is the contract a fresh agent reads to ship code without re-deriving decisions.

---

## 1. System overview

```
┌──────────────────┐    ┌─────────────────┐    ┌──────────────┐
│ recordstops.com  │◄──►│ Cloudflare D1   │◄──►│ 4 Cron       │
│ Astro static     │    │ recordstops-db  │    │ Workers      │
│ Cloudflare Pages │    └─────────────────┘    └──────────────┘
└────────┬─────────┘             │                     │
         │                       ▼                     ▼
         ▼              ┌─────────────────┐   ┌──────────────┐
┌─────────────────┐    │ Cloudflare R2   │   │ External     │
│ /admin section  │    │ recordstops-    │   │ - Discogs    │
│ (Astro pages)   │    │ images          │   │ - MusicBrainz│
└─────────────────┘    └─────────────────┘   │ - Mapbox     │
         │                                    │ - SendGrid   │
         ▼                                    │ - GHL/Stripe │
┌─────────────────┐                          └──────────────┘
│ GHL (CRM +      │
│ payment + email)│
└─────────────────┘
```

---

## 2. Tech stack (current, deployed)

| Layer | Tech | Notes |
|---|---|---|
| Frontend | Astro (static) + Tailwind | Auto-deploys from GitHub to Cloudflare Pages |
| Database | Cloudflare D1 (`recordstops-db`) | Schema in `d1-schema.sql` (296 stores, 1,078 releases, 16 city guides) |
| Image storage | Cloudflare R2 (`recordstops-images`) | ID-based paths (NOT slugs — historical bug) |
| Maps | Mapbox | Token in `.env` |
| CRM + outreach | GoHighLevel | Subaccount integrated; webhook → D1 sync worker |
| Payments | Stripe (via GHL payment link) | Featured Listings $15/mo or $150/yr |
| Newsletter delivery | SendGrid | Saturday 8am EST cron |
| Email outreach | GHL | Templates exist, send mechanism not wired (see §5) |

---

## 3. D1 schema highlights

Full schema in `d1-schema.sql`. Key tables:

| Table | Purpose | Notes |
|---|---|---|
| `stores` | 296 record stores | Includes name, slug, address, lat/lng, hours, social links, photos array |
| `cities` | 16 curated city guides | Each guide is editorial markdown + featured stores |
| `vinyl_releases` | 1,078 tracked releases | Synced daily from Discogs + MusicBrainz |
| `featured_listings` | Stores with active paid Featured tier | NOT YET POPULATED — no paying customers yet |
| `outreach_status` | Per-store tracking of outreach state | Used by `/admin` dashboard |
| `outreach_log` | Audit trail of outreach actions | Underused — not auto-populated by any sender |
| `newsletter_subscribers` | Newsletter sign-ups | Saturday digest target list |
| `submissions` | Operator-submitted store info | Reviewed in `/admin/submissions` |

---

## 4. Cron workers (4 deployed, all active)

| Worker | Schedule | Purpose | Status |
|---|---|---|---|
| `recordstops-sync` | Daily 6am UTC | Pull Discogs prices + marketplace data for tracked releases | Working |
| `recordstops-musicbrainz` | Daily 7am UTC | Pull MusicBrainz release dates for new arrivals | Working |
| `recordstops-newsletter` | Saturday 8am EST | Compose + send weekly digest via SendGrid | **BROKEN — sends same content every week (see §5.1)** |
| `recordstops-ghl-sync` | On-demand (webhook) | GHL → D1 store-record updates (6 event types) | Working |

Worker source lives under `workers/` (separate from main Astro site). Each has its own `wrangler.toml`.

---

## 5. Known bugs and gaps (priority order)

These are real issues identified by the founder. Each has a section below.

### 5.1 Newsletter sends same content every week (HIGH — blocks growth)

**Symptom:** Brian (and all subscribers) receive the identical digest every Saturday.

**Hypothesis:** the worker''s "this week''s new arrivals" query is using an unbounded date window or a stale variable. Could also be a caching layer (KV?) that''s never invalidated.

**Investigation steps:**
1. Read `workers/newsletter-digest/index.ts` — find the query that selects "new" content.
2. Verify the date filter is computing `now - 7 days` at runtime, not at module load.
3. Check if there''s a KV cache wrapping the query — invalidate or remove.
4. Manually invoke worker via `wrangler dev` with mock now-date to confirm fix.

**Owner:** next agent picking this up has explicit permission to ship the fix without further design review.

### 5.2 Outreach engine: no auto-send + tracking (HIGH — blocks revenue)

**Current state:**
- 6 GHL outreach email templates exist (`marketing/ghl-outreach-email-templates.html`)
- GHL webhook syncs status changes back to D1 (works)
- `/admin` dashboard shows outreach status per store
- **There is no "send pitch" button. No log entry on send. No way to schedule a follow-up.**

**What needs building (~3 hr scope):**
1. Add "Send pitch" action in `/admin` per-store row → calls a new endpoint
2. New endpoint: `POST /api/admin/outreach/send` — accepts `{store_id, template_id}`, calls GHL email-send API, writes to `outreach_log`
3. Display recent `outreach_log` entries on the dashboard (last 30 days)
4. Add a "follow-up due" filter (stores with outreach >7 days ago, no response)

### 5.3 Branded outreach emails not configured (MEDIUM)

**Symptom:** Brian believes outreach emails go from a generic GHL sender, not `pitch@recordstops.com` or similar.

**Fix:**
- Verify `recordstops.com` sender domain in GHL (DKIM/SPF records)
- Or set up `pitch@recordstops.com` in SendGrid + route GHL through it
- Confirm via test send that From-line and signature render correctly

**Owner action required:** check current GHL sender config; if generic, request domain verification through GHL dashboard.

### 5.4 Admin requires login (LOW — workaround works)

**Symptom:** Brian forgets to log in to `/admin` because he manages his day from email.

**Decision:** **don''t fix this.** At <50 paying customers, daily-management-via-email is the right answer. The fix is not "make admin easier to log in to" — it''s to make admin EMAIL THE FOUNDER an actionable digest each morning.

**Future spec (not this quarter):** daily admin email at 8am ET listing:
- New submissions waiting for review
- Stores without recent outreach (>30 days)
- Featured customers in trial week
- Stores with high traffic this week (upsell candidates)

### 5.5 Social campaign not running (HIGH — blocks growth)

**Current state:** 60-day content calendar exists at `marketing/60-day-content-calendar.md` (~105 posts). All copy + image specs already written. CSVs already imported into GHL Social Planner.

**Gap:** no posts have actually been published. The calendar window (Mar 12 – May 10) is now passing without execution.

**Fix:** there is no engineering fix. This is purely a "open GHL Social Planner and approve the queued posts" problem. Founder action.

### 5.6 No traffic acquisition motion (MEDIUM)

**Current state:** Site sits at 683 monthly users. SEO is doing the work; no other channels are active.

**Plan (per [PRD.md](./PRD.md) §8):** founder spends 30 min/week on Reddit answers + Twitter/X new-arrival threads. No engineering work needed.

---

## 6. /admin section — what exists

Astro pages under `src/pages/admin/`:

| Page | Purpose |
|---|---|
| `/admin/index.astro` | Dashboard landing — stats overview |
| `/admin/newsletter.astro` | Newsletter management (send manually, preview) |
| `/admin/reports.astro` | Outreach status reports |
| `/admin/submissions.astro` | Review operator-submitted stores |

API routes under `src/pages/api/admin/`:
- `approve-submission.ts`
- `reject-submission.ts`

**Auth model:** simple session-based or none (verify before exposing). Whatever it is, **don''t make it more complex.** Add the daily-digest email feature instead (§5.4).

---

## 7. Newsletter pipeline (separate from outreach)

Two distinct email flows — easy to confuse.

| | Newsletter (subscribers) | Outreach (store owners) |
|---|---|---|
| Audience | Vinyl enthusiasts | Independent record store owners |
| Frequency | Weekly Saturday | Per-store, manual cadence |
| Sender | SendGrid via newsletter worker | GHL (planned: domain-verified `pitch@recordstops.com`) |
| Content | Curated digest of new arrivals + city spotlight | Personalized pitch from Brian |
| Status | **Broken (same content)** | **Templates exist, send not wired** |

---

## 8. R2 storage notes

`recordstops-images` bucket. **Use ID-based paths**, not store-slug-based. There was a historical bug where slug-based URLs broke when stores were renamed. The Feb 8 commit `d1cd397` fixed CSV references; the same fix should apply to any new code that references store images.

URL pattern: `https://recordstops-images.r2.cloudflarestorage.com/{store_id}/{photo_index}.{ext}`

(Or whatever the public R2 URL format is for the configured bucket — verify before hard-coding.)

---

## 9. Affiliate tracking (not yet wired)

Per [PRD.md](./PRD.md) §5: affiliate links are a 30-min add for Amazon Associates, Turntable Lab, Crutchfield. No tracking infrastructure needed beyond their native dashboards.

When ready to implement:
1. Sign up for each program (status unknown — verify Amazon Associates approval)
2. Add affiliate disclosure page at `/affiliate-disclosure`
3. Link from site footer
4. Add affiliate tag to gear-article URLs (e.g., Amazon: `?tag=recordstops-20`)
5. Track conversions via the partner dashboards weekly (no internal DB)

---

## 10. Environment variables (current, on workers)

| Name | Where | Purpose |
|---|---|---|
| `DISCOGS_TOKEN` | sync worker | Discogs API auth |
| `MUSICBRAINZ_USER_AGENT` | musicbrainz worker | Required by their API |
| `SENDGRID_API_KEY` | newsletter worker | Outbound email |
| `SENDGRID_FROM_EMAIL` | newsletter worker | Sender identity |
| `GHL_API_KEY` | ghl-sync worker | Webhook signature verification |
| `MAPBOX_TOKEN` | Astro build | Map tile rendering |

When adding affiliate revenue: store affiliate tags as build-time constants, not env vars (they''re not sensitive).

---

## 11. Build order if you have one session to spend on this project

1. **Fix the newsletter bug** (§5.1) — 1 hr, restores subscriber trust
2. **Add the "Send pitch" button + log** (§5.2) — 3 hr, enables sales motion at scale
3. **Verify outreach sender domain** (§5.3) — 30 min, lifts open rates
4. **Add affiliate links to gear page** (per PRD §5) — 30 min, starts revenue compounding

That''s ~5 hours for a meaningful unlock. The other items are founder-execution, not engineering.

---

## 12. What this spec does NOT cover

- Astro page-level implementation (read source directly)
- GHL configuration steps (handled in GHL dashboard, not in code)
- SEO optimization specifics (already done; see archived `prd-go-to-market.md`)
- City guide editorial process (markdown + Brian''s curation)
- Marketing content (see `marketing/` folder)
', 32, 'site-recordstore-directory/tasks/TECHNICAL-SPEC.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'PRD', '# PRD: RecordStops — Vinyl Directory Monetization

> [!info] Status: **Live product. Shifting focus from build to sell.**
> Owner: Brian Mangum · Last updated: 2026-05-03 · Replaces all prior PRDs (archived in `tasks/_archive/`).

---

## TL;DR

RecordStops is **already live**: 296 stores across 5 states, 16 city guides, 683 monthly users, 4 production cron workers, payment flow wired ($15/mo or $150/yr Featured Listings via GHL/Stripe). The infrastructure exists. **What does not exist is a working sales motion.**

This PRD is a deliberate pivot from "build the directory" to "monetize the directory." Every decision below trades off engineering work for revenue work. Target: **5 paying Featured Listings ($75 MRR) by Aug 1, 2026** — beat that or kill the Featured-listings model.

---

## 1. Why we''re rewriting this PRD

The prior GTM PRD (Jan 2026, archived) shipped: GHL pipeline, payment flow, 60-day content calendar, 6 outreach email templates, sync workers. **All built. None sent.**

| Engineering shipped | Sales shipped |
|---|---|
| GHL webhook sync worker (Feb 16) | 0 store pitches sent |
| 6 outreach email templates (Feb 11) | 0 outreach emails sent through them |
| 60-day content calendar (Feb 9) | 0 social posts published |
| GHL Social Planner pipeline (Feb 8) | 0 campaigns active |
| Featured Listings payment link (Feb 8) | 0 stores asked to upgrade |
| Newsletter worker (Jan 16) | Sending the same content every week (broken) |
| Patrick Foster podcast lead (~Feb) | Replied. No response. Lead dead. |

The pattern matches the LoveNotes V1 failure: building feels productive, selling feels gross. Same trap, different product. The fix is the same: **stop building until something is sold.**

---

## 2. Who pays

Two distinct revenue customers; the directory itself is free for vinyl enthusiasts (the audience that drives the SEO that drives the value proposition for the paying customer).

### Customer 1 — Independent record store owners (B2B, primary)
- 296 listed today. ~50 are highly responsive on social (verified, posting regularly, real Instagram).
- Pay $15/mo or $150/yr for **Featured Listing**: pinned placement in their state, hero image, social-link block, "Featured" badge.
- Job-to-be-done: get found by tourists searching for "record stores in [city]" (the highest-intent buyer they have).
- Willingness to pay: untested. $15/mo is a coffee. The pitch needs to be specific about traffic delivered, not abstract.

### Customer 2 — Vinyl enthusiasts (B2C, indirect)
- 683 monthly users today.
- Don''t pay directly. Their traffic + engagement is what we sell to Customer 1.
- Future revenue: affiliate (gear) at scale, AdSense at >5K monthly users (Mediavine threshold).

---

## 3. The honest 6-month plan

### Quarter 1 (May–Jul 2026): prove someone will pay

| Month | Goal | Specifically |
|---|---|---|
| **May** | First paying customer | Send 5 personalized Featured pitches to verified-active stores. Convert 1. |
| **Jun** | First 3 paying customers | Pitch the next 10. Convert 2 more. Get a testimonial. |
| **Jul** | First 5 paying customers + repeatable pitch | Use the 3 testimonials in pitch v2. Pitch the next 20. |

By Aug 1: **5 paying Featured Listings = $75 MRR**, plus a documented pitch that converts at a known rate.

### Quarter 2 (Aug–Oct 2026): scale or kill

If month 4 numbers hit:
- Push to 25 paying ($375 MRR) by end of Q2 by sending the proven pitch to every responsive store
- Layer in affiliate revenue (gear articles tied to high-intent SEO terms)
- First social campaign actually running (60-day calendar finally published)

If month 4 numbers miss (<5 paying):
- Featured Listings is not the model. Pivot to affiliate-only or sell the asset.

---

## 4. Pricing & packaging

| Tier | Price | What it gets | Today |
|---|---|---|---|
| **Free Listing** | $0 | Name, address, hours, basic info, map pin | All 296 stores |
| **Featured Monthly** | $15/mo | Pinned in state, hero image, full photo gallery, social-link block, "Featured" badge | Live but never pitched |
| **Featured Annual** | $150/yr (save $30) | Same as monthly | Live but never pitched |

**No new tiers.** Adding a "Pro" or "Enterprise" tier is engineering work in disguise. Sell the existing tier first.

---

## 5. The 7-day commitment (do this week)

Three tactical actions. Each takes <30 min.

1. **Use the new admin templates → send 5 personalized pitches.** `/admin/templates` now has 6 starter templates (`initial-pitch`, `follow-up-1`, etc.); edit one for tone, then for each of 5 verified-active stores click "Send pitch" — the API renders {{store_name}}, {{store_city}}, {{store_state}}, {{store_url}} per store, sends via SendGrid, logs to `outreach_log`, and stamps `email1_sent_at`. **Personalize the subject and opening sentence per store** — don''t blast the template raw.
2. **Publish ONE post on Twitter/X or Facebook** from the 60-day calendar in `marketing/60-day-content-calendar.md`. (No Instagram — Brian''s not on IG.)
3. **Add affiliate links somewhere meaningful.** The gear page was killed, so default targets (Amazon, Turntable Lab, Crutchfield) need a new home. **Open question: where do affiliate links live now?** See §11 #5.

Newsletter bug is fixed and deployed. Affiliate sign-ups can happen anytime — placement decision is the blocker.

---

## 6. What we explicitly are NOT doing this quarter

- Building more cron workers
- Adding new revenue streams (display ads need 5K monthly users we don''t have)
- Expanding to new states (current 5 are not yet monetized)
- Writing more PRDs (this is the one)
- Building store-owner self-serve dashboards (manual outreach until 25+ paying)
- Migrating off GHL (it works; the gap is in HOW WE USE IT, not the platform)
- Touching the admin UI (you don''t use it; managing via email is fine for <50 customers)

---

## 7. Known infrastructure gaps to fix (in priority order)

These are real bugs and missing wiring identified by the founder. Each has a revenue impact.

| # | Gap | Revenue impact | Fix scope |
|---|---|---|---|
| 1 | **Newsletter sends same content every week** | Subscribers churn → fewer reach hits per outreach → lower conversion | Bug in worker — likely date-window query or stale cache. ~1 hr investigation. |
| 2 | **Outreach engine doesn''t actually send** | Cannot pitch stores at scale without manual copy-paste through GHL | Wire GHL email-send API → trigger from admin "send pitch" button → log to outreach_log table. ~3 hr. |
| 3 | **Branded outreach emails** | Currently sending from default GHL sender; lower open rate | Set up `pitch@recordstops.com` (SendGrid domain auth), or verify GHL sender domain. ~30 min. |
| 4 | **No social campaign published** | 60-day calendar built Feb 9, ready, never started | Just publish. The calendar is in `marketing/60-day-content-calendar.md`. ~30 min/day to maintain. |
| 5 | **No traffic acquisition motion** | Site sits at 683 monthly with no growth lever | Reddit (r/vinyl, r/RecordCollector), Twitter/X, IG, podcast pitches. Already partly designed. |
| 6 | **Admin section exists but isn''t part of daily flow** | Forces context switch out of email | **Don''t fix this.** Manage via email + GHL until 25+ customers. Then revisit. |

---

## 8. Marketing motion (what''s actually realistic)

Brian has 5 hr/week across the entire portfolio. RecordStops gets ~1.5 hr/week of that time.

Allocation:
- **45 min: Store outreach** — 3 personalized pitches/week via `/admin/templates` × 4 weeks = 12 pitches/month
- **30 min: Social** — 1 post/week on Twitter/X + 1 on Facebook from the calendar (already built, just publish). **No Instagram — Brian doesn''t use it.**
- **15 min: Inbox** — replies, GHL admin, anything that pinged
- (no time for: blogs, podcasts, paid ads, AdSense optimization)

12 pitches/month × 25% conversion = **3 customers/month** = $45/mo each month added. By month 3: $135 MRR. By month 6: $270 MRR.

Conservative target: $75 MRR by Aug 1 (5 customers). Stretch: $200 MRR.

---

## 9. Kill criteria

Evaluated **Aug 1, 2026** (90 days from today):

| Outcome | Action |
|---|---|
| **<5 paying Featured Listings** | Featured-listings model is dead. Pivot to affiliate-only. Or list on Acquire.com as "vinyl directory + GHL pipeline + 296 stores + 683 monthly users" for $5K-15K. |
| **5–10 paying** | Model works but converting slowly. Push another 30 days, optimize pitch, double the cadence. |
| **>10 paying** | Hard validation. Push to 25 paying by EOY. Layer affiliate. |

These are codified so we don''t fall in love with the build. The numbers decide.

---

## 10. Resolved decisions (2026-05-03)

| # | Decision | Resolution |
|---|---|---|
| 1 | Patrick Foster podcast lead | **Dead.** Brian replied; no response. Move on. |
| 2 | Domain | Keep `recordstops.com`. |
| 3 | Pricing | $15/mo or $150/yr Featured. No new tiers this quarter. |
| 4 | Geography | Stay in current 5 states. No expansion until monetization works. |
| 5 | Tech stack | Astro + D1 + R2 + GHL + SendGrid. No platform changes. |
| 6 | Affiliate programs | Amazon Associates, Turntable Lab, Crutchfield. Sign up + link this week. |
| 7 | iOS app | None. Web is enough. |
| 8 | Standard doc template | Adopted. This file replaces all prior PRDs. |

---

## 11. Open questions for Brian

1. **~~Outreach engine: build or manual?~~** **RESOLVED 2026-05-03.** Built. `/admin/templates` + `POST /api/admin/outreach/send` deployed. Sends via SendGrid directly (bypasses GHL).
2. **Featured Listing visual differentiation** — is current "pinned + hero + badge" enough to justify $15/mo? Or add 1-2 things (e.g., "latest Twitter post embedded") that move the value prop from abstract to obvious?
3. **AdSense at 683 users** — Google AdSense has no minimum. Worth running for $5-15/mo, or distraction?
4. **Branded sender** — Worker uses `EMAIL_FROM=RecordStops <hello@recordstops.com>`. Verify SendGrid domain auth on `recordstops.com` (DKIM/SPF/DMARC). If domain is verified, outreach is now branded — done. If not, that''s a 30-min DNS task.
5. **Where do affiliate links live without a gear page?** Options:
   - Embed inline in city guide articles ("if you need a turntable to play these on…" + Crutchfield link)
   - "Recommended setup" sidebar on store detail pages
   - New `/setup` page (single review-style article, not a directory of categories)
   - Just put them in the newsletter footer
   Pick one before signing up for the affiliate programs.

---

## 12. Source documents
- Market research: [MARKET-RESEARCH.md](./MARKET-RESEARCH.md)
- Design direction (voice for outreach + social): [DESIGN-BRIEF.md](./DESIGN-BRIEF.md)
- Architecture + known bugs: [TECHNICAL-SPEC.md](./TECHNICAL-SPEC.md)
- Archived legacy docs: [tasks/_archive/](./_archive/)
', 33, 'site-recordstore-directory/tasks/PRD.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Record Store Directory

A comprehensive directory helping vinyl enthusiasts find independent record stores.

## Status

**Planning** - Ready to build

## Documents

| File | Description |
|------|-------------|
| [PROJECT-NOTES.md](./PROJECT-NOTES.md) | Full project research, strategy, and architecture |
| [CHECKLIST.md](./CHECKLIST.md) | Granular launch checklist with all tasks |

## Quick Stats

- **Evaluation Score:** 77/100
- **Verdict:** BUILD
- **Market Size:** $1.9B (2024), growing 6.8% CAGR
- **Monetization:** Affiliate (gear) + Ads + Premium listings

## Differentiation

- Hyper-local depth (visit stores personally)
- Genre specialties documented
- Owner interviews and store spotlights
- Event calendars (RSD, in-store performances)
- Gear reviews paired with store discovery

## Tech Stack (Planned)

- Astro (static site)
- Tailwind CSS
- Supabase (database)
- Cloudflare Pages (hosting)
- Mapbox or Google Maps

## Next Steps

1. Choose and purchase domain
2. Set up project scaffold
3. Visit local record stores
4. Build MVP with 15-30 stores
5. Launch and iterate
', 90, 'site-recordstore-directory/README.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;

INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)
SELECT id, 'doc', 'README', '# Outreach Email Templates

Email templates for store owner outreach via Directory Factory.

## Templates

| # | File | Purpose | When to Send |
|---|------|---------|--------------|
| 1 | `01-verification-initial.html` | Initial listing notification | Day 0 |
| 2 | `02-verification-followup.html` | Follow-up if no response | Day 7 |
| 3 | `03-premium-upsell.html` | Offer featured listing | Day 14+ (after verification) |

## Template Variables

Use these variables in your templates - they''ll be replaced with actual data:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{store_name}}` | Business name | Lunchbox Records |
| `{{contact_name}}` | Owner/contact name | Mike |
| `{{city}}` | City | Charlotte |
| `{{state}}` | State | North Carolina |
| `{{email}}` | Store email | mike@lunchboxrecords.com |
| `{{listing_url}}` | Full URL to listing | https://recordstops.com/stores/north-carolina/lunchbox-records |
| `{{site_name}}` | Directory name | RecordStops |
| `{{site_url}}` | Directory URL | https://recordstops.com |

## Using with Directory Factory

1. Go to **Outreach** page in Directory Factory
2. Select "RecordStops" site
3. Choose template from dropdown
4. Select recipients and send

## Subject Lines

- **Template 1:** Your record store is listed on {{site_name}}
- **Template 2:** Quick follow-up about {{store_name}} on {{site_name}}
- **Template 3:** Make {{store_name}} stand out on {{site_name}}

## Sequence Timing

```
Day 0:  Send Template 1 (Initial verification)
Day 7:  Send Template 2 (Follow-up) if no response
Day 14: Send Template 3 (Premium upsell) - optional, only for engaged stores
```

## Notes

- All templates include unsubscribe link in footer
- Templates use Handlebars-style `{{#if}}` conditionals for optional fields
- Keep subject lines under 60 characters for mobile
', 90, 'site-recordstore-directory/templates/outreach/README.md'
FROM projects WHERE name = 'RecordStops' LIMIT 1;
