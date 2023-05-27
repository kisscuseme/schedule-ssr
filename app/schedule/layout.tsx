export const metadata = {
  title: 'SCHEDULE',
  description: 'Manage your schedule',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}