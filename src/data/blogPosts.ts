export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "omg-cable-favorite-hacking-tool",
    title: "My fave hacking tool: The OMG cable",
    excerpt: "A reflection on the OMG cable — why it remains my favourite piece of offensive hardware, the experiment I'm running with it right now, and a friendly warning about borrowing cables from me.",
    date: "2026-04-20",
    readTime: "9 min read",
    tags: ["Offensive Security", "Hardware", "Red Team", "OMG Cable"],
    content: `Every offensive security practitioner has that one tool they keep coming back to. For some it's Burp Suite. For others, it's a battered copy of Metasploit and a stubborn refusal to let it die. For me, it's a cable. A small, unassuming, frankly *boring*-looking cable. The OMG cable.

If you've never heard of it, picture this: a USB cable that looks identical to the one currently charging your phone. Same weight. Same flex. Same little branded moulding near the connector. You could throw it in a drawer with twenty other cables and never find it again. And yet, hidden inside the connector shell is a tiny implant — a microcontroller, a Wi-Fi radio, and just enough firmware to ruin somebody's week.

## A short history

The OMG cable started life as a research project by Mike Grover (MG), who wanted to prove a point that most of us in security had been making for years but rarely demonstrated convincingly: the supply chain for *cables* is just as untrustworthy as the supply chain for software. Early prototypes were hand-soldered, ugly, and unreliable. The current generation, produced in partnership with Hak5, is a polished commercial product that fits an entire offensive platform inside a connector smaller than my thumbnail.

What I love about the origin story is that it didn't come from a vendor trying to sell us a new category of "next-gen endpoint cable threat detection." It came from a researcher with a soldering iron and a hunch. That's the lineage of nearly every tool I actually trust.

## Why I love it

### 1. Stealth

This is the headline feature and it deserves the top spot. The cable looks like an ordinary cable. It *behaves* like an ordinary cable. You can plug it into a phone and it will charge. You can plug it into a laptop and transfer files. There is no blinking light, no suspicious enumeration, no "Unknown HID device" prompt unless the operator wants one. In a world where most offensive hardware screams its presence the moment it touches a USB port, the OMG cable whispers.

I've watched seasoned engineers — people who would never plug a random USB stick into their machine — happily accept a "spare charging cable" without a second thought. Cables are invisible. We've trained ourselves to be paranoid about the wrong shape of plastic.

### 2. Configured over a Wi-Fi interface

The cable hosts its own Wi-Fi access point. You connect to it from your phone or laptop, open a web UI, and you're staring at a payload editor. No need to be in the same room as the target. No need to retrieve the cable to reprogram it. If the cable is plugged in somewhere on the other side of an office, and you're within Wi-Fi range, you can push new payloads, trigger them on demand, or exfiltrate small amounts of data back through the same channel.

This is the part that turns it from a clever party trick into a genuine red-team primitive. Persistence and remote control on a device that the target literally bought as a "charger."

### 3. Ducky Script

The payload language is Ducky Script — a human-readable DSL originally built for the USB Rubber Ducky. I've written things in x86 assembly. I've fought with C and its many opinions about memory. I've spent more hours than I'd like to admit chasing segfaults that turned out to be a missing semicolon three files away. After all of that, opening a Ducky Script file feels like a small holiday.

\`\`\`
DELAY 1000
GUI r
DELAY 500
STRING powershell -w hidden -c "..."
ENTER
\`\`\`

That's it. That's a payload. You can read it out loud. You can hand it to a junior analyst and they'll understand what it does in thirty seconds. The barrier to entry is so low that the limiting factor becomes *creativity*, not syntax — which is exactly how a tool should feel.

## The experiment I'm running

Right now I'm using the cable for a small, self-contained experiment on cross-machine lateral capability. The cable's "active" end — the one with the implant — is the USB-A side. That means whichever machine the USB-A end is plugged into is the one being attacked, regardless of which device is on the other end of the cable.

The setup is deliberately mundane. A laptop on a desk. The cable runs from the laptop's USB-A port to a phone sitting innocently next to it, apparently charging. From the outside, it looks like the laptop is the host and the phone is the peripheral. In reality, the laptop is the target. The phone is just set dressing.

What I'm measuring isn't whether the attack *works* — that part is well established. I'm measuring **time-to-detection** under different endpoint configurations: a stock corporate image, a hardened image with HID filtering, and an image with a behavioural EDR tuned for keystroke-injection patterns. I want to know how long a realistic payload — one that doesn't try to be clever, just types like a slightly impatient human — can run before something, anything, notices.

Early results are humbling. The stock image notices nothing. The hardened image notices the *type* of device but not the behaviour. The EDR notices the behaviour but only after enough keystrokes that a competent operator would already have what they came for. I'll write up the full results in a follow-up post once I've run the test against a few more configurations.

The broader point I keep coming back to: most of our defensive stack assumes the threat is software. The OMG cable is a reminder that the threat can be the *cable*.

## A reflection

I've been doing this work long enough to be a little tired of "shiny new tool" energy. Most things that get hyped at conferences end up gathering dust in a Pelican case six months later. The OMG cable is one of the rare exceptions. I bought mine years ago and it has earned its place in my kit on every single engagement since. It's quiet. It's reliable. It does one thing extraordinarily well. And it forces every client I show it to to rethink an assumption they didn't even know they were making.

That last part is, honestly, the reason I love offensive security. The best tools aren't the ones that pop the most shells. They're the ones that change how someone thinks about their environment. The OMG cable does that every time I pull it out of my bag.

## P.S.

Never borrow a cable from anyone.

I mean it kindly. I really do. But also — never borrow a cable from anyone.`,
  },
  {
    slug: "understanding-zcdpa",
    title: "Understanding the Zimbabwe Cyber and Data Protection Act",
    excerpt: "A breakdown of Zimbabwe's landmark data protection legislation and what it means for businesses operating in the region.",
    date: "2026-03-15",
    readTime: "6 min read",
    tags: ["Compliance", "ZCDPA", "Data Protection"],
    content: `The Zimbabwe Cyber and Data Protection Act (ZCDPA) represents a significant step forward in the country's digital governance framework. As businesses increasingly digitize their operations, understanding this legislation is not just a legal requirement — it's a strategic imperative.

## Key Provisions

The Act establishes clear guidelines for how personal data should be collected, processed, and stored. Organizations must appoint a Data Protection Officer (DPO) and implement appropriate technical and organizational measures to protect personal data.

## What This Means for Businesses

For companies operating in Zimbabwe, compliance isn't optional. The penalties for non-compliance can be severe, including fines and potential criminal liability. But beyond the stick, there's a carrot: organizations that demonstrate strong data protection practices build trust with their customers and partners.

## Steps to Compliance

1. **Conduct a Data Audit** — Understand what personal data you collect and how it flows through your organization.
2. **Appoint a DPO** — Designate a qualified individual to oversee data protection compliance.
3. **Implement Security Measures** — Deploy encryption, access controls, and monitoring systems.
4. **Train Your Staff** — Ensure everyone understands their responsibilities under the Act.
5. **Document Everything** — Maintain records of processing activities and data protection impact assessments.

The journey to compliance is ongoing, not a one-time project. Stay vigilant, stay informed, and stay secure.`,
  },
  {
    slug: "llm-prompt-injection-defense",
    title: "Defending Against LLM Prompt Injection Attacks",
    excerpt: "How to protect AI-powered applications from prompt injection vulnerabilities that can compromise data integrity and system security.",
    date: "2026-02-28",
    readTime: "8 min read",
    tags: ["AI Security", "LLM", "Prompt Injection"],
    content: `As organizations rush to integrate Large Language Models into their workflows, a new attack surface has emerged: prompt injection. This vulnerability allows attackers to manipulate AI systems into performing unintended actions.

## What is Prompt Injection?

Prompt injection occurs when an attacker crafts input that overrides or manipulates the system prompt of an LLM. This can lead to data exfiltration, unauthorized actions, or the generation of harmful content.

## Types of Prompt Injection

### Direct Injection
The attacker directly provides malicious instructions to the model, attempting to override its system prompt.

### Indirect Injection
Malicious instructions are embedded in external data sources that the LLM processes — such as web pages, documents, or emails.

## Defense Strategies

1. **Input Sanitization** — Filter and validate all user inputs before passing them to the LLM.
2. **Output Validation** — Verify that LLM outputs conform to expected patterns before acting on them.
3. **Privilege Separation** — Limit the actions an LLM can perform. Never give it direct database access.
4. **Monitoring & Logging** — Track all LLM interactions for anomalous behavior.
5. **Human-in-the-Loop** — Require human approval for sensitive operations.

The key takeaway: treat LLMs as untrusted components in your architecture. Defense in depth applies to AI just as it does to traditional systems.`,
  },
  {
    slug: "honeypots-threat-detection",
    title: "Cyber Deception: Your Next Line of Defence",
    excerpt: "A practical guide to deploying honeypots as early warning systems in your network security architecture.",
    date: "2026-02-10",
    readTime: "5 min read",
    tags: ["Defensive Security", "Honeypots", "Threat Detection"],
    content: `Honeypots are one of the most underutilized tools in a defender's arsenal. By deploying decoy systems that mimic real assets, you can detect attackers early in the kill chain — often before they reach your actual infrastructure.

## Why Honeypots?

Traditional security tools are reactive. Firewalls block known threats, IDS/IPS systems detect known signatures. Honeypots flip the script: any interaction with a honeypot is suspicious by definition, because legitimate users have no reason to access them.

## Types of Honeypots

### Low-Interaction
Simulate basic services (SSH, HTTP, FTP) to capture initial reconnaissance. Easy to deploy, lower maintenance.

### High-Interaction
Full operating systems and services that allow deeper attacker engagement. More intelligence gathered, but higher risk and maintenance.

## Thinkst Canary

If I had to recommend a single product to a defender who wants high-signal alerts with minimal effort, it would be the Thinkst Canary. You unbox it, pick a personality (Windows file server, Linux box, network switch, SCADA device, you name it), and drop it on your network. That's basically the deployment.

What makes it special is the **low false positive rate**. You don't get drowned in noise. Most days you get *no* alerts at all — and that's the point. When the Canary does fire, it almost certainly means something interesting is happening. An attacker has moved laterally, or someone internal is poking at a share they have no business touching. Either way, you want to know immediately.

Compare that to a traditional SIEM, where defenders spend their week tuning rules and triaging alerts that turn out to be a backup job or a misconfigured scanner. Canaries flip the economics: fewer alerts, higher confidence per alert.

## Canary Tokens

Canary tokens are the free, lightweight cousin of the Canary appliance, and honestly they might be my favourite defensive primitive of the last decade. A token is just a tripwire dressed up as something attractive: a Word document, a PDF, an AWS credential, a database connection string, a folder, a URL. When someone opens it or uses it, you get an alert.

Where they really shine is in catching the things traditional tooling never sees:

- **Dumpster diving and physical snooping** — drop a printed "Q1 Salaries 2026.pdf" token on a desk or in a recycling bin. If anyone fishes it out, scans it, and opens it, you'll know.
- **Insider curiosity** — a file called \`Resignation_Letter_Draft.docx\` in a personal folder, or \`board_minutes_confidential.pdf\` on a shared drive, is irresistible to the wrong kind of nosy.
- **Post-breach detection** — credentials seeded in a config file that nobody legitimate should ever read. The moment they show up in a login attempt, you have ground truth that something is wrong.

The beauty is that legitimate users have no reason to interact with these files. Any hit is, by definition, worth investigating.

## Deployment Best Practices

1. **Place Strategically** — Deploy honeypots and tokens in segments where they'll catch lateral movement and curious insiders.
2. **Make Them Realistic** — Use realistic hostnames, plausible filenames, and content that matches the surrounding environment.
3. **Monitor Religiously** — Every alert from a honeypot or token deserves investigation. The whole value proposition is that there are very few of them.
4. **Integrate with SIEM** — Feed alerts into your SIEM and your on-call rotation, not just an inbox nobody reads.
5. **Keep Them Updated** — An outdated decoy can become a liability rather than an asset.

Honeypots won't replace your firewall, but they'll tell you things your firewall can't.

## A small reflection

I gave a talk on this with the Cybersecurity Mindmap community — a hands-on demo webinar walking through Canary tokens live, dropping them into folders, triggering them, and watching the alerts land. It was genuinely fun to teach, and also genuinely stressful when a few things didn't go as planned (live demos, as always, have opinions of their own). But that's part of the craft. You learn more from the demo that almost falls apart than from the one that goes perfectly.`,
  },
  {
    slug: "sdwan-security-architecture",
    title: "Securing SD-WAN: Architecture Considerations",
    excerpt: "Key security considerations when designing and deploying Software-Defined Wide Area Networks for enterprise environments.",
    date: "2026-01-20",
    readTime: "7 min read",
    tags: ["SD-WAN", "Network Security", "Infrastructure"],
    content: `SD-WAN has revolutionized how enterprises connect their branch offices and remote sites. But with this flexibility comes new security challenges that traditional WAN architectures didn't face.

## The Security Challenge

Traditional MPLS networks provided inherent security through private circuits. SD-WAN, by contrast, often routes traffic over the public internet, introducing exposure to a wider threat landscape.

## Security Architecture Principles

### Zero Trust at the Edge
Every SD-WAN edge device should enforce zero trust principles. Don't assume that traffic from a branch office is trustworthy just because it originates from a known location.

### Encrypted Tunnels
All inter-site traffic should traverse encrypted tunnels. IPSec and WireGuard are common choices, but ensure your encryption standards meet compliance requirements.

### Integrated Security Stack
Modern SD-WAN solutions integrate firewall, IPS, URL filtering, and malware detection directly into the edge device. Leverage these capabilities rather than backhauling traffic to a central security stack.

## Key Recommendations

1. **Segment Your Network** — Use micro-segmentation to limit blast radius.
2. **Centralize Policy Management** — Define security policies centrally and push them to all edges.
3. **Monitor East-West Traffic** — Don't just watch north-south. Lateral movement between sites is a real risk.
4. **Plan for Failover** — Ensure security controls remain active even when primary links fail.
5. **Regular Audits** — Continuously validate that your SD-WAN configuration matches your security policies.

SD-WAN is powerful, but power without control is just risk.`,
  },
  {
    slug: "penetration-testing-methodology",
    title: "My Penetration Testing Methodology: A Practitioner's Guide",
    excerpt: "A walkthrough of my structured approach to conducting thorough and ethical penetration tests.",
    date: "2026-01-05",
    readTime: "10 min read",
    tags: ["Offensive Security", "VAPT", "Methodology"],
    content: `Penetration testing is as much about methodology as it is about technical skill. A structured approach ensures thorough coverage, reproducible results, and clear communication with stakeholders.

## Phase 1: Scoping & Rules of Engagement

Before touching a keyboard, define the scope. What systems are in scope? What's off-limits? What are the testing windows? Document everything in a formal Rules of Engagement (RoE) document.

## Phase 2: Reconnaissance

### Passive Recon
Gather intelligence without directly interacting with the target. OSINT, DNS records, WHOIS data, social media — all fair game.

### Active Recon
Nmap scans, service enumeration, banner grabbing. Now you're directly probing the target, so stay within scope.

## Phase 3: Vulnerability Analysis

Map discovered services against known vulnerability databases. Tools like Nessus and OpenVAS help, but manual analysis catches what scanners miss.

## Phase 4: Exploitation

This is where tools like Metasploit, Burp Suite, and SQLMap come into play. But exploitation isn't about running scripts — it's about understanding the vulnerability deeply enough to demonstrate real business impact.

## Phase 5: Post-Exploitation

What can you access after the initial breach? Can you escalate privileges? Move laterally? Access sensitive data? This phase demonstrates the true risk.

## Phase 6: Reporting

The report is the product. Write for two audiences: executives who need to understand risk, and engineers who need to fix the vulnerabilities. Include clear severity ratings, evidence, and remediation guidance.

A penetration test without a clear, actionable report is just hacking. We're professionals — act like it.`,
  },
  {
    slug: "iso-27001-implementation-lessons",
    title: "Lessons from Implementing ISO 27001 in African Enterprises",
    excerpt: "Practical insights and common pitfalls from leading ISO 27001 implementations across diverse organizational contexts.",
    date: "2025-12-15",
    readTime: "6 min read",
    tags: ["ISO 27001", "Compliance", "ISMS"],
    content: `Implementing an Information Security Management System (ISMS) aligned with ISO 27001 is a transformative journey. Having led multiple implementations, I've gathered insights that go beyond what the standard's documentation tells you.

## Common Pitfalls

### Treating It as a Documentation Exercise
ISO 27001 requires documentation, but the standard is about building a living security culture. If your ISMS lives only in SharePoint, you've failed.

### Ignoring Context
Clause 4 requires understanding your organization's context. This isn't a checkbox — it's the foundation. An ISMS for a fintech startup looks very different from one for a mining company.

### Underestimating Training
Your controls are only as strong as the people implementing them. Budget for ongoing security awareness training, not just a one-time session.

## What Works

1. **Executive Buy-In** — Get leadership commitment early. Without it, the ISMS will be undermined at every turn.
2. **Start with Risk Assessment** — Let your risks drive your controls, not the other way around.
3. **Integrate with Business Processes** — Security controls should enhance operations, not hinder them.
4. **Measure and Improve** — Use metrics to demonstrate value and identify areas for improvement.
5. **Internal Audits Matter** — Don't treat internal audits as a formality. They're your early warning system.

ISO 27001 certification is a milestone, not a destination. The real value is in the continuous improvement cycle it establishes.`,
  },
];
