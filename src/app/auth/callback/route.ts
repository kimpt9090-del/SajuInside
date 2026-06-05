import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/my";
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      if (!supabase) {
        return NextResponse.redirect(`${origin}/my?auth=error`);
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(`${origin}/my?auth=error`);
      }
    } catch {
      return NextResponse.redirect(`${origin}/my?auth=error`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
