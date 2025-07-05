/* eslint-disable no-restricted-imports */
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material';
import { forwardRef } from 'react';

/**
 * Next.jsのLinkコンポーネントとMUIのLinkコンポーネントを組み合わせたカスタムリンクコンポーネント
 *
 * @see https://mui.com/material-ui/react-link/
 */
type CustomLinkProps = Omit<NextLinkProps, 'href'> &
  Omit<MuiLinkProps, 'href'> & {
    href: NextLinkProps['href'];
  };

/**
 * MUIの見た目でNextのLink機能を実現するコンポーネント
 */
const Link = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ href, ...props }, ref) => {
    return <MuiLink ref={ref} component={NextLink} href={href} {...props} />;
  },
);

Link.displayName = 'Link';

export default Link;
