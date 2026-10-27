import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidateSiteContent } from "@/lib/revalidate";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ categories });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug: rawSlug,
      shortDescription,
      description,
      image,
      bannerImage,
      featured = false,
      isActive = true,
      sortOrder = 0,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = slugify(rawSlug || name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        shortDescription: shortDescription || null,
        description: description || null,
        image: image || null,
        bannerImage: bannerImage || null,
        featured: Boolean(featured),
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
      },
    });

    revalidateSiteContent({
      categoryId: category.id,
      categorySlug: category.slug,
    });

    return NextResponse.json({ success: true, category });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
