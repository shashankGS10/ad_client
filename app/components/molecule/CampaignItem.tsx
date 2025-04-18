import { useFetcher, Link } from "@remix-run/react";
import { useEffect, useState } from "react";

type Campaign = {
  id: number;
  name: string;
  daily_budget: number;
};

type Props = {
  campaign: Campaign;
  onChange: () => void;
};

export default function CampaignItem({ campaign, onChange }: Props) {
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState(campaign.name);
  const [budget, setBudget] = useState(campaign.daily_budget);

  useEffect(() => {
    if (fetcher.data?.success) {
      onChange();
      setEditing(false); // Close the edit form upon successful update
    }
  }, [fetcher.data, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      { _action: "edit", id: campaign.id, name, daily_budget: budget },
      { method: "POST" }
    );
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      fetcher.submit(
        { _action: "delete", id: campaign.id },
        { method: "POST" }
      );
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm space-y-2">
      {isEditing ? (
        <fetcher.Form onSubmit={handleSubmit} className="space-y-2">
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            required
          />
          <input
            name="daily_budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="border px-2 py-1 rounded w-full"
            required
          />
          {fetcher.data?.error && (
            <div className="text-red-500">{fetcher.data.error}</div>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded"
              disabled={fetcher.state !== "idle"}
            >
              {fetcher.state === "submitting" ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-gray-500"
              disabled={fetcher.state !== "idle"}
            >
              Cancel
            </button>
          </div>
        </fetcher.Form>
      ) : (
        <div className="flex justify-between items-center">
          <div>
          <Link to={`/campaigns/${campaign.id}`}
              className="block hover:underline"
            >
              <h3 className="font-semibold text-lg">{campaign.name}</h3>
              <p className="text-sm text-gray-600">
                Budget: ₹{campaign.daily_budget}
              </p>
            </Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
