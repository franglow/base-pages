# Pass 2 — Copy and messages

*16 Sept 2026. Follows [pass-1-direction.md](pass-1-direction.md). Covers the homepage, services headline, About page, the Small Fix, Instagram DMs, and the friend and referral messages. English only. Strategy and copy only, no code.*

---

## Decisions this pass is built on

- **Name: keep Base Pages.** This replaces Task 3 in Pass 1. To make it work, **always pair the brand with the person**: "Base Pages · Fran Cortez". Your face and first name should come before the brand wherever people meet you first (homepage hero, Instagram display name, DM signature, email signature). The brand can stay; people just need to see that a person is behind it.
- **Languages:** English is the main language. Spanish is native and used when it helps. German is not used for sales.
- **Agreed:** the **Small Fix at €120** is added, and **Scale is hidden** from the homepage and nav (its URL stays live).
- **Voice rules** (from your copy preferences):
  - No jargon, and no "solutions / digital / conversion / SEO / funnel".
  - Describe outcomes instead.
  - "Translate" is the word used in messages; "bridge" appears **once**, in writing, on the About page, and is never said out loud.
  - **Disney and LATAM are not named in client-facing copy** unless someone asks. This replaces Pass 1's suggestion to name them on the About page.
- **Testimonials** below are copied exactly from the live site (`src/i18n/en.json`). Mareen's quote on the site is longer than the version in the brief (the brief cut part of it with "..."). The site version is her real wording, so that's the one used here.

---

## 1. Homepage — the credibility page

**New order:**
1. Hero (you)
2. Cornelia's testimonial
3. Where to start (the doors)
4. Work
5. What working with me is like
6. Mareen's testimonial
7. "Tell me what's going on" contact block

The designer banner moves off the homepage to a footer link (see §6).

*Implementation note for later: blocks 2, 5, 6 and 7 don't exist on the homepage today. This is copy only.*

### 1.1 Hero

| Field | Now | New |
|---|---|---|
| Small label above | — | BASE PAGES · FRAN CORTEZ · BERLIN |
| Title | "Websites that perform." / "Landing pages that convert." | **You speak your practice. I speak tech.** |
| Subtitle | "Lightning-fast architectures designed to capture leads and outshine the competition." | I'm Fran. I build and look after websites for yoga teachers, therapists, coaches and retreat hosts in Berlin. You tell me what you need in your own words — I translate it into something that works, and explain it back in plain English. |
| Main button | "Explore services" | **Message me on WhatsApp** |
| Second button | — | See how I can help → (scrolls to *Where to start*) |
| Location | "US" | Berlin |
| Line under the buttons | — | I work in English and Spanish. |

**Notes:**
- Use one fixed title instead of the two rotating ones. A rotating headline feels like a product demo; one calm sentence feels like a person.
- Put your photo in the hero. It's the most important thing on the page for a DM recipient checking whether you're real.
- `hero.promo` currently says "Use for free". Check where it shows up. If it's visible, remove it, because it contradicts the paid offer.
- Homepage page title and link preview (it currently falls back to the old subtitle): **Base Pages — Websites for yoga teachers, therapists & retreat hosts in Berlin**

### 1.2 Cornelia's testimonial (directly under the hero)

Label above: **In a client's words**

> Fran built a beautiful website for my coaching business this year, stepping in where I lacked technical know-how and ideas. From the very first moment, he was highly engaged, providing structure, ideas, and helpful suggestions. Fran was professional, reliable, and fast, and he always responded to change requests promptly and with a lot of patience.
>
> — Cornelia Jaeger · Ergotherapie & Coaching

**Visually emphasise:** *"stepping in where I lacked technical know-how and ideas"*. Placed right under "You speak your practice. I speak tech.", it proves the title in her words.

### 1.3 Where to start (replaces the services headline)

| Field | Now | New |
|---|---|---|
| Label | SERVICES & PRICING | WHERE TO START |
| Headline | "I don't charge by the hour. I charge for value, speed, and clean code that converts. Pick your foundation." | **Start where you are.** |
| Intro | — | No website yet, a retreat to fill, or a site that's gone quiet — pick the one that sounds like you. Every price is fixed and written down, so there are no surprises. |
| Count badge | "6" | Remove |

