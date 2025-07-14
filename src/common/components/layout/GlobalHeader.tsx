// src/common/components/layout/GlobalHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  Home,
  Layers,
  Info,
  Phone,
  LogIn,
  LogOut,
  Package,
  Settings,
  ChevronRight,
  Tags,
  Heart,
} from 'lucide-react'; // 💡 新しいアイコンも追加
import { useAuthStore } from '@/store/authStore';
// import { useCartStore } from '@/features/cart/store/cartStore'; // カートストア (後で作成)
import { signIn, signOut } from 'next-auth/react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/common/components/ui/sheet';
import { Separator } from '@/common/components/ui/separator';
import { ScrollArea } from '@/common/components/ui/scroll-area';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/common/components/ui/accordion';

// モバイルメニューのカテゴリデータ例
const mobileCategories = [
  { name: '家電', href: '/products/category/electronics', icon: Home },
  { name: 'ファッション', href: '/products/category/fashion', icon: Layers },
  { name: '本', href: '/products/category/books', icon: Info },
  { name: '生活雑貨', href: '/products/category/home-goods', icon: Settings },
  // さらにサブカテゴリを持つ場合は、childrenプロパティを追加
  {
    name: 'スペシャル',
    icon: Tags,
    subCategories: [
      { name: 'セール品', href: '/products/sale' },
      { name: '限定商品', href: '/products/limited' },
    ],
  },
];

