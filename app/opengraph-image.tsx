import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The social preview image for every route. It uses the same brand gradient as the landing
// page's buttons, so link previews of the marketing site stay on-brand.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 28,
          padding: '0 96px',
          background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.85 }}>
          Self-hosted wash tracker
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
          <span>Log every wash.</span>
          <span>Know when it needs cleaning.</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
