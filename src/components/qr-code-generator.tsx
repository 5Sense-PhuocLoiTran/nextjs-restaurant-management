'use client'

import { getTableLink } from '@/lib/utils'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

type Props = {
  token: string
  tableNumber: number
  size?: number
}

export default function QrCodeGenerator({
  token,
  tableNumber,
  size = 256,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQr = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const value = getTableLink({ token, tableNumber })
      const canvasCtx = canvas.getContext('2d')
      if (!canvasCtx) return

      const height = size + 110
      canvas.width = size
      canvas.height = height

      // Background
      canvasCtx.fillStyle = 'white'
      canvasCtx.fillRect(0, 0, size, height)

      // Text
      canvasCtx.font = '16px Arial'
      canvasCtx.fillStyle = 'black'
      canvasCtx.textAlign = 'center'
      canvasCtx.save()
      canvasCtx.font = 'bold 16px Arial'
      canvasCtx.fillText(`Tiệm Ăn Nhà Nudo350`, size / 2, size + 15)
      canvasCtx.restore()
      // Draw a horizontal line after the dashed text
      canvasCtx.beginPath()
      canvasCtx.moveTo(20, size + 35)
      canvasCtx.lineTo(size - 20, size + 35)
      canvasCtx.strokeStyle = '#000'
      canvasCtx.lineWidth = 1
      canvasCtx.stroke()

      canvasCtx.fillText(
        `Bạn đang ngồi bàn số ${tableNumber}`,
        size / 2,
        size + 65
      )
      canvasCtx.font = 'italic 12px Arial'
      canvasCtx.fillText(
        'Quét QR để đặt món nha khách iu!',
        size / 2,
        size + 90
      )

      try {
        const qrCanvas = document.createElement('canvas')
        qrCanvas.width = size
        qrCanvas.height = size
        await QRCode.toCanvas(qrCanvas, value, { width: size })
        canvasCtx.drawImage(qrCanvas, 0, 0)
      } catch (error) {
        console.error('QR Code generation failed:', error)
      }
    }

    generateQr()
  }, [token, tableNumber, size])

  return <canvas ref={canvasRef} width={size} height={size + 70} />
}
