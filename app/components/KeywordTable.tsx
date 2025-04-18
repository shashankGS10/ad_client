import { Form } from '@remix-run/react'

type Props = {
  keywords: {
    id: number
    text: string
    bid: number
    match_type: string
    state: string
  }[]
  campaignId: number
}

export default function KeywordTable({ keywords }: Props) {
  if (!keywords.length) {
    return <p className="text-gray-500 text-sm">No keywords yet.</p>
  }

  return (
    <table className="w-full text-left border-collapse border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Keyword</th>
          <th className="p-2 border">Bid (₹)</th>
          <th className="p-2 border">Match Type</th>
          <th className="p-2 border">State</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {keywords.map(k => (
          <tr key={k.id}>
            <td className="p-2 border">{k.text}</td>
            <td className="p-2 border">{k.bid}</td>
            <td className="p-2 border capitalize">{k.match_type}</td>
            <td className="p-2 border capitalize">{k.state}</td>
            <td className="p-2 border">
              <Form method="post">
                <input type="hidden" name="_action" value="delete_keyword" />
                <input type="hidden" name="id" value={k.id} />
                <button
                  type="submit"
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </Form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
