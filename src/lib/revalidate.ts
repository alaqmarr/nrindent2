import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateSiteContent(options?: {
  productId?: string;
  productSlug?: string;
  categoryId?: string;
  categorySlug?: string;
}) {
  try {
    revalidateTag("site-settings", "max");
  } catch {
    // Fallback if signature varies
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/categories");
  revalidatePath("/contact");
  revalidatePath("/sitemap.xml");

  if (options?.productId) {
    revalidatePath(`/products/${options.productId}`);
  }
  if (options?.productSlug) {
    revalidatePath(`/products/${options.productSlug}`);
  }
  if (options?.categoryId) {
    revalidatePath(`/categories/${options.categoryId}`);
  }
  if (options?.categorySlug) {
    revalidatePath(`/categories/${options.categorySlug}`);
  }
}
