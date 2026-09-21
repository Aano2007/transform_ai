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
      <div className="card" style={{ maxWidth: '440px', padding: '36px 24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--nb-yellow)',
          border: '2px solid var(--nb-black)',
          boxShadow: '2px 2px 0px var(--nb-black)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <AlertTriangle size={28} color="var(--nb-black)" />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--nb-black)' }}>
          404 - Page Not Found
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--nb-text-muted)', marginTop: '8px', fontWeight: '600' }}>
          The deliverable or page you are looking for does not exist or has moved.
        </p>

        <Link
          href="/"
          className="btn btn-primary"
          style={{ marginTop: '20px', width: '100%', gap: '8px' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
