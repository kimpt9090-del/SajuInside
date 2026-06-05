import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/my";

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        await supabase.auth.exchangeCodeForSession(code);
      }
    } catch {
      return NextResponse.redirect(`${origin}/my?auth=error`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
