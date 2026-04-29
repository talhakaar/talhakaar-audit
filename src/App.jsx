import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `## Role & Objective

You are an expert **Growth Architect** and strategic consultant specialising in South Asian music, celebrity management, and cultural dynamics. Your role is to audit and develop comprehensive growth strategies for emerging and tier-3/2 influencer musicians in Pakistan and the diaspora.

## Core Expertise

You possess expert-level knowledge across:
- **South Asian Music Ecosystem**: Pakistan's indie/mainstream landscape, Coke Studio, Nescafe Basement, regional TV platforms (Bol, ARY, HUM), LUX Style Awards, Pepsi Battle of the Bands
- **Artist Management & Career Dynamics**: Live circuits, brand endorsements, label relations, festival ecosystems (Lahore Music Meet, Karachi Eat, Nescafe Basement auditions)
- **Digital Metrics & Platforms**: YouTube (dominant in Pakistan), Instagram Reels, TikTok (where available), Spotify (limited tier-3 penetration), SoundCloud
- **Cultural & Alt-Culture Trends**: Diaspora aesthetics (UK/Canada Pakistani diaspora), Gen-Z urban Pakistan, underground movements, political undertones
- **Celebrity Dynamics**: Pakistani media narratives, influencer culture, controversy management, PR landscape

## Pakistan-Specific Platform Priority Stack
When making recommendations, weight platforms in this order for Pakistan-based artists:
1. YouTube (primary discovery + monetisation)
2. Instagram / Reels (engagement + brand deals)
3. TikTok (virality, where available)
4. Spotify (diaspora + urban elite)
5. SoundCloud / Bandcamp (niche/underground credibility)

## Data Confidence Protocol
When input data is sparse or missing, assign a **Data Confidence Score (DCS)** from 1–5 at the start of your analysis:
- 5 = Full data provided, high confidence
- 3 = Partial data, assumptions flagged clearly
- 1 = Minimal data, analysis is directional only

Always flag assumptions explicitly with [ASSUMED] tags.

## Output Format

Structure your response as follows — be direct, specific, and avoid generic filler:

---

### EXECUTIVE SUMMARY
*(120–160 words)*
- Current tier positioning
- Single biggest growth opportunity
- Single biggest risk
- Top-line recommendation

**Data Confidence Score: X/5**
*Assumptions: [list any]*

---

### CURRENT STATE AUDIT

**A. Quantitative Snapshot**
Present metrics in a clean table format covering: Platform | Metric | Value | Trend

**B. Qualitative Assessment**
- **Narrative Strength** (1–10): Score + 2-sentence rationale
- **Cultural Resonance** (1–10): Score + which communities resonate
- **Production Quality** (1–10): Score + honest assessment
- **Competitive Positioning**: How does the artist differentiate from peer tier artists?

---

### SWOT ANALYSIS
Present as a 2x2 table. Be specific — no generic entries.

---

### GROWTH OPPORTUNITY MATRIX
Rank initiatives by Impact (H/M/L) x Feasibility (H/M/L):
- **Online Growth Levers**
- **Real-World Amplification**
- **Narrative & Positioning**

---

### STRATEGIC ROADMAP

**Phase 1 — Foundation (Months 1–3)**
3–5 specific, actionable tactics with clear owners/methods

**Phase 2 — Acceleration (Months 4–6)**
3–5 scaling tactics tied to Phase 1 outcomes

**Phase 3 — Expansion (Months 7–12)**
3–5 long-horizon moves for audience/geographic/monetisation expansion

---

### KPI FRAMEWORK
Present as a table: KPI | Current Baseline | 3-Month Target | 6-Month Target | 12-Month Target

---

### RISKS & CONTINGENCIES
For each risk: Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation

---

## Quality Standards
- **Tone**: Strategic, direct, honest — no hype or false optimism
- **Specificity**: Name actual platforms, venues, shows, brands, collaborators relevant to Pakistan
- **Cultural Sensitivity**: Acknowledge religious/political sensitivities in Pakistan's media landscape
- **Realism**: All tactics must be feasible within Pakistani industry constraints and budgets
- **Concision**: Every sentence must earn its place — cut filler aggressively`;

