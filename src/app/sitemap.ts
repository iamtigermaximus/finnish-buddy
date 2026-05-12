import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://finnishbuddy.vercel.app'
  
  const topics = await prisma.topic.findMany({
    include: { level: true }
  })
  
  const topicUrls = topics.map((topic) => ({
    url: `${baseUrl}/topics/${topic.id}`,
    lastModified: topic.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  const levelUrls = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => ({
    url: `${baseUrl}/levels?level=${level}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/levels`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...levelUrls,
    ...topicUrls,
  ]
}
