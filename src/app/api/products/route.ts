import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidateSiteContent } from "@/lib/revalidate";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch products";
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
      sku,
      shortDescription,
      description,
      image,
      gallery = [],
      specifications = [],
      features = [],
      applications = [],
      priceLabel = "Request a Quote",
      minOrderQty = "1 Unit",
      unit = "Unit",
      inStock = true,
      featured = false,
      isActive = true,
      sortOrder = 0,
      brochureUrl,
      metaTitle,
      metaDescription,
      metaKeywords,
      categoryId,
    } = body;

    if (!name || !categoryId || !description) {
      return NextResponse.json(
        { error: "Product name, category, and description are required" },
        { status: 400 }
      );
    }

    const slug = slugify(rawSlug || name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        sku: sku || null,
        shortDescription: shortDescription || null,
        description,
        image: image || null,
        gallery:
          typeof gallery === "string" ? gallery : JSON.stringify(gallery || []),
        specifications:
          typeof specifications === "string"
            ? specifications
            : JSON.stringify(specifications || []),
        features:
          typeof features === "string" ? features : JSON.stringify(features || []),
        applications:
          typeof applications === "string"
            ? applications
            : JSON.stringify(applications || []),
        priceLabel: priceLabel || "Request a Quote",
        minOrderQty: minOrderQty || "1 Unit",
        unit: unit || "Unit",
        inStock: Boolean(inStock),
        featured: Boolean(featured),
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
        brochureUrl: brochureUrl || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    revalidateSiteContent({
      productId: product.id,
      productSlug: product.slug,
      categoryId: product.categoryId,
      categorySlug: product.category?.slug,
    });

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
