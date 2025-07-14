'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export default function AuthStatus() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">ログインが必要です</CardTitle>
          <CardDescription>
            サービスをご利用いただくにはログインしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 text-sm">
            アカウントをお持ちでない場合は、新規登録を行ってください。
          </p>
          <Button className="w-full">ログイン</Button>
          <Button variant="outline" className="mt-2 w-full">
            新規登録
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">認証済み</CardTitle>
        <CardDescription>アカウント情報</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          ようこそ、<span className="text-lg font-semibold">{user?.name}</span>{' '}
          さん！
        </p>
        <p className="mb-4 text-sm text-gray-600">メール: {user?.email}</p>
        <Button onClick={logout} className="w-full" variant="destructive">
          {' '}
          ログアウト
        </Button>
      </CardContent>
    </Card>
  );
}
