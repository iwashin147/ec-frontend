// src/common/components/layout/GlobalFooter.tsx
import React from 'react';
import Link from 'next/link';

export default function GlobalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-gray-50 py-8 text-sm text-gray-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {' '}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">MyEC</h3>
            <p className="text-gray-600">
              あなたのための最高の商品を。
              <br />
              安心してお買い物をお楽しみください。
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              カテゴリ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products/category/electronics"
                  className="hover:text-blue-600"
                >
                  家電
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/fashion"
                  className="hover:text-blue-600"
                >
                  ファッション
                </Link>
              </li>
              <li>
                <Link
                  href="/products/category/books"
                  className="hover:text-blue-600"
                >
                  本
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              カスタマーサービス
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-blue-600">
                  注文履歴
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-600">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              フォローする
            </h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="hover:text-blue-600">
                Twitter
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-blue-600"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-gray-500">
          &copy; {currentYear} MyEC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