**The doors.** Each card leads with the visitor's situation; the package name comes second.

**1. "I need a website I'm proud of."**
The Starter Package · From €890 · Live in 5 days
A one-page website that feels like you, that you can update yourself.

**2. "I have a retreat or offer to fill."**
The Growth Package · From €1,750 · Live in 10 days
One page that turns interest from Instagram into real bookings — the same approach behind Carma Retreats' sold-out first retreat.
*(The sold-out claim is your statement, not Mareen's. See §5.)*

**3. "I have a website, but it's quiet — or something's broken."**
Care Plus · From €490, then €290/month
I get your site into shape so the people nearby who'd love what you do can actually find it — then keep it that way. Wix, Squarespace, WordPress, whatever you have.

**Small card underneath: "Just one thing isn't working?"**
The Small Fix · €120
A booking link that goes nowhere, a form that doesn't send, a page that looks wrong on phones. One fix, done within a few days — plus a short note on anything else I noticed.

**Changes to the existing homepage blocks:**
- `services.items`: keep Starter and Growth, **remove Scale**.
- `services.carePlus`: becomes door 3 (copy above).
- `services.cta` (currently the Care retainer): becomes the **Small Fix** card. Care stays where it already makes sense, on the Care Plus page as what happens after the tune-up.
- Growth's current subtitle, *"the landing page that fills your retreats"*, promises an outcome you can't guarantee for every client. The new line points to what happened for Carma instead.

### 1.4 What working with me is like (new, three short points)

Label: **WHAT IT'S LIKE**

- **One person, start to finish.** You talk to me, not a team. The person who builds your site is the one who answers your message a year later.
- **Plain words.** I explain what I'm doing and why — no jargon, and no feeling silly for asking.
- **Someone to message when it breaks.** WhatsApp or email — I reply within one working day, and urgent problems usually get an answer the same day. *(See §9 for the reasoning.)*

### 1.5 Mareen's testimonial

> Fran is very well structured and maps out the process very well, so I always knew at what stage the website was, and he checked in with me regularly when he needed some more material. Its very easy to work with him because he communicates so clearly, and he has done a wonderful job for Carma Retreats.
>
> — Mareen · Carma Retreats

**Visually emphasise:** *"he communicates so clearly"*.
⚠️ The quote contains "Its" where standard spelling is "It's". Don't correct it yourself. If it bothers you, ask Mareen whether she's happy for you to fix it. Otherwise leave it: a small slip is part of what makes it read as real.

### 1.6 Closing contact block

- **Headline:** Not sure where to start? Tell me what's going on.
- **Text:** A few lines are enough. I'll take a free 15-minute look and tell you honestly what I'd do — even if the answer is that you don't need me.
- **Main button:** Message me on WhatsApp
- **Second button:** Or send an email

**Contact page title:** currently *"Let's build your engine"* → **Tell me what's going on.**

---

## 2. The Small Fix — offer wording

This can go on the services page or its own short page; no full landing page is needed yet. Add "A small fix" as an option in the contact form.

**Title:** The Small Fix
**Price:** €120, paid upfront
**One line:** One thing on your website that isn't working — fixed within a few days.

**What counts as a small fix:**
- A booking or payment link that goes to the wrong place
- A contact form that doesn't send
- A page that looks broken on phones
- Swapping out text, photos or prices you can't figure out how to change
- Your Instagram, email or map not connected properly

**What you get:**
- A reply within one working day, and the fix done within 3 working days of payment *(confirmed)*
- A short note, **"What I noticed"**: up to three things on your site worth knowing about, in plain words. No obligation.
- If you go ahead with Starter or Care Plus within 30 days, the €120 comes off the price.

**If it's bigger than a small fix:** I'll tell you before I start, and you decide. No surprise invoices.

**Any platform.** Wix, Squarespace, WordPress, Webflow, or something custom.

*Internal rule, not published: at most ~4 small fixes a month. If one client needs more than two in a quarter, suggest Care Plus.*

---

## 3. About page

The About page is the biggest change: it goes from "AI search architecture" to the story of who you are.

### 3.1 Hero

| Field | Now | New |
|---|---|---|
| Label | ABOUT ME | ABOUT ME |
| Headline | "I future-proof brands for the AI search era with high-performance digital architectures." | **Hi, I'm Fran. I take care of the tech, so you can take care of your clients.** |
| Image | Stock photo of a team at laptops | **A real photo of you.** A stock team photo contradicts "one person, start to finish". |
| Browser tab title | "About Us - base-pages" | About Fran — Base Pages |

### 3.2 My story (replaces "MY METHOD / The Strategy / The Execution / The Growth")

Label: **MY STORY**

> For more than ten years I worked as a software engineer, on big teams, for large international companies. It taught me how to build things that are solid and don't break.
>
> Now I use it for something that matters more to me. I do this so people who hold space for others can focus on that — instead of worrying about websites, bookings and technology.
>
> Yoga teachers, therapists, coaches, retreat hosts — you're experts at something that has nothing to do with websites. You shouldn't have to learn a new language just to be found online. Think of me as the bridge between your practice and the tech it needs: you tell me what you need, however you'd say it, and I translate it into something that works — and explain it back in words that make sense. I take care of the tech, so you can focus on your practice.

*The middle paragraph uses your own reason, lightly shaped. "Hold space" is how this audience describes its own work, so hearing it back signals that you understand their world.*
>
> I live in Berlin and work in English and Spanish. My German is still growing.

*This is the one written use of "bridge" on the site. Remove the sentence if you'd rather not have it at all. If you want the big names in, add "including Disney and LATAM Airlines" after "large international companies". By default they're left out.*

### 3.3 How I work (three cards, replacing Strategy / Execution / Growth)

The current images (`strategy.png`, `execution.png`, `growth.png`) will need replacing to match.

**1. First, I listen.**
We start with a conversation about your practice, not about technology. Who you help, how people find you now, what feels hard. I ask the questions — you don't need to know the answers in tech terms.

**2. Then I build — and keep you in the loop.**
I map out every step before we start, so you always know where things are. You see your site as it takes shape, and you can change your mind along the way.

**3. Then I stay.**
A website should keep working after launch day. I make sure yours loads quickly, stays safe, and shows up when people nearby search for what you offer. When something breaks, you message me.

*Card 2 echoes Mareen's words on purpose ("I always knew at what stage the website was"), so the page and her testimonial agree.*

### 3.4 What I care about (replaces "01 I engineer for AI retrieval / 02 I design conversion funnels / 03 I build resilient partnerships")

**01 — Plain words, always.**
If I can't explain it simply, that's my job to fix, not yours. No jargon, and no question is too small.

**02 — Honest about what's possible.**
I'll tell you what a website can and can't do for your practice — and when you don't need me at all.

**03 — One person, for the long run.**
No agency layers, no hand-offs. The person you talk to on day one builds your site and answers your message a year later.

### 3.5 Testimonial on the About page

Mareen's quote exactly as in §1.5, with the same emphasis. Cornelia's stays on the homepage so the same quote doesn't appear twice on one visit.

### 3.6 Team block

- **Role:** *"Founder & Senior Frontend Engineer"* → **Founder · I build and look after your website**
- **Name:** use **Fran Cortez** everywhere a client sees it. The Starter page currently says "Francisco Cortez". Your full legal name stays in the Impressum.
- **Closing link:** keep "Connect on LinkedIn →". Add **Message me on WhatsApp** as the main button.

---

## 4. Messages

**Rules for every message:**
- Written by hand, one at a time, mentioning something real about the person.
- No links in the first message. Links in a first DM look like phishing and raise spam flags.
- No criticism of their website.
- No prices.
- One gentle follow-up after 5–7 days at most, then stop.

### 4.1 Friends: asking for introductions

Send to 40–60 people, one by one. Adjust it to how you'd actually talk to each person.

> Hey [name]! Quick one. I've started helping yoga teachers, therapists, coaches and retreat hosts here in Berlin with their websites — building them, fixing them, and being the person they can message when the tech side gets confusing.
>
> Do you know anyone like that? Even one name would really help. Coffee's on me 🙂

*If they give a name, ask them to introduce you in a group chat or forward a line, rather than you messaging cold with "[friend] gave me your name".*

### 4.2 Mareen: referral request

> Hi Mareen, I hope the retreats are going beautifully!
>
> I'd love to ask you a small favour. I'm focusing my work on people in the wellness world here in Berlin, and you know that world far better than I do. Is there anyone — a teacher, a facilitator, someone who's held space at Carma — who you think could use some help with their website?
>
> If you're comfortable with it, I'd mention that you suggested I get in touch. And no pressure at all if nobody comes to mind.

*Send separately, later, and only if you want it: ask whether she'd like to add a sentence about the sold-out retreat to her testimonial, in her own words. Don't suggest the wording.*

### 4.3 Cornelia: referral request

> Hi Cornelia, I hope all is well with you and your practice!
>
> Can I ask you a small favour? I'm focusing my work on therapists, coaches and people in the wellness world here in Berlin. Do you know anyone who might need help with their website — ideally someone who's comfortable working in English?
>
> If you're happy to, I'd mention that you suggested I reach out. And of course, no pressure at all.

### 4.4 Third client: testimonial request

> Hi [name], I really enjoyed working on your project.
>
> Would you be willing to write a few sentences about what it was like working with me? Whatever feels true to you — short is perfect. I'll use it on my website exactly as you write it.
>
> And if you know anyone in Berlin who could use help with their website, I'd be very grateful for an introduction.

*Don't suggest what to write. Unprompted words are what make testimonials work, and "exactly as you write it" is a promise you keep.*

### 4.5 Instagram DM: someone you've never met

**Only send after 1–2 weeks of genuinely engaging with their posts**, so your name isn't new to them.

**Long version:**

> Hi [name], I'm Fran — I really enjoyed [something specific: your post about…, the way you talk about…].
>
> I don't want to be one more stranger in your inbox trying to sell you something, so I'll be straightforward: I live in Berlin and help yoga teachers, therapists and retreat hosts with the tech side of their work, mostly their websites.
>
> Sometimes that's a whole new site. Often it's the smaller things that quietly take up headspace — the website you set up years ago and don't dare touch anymore. The booking link that doesn't quite go where it should. That feeling that people find you on Instagram but don't make it to your classes.
>
> If any of that sounds familiar, I'm happy to take a quick look and tell you honestly what I see. No cost, no pitch. And if not, I'll just keep enjoying your posts.

**Short version:**

> Hi [name], I'm Fran — loved [specific thing]. I'm in Berlin and help yoga teachers and retreat hosts with the tech side of their work, mostly websites.
>
> Is there anything on yours that's been bugging you, or that you keep putting off? Happy to take a quick look, no strings — and no worries at all if not.

**Why it's built this way:**
- The three examples work as a mirror. Each is a feeling ("don't dare touch", "doesn't quite go where it should", "don't make it to your classes"), not a service.
- "Sometimes that's a whole new site" keeps the bigger projects in view, so you don't get cast as just the fix-it person.
- The close asks for a reply, not a sale.

### 4.6 Instagram DM: someone you've met or were introduced to

**After meeting in person:**

> Hi [name], it was lovely meeting you at [event]! You mentioned [the thing they said about their website / bookings / being hard to find]. That's exactly the kind of thing I help with — would you like me to take a quick look this week? No cost, just a friendly look, and I'll tell you honestly what I'd do.

**After an introduction:**

> Hi [name], [friend] suggested I say hello — I'm Fran, I help yoga teachers, therapists and retreat hosts in Berlin with their websites and the tech around their work. [Friend] mentioned [what they said, if anything]. Happy to take a quick look or just have a chat, whatever's useful.

**Warm vs. stranger:**

| | Stranger | Warm |
|---|---|---|
| Before messaging | 1–2 weeks of genuine engagement | Not needed |
| Their problem | Unknown, so use mirror examples | Known, so name what they told you |
| Offer | "Happy to take a quick look" | Offer the look directly, with a time |
| Tone | A bit more careful and explanatory | Direct and friendly |
| Follow-up | One, after 5–7 days, then stop | One, and a coffee or call is fine |

### 4.7 Practical risks of DMing from a new account

- **Message Requests.** Your messages to strangers land in a folder many people never open. Engaging first (likes, real comments, story replies) makes it much more likely they see you.
- **Action blocks.** New accounts that send many similar messages get temporarily restricted. Keep to **5 a day at most** and personalise every message.
- **Your profile is the second message.** Before replying, people check your profile. Have your face, your name, a clear bio and 3–6 posts in place before the first DM.
- **Keep a simple tracker** (name, date, where you met, reply yes/no, next step). It's also your count of conversations per week, the number Pass 1 says to track.

---

## 5. Testimonial and claim rules (checklist)

- Both quotes are used **exactly** as in `en.json`, including "Its".
- **Neither quote says "sold out".** That claim always appears as your own statement (for example on the Growth card, or in the Carma case study headline), visually separate from Mareen's quote.
- If Mareen or Cornelia ever adds a sentence, it's their sentence, unedited.
- The third testimonial follows the same rules when it arrives.

---

## 6. Keeping the designer offer without splitting the site's voice

- **Remove the designer banner** (`designerBanner`) and the partnership block from the homepage and About page.
- **Add a footer link:** *For designers →*
- On the Partnership page, add one line at the top so the change in tone feels deliberate: **"This page is for designers and studios. It gets a bit technical — on purpose."** Everything below stays as technical as it is now.
- Use the page in one-to-one conversations with brand designers and photographers (Pass 1, weeks 3–6).

---

## 7. German and Spanish: adapt, don't translate

Don't write these until the English has been tested in real conversations. When you do:

**Wordplay doesn't carry.** "You speak your practice. I speak tech." needs a new line in each language, not a translation.

**German:**
- **Du vs. Sie.** The yoga and retreat scene is mostly *du* (the current site uses *du*), but therapists, especially in health professions like Ergotherapie, often expect *Sie*. Decide per page, or keep *du* and accept that some therapists will find it too casual.
- **Less warmth, more concrete detail.** German readers tend to distrust emotional copy and look for specifics: price, timing, what's included, data protection.
- **Language honesty is most important here.** The German homepage must say clearly and early that conversations and support happen in English (or Spanish). Otherwise the first call disappoints.
- Have a native speaker proofread everything before it goes live.

**Spanish (you can write this yourself):**
- **Choose a register.** Berlin's Spanish-speaking community mixes Latin American and Spanish speakers. A neutral Latin American *tú* works for most people. Avoid *vosotros* and strong regionalisms.
- **Warmth carries more naturally.** The friend and DM messages can be even more personal in Spanish than in English.
- **The honest-language line** reverses: say that you work in Spanish and English.

---

## 8. Other wording to fix later (outside this pass)

Found while reading the live copy. None of it blocks outreach, but a careful visitor may notice these:

| Where | Now | Problem |
|---|---|---|
| Starter hero badge | "Lighthouse ≥ 95 guaranteed" | Jargon. Replace with "Loads fast on any phone". |
| Carma case study | "Astro… Meta pixel + conversion events, SEO set up from day one", "via the new booking funnel" | Jargon on the page with your strongest proof. Rewrite as outcomes. |
| Care page, contact confirmation, Starter thank-you page | Four different reply promises | ✅ **Done 16 Sept.** Aligned in EN/DE/ES (§9). |
| Starter founder | "Francisco Cortez" | Use "Fran Cortez" (§3.6). |
| Scale page | "15 years" (all languages) | Should be "10+". |
| Hero | `location: "US"` / `"Deutschland"` / `"Argentina"` | Should be Berlin. |
| Impressum / Datenschutz | § 5 TMG, §§ 7–10 TMG | Regenerate from e-recht24 (TMG was replaced by DDG). |

---

## 9. Reply times — research and the standard

### What the research shows

- **Customer surveys say people expect near-instant replies:** under 1 hour for email and under 5 minutes on WhatsApp. These numbers mostly come from companies that sell chatbots and support software, and they measure large companies and online shops. They're the wrong benchmark for one person, and not a promise you could keep at 20–25 hours a week.
- **What businesses actually manage:** about 12 hours on average for email (SuperOffice); about 23 hours in Germany.
- **Website care plans:** 24–48 hours is the normal reply time for basic plans. Faster replies are sold as a premium, and emergencies are handled separately.
- **New enquiries lose value fast.** An HBR study of 2,241 companies found that firms replying to a new enquiry within an hour were about 7× more likely to have a meaningful conversation with the prospect than firms replying later, and that results dropped sharply after 24 hours. The study is from 2011 and covers US business sales, so it's directional for you, not exact.
- **No data exists** on reply-time expectations among wellness practitioners specifically. The standard below is my judgement, based on the sources above and your 20–25 hours a week.

### The standard (now live everywhere on the site)

| Situation | Public promise | Your private goal |
|---|---|---|
| Any message, from a new enquiry or an existing client | **Within one working day** (Mon–Fri) | New enquiries: same day, ideally within a few hours. The HBR finding says this matters more than anything else. |
| Urgent (site down, bookings broken), Care clients | **Usually the same day**, Mon–Fri 9–18 Berlin time | Within a few hours |
| Small changes on Care | **Most done within two working days** | — |
| Small Fix | **Done within 3 working days of payment** | — |
| Guaranteed urgent response (Care add-on, +€90/mo) | Unchanged | — |

**Why one working day:**
- It beats what businesses actually manage, and it's faster than the typical care-plan promise.
- You can keep it by checking messages twice a day.
- It protects your weekends.
- It sits honestly under the paid "guaranteed same-day" add-on. The old copy promised same-day urgent replies as standard *and* sold them as an extra.

### What changed on the site (EN, DE, ES)

- **Care page:**
  - Hero text: "it's done — usually the same day" → a reply within one working day, most small changes within two.
  - Badge: "Reply within 48h" → "Reply within 1 working day".
  - "A real person" feature: the same promise as the hero.
  - Included list: 48 hours → one working day, urgent issues usually the same day.
  - Site-down FAQ: "within a few hours" → "usually the same day", and "Central European Time" → "Berlin time".
- **Contact form confirmation:** "We'll… within 24 hours" → "I'll read your message and reply within one working day". It also switched from "we" to "I".
- **Starter thank-you page:** the same change.
- **Deliberately unchanged:**
  - The Scale and Partnership "estimate within 48 hours" and "48 hours' notice" lines. Those are about delivering an estimate, not replying.
  - The Starter "checklist the same day you book".
- **German register:** the German Care page already mixed *du* (hero) and *Sie* (FAQ). I kept each line in the register it already used. Have the German changes proofread by a native speaker along with everything else.

### One practical step

**WhatsApp creates an expectation of near-instant replies.** Set a WhatsApp Business greeting or away message that states the promise, for example: *"Thanks for your message! I reply within one working day — usually much sooner."* That way a two-hour silence doesn't feel like being ignored.

**Sources:**
- [Harvard Business Review — The Short Life of Online Sales Leads](https://hbr.org/2011/03/the-short-life-of-online-sales-leads)
- [Ringly — Customer service response time benchmarks](https://www.ringly.io/blog/customer-service-response-time-benchmarks)
- [LiveChatAI — Customer support response time statistics](https://livechatai.com/blog/customer-support-response-time-statistics)
- [FatLab — WordPress care plans](https://fatlabwebsupport.com/blog/website-maintenance/wordpress-care-plans/)
- [SuperOffice — Kundenservice-Antwortzeiten](https://www.superoffice.de/quellen/artikel/kundenserviceantwortzeiten/)
- [urbandivision — E-Mail-Antwortzeit auf Anfragen](https://urbandivision.de/email-antwortzeit-auf-anfragen-reaktionszeit-bei-emails/)

---

## Next

1. ✅ **"Real reason" paragraph** added (§3.2).
2. ✅ **Reply times** set and live on the site (§9). ✅ **Small Fix turnaround** confirmed.
3. **Send the friend messages and the Mareen, Cornelia and third-client messages this week.** They don't depend on the site changes.
4. **Set the WhatsApp Business away message** (§9).
4. **Pass 3** (visual identity and Instagram: bio, content themes, first posts) comes after your first ~10 real conversations, as agreed in Pass 1.
