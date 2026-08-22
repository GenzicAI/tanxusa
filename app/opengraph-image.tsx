import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TanXUSA — Execution at 10X Speed';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 88px',
          background: '#0a0a0a',
          backgroundImage:
            'radial-gradient(circle at 900px 120px, rgba(16,185,129,0.28) 0%, rgba(10,10,10,0) 480px)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 44 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>TAN</span>
          <span style={{ fontSize: 36, fontWeight: 800, color: '#ef4444' }}>X</span>
          <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>USA</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 999,
            border: '1px solid rgba(16,185,129,0.4)',
            color: '#34d399',
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 30,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#34d399', display: 'flex' }} />
          Powered by Genzic.AI Strategy
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, color: '#fff', letterSpacing: -2 }}>
          Execution at&nbsp;<span style={{ color: '#34d399' }}>10X Speed</span>
        </div>
        <div style={{ display: 'flex', fontSize: 27, color: '#9ca3af', marginTop: 28, maxWidth: 760 }}>
          AI agents + expert delivery teams that build, automate, and scale operations for growing businesses.
        </div>
        <div style={{ display: 'flex', gap: 44, marginTop: 46 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: '#d1d5db' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#34d399', display: 'flex' }} />
            AI Agents Active
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: '#d1d5db' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#38bdf8', display: 'flex' }} />
            24/7 Operations
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: '#d1d5db' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444', display: 'flex' }} />
            Real-Time Tracking
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
