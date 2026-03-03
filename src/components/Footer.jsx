import { LeafDivider } from './BotanicalElements';
import VerificationBadge from './VerificationBadge';

// ============================================================
// Footer Component
// ============================================================

export default function Footer({ pubmedVerified }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <LeafDivider />

        <div className="footer__label">Verification Statement</div>

        <p className="footer__text">
          Every article in this database has been individually verified through
          PubMed PMID confirmation ({pubmedVerified} articles), DOI resolution,
          or direct publisher record confirmation. Articles with unverifiable
          references have been removed. Last audit: February 21, 2026.
        </p>

        <div className="footer__badges">
          <VerificationBadge type="PubMed" />
          <VerificationBadge type="DOI" />
          <VerificationBadge type="Publisher" />
        </div>

        <div className="footer__copyright">
          Ayahuasca Research Portal -- For educational and research purposes only
        </div>
      </div>
    </footer>
  );
}
