export const metadata = {
  title: 'SCHEDULE - SSR',
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