export default function GlobalHeader() {
  const { isAuthenticated, user } = useAuthStore();
  // const cartItemCount = useCartStore(state => state.items.length); // カートのアイテム数 (後で実装)

  const handleAuthClick = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      signIn();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* サイトロゴ/ホームリンク */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MyEC
        </Link>

        {/* 検索バー (モバイルでは非表示、MDサイズ以上で表示) */}
        <div className="relative mx-4 hidden flex-grow justify-center md:flex">
          <Input
            type="search"
            placeholder="商品を検索..."
            className="w-full max-w-md rounded-full border-gray-300 pr-2 pl-10 focus:border-blue-500"
          />
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
        </div>

        {/* ナビゲーションアイコン群 */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {/* アカウント/ログイン (デスクトップ版) */}
          <Link
            href={isAuthenticated ? '/account' : '/auth/login'}
            className="hidden md:block"
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100"
            >
              {' '}
              {/* 💡 スタイル調整 */}
              <User className="h-6 w-6" />
              <span className="sr-only">
                {isAuthenticated ? 'マイページ' : 'ログイン'}
              </span>
              {isAuthenticated && (
                <span
                  className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-green-500 ring-2
                    ring-white"
                />
              )}
            </Button>
          </Link>

          {/* カート */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100"
            >
              {' '}
              {/* 💡 スタイル調整 */}
              <ShoppingCart className="h-6 w-6" />
              {/*cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-white"> {/* 💡 リングを追加 */}
              {/*cartItemCount*/}
              {/*</span>
              )*/}
              <span className="sr-only">カート</span>
            </Button>
          </Link>

          {/* モバイルメニューボタン (MDサイズ以下で表示) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                >
                  {' '}
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">メニューを開く</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[300px] flex-col p-4 sm:w-[350px]"
              >
                {' '}
                <SheetHeader className="mb-0">
                  <SheetTitle className="text-2xl font-bold">
                    メニュー
                  </SheetTitle>{' '}
                  {/* 💡 タイトルスタイル調整 */}
                  <SheetDescription className="text-gray-600">
                    サイトの主要な機能へアクセス
                  </SheetDescription>{' '}
                  {/* 💡 説明文スタイル調整 */}
                </SheetHeader>
                {/* モバイルメニュー内の検索バー */}
                <div className="relative my-4 flex justify-center">
                  {' '}
                  <Input
                    type="search"
                    placeholder="商品を検索..."
                    className="w-full rounded-full border-gray-300 pr-2 pl-10 focus:border-blue-500" // 💡 スタイル調整
                  />
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
                <ScrollArea className="flex-grow pb-4">
                  {' '}
                  {isAuthenticated && user && (
                    <>
                      {/* 💡 mb-4 を mb-2 に調整 */}
                      <div className="mb-2 flex items-center rounded-lg bg-blue-50 p-3 text-blue-800">
                        <User className="mr-3 h-6 w-6" />
                        <div>
                          <p className="text-base font-semibold">
                            こんにちは、{user.name || user.email}さん！
                          </p>
                          <Link
                            href="/account"
                            className="text-sm hover:underline"
                          >
                            マイアカウントへ{' '}
                            <ChevronRight className="inline h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                      {/* 💡 mb-4 を mb-2 に調整 */}
                      <Separator className="mb-2" />
                    </>
                  )}
                  <nav className="flex flex-col space-y-1 text-base">
                    {' '}
                    {/* 💡 フォントサイズ、スペース調整 */}
                    <Link
                      href="/"
                      className="group flex items-center rounded-lg p-3 transition-colors hover:bg-gray-100"
                    >
                      <Home className="mr-3 h-5 w-5 text-gray-600 group-hover:text-blue-600" />{' '}
                      トップページ{' '}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                    <Link
                      href="/products"
                      className="group flex items-center rounded-lg p-3 transition-colors hover:bg-gray-100"
                    >
                      <Layers className="mr-3 h-5 w-5 text-gray-600 group-hover:text-blue-600" />{' '}
                      全商品{' '}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                    {/* カテゴリのアコーディオンメニュー */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories">
                        <AccordionTrigger
                          className="group flex items-center rounded-lg p-3 text-base font-medium transition-colors
                            hover:bg-gray-100"
                        >
                          <Tags className="mr-3 h-5 w-5 text-gray-600 group-hover:text-blue-600" />{' '}
                          カテゴリ
                        </AccordionTrigger>
                        <AccordionContent className="space-y-1 py-2 pl-8">
                          {' '}
                          {/* 💡 インデントと余白 */}
                          {mobileCategories.map((category, index) =>
                            typeof category.href === 'string' ? ( // hrefがある場合（直接リンク）
                              <Link
                                key={index}
                                href={category.href}
                                className="flex items-center rounded-md px-3 py-2 text-sm text-gray-700 transition-colors
                                  hover:bg-gray-200"
                              >
                                {category.name}{' '}
                                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                              </Link>
                            ) : (
                              // サブカテゴリがある場合
                              <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                                key={index}
                              >
                                <AccordionItem value={category.name}>
                                  <AccordionTrigger
                                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700
                                      transition-colors hover:bg-gray-200"
                                  >
                                    {category.name}
                                  </AccordionTrigger>
                                  <AccordionContent className="space-y-1 py-1 pl-4">
                                    {category.subCategories?.map(
                                      (subCat, subIndex) => (
                                        <Link
                                          key={subIndex}
                                          href={subCat.href}
                                          className="flex items-center rounded-md px-3 py-2 text-xs text-gray-600 transition-colors
                                            hover:bg-gray-300"
                                        >
                                          {subCat.name}
                                        </Link>
                                      ),
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ),
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Link
                      href="/favorites"
                      className="group flex items-center rounded-lg p-3 transition-colors hover:bg-gray-100"
                    >
                      <Heart className="mr-3 h-5 w-5 text-gray-600 group-hover:text-red-500" />{' '}
                      お気に入り{' '}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                    <Separator className="my-2" />
                    <Link
                      href="/account/orders"
                      className="group flex items-center rounded-lg p-3 transition-colors hover:bg-gray-100"
                    >
                      <Package className="mr-3 h-5 w-5 text-gray-600 group-hover:text-blue-600" />{' '}
                      注文履歴{' '}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                    <Link
                      href="/account/profile"
                      className="group flex items-center rounded-lg p-3 transition-colors hover:bg-gray-100"
                    >
                      <Settings className="mr-3 h-5 w-5 text-gray-600 group-hover:text-blue-600" />{' '}
                      アカウント設定{' '}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                    <Separator className="my-2" />
                    <Link
                      href="/about"
                      className="group flex items-center rounded-lg p-3 transition-colors hover:bg-gray-100"
                    >
                      <Info className="mr-3 h-5 w-5 text-gray-600 group-hover:text-blue-600" />{' '}
                      MyECについて{' '}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                    <Link
                      href="/contact"
                      className="group flex items-center rounded-lg p-3 transition-colors hover:bg-gray-100"
                    >
                      <Phone className="mr-3 h-5 w-5 text-gray-600 group-hover:text-blue-600" />{' '}
                      お問い合わせ{' '}
                      <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                  </nav>
                </ScrollArea>
                {/* 認証状態に応じたボタン - 常に下部に固定 */}
                <div className="mt-auto border-t border-gray-200 pt-6">
                  {isAuthenticated && user ? (
                    <div className="mb-4 text-center text-sm text-gray-600">
                      <p className="mb-1">
                        こんにちは、
                        <span className="font-semibold">
                          {user.name || user.email}
                        </span>
                        さん！
                      </p>
                    </div>
                  ) : null}
                  <Button
                    className="h-12 w-full text-lg" // 💡 ボタンの高さも調整
                    variant={isAuthenticated ? 'outline' : 'default'}
                    onClick={handleAuthClick}
                  >
                    {isAuthenticated ? (
                      <>
                        <LogOut className="mr-2 h-5 w-5" /> ログアウト
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" /> ログイン / 会員登録
                      </>
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
