'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Client Component用のsignIn
import { useRouter } from 'next/navigation';
import { Button, TextField, Box, Typography } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // 「入力キー」用のstate
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false, // ページリダイレクトを自身で制御
        email,
        password, // 「入力キー」を渡す
      });

      if (result?.error) {
        setError('認証に失敗しました。');
      } else if (result?.ok) {
        router.push('/'); // ログイン成功時にトップページへ
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('エラーが発生しました。');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, margin: 'auto', mt: 8 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        ログイン
      </Typography>
      <TextField
        label="メールアドレス"
        type="email"
        fullWidth
        required
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="入力キー" // UI上のラベル
        type="text" // ここではtypeをtextにしています
        fullWidth
        required
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        ログイン
      </Button>
    </Box>
  );
}
