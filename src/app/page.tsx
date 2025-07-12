'use client';
import AuthStatus from '@/features/auth/components/AuthStatus';
import { Button } from '@/common/components/ui/button';
import { useAuthStore } from '@/common/store/authStore';

export default function HomePage() {
  const loginUser = useAuthStore((state) => state.login);

  const handleLogin = () => {
    loginUser({
      id: 'user-123',
      name: 'テストユーザー',
      email: 'test@example.com',
    });
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      {' '}
      <h1 className="mb-10 text-center text-4xl font-extrabold">
        <span className="text-blue-600">EC</span> サイトへようこそ！
      </h1>
      <section className="mb-10 text-center">
        <h2 className="mb-4 text-2xl font-semibold">認証状態を確認</h2>
        <div className="mb-6 flex justify-center">
          {' '}
          <AuthStatus />
        </div>
        <Button onClick={handleLogin} className="mt-4 px-6 py-3 text-lg">
          テストログイン
        </Button>
      </section>
      <section className="mt-12 text-center text-gray-600">
        <p>商品カテゴリや最新アイテムを探索してみましょう。</p>
        <Button variant="link" className="mt-2">
          商品一覧を見る
        </Button>
      </section>
    </div>
  );
}
