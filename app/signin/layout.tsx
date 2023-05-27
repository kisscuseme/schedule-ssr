export const metadata = {
  title: 'SCHEDULE - Sign In',
  description: 'Please log in.',
  openGraph: {
    title: 'SCHEDULE - Sign In',
    description: 'Please log in.',
    images: '/logo.png'
  }
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