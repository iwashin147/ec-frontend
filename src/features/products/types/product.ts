/**
 * 商品のinterface定義
 */
export interface Product {
  id: string;
  name: string;
  description: ProductDescriptionBlock[];
  price: number;
  stock: number;
  status: '販売中' | '在庫切れ' | '非公開'; // 具体的なステータスにするとより安全
  createdAt: string; // ISO 8601形式の文字列
  category: Category | null;
  brand: Brand | null;
  images: Image[];
}
export interface Brand {
  id: string;
  name: string;
  website: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parent: Category | null;
}

export interface Image {
  id: string;
  url: string;
  order: number;
}
export interface ProductDescriptionBlock {
  type: 'paragraph' | 'heading' | 'list';
  content: string | string[];
}
