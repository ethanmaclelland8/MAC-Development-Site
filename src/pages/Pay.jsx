import { ExternalLink, Landmark } from "lucide-react";
import { PAYMENTS } from "../content";
import { backendReady, paymentsReady } from "../config";
import { useAuth } from "../lib/auth";
import { CopyButton, Notice } from "../ui";

/* Zelle / Venmo / check — shown on the public page and in the account. */
export function OtherWays({ compact = false }) {
  const { zelle, venmo, check } = PAYMENTS;
  const venmoUser = venmo.replace(/^@/, "");
  return (
    <div className={`pay-list ${compact ? "pay-list-compact" : ""}`}>
      {zelle && (
        <div className="card pay-method">
          <div className="pay-body">
            <h3>Zelle <span className="tag">No fee</span></h3>
            <p className="pay-value">{zelle}</p>
            <p className="fine">Send from your bank's app.</p>
          </div>
          <CopyButton text={zelle} />
        </div>
      )}
      {venmo && (
        <div className="card pay-method">
          <div className="pay-body">
            <h3>Venmo</h3>
            <p className="pay-value">{venmo}</p>
          </div>
          <a className="btn btn-secondary btn-sm" href={`https://venmo.com/u/${venmoUser}`} target="_blank" rel="noopener noreferrer">Open Venmo <ExternalLink size={14} /></a>
        </div>
      )}
      {check.payableTo && (
        <div className="card pay-method">
          <div className="pay-body">
            <h3>Check or money order <span className="tag">No fee</span></h3>
            <p className="fine">Payable to</p>
            <p className="pay-value">{check.payableTo}</p>
            <p className="fine">Mail to</p>
            <p className="pay-value pre">{check.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function PayPage() {
  const { session } = useAuth();
  return (
    <section className="container narrow page">
      <header className="page-head">
        <h1>Pay rent</h1>
        <p className="lead">{PAYMENTS.dueNote}</p>
      </header>

      {paymentsReady && (
        <div className="card card-pad bank-cta">
          <div className="bank-cta-icon"><Landmark size={22} /></div>
          <div className="pay-body">
            <h2 className="card-title">Pay by bank transfer</h2>
            <p>Pay straight from your checking account on this site. No fee, and your balance and receipts stay in your account.</p>
          </div>
          <div className="btn-row">
            {session ? (
              <a href="#account" className="btn btn-primary">Go to my account</a>
            ) : (<>
              <a href="#login" className="btn btn-primary">Log in to pay</a>
              <a href="#join" className="btn btn-secondary">Create account</a>
            </>)}
          </div>
        </div>
      )}

      {paymentsReady && <h2 className="sub-head">Other ways to pay</h2>}
      <OtherWays />
      {PAYMENTS.memoNote && <Notice>{PAYMENTS.memoNote}</Notice>}
      {!backendReady && <p className="fine center gap-top">Online accounts are coming soon.</p>}
    </section>
  );
}
