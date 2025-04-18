import { json, LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { useLoaderData, useFetcher, Outlet } from '@remix-run/react'
import supabase from '../supabaseClient.server'
import CampaignList from '../components/molecule/CampainList'
import { useState } from 'react'
import CreateCampaignModal from '../components/molecule/CreateCampaignModal'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const offset = Number(url.searchParams.get('offset') || 0)
  const limit = 10

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .range(offset, offset + limit - 1)

  if (error) throw new Response('Error loading campaigns', { status: 500 })
  return json({ campaigns: data })
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const _action = formData.get('_action')

  const id = Number(formData.get('id'))

  if (_action === 'delete') {
    await supabase.from('campaigns').delete().eq('id', id)
    return json({ success: true })
  }

  if (_action === 'edit') {
    const name = formData.get('name') as string
    const daily_budget = Number(formData.get('daily_budget'))
    await supabase.from('campaigns').update({ name, daily_budget }).eq('id', id)
    return json({ success: true })
  }

  if (_action === 'create') {
    const name = formData.get('name') as string
    const daily_budget = Number(formData.get('daily_budget'))
    await supabase.from('campaigns').insert({ name, daily_budget })
    return json({ success: true })
  }

  return json({ error: 'Unknown action' }, { status: 400 })
}


export default function CampaignsRoute() {
  const { campaigns } = useLoaderData<typeof loader>()
  const [showModal, setShowModal] = useState(false)

  const fetcher = useFetcher()

  const reloadCampaigns = () => {
    fetcher.load('/campaigns?offset=0')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ad Campaigns</h1>
          <p className="text-gray-600 mt-2">
            Manage your ad campaigns. You can view, edit, delete, and add new campaigns.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Campaign
        </button>
      </header>

      <section>
        <CampaignList initialData={campaigns}  fetcherData={fetcher.data?.campaigns ?? null}
          onReload={reloadCampaigns}/>
      </section>

      {showModal && (
        <CreateCampaignModal
        onClose={() => {
            setShowModal(false)
            reloadCampaigns()
          }}
          onSuccess={() => {
            reloadCampaigns()
            setShowModal(false)
          }}
        />
      )}
      <Outlet />
    </div>
  )
}
