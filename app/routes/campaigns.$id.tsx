import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Outlet,Link, useLoaderData, useActionData } from "@remix-run/react";
import supabase from "../supabaseClient.server";
import KeywordTable from "../components/KeywordTable";
import AddKeywordModal from "../components/molecule/AddKeywordModal";
import { useState } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Response("Invalid campaign ID", { status: 400 });

  const [{ data: campaign }, { data: keywords }] = await Promise.all([
    supabase.from("campaigns").select("*").eq("id", id).single(),
    supabase.from("keywords").select("*").eq("campaign_id", id),
  ]);

  if (!campaign) throw new Response("Campaign not found", { status: 404 });

  return json({ campaign, keywords });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const form = await request.formData();
  const _action = form.get("_action");
  const campaign_id = params.id;

  if (_action === "add_keyword") {
    const text = String(form.get("text"));
    const bid = Number(form.get("bid"));
    const match_type = String(form.get("match_type"));
    const state = String(form.get("state"));

    const { error } = await supabase.from("keywords").insert({
      campaign_id,
      text,
      bid,
      match_type,
      state,
    });

    if (error?.code === "23505") {
      return json(
        { error: "Keyword already exists for this campaign." },
        { status: 409 }
      );
    }

    if (!campaign_id) {
      return json({ error: "Campaign ID is missing." }, { status: 400 });
    }

    return redirect(`/campaigns/${campaign_id}`);
  }

  if (_action === "delete_keyword") {
    const id = Number(form.get("id"));
    const { data, error } = await supabase.from("keywords").delete().eq("id", id).select('campaign_id').single()

    if (error) {
      console.error('Error deleting keyword:', error);
      return json({ error: 'Failed to delete keyword' }, { status: 500 });
    }

    if (!data?.campaign_id) {
        return json({ error: "Campaign ID is missing." }, { status: 400 });
      }
    
    return redirect(`/campaigns/${data.campaign_id}`);
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function CampaignDetailRoute() {
  const { campaign, keywords } = useLoaderData<typeof loader>();
  const [showModal, setShowModal] = useState(false);
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <p className="text-gray-600">Budget: ₹{campaign.daily_budget}</p>
          {actionData?.error && (
            <div className="text-red-500">{actionData.error}</div>
          )}
        </div>
        <Link
          to="/campaigns"
          className="text-blue-600 underline text-sm hover:text-blue-800"
        >
          ← Back to all campaigns
        </Link>
      </div>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Keywords</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Keyword
          </button>
        </div>

        <KeywordTable keywords={keywords} campaignId={campaign.id} />
      </section>

      {showModal && (
        <AddKeywordModal
          campaignId={campaign.id}
          onClose={() => setShowModal(false)}
        />
      )}
        <Outlet />
    </div>
  );
}
