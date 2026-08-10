import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

async function uniqueSlug(base: string) {
  const supabase = getSupabaseAdmin();
  const baseSlug = slugify(base) || "post";
  let slug = baseSlug;
  let n = 2;

  while (true) {
    const { data } = await supabase.from("news_posts").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${baseSlug}-${n}`;
    n++;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getSupabaseAdmin();

  if (body.featured) {
    await supabase.from("news_posts").update({ featured: false }).eq("featured", true);
  }

  const slug = await uniqueSlug(body.title);

  const { data, error } = await supabase
    .from("news_posts")
    .insert({
      slug,
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
      sort_order: body.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}