const FIELDS = [
  {
    section: 'Artist Identity',
    fields: [
      {
        id: 'artistName',
        label: 'Artist name',
        type: 'text',
        placeholder: 'Zara Ali',
      },
      {
        id: 'genre',
        label: 'Genre(s)',
        type: 'text',
        placeholder: 'Indie Pop, Urdu Rap',
      },
      {
        id: 'location',
        label: 'Base location',
        type: 'text',
        placeholder: 'Karachi / London',
      },
      {
        id: 'careerStage',
        label: 'Career stage',
        type: 'select',
        options: [
          'Emerging (0–1 yr)',
          'Tier-3 (1–3 yrs)',
          'Tier-2 (3–6 yrs)',
          'Breaking Through (6+ yrs)',
        ],
      },
    ],
  },
  {
    section: 'Social & Streaming',
    fields: [
      {
        id: 'instagram',
        label: 'Instagram followers + engagement rate',
        type: 'text',
        placeholder: '8.2K followers, ~3.5% ER',
      },
      {
        id: 'youtube',
        label: 'YouTube subscribers + avg views',
        type: 'text',
        placeholder: '1.2K subs, avg 4K views',
      },
      {
        id: 'tiktok',
        label: 'TikTok / Reels',
        type: 'text',
        placeholder: '500 followers, 1 viral reel (120K views)',
      },
      {
        id: 'spotify',
        label: 'Spotify monthly listeners + total streams',
        type: 'text',
        placeholder: '4K monthly, 45K total',
      },
      {
        id: 'topTrack',
        label: 'Top track + stream count',
        type: 'text',
        placeholder: 'Raat Ka Safar — 28K streams',
      },
    ],
  },
  {
    section: 'Releases & Content',
    fields: [
      {
        id: 'releases',
        label: 'Original tracks released',
        type: 'text',
        placeholder: '6 singles, 1 EP',
      },
      {
        id: 'bestRelease',
        label: 'Most successful release + why',
        type: 'textarea',
        placeholder:
          'Dil Hai — 80K YouTube views, picked up by 2 diaspora playlists',
      },
      {
        id: 'contentFreq',
        label: 'Content posting frequency',
        type: 'text',
        placeholder: '2–3 posts/week Instagram, irregular YouTube',
      },
    ],
  },
  {
    section: 'Live & Brand',
    fields: [
      {
        id: 'liveGigs',
        label: 'Gigs in past 12 months',
        type: 'text',
        placeholder: '4 gigs — 2 cafe shows, 1 uni event, 1 open mic',
      },
      {
        id: 'avgAttendance',
        label: 'Average attendance',
        type: 'text',
        placeholder: '30–60 per show',
      },
      {
        id: 'brandDeals',
        label: 'Brand partnerships',
        type: 'text',
        placeholder: 'None yet / Unpaid collab with local clothing brand',
      },
    ],
  },
  {
    section: 'Goals & Context',
    fields: [
      {
        id: 'goals',
        label: 'Goals — 3 / 6 / 12 month',
        type: 'textarea',
        placeholder:
          '3M: 10K Instagram. 6M: Nescafe Basement audition. 12M: first paid brand deal',
      },
      {
        id: 'targetAudience',
        label: 'Target audience',
        type: 'text',
        placeholder: 'Urban Pakistani Gen-Z, 18–28, diaspora in UK/Canada',
      },
      {
        id: 'geoFocus',
        label: 'Geographic focus',
        type: 'text',
        placeholder: 'Pakistan-first, diaspora secondary',
      },
      {
        id: 'competitors',
        label: 'Comparable artists (3–5)',
        type: 'text',
        placeholder: 'Abdul Hannan, Ali Sethi (aspirational), Bayaan',
      },
      {
        id: 'challenges',
        label: 'Current challenges / blockers',
        type: 'textarea',
        placeholder:
          'Low YouTube traction despite decent Instagram. No budget for MVs. Inconsistent posting.',
      },
    ],
  },
];

