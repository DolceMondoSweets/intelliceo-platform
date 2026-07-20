"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";

export type SaveCredentialsInput = { accessToken: string; locationId: string };
export type SaveCredentialsResult = { error?: string; success?: boolean };

export async function saveSquareCredentials(
  input: SaveCredentialsInput
): Promise<SaveCredentialsResult> {
  const locationId = input.locationId.trim();
  const accessToken = input.accessToken.trim();

  if (!locationId) return { error: "Enter your Square Location ID." };

  const { businessId } = await getSessionState();
  const id = businessId as string;
  const supabase = await createClient();

  if (!accessToken) {
    // No new token typed — only update the location ID, keep the existing token.
    const { data: existing } = await supabase
      .from("square_credentials")
      .select("access_token")
      .eq("business_id", id)
      .maybeSingle();

    if (!existing?.access_token) {
      return { error: "Enter your Square Access Token." };
    }

    const { error } = await supabase
      .from("square_credentials")
      .update({ location_id: locationId, updated_at: new Date().toISOString() })
      .eq("business_id", id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("square_credentials").upsert({
      business_id: id,
      access_token: accessToken,
      location_id: locationId,
      updated_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };
  }

  revalidatePath("/square-integration");
  return { success: true };
}

export type FetchRevenueResult = { total?: number; error?: string };

export async function fetchSquareMtdRevenue(): Promise<FetchRevenueResult> {
  const { businessId } = await getSessionState();
  const id = businessId as string;
  const supabase = await createClient();

  const { data: creds } = await supabase
    .from("square_credentials")
    .select("access_token, location_id")
    .eq("business_id", id)
    .maybeSingle();

  if (!creds?.access_token || !creds?.location_id) {
    return { error: "Save your Square credentials first." };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const startAt = startOfMonth.toISOString().replace(/\.\d{3}Z$/, "+00:00");

  const url = "https://connect.squareup.com/v2/orders/search";
  let totalCents = 0;
  let cursor: string | undefined;
  let pageCount = 0;

  try {
    do {
      const body: Record<string, unknown> = {
        location_ids: [creds.location_id],
        query: {
          filter: {
            state_filter: { states: ["COMPLETED"] },
            date_time_filter: { closed_at: { start_at: startAt } },
          },
        },
        limit: 500,
        ...(cursor ? { cursor } : {}),
      };

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          "Content-Type": "application/json",
          "Square-Version": "2024-10-17",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return { error: `Square API error (${resp.status}): ${text}` };
      }

      const payload = await resp.json();
      for (const order of payload.orders ?? []) {
        totalCents += order.total_money?.amount ?? 0;
      }
      cursor = payload.cursor;
      pageCount += 1;
    } while (cursor && pageCount < 20);

    return { total: totalCents / 100 };
  } catch (err) {
    return {
      error: err instanceof Error ? `Could not reach Square: ${err.message}` : "Unexpected error.",
    };
  }
}

export async function useFetchedRevenue(total: number): Promise<{ error?: string }> {
  const { businessId } = await getSessionState();
  const id = businessId as string;
  const supabase = await createClient();

  const { error } = await supabase
    .from("finance_data")
    .update({ revenue_mtd: total, updated_at: new Date().toISOString() })
    .eq("business_id", id);

  if (error) return { error: error.message };

  // Marks the moment a Square pull actually completed — distinct from
  // finance_data.updated_at, which also changes on manual Settings edits.
  await supabase
    .from("square_credentials")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("business_id", id);

  revalidatePath("/dashboard");
  revalidatePath("/morning-brief");
  revalidatePath("/square-integration");
  return {};
}
