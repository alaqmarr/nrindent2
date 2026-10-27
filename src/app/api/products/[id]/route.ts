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

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug,
        sku: body.sku ?? null,
        shortDescription: body.shortDescription ?? null,
        description: body.description,
        image: body.image ?? null,
        gallery:
          typeof body.gallery === "string"
            ? body.gallery
            : JSON.stringify(body.gallery || []),
        specifications:
          typeof body.specifications === "string"
            ? body.specifications
            : JSON.stringify(body.specifications || []),
        features:
          typeof body.features === "string"
            ? body.features
            : JSON.stringify(body.features || []),
        applications:
          typeof body.applications === "string"
            ? body.applications
            : JSON.stringify(body.applications || []),
        priceLabel: body.priceLabel ?? "Request a Quote",
        minOrderQty: body.minOrderQty ?? "1 Unit",
        unit: body.unit ?? "Unit",
        inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
        featured: Boolean(body.featured),
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        sortOrder: Number(body.sortOrder) || 0,
        brochureUrl: body.brochureUrl ?? null,
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        metaKeywords: body.metaKeywords ?? null,
        categoryId: body.categoryId,
      },
      include: { category: true },
    });

    revalidateSiteContent({
      productId: product.id,
      productSlug: product.slug,
      categoryId: product.categoryId,
      categorySlug: product.category?.slug,
    });

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product";
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
    const deleted = await prisma.product.delete({
      where: { id },
      include: { category: true },
    });

    revalidateSiteContent({
      productId: deleted.id,
      productSlug: deleted.slug,
      categoryId: deleted.categoryId,
      categorySlug: deleted.category?.slug,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
