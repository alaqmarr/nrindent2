import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidateSiteContent } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug,
        shortDescription: body.shortDescription ?? null,
        description: body.description ?? null,
        image: body.image ?? null,
        bannerImage: body.bannerImage ?? null,
        featured: Boolean(body.featured),
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        sortOrder: Number(body.sortOrder) || 0,
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        metaKeywords: body.metaKeywords ?? null,
      },
    });

    revalidateSiteContent({
      categoryId: category.id,
      categorySlug: category.slug,
    });

    return NextResponse.json({ success: true, category });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await prisma.category.delete({ where: { id } });

    revalidateSiteContent({
      categoryId: deleted.id,
      categorySlug: deleted.slug,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