function renderInline(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[ASSUMED\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return (
        <strong key={i} style={{ fontWeight: 600, color: '#1D1D1F' }}>
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith('*') && part.endsWith('*'))
      return (
        <em key={i} style={{ color: '#6E6E73' }}>
          {part.slice(1, -1)}
        </em>
      );
    if (part.startsWith('`') && part.endsWith('`'))
      return (
        <code
          key={i}
          style={{
            fontFamily: 'ui-monospace,monospace',
            fontSize: '12px',
            background: '#F5F5F7',
            padding: '1px 5px',
            borderRadius: '4px',
            color: '#1D1D1F',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    if (part === '[ASSUMED]')
      return (
        <span
          key={i}
          style={{
            fontSize: '10px',
            fontWeight: 600,
            background: '#FFF8E1',
            color: '#795B00',
            padding: '1px 7px',
            borderRadius: '20px',
            letterSpacing: '0.03em',
          }}
        >
          ASSUMED
        </span>
      );
    return part;
  });
}

function MarkdownRenderer({ text }) {
  const lines = text.split('\n');
  const els = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('### ')) {
      els.push(
        <div key={i} style={{ marginTop: '36px', marginBottom: '14px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: '#AEAEB2',
              marginBottom: '8px',
            }}
          >
            {line
              .slice(4)
              .replace(/[^\w\s—–\-\/()]/g, '')
              .trim()}
          </p>
          <div style={{ height: '1px', background: '#F2F2F7' }} />
        </div>
      );
    } else if (line.startsWith('## ')) {
      els.push(
        <h2
          key={i}
          style={{
            fontSize: '19px',
            fontWeight: 600,
            color: '#1D1D1F',
            marginTop: '24px',
            marginBottom: '6px',
            letterSpacing: '-0.02em',
          }}
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('| ')) {
       tLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tLines.push(lines[i]);
        i++;
      }
      const rows = tLines.filter((l) => !l.match(/^\|[-| :]+\|$/));
      els.push(
        <div
          key={`t${i}`}
          style={{
            overflowX: 'auto',
            margin: '14px 0',
            borderRadius: '10px',
            border: '1px solid #F2F2F7',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
            }}
          >
            {rows.map((row, ri) => {
              const cells = row
                .split('|')
                .filter((_, ci, arr) => ci > 0 && ci < arr.length - 1);
              const isH = ri === 0;
              return (
                <tr
                  key={ri}
                  style={{
                    borderBottom:
                      ri < rows.length - 1 ? '1px solid #F2F2F7' : 'none',
                  }}
                >
                  {cells.map((cell, ci) => {
                    const Tag = isH ? 'th' : 'td';
                    return (
                      <Tag
                        key={ci}
                        style={{
                          padding: '9px 14px',
                          textAlign: 'left',
                          fontWeight: isH ? 600 : 400,
                          color: isH ? '#6E6E73' : '#3A3A3C',
                          background: isH ? '#FAFAFA' : 'transparent',
                          fontSize: isH ? '10px' : '13px',
                          letterSpacing: isH ? '0.07em' : 'normal',
                          textTransform: isH ? 'uppercase' : 'none',
                        }}
                      >
                        {renderInline(cell.trim())}
                      </Tag>
                    );
                  })}
                </tr>
              );
            })}
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      els.push(
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '5px',
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              color: '#C7C7CC',
              fontSize: '14px',
              marginTop: '3px',
              flexShrink: 0,
              lineHeight: 1.5,
            }}
          >
            ·
          </span>
          <span
            style={{ fontSize: '15px', color: '#3A3A3C', lineHeight: 1.65 }}
          >
            {renderInline(line.slice(2))}
          </span>
        </div>
      );
    } else if (line.startsWith('---')) {
      els.push(
        <div
          key={i}
          style={{ height: '1px', background: '#F2F2F7', margin: '24px 0' }}
        />
      );
    } else if (line.trim() === '') {
      els.push(<div key={i} style={{ height: '5px' }} />);
    } else {
      els.push(
        <p
          key={i}
          style={{
            fontSize: '15px',
            color: '#3A3A3C',
            lineHeight: 1.7,
            marginBottom: '3px',
          }}
        >
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }
  return <div>{els}</div>;
}

export default function GrowthArchitect() {
  const [formData, setFormData] = useState({});
  const [output, setOutput] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [error, setError] = useState('');
  const outputRef = useRef(null);

  const handleChange = (id, val) => setFormData((p) => ({ ...p, [id]: val }));

  const buildPrompt = () => {
    let p = 'Generate a full Growth Architect strategy report:\n\n';
    FIELDS.forEach((s) => {
      p += `**${s.section}**\n`;
      s.fields.forEach((f) => {
        p += `- ${f.label}: ${formData[f.id] || '[Not provided]'}\n`;
      });
      p += '\n';
    });
    return p;
  };

  const handleSubmit = async () => {
    if (!formData.artistName) {
      setError('Please enter the artist name to continue.');
      return;
    }
    setError('');
    setLoading(true);
    setOutput('');
    setActiveTab('output');
    setTimeout(() => {
      setOutput(`
 
Talhakaar Studios - Artist Growth Intelligence Brief  
Confidential | Internal Strategy Use Only  

Artist: ${formData.artistName}  
Region: Pakistan (Primary), South Asia (Secondary)  
Assessment Type: Snapshot Diagnostic  

---

EXECUTIVE OVERVIEW  

${formData.artistName} sits in a high-potential breakout zone within the Pakistani indie ecosystem, with demonstrated audience resonance across both recorded music and live performance environments.

The current trajectory indicates **early-stage cultural recognition without systemized digital leverage**, meaning discovery is happening — but not being captured, retained, or compounded.

This creates a critical inflection point:
The artist is positioned to either evolve into a scalable cultural voice, or stabilize into a respected but non-exponential act.

Data Confidence Score: 4/5  

---

CURRENT STATE ANALYSIS  

Strength Profile  

• Demonstrated streaming traction (flagship track performance indicates algorithmic compatibility)  
• Strong live performance frequency (suggests demand-side validation and booking trust)  
• Distinct sonic identity (fusion positioning — Indie / Sufi / Alternative)  
• Early audience recall (recognition without full ecosystem lock-in)  

Weakness Profile  

• Inconsistent digital content output (low narrative continuity)  
• Weak conversion funnel (listeners → followers → community)  
• Platform imbalance (over-reliance on discovery platforms vs retention platforms)  
• Limited storytelling architecture (no clear identity loop or thematic repetition)  

Structural Gaps  

• No defined content system (reactive posting vs engineered output)  
• Lack of audience capture mechanisms (no funnel, CTA logic, or ecosystem mapping)  
• Weak YouTube leverage (low subscriber conversion vs view potential)  
• No narrative positioning as a “cultural voice”  

---

AUDIENCE & MARKET POSITION  

The artist currently occupies a **“recognized but not owned” audience position**.

Listeners are:
• Discovering through tracks  
• Engaging passively  
• Not transitioning into long-term followers  

This suggests:

→ Discovery engine exists  
→ Retention engine does not  

Primary audience clusters likely include:
• Urban Pakistani youth (18–30)  
• Indie / alternative listeners  
• Coke Studio adjacent audience  
• Diaspora listeners with cultural nostalgia alignment  

---

CONTENT & PLATFORM DIAGNOSTIC  

Platform Weight Reality (Pakistan context):

1. YouTube → discovery + monetization  
2. Instagram / Reels → engagement + brand  
3. TikTok → virality (inconsistent in PK but still relevant)  
4. Spotify → validation, not primary growth driver  

Current Issue:

The artist’s ecosystem is **not platform-strategic**.

Instead of:
→ Discovery → Engagement → Retention → Community  

It is currently:
→ Discovery → Drop-off  

---

TRAJECTORY ASSESSMENT  

If unchanged, the most likely outcome:

→ Plateau at “recognized indie act” level  
→ Continued live shows  
→ No exponential audience growth  

If corrected:

→ Transition into a **cultural identity-driven artist**  
→ Stronger audience ownership  
→ Higher monetization leverage (brands, tours, drops)  

---

STRATEGIC NOTE  

This report is a snapshot diagnostic, not a full strategic system. 

---

END OF REPORT
      `);
    
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (activeTab === 'output' && outputRef.current)
      outputRef.current.scrollTop = 0;
  }, [activeTab, output]);
  useEffect(() => {
  if (!output) return;

  let i = 0;
  setDisplayedOutput('');

  const typing = setInterval(() => {
    setDisplayedOutput(prev => prev + output.charAt(i));
    i++;

    if (i >= output.length) {
      clearInterval(typing);
    }
  }, 30);

  return () => clearInterval(typing);
}, [output]);
return (
  <>
    {activeTab === 'form' && (
      <div>
        <button
          className="ga-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Strategy Report'}
        </button>
      </div>
    )}

    {activeTab === 'output' && (
      <div className="ga-out" ref={outputRef}>
        {loading ? (
          <div style={{ padding: '40px 0' }}>
            Generating strategy...
          </div>
        ) : output ? (
          <MarkdownRenderer text={displayedOutput || output} />
        ) : (
          <div>No report yet</div>
        )}
      </div>
    )}

    <div className="ga-footer">
      Growth Architect • Talhakaar Studios
    </div>
  </>
  );
}
