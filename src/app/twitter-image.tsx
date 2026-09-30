import { renderShareImage } from './_share/share-image'

export const alt = 'Kaora · Estúdio de software sob medida'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderShareImage(size)
}
