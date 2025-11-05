import React, { useState } from 'react'
import YouTube from 'react-youtube'

export default function LazyYT({ url, height = 340 }) {
    const [play, setPlay] = useState(false)
    const [loading, setLoading] = useState(false)
    const id = (() => {
        try {
            // Match various YouTube URL formats including shorts
            const m = url.match(
                /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|v\/|embed\/|watch\?v=|watch\?.+&v=))([^#&?]{11})/
            )
            return m ? m[1] : null
        } catch { return null }
    })()

    if (!id) return null

    if (!play) {
        const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
        return (
            <div style={{ position: 'relative', height, background: '#000', cursor: 'pointer' }} onClick={() => { setPlay(true); setLoading(true); }}>
                <img src={thumb} alt="yt-thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 30
                    }}>▶</div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', height }}>
            {loading && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22
                }}>
                    Loading YouTube video...
                </div>
            )}
            <YouTube
                videoId={id}
                opts={{
                    width: '100%',
                    height: typeof height === 'number' ? height : 340,
                    playerVars: { modestbranding: 1, rel: 0, origin: window.location.origin }
                }}
                onReady={() => setLoading(false)}
            />
        </div>
    )
}