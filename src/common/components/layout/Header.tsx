import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from '@/common/components/ui/input/Link';

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
          component={Link}
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
          <Button component={Link} href="/products" color="inherit">
            商品
          </Button>
          <Button component={Link} href="/login" color="inherit">
            ログイン
          </Button>
        </Box>
        <IconButton component={Link} href="/cart" color="inherit">
          <ShoppingCartIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
