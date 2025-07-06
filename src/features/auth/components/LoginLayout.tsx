export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>ログイン</h1>
      {children}
    </div>
  );
}
