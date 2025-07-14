'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
// [追加] Carouselコンポーネントをインポート
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/common/components/ui/carousel';
import { Product } from '@/features/products/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const descriptionText =
    product.description
      ?.map((block) => block.content)
      .flat()
      .join(' ') || '';

  return (
    <Card
      className="flex flex-col overflow-hidden rounded-lg shadow-lg
        transition-shadow duration-300 hover:shadow-xl"
    >
      {product.images && product.images.length > 1 ? (
        <Carousel
          className="group relative w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {product.images.map((image) => (
              <CarouselItem key={image.id}>
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={image.url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* [追加] 前後のナビゲーションボタン (ホバーで表示) */}
          <CarouselPrevious
            className="absolute top-1/2 left-2 -translate-y-1/2 opacity-0
              transition-opacity group-hover:opacity-100"
          />
          <CarouselNext
            className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0
              transition-opacity group-hover:opacity-100"
          />
        </Carousel>
      ) : (
        // --- 単一または画像なしの場合の静的表示 (従来通り) ---
        <Link href={`/products/${product.id}`} className="group block">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={product.images?.[0]?.url || '/placeholder.svg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500
                group-hover:scale-105"
            />
          </div>
        </Link>
      )}

      <CardContent className="flex flex-grow flex-col p-4">
        <div className="flex-grow">
          <Link
            href={`/products/${product.id}`}
            className="hover:text-primary block transition-colors"
          >
            <CardTitle className="mb-1 truncate text-lg font-semibold">
              {product.name}
            </CardTitle>
          </Link>
          {descriptionText && (
            <CardDescription
              className="text-muted-foreground line-clamp-2 text-sm"
            >
              {descriptionText}
            </CardDescription>
          )}
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-xl font-bold">¥{product.price.toLocaleString()}</p>
          <Button
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
            aria-label={`${product.name}をカートに追加`}
          >
            {product.stock > 0 ? 'カートに追加' : '在庫切れ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
