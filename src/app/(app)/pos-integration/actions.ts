"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { isGrowthTier } from "@/lib/subscription";

const GROWTH_REQUIRED_ERROR = "POS Integration is a Growth plan feature.";

export type PosType = "square" | "clover";

export type SaveCredentialsInput =
  | { posType: "square"; accessToken: string; locationId: string }
  | { posType: "clover"; accessToken: string; merchantId: string };

export type SaveCredentialsResult = { error?: string; success?: boolean };

export async function savePosCredentials(
  input: SaveCredentialsInput
): Promise<SaveCredentialsResult> {
  const { businessId, subscriptionTier } = await getSessionState();
  if (!isGrowthTier(subscriptionTier)) return { error: GROWTH_REQUIRED_ERROR };
  const id = businessId as string;
  const supabase = await createClient();
  const accessToken = input.accessToken.trim();

  const { data: existing } = await supabase
    .from("pos_credentials")
    .select("pos_type, access_token")
    .eq("business_id", id)
    .maybeSingle();

  // Switching platforms always needs a fresh token — a Square token can't
  // authenticate against Clover's API or vice versa, so the "leave blank to
  // keep the saved token" convenience only applies when staying on the same
  // platform.
  const switchingPlatform = existing?.pos_type != null && existing.pos_type !== input.posType;

  if (input.posType === "square") {
    const locationId = input.locationId.trim();
    if (!locationId) return { error: "Enter your Square Location ID." };

    if (!accessToken) {
      if (switchingPlatform || !existing?.access_token) {
        return { error: "Enter your Square Access Token." };
      }
      const { error } = await supabase
        .from("pos_credentials")
        .update({ location_id: locationId, updated_at: new Date().toISOString() })
        .eq("business_id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("pos_credentials").upsert({
        business_id: id,
        pos_type: "square",
        access_token: accessToken,
        location_id: locationId,
        merchant_id: null,
        updated_at: new Date().toISOString(),
      });
      if (error) return { error: error.message };
    }
  } else {
    const merchantId = input.merchantId.trim();
    if (!merchantId) return { error: "Enter your Clover Merchant ID." };

    if (!accessToken) {
      if (switchingPlatform || !existing?.access_token) {
        return { error: "Enter your Clover API Token." };
      }
      const { error } = await supabase
        .from("pos_credentials")
        .update({ merchant_id: merchantId, updated_at: new Date().toISOString() })
        .eq("business_id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("pos_credentials").upsert({
        business_id: id,
        pos_type: "clover",
        access_token: accessToken,
        merchant_id: merchantId,
        location_id: null,
        updated_at: new Date().toISOString(),
      });
      if (error) return { error: error.message };
    }
  }

  revalidatePath("/pos-integration");
  return { success: true };
}

export type FetchRevenueResult = { total?: number; error?: string };

function startOfMonthIso(): string {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

async function fetchSquareMtdRevenue(accessToken: string, locationId: string): Promise<FetchRevenueResult> {
  const url = "https://connect.squareup.com/v2/orders/search";
  const startAt = startOfMonthIso();
  let totalCents = 0;
  let cursor: string | undefined;
  let pageCount = 0;

  try {
    do {
      const body: Record<string, unknown> = {
        location_ids: [locationId],
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
          Authorization: `Bearer ${accessToken}`,
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

// Clover REST API v3 — verified live against a real sandbox merchant.
// Orders turned out NOT to carry a `total` field at all (even with
// `expand=lineItems`), and `paymentState` didn't flip to PAID after a real
// payment was recorded against a test order in this sandbox — so summing
// Orders, as originally written, would have silently returned 0 forever.
// The Payments endpoint is the reliable source: each payment has its own
// `amount` (cents) and a `result` ("SUCCESS" | failure states), which is
// exactly "money actually collected." Both `createdTime` and `result`
// filters are confirmed working server-side. createdTime is epoch
// milliseconds, unlike Square's ISO8601 strings.
async function fetchCloverMtdRevenue(accessToken: string, merchantId: string): Promise<FetchRevenueResult> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const startAtMs = startOfMonth.getTime();

  // Defaults to production — Clover's sandbox lives on a different host
  // (apisandbox.dev.clover.com), set via CLOVER_API_BASE_URL for testing.
  const baseUrl = process.env.CLOVER_API_BASE_URL ?? "https://api.clover.com";
  const limit = 100;
  let offset = 0;
  let totalCents = 0;
  let pageCount = 0;

  try {
    for (;;) {
      const url =
        `${baseUrl}/v3/merchants/${merchantId}/payments` +
        `?filter=${encodeURIComponent(`createdTime>=${startAtMs}`)}` +
        `&filter=${encodeURIComponent(`result=SUCCESS`)}` +
        `&limit=${limit}&offset=${offset}`;

      const resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return { error: `Clover API error (${resp.status}): ${text}` };
      }

      const payload = await resp.json();
      const payments: Array<{ amount?: number }> = payload.elements ?? [];
      for (const payment of payments) {
        totalCents += payment.amount ?? 0;
      }

      pageCount += 1;
      if (payments.length < limit || pageCount >= 20) break;
      offset += limit;
    }

    return { total: totalCents / 100 };
  } catch (err) {
    return {
      error: err instanceof Error ? `Could not reach Clover: ${err.message}` : "Unexpected error.",
    };
  }
}

export async function fetchPosMtdRevenue(): Promise<FetchRevenueResult> {
  const { businessId, subscriptionTier } = await getSessionState();
  if (!isGrowthTier(subscriptionTier)) return { error: GROWTH_REQUIRED_ERROR };
  const id = businessId as string;
  const supabase = await createClient();

  const { data: creds } = await supabase
    .from("pos_credentials")
    .select("pos_type, access_token, location_id, merchant_id")
    .eq("business_id", id)
    .maybeSingle();

  if (!creds?.access_token) {
    return { error: "Save your POS credentials first." };
  }

  if (creds.pos_type === "clover") {
    if (!creds.merchant_id) return { error: "Save your Clover Merchant ID first." };
    return fetchCloverMtdRevenue(creds.access_token, creds.merchant_id);
  }

  if (!creds.location_id) return { error: "Save your Square Location ID first." };
  return fetchSquareMtdRevenue(creds.access_token, creds.location_id);
}

export async function useFetchedRevenue(total: number): Promise<{ error?: string }> {
  const { businessId, subscriptionTier } = await getSessionState();
  if (!isGrowthTier(subscriptionTier)) return { error: GROWTH_REQUIRED_ERROR };
  const id = businessId as string;
  const supabase = await createClient();

  const { error } = await supabase
    .from("finance_data")
    .update({ revenue_mtd: total, updated_at: new Date().toISOString() })
    .eq("business_id", id);

  if (error) return { error: error.message };

  // Marks the moment a POS pull actually completed — distinct from
  // finance_data.updated_at, which also changes on manual Settings edits.
  await supabase
    .from("pos_credentials")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("business_id", id);

  revalidatePath("/dashboard");
  revalidatePath("/morning-brief");
  revalidatePath("/pos-integration");
  return {};
}
