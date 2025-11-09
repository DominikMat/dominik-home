import { useEffect, useRef, useState } from 'react'
import { Image } from 'antd'
import { ImageData } from './ProjectData'
import LazyYT from './LazyYT'

type ImageGalleryProps = {
  items?: ImageData[];
  projectTitle?: string;
  projectId: number;
  aspectMult?: number;
}

export default function ImageGallery({
  items = [],
  projectTitle = "Default Project Name",
  projectId = 0,
  aspectMult = 2,
}: ImageGalleryProps): React.ReactElement | null {

  const GAP_PX = 0
    const BASE_ROW_PX = 20

    const desiredColPx = 145

    const containerRef = useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [columns, setColumns] = useState(12)

  const clamp = (v:number, a:number, b:number) => Math.max(a, Math.min(b, v))
  const colWidth = (() => {
    if (!containerWidth || columns <= 0) return 0
    const totalGaps = (columns - 1) * GAP_PX
    const available = Math.max(0, containerWidth - totalGaps)
    return available / columns
  })()

  return (
    <div
      ref={containerRef}
      className="image-gallery"
      key={projectId}
    >
      {items.map((item, i) => {
        const aspect = Number(item.aspect) || 1
        const rawCols = Math.round(aspect * aspectMult)
        const cols = clamp(rawCols, 1, columns)

        let rows = 1
        if (colWidth > 0) {
          const itemWidthPx = cols * colWidth + (cols - 1) * GAP_PX
          const targetHeightPx = itemWidthPx / (aspect || 1)
          rows = Math.max(1, Math.ceil(targetHeightPx / BASE_ROW_PX))
          rows = clamp(rows, 1, 24)
        }

        const isVideo = item.path.startsWith("https://youtu");

        return (
          <div
            key={item.path ?? i}
            style={{
              gridColumn: `span ${cols}`,
              gridRow: `span ${rows}`,
              animationDelay: `${ (items.length/2 - Math.abs(items.length/2 - i)) * 0.25}s`,
            }}
            className='gallery-img'
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
