import { LeafDivider } from './BotanicalElements';

// ============================================================
// About Section Component
// ============================================================

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-section__inner">
        <LeafDivider />

        <div className="about-section__label">About This Project</div>

        <div className="about-section__content">
          <div className="about-section__bio">
            <h3 className="about-section__name">Edo Maimon</h3>
            <div className="about-section__role">
              Somatic Psychotherapist · PTSD-focused Clinician &amp; Researcher · MSW Candidate
            </div>

            <p className="about-section__text">
              This research portal is curated by Edo Maimon, an integrative
              somatic psychotherapist and clinician-researcher bridging biology
              and clinical trauma recovery. Edo holds an M.Sc. in Biotechnology
              and is completing an MSW with a trauma specialization at the
              University of Haifa, where he researches PTSD interventions and
              physiological markers of resilience.
            </p>

            <p className="about-section__text">
              His clinical work at Rambam Hospital's Veterans Psychiatric
              Outpatient Clinic, over a decade of therapeutic practice with
              individuals and groups, and a personal journey of resilience as a
              cancer survivor inform his commitment to interdisciplinary,
              evidence-based innovation in trauma care. His current focus lies at
              the intersection of PTSD, somatic interventions, and entheogens.
            </p>

            <div className="about-section__links">
              <a
                href="https://edo-maimon.com/home-eng/"
                target="_blank"
                rel="noopener noreferrer"
                className="about-section__link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Website
              </a>
              <a
                href="https://www.linkedin.com/in/edo-maimon-90b05522/"
                target="_blank"
                rel="noopener noreferrer"
                className="about-section__link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a
                href="mailto:edomaimon@gmail.com"
                className="about-section__link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Contact
              </a>
            </div>
          </div>
        </div>

        <p className="about-section__mission">
          This portal was created to provide researchers, clinicians, and
          students with a curated, verified collection of peer-reviewed
          ayahuasca literature — making the science more accessible to those
          working at the frontier of psychedelic-assisted therapy.
        </p>
      </div>
    </section>
  );
}
