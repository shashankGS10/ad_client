import { useEffect, useRef, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import CampaignItem  from './CampaignItem'

type Campaign = {
  id: number
  name: string
  daily_budget: number
}

type CampaignListProps = {
  initialData: Campaign[]
  fetcherData: Campaign[] | null
  onReload: () => void
}

export default function CampaignList({ initialData, fetcherData, onReload }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialData)
  const [offset, setOffset] = useState(initialData.length)
  const [hasMore, setHasMore] = useState(true)
  const fetcher = useFetcher<{ campaigns: Campaign[] }>()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  // Handle infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && fetcher.state === 'idle') {
        fetcher.load(`/campaigns?offset=${offset}`)
      }
    })

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [offset, fetcher.state, hasMore])

  // Append new campaigns (infinite scroll)
  useEffect(() => {
    if (fetcher.data?.campaigns?.length) {
      const newItems = fetcher.data.campaigns.filter(
        newItem => !campaigns.some(existing => existing.id === newItem.id)
      )
      setCampaigns(prev => [...prev, ...newItems])
      setOffset(prev => prev + newItems.length)
    } else if (fetcher.data) {
      setHasMore(false)
    }
  }, [fetcher.data])

  // Replace all data on fetcherData change (reload)
  useEffect(() => {
    if (fetcherData) {
      setCampaigns(fetcherData)
      setOffset(fetcherData.length)
      setHasMore(true)
    }
  }, [fetcherData])

  return (
    <div className="space-y-4">
      {campaigns.length === 0 ? (
        <div className="text-center text-gray-500 border rounded py-4">
          No campaigns found.
        </div>
      ) : (
        campaigns.map(campaign => (
          <CampaignItem key={campaign.id} campaign={campaign} onChange={onReload} />
        ))
      )}

      {hasMore && <div ref={loaderRef} className="h-8" />}
    </div>
  )
}
