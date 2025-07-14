import { apiClient } from '@/common/lib/api';
import type { Product } from '@/features/products/types/product';

/**
 * 商品関連のAPI通信を責務とするサービス
 */
export const productService = {
  /**
   * 特集商品（商品一覧）を取得します。
   */
  getFeatured: async (): Promise<Product[]> => {
    const result = await apiClient.get<{ data: Product[] }>('/products');
    if (!result.ok) {
      throw new Error(
        `Failed to fetch products: ${result.error.statusCode} ${result.error.message}`,
      );
    }
    return result.value.data;
  },

  /**
   * IDを指定して単一の商品を取得します。
   * @param id - 商品ID
   */
  // getById: async (id: string): Promise<Product> => { ... },

  /**
   * 新しい商品を作成します。
   */
  // create: async (newProductData: Omit<Product, 'id'>): Promise<Product> => { ... },
};
