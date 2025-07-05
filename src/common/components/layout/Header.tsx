import NextLink from 'next/link';
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
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        color: 'text.primary',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
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
          <Button component={NextLink} href="/products" color="inherit">
            商品
          </Button>
          <Button component={NextLink} href="/login" color="inherit">
            ログイン
          </Button>
        </Box>
        <IconButton component={NextLink} href="/cart" color="inherit">
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
