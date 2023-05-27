export const metadata = {
  title: 'SCHEDULE - Create an account',
  description: 'Please create an account.',
  openGraph: {
    title: 'SCHEDULE - Create an account',
    description: 'Please create an account.',
    image: '/logo.png'
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