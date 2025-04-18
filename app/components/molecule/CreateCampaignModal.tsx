import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'

export default function CreateCampaignModal({
  onClose,
  onSuccess
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const fetcher = useFetcher<{ success?: boolean }>()
  const [name, setName] = useState('')
  const [budget, setBudget] = useState<number>(100)
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState('')

  const addKeyword = () => {
    const trimmed = newKeyword.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed])
    }
    setNewKeyword('')
  }

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  useEffect(() => {
    if (fetcher.data?.success) {
      onSuccess()
    }
  }, [fetcher.data, onSuccess])

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">Create New Campaign</h2>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="create" />

          <div>
            <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700">
              Campaign Name
            </label>
            <input
              id="campaign-name"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring focus:ring-blue-200"
              placeholder="e.g., Summer Sale 2025"
            />
          </div>

          <div>
            <label htmlFor="daily-budget" className="block text-sm font-medium text-gray-700">
              Daily Budget (₹)
            </label>
            <input
              id="daily-budget"
              type="number"
              name="daily_budget"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring focus:ring-blue-200"
              placeholder="100"
            />
          </div>

          <div>
            <label htmlFor="new-keyword" className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <div className="flex gap-2 mt-1">
              <input
                id="new-keyword"
                type="text"
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Press Enter to add"
                className="flex-grow border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {keywords.map(k => (
                  <span
                    key={k}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {k}
                    <button
                      type="button"
                      onClick={() => removeKeyword(k)}
                      className="text-blue-700 hover:text-red-500 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Campaign
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  )
}
