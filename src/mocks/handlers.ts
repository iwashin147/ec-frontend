import { http, HttpResponse, delay } from 'msw';
import { db } from '@/mocks/db';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const handlers = [
  http.get(`${API_BASE_URL}/products`, async ({ request }) => {
    console.log(`✅ [MSW Handler] GET ${API_BASE_URL}/products executed!`);

    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const allProducts = db.product.findMany({
      where: { name: { contains: q } },
    });

    const pageIndex = parseInt(url.searchParams.get('pageIndex') ?? '0', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10);
    const paginated = allProducts.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize,
    );
    const responseData = paginated.map((p) => ({
      ...p,
      category: p.category
        ? { id: p.category.id, name: p.category.name }
        : null,
      brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
    }));

    await delay(300);
    return HttpResponse.json({
      data: responseData,
      meta: { pageCount: Math.ceil(allProducts.length / pageSize) },
    });
  }),

  http.post(`${API_BASE_URL}/products`, async ({ request }) => {
    const data = await request.json();
    // @ts-ignore
    const newProduct = db.product.create(data);
    return HttpResponse.json(newProduct, { status: 201 });
  }),
];
