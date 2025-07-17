import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

interface Props {
  params: Promise<{
    shortCode: string
  }>
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params

  // Check if it's a custom domain format (contains ".s8l.xyz/")
  if (shortCode.includes('.s8l.xyz')) {
    // Parse custom domain format: prefix.s8l.xyz/path
    const parts = shortCode.split('.s8l.xyz/')
    if (parts.length === 2) {
      const [prefix, customPath] = parts
      
      // Find the custom URL
      const userUrl = await prisma.userUrl.findFirst({
        where: {
          customDomain: {
            prefix: prefix
          },
          customPath: customPath
        },
        include: {
          url: true
        }
      })

      if (!userUrl) {
        notFound()
      }

      // Increment click count
      await prisma.url.update({
        where: { id: userUrl.url.id },
        data: { clickCount: { increment: 1 } }
      })

      redirect(userUrl.url.originalUrl)
    }
  }

  // Handle regular short codes
  const url = await prisma.url.findUnique({
    where: { shortCode }
  })

  if (!url) {
    notFound()
  }

  // Increment click count
  await prisma.url.update({
    where: { id: url.id },
    data: { clickCount: { increment: 1 } }
  })

  redirect(url.originalUrl)
}