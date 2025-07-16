import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

interface Props {
  params: Promise<{
    shortCode: string
  }>
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params

  const url = await prisma.url.findUnique({
    where: { shortCode }
  })

  if (!url) {
    notFound()
  }

  redirect(url.originalUrl)
}