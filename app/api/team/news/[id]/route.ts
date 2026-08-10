import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = getSupabaseAdmin();

  if (body.featured) {
    await supabase.from("news_posts").update({ featured: false }).eq("featured", true).neq("id", id);
  }

  const { data, error } = await supabase
    .from("news_posts")
    .update({
      published_date: body.publishedDate,
      title: body.title,
      excerpt: body.excerpt,
      body: body.body || null,
      image_url: body.imageUrl || null,
      video_url: body.videoUrl || null,
      link_url: body.linkUrl || null,
      link_label: body.linkLabel || null,
      featured: Boolean(body.featured),
      show_on_homepage: body.showOnHomepage !== false,
      sort_order: body.sortOrder,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("news_posts").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
