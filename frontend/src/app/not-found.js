import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="content-wrapper" style={{
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div className="bento-card" style={{ maxWidth: '440px', padding: '36px 28px', alignItems: 'center' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--bento-primary-subtle)',
          border: '1px solid rgba(73, 80, 87, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <AlertTriangle size={24} color="var(--bento-primary-dark)" />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--bento-primary-deep)', letterSpacing: '-0.4px' }}>
          404 - Page Not Found
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--bento-primary-muted)', marginTop: '6px', fontWeight: '500' }}>
          The deliverable or section you are looking for does not exist or has moved.
        </p>

        <Link
          href="/"
          className="btn btn-primary btn-pill"
          style={{ marginTop: '20px', width: '100%', gap: '8px' }}
        >
          <ArrowLeft size={15} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
