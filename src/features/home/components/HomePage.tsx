'use client';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/common/components/ui/button';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AuthStatus from '@/features/auth/components/AuthStatus';
import ProductCard from '@/features/products/components/ProductCard';
import { useFeaturedProducts } from '@/features/products/hooks/useProducts';

export default function HomePage() {
  const { data: products, isLoading, isError, error } = useFeaturedProducts();

  const loginUser = useAuthStore((state) => state.login);
  const handleLogin = () => {
    loginUser({
      id: 'user-123',
      name: 'テストユーザー',
      email: 'test@example.com',
    });
  };

  const handleAddToCart = (productId: string) => {
    console.log(`カートに ${productId} を追加`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>商品を読み込んでいます...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[calc(100vh-theme(spacing.16)-theme(spacing.20))]
        flex-col"
    >
      <section
        className="relative w-full overflow-hidden bg-gradient-to-r
          from-blue-600 to-indigo-700 px-4 py-24 text-white sm:py-32 md:py-40
          lg:py-48"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at top left, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%)',
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at bottom right, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%)',
          }}
        ></div>
        <div className="relative z-10 container mx-auto text-center">
          <Sparkles
            className="mx-auto mb-6 h-16 w-16 animate-pulse text-yellow-300"
          />
          <h1
            className="animate-fade-in-up mb-4 text-4xl leading-tight
              font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            <span className="block">あなたの日々を</span>
            <span className="block text-blue-200">
              豊かにする特別なアイテムを。
            </span>
          </h1>
          <p
            className="animate-fade-in animation-delay-300 mx-auto mb-10
              max-w-3xl text-lg opacity-90 sm:text-xl md:text-2xl"
          >
            厳選された高品質な商品で、最高のショッピング体験をお届けします。
          </p>
          <Button
            size="lg"
            className="animate-slide-up transform bg-white text-blue-700
              shadow-lg transition-all duration-300 hover:scale-105
              hover:bg-blue-100"
            asChild
          >
            <Link
              href="/products"
              className="flex items-center justify-center space-x-2"
            >
              <span>全商品を見る</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 特集商品セクション */}
      <section className="container mx-auto bg-white px-4 py-16">
        <div className="mb-10 flex items-center justify-between">
          <h2
            className="flex items-center space-x-3 text-3xl font-bold
              tracking-tight text-gray-800 sm:text-4xl"
          >
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span>新着&おすすめ商品</span>
          </h2>
          <Button variant="outline" asChild>
            <Link href="/products">
              すべて見る <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {products && products.length > 0 && (
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3
              lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* カテゴリ誘導セクション */}
      <section className="container mx-auto bg-gray-50 px-4 py-16">
        <h2
          className="mb-10 text-center text-3xl font-bold text-gray-800
            sm:text-4xl"
        >
          人気カテゴリから探す
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Link
            href="/products/category/electronics"
            className="group block rounded-xl border border-gray-200 bg-white
              p-6 text-center shadow-sm transition-all duration-300
              hover:border-blue-300 hover:shadow-md"
          >
            <img
              src="/icons/electronics.svg"
              alt="Electronics"
              className="mx-auto mb-4 h-20 w-20 transition-transform
                duration-300 group-hover:scale-110"
            />
            <span
              className="text-lg font-semibold text-gray-800
                group-hover:text-blue-600"
            >
              家電
            </span>
          </Link>
          {/* 他のカテゴリリンクも同様 */}
        </div>
      </section>

      {/* アカウント管理セクション */}
      <section className="container mx-auto max-w-md px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          アカウント管理
        </h2>
        <AuthStatus />
        <Button onClick={handleLogin} className="mt-6 px-6 py-3 text-lg">
          テストログイン
        </Button>
      </section>
    </div>
  );
}
