import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'

type Props = {
  campaignId: number
  onClose: () => void
}

export default function AddKeywordModal({ campaignId, onClose }: Props) {
  const fetcher = useFetcher<{ success?: boolean; error?: string }>()
  const [text, setText] = useState('')
  const [bid, setBid] = useState<number>(10)
  const [matchType, setMatchType] = useState('exact')
  const [state, setState] = useState('enabled')

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      onClose()
    }
  }, [fetcher.state, fetcher.data, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Add New Keyword</h3>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="add_keyword" />
          <input type="hidden" name="campaign_id" value={campaignId} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Keyword</label>
            <input
              name="text"
              value={text}
              onChange={e => setText(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter keyword"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bid (₹)</label>
            <input
              name="bid"
              type="number"
              value={bid}
              onChange={e => setBid(Number(e.target.value))}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Match Type</label>
              <select
                name="match_type"
                value={matchType}
                onChange={e => setMatchType(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="exact">Exact</option>
                <option value="phrase">Phrase</option>
                <option value="broad">Broad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                name="state"
                value={state}
                onChange={e => setState(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {fetcher.data?.error && (
            <div className="mt-2 rounded bg-red-100 px-3 py-2 text-sm text-red-600">
              {fetcher.data.error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-600 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50"
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state === 'submitting' ? 'Adding...' : 'Add Keyword'}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  )
}