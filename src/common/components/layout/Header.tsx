// src/components/layout/Header.tsx

import NextLink from 'next/link'; // Next.jsのLinkをインポート
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Header() {
  return (
    <AppBar
      position="sticky" // 画面上部に追従
      sx={{
        // ガラスエフェクトを適用
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // 背景を少し透過
        color: 'text.primary', // 文字色をテーマのプライマリテキストカラーに
      }}
    >
      <Toolbar>
        {/* サイトロゴ/タイトル (クリックでトップページへ) */}
        <Typography
          variant="h6"
          component={NextLink} // Next.jsのLinkとして機能させる
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          My EC Site
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {/* ナビゲーションリンク */}
          <Button
            component={NextLink} // Next.jsのLinkとして機能させる
            href="/products"
            color="inherit"
          >
            Products
          </Button>
          <Button component={NextLink} href="/login" color="inherit">
            Login
          </Button>
        </Box>

        {/* カートアイコン */}
        <IconButton component={NextLink} href="/cart" color="inherit">
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
