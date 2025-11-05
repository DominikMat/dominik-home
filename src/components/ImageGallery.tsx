import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Image } from 'antd'
import { ImageData } from './ProjectData'
import LazyYT from './LazyYT'

type ImageGalleryProps = {
  items?: ImageData[];
  projectTitle?: string;
  targetHeight?: number;
  initialAspectMult?: number;
  desiredColPx?: number;
  gapPx?: number;
  baseRowPx?: number;
  maxAdjustAttempts?: number;
}

export default function ImageGallery({
  items = [],
  projectTitle = "Default Project Name",
  targetHeight,
  initialAspectMult = 6,
  desiredColPx = 100,
  gapPx = 30,
  baseRowPx = 100,
  maxAdjustAttempts = 6
}: ImageGalleryProps): React.ReactElement | null {

  const GAP_PX = gapPx
  const BASE_ROW_PX = baseRowPx

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [columns, setColumns] = useState(12)
  const [aspectMult, setAspectMult] = useState<number>(initialAspectMult)
  const [adjustAttempts, setAdjustAttempts] = useState<number>(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(false)

  }, [items, projectTitle])
  
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const w = el.clientWidth
      setContainerWidth(w)
      const calcCols = Math.max(2, Math.floor(w / desiredColPx))
      const cols = Math.min(12, calcCols)
      setColumns(cols)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [desiredColPx])

  const clamp = (v:number, a:number, b:number) => Math.max(a, Math.min(b, v))
  const colWidth = (() => {
    if (!containerWidth || columns <= 0) return 0
    const totalGaps = (columns - 1) * GAP_PX
    const available = Math.max(0, containerWidth - totalGaps)
    return available / columns
  })()

  useLayoutEffect(() => {
    if (!targetHeight) {
      setIsReady(true)
      return
    }
    const el = containerRef.current
    if (!el) return
    const raf = requestAnimationFrame(() => {
      const measured = el.scrollHeight || el.offsetHeight || el.getBoundingClientRect().height
      const lower = targetHeight * 0.95
      const upper = targetHeight * 1.05

      if (measured >= lower && measured <= upper) {
        setIsReady(true) // 👈 gotowe — pokaż
        return
      }

      if (adjustAttempts >= maxAdjustAttempts) {
        setIsReady(true) // 👈 po ostatniej próbie też pokaż
        return
      }

      const proportion = targetHeight / (measured || 1)
      const dampFactor = 0.6
      let newAspect = aspectMult * (1 + (proportion - 1) * dampFactor)
      newAspect = clamp(newAspect, 0.5, 20)
      if (Math.abs(newAspect - aspectMult) < 0.01) {
        setIsReady(true)
        return
      }

      setAspectMult(Number(newAspect.toFixed(3)))
      setAdjustAttempts(prev => prev + 1)
    })
    return () => cancelAnimationFrame(raf)
  }, [targetHeight, containerWidth, columns, items, aspectMult, adjustAttempts])

  useEffect(() => setAdjustAttempts(0), [items, targetHeight, containerWidth])

  return (
    <div
      ref={containerRef}
      style={{
        width: '700px',
        boxSizing: 'border-box',
        background: 'transparent',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${GAP_PX}px`,
        gridAutoFlow: 'dense',
        opacity: isReady ? 1 : 0,          
        transition: isReady ? 'opacity 1s ease-in, transform 1s ease' : 'none',
        transform: isReady ? 'translateX(0)' : 'translateX(200px)',
      }}
    >
      {items.map((item, i) => {
        const aspect = Number(item.aspect) || 1
        const rawCols = Math.round(aspect * aspectMult)
        const cols = clamp(rawCols, 1, Math.max(1, columns))
        const isVideo = item.path?.startsWith('https://youtu')
        let rows = 1
        if (colWidth > 0 && BASE_ROW_PX > 0) {
          const itemWidthPx = cols * colWidth + (cols - 1) * GAP_PX
          const targetHeightPx = itemWidthPx / (aspect || 1)
          rows = Math.max(1, Math.ceil(targetHeightPx / BASE_ROW_PX))
          rows = clamp(rows, 1, 100)
        }

        return (
          <div
            key={item.path ?? i}
            style={{
              gridColumn: `span ${cols}`,
              gridRow: `span ${rows}`,
              overflow: 'hidden',
              borderRadius: '8px',
              background: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4
            }}
          >
            {isVideo ? (
              <LazyYT url={item.path} height={Math.max(100, BASE_ROW_PX * rows * 0.9)} />
            ) : (
              <Image
                src={item.path}
                alt={"image of project " + projectTitle}
                style={{
                  objectFit: 'contain',
                  borderRadius: '8px',
                  maxHeight: '100%',
                  maxWidth: '100%',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
