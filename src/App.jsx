import { useState, useRef, useEffect } from 'react';

/* ---------- (UNCHANGED CODE ABOVE REMOVED FOR BREVITY IN EXPLANATION — KEEP YOUR FULL FILE STRUCTURE) ---------- */

/* KEEP EVERYTHING EXACTLY SAME UNTIL STATE SECTION */

export default function GrowthArchitect() {
  const [formData, setFormData] = useState({});
  const [output, setOutput] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState(''); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [error, setError] = useState('');
  const outputRef = useRef(null);

  const handleChange = (id, val) => setFormData((p) => ({ ...p, [id]: val }));

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

The current trajectory indicates early-stage cultural recognition without systemized digital leverage, meaning discovery is happening — but not being captured, retained, or compounded.

This creates a critical inflection point:
The artist is positioned to either evolve into a scalable cultural voice, or stabilize into a respected but non-exponential act.

Data Confidence Score: 4/5  

---

CURRENT STATE ANALYSIS  

Strength Profile  

• Demonstrated streaming traction  
• Strong live performance frequency  
• Distinct sonic identity  
• Early audience recall  

Weakness Profile  

• Inconsistent digital content output  
• Weak conversion funnel  
• Platform imbalance  
• Limited storytelling architecture  

---

END OF REPORT
      `);

      setLoading(false);
    }, 2000);
  };

  /* ---------- EXISTING EFFECT ---------- */

  useEffect(() => {
    if (activeTab === 'output' && outputRef.current)
      outputRef.current.scrollTop = 0;
  }, [activeTab, output]);

  /* ---------- NEW TYPING EFFECT ---------- */

  useEffect(() => {
    if (!output) return;

    let i = 0;
    setDisplayedOutput('');

    const typing = setInterval(() => {
      setDisplayedOutput((prev) => prev + output.charAt(i));
      i++;

      if (i >= output.length) {
        clearInterval(typing);
      }
    }, 30); // 🔥 adjust speed here

    return () => clearInterval(typing);
  }, [output]);

  return (
    <>
      {/* UI unchanged */}

      {activeTab === 'output' && (
        <div className="ga-out" ref={outputRef}>
          {loading ? (
            <div>Generating strategy...</div>
          ) : output ? (
            <MarkdownRenderer text={displayedOutput || output} />
          ) : (
            <div>No report yet</div>
          )}
        </div>
      )}
    </>
  );
}
