import { useQuery } from '@tanstack/react-query';
import { productService } from '@/features/products/service/productService';
import type { Product } from '@/features/products/types/product';

const PRODUCTS_QUERY_KEY = 'products';

/**
 * 特集商品を取得するためのカスタムフック
 */
export function useFeaturedProducts() {
  return useQuery<Product[], Error>({
    queryKey: [PRODUCTS_QUERY_KEY, 'featured'],
    queryFn: productService.getFeatured,
  });
}
