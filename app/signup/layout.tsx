// 계정 생성 페이지 메타 정보
export const metadata = {
  title: "SCHEDULE - Create an account",
  description: "Please create an account.",
  openGraph: {
    title: "SCHEDULE - Create an account",
    description: "Please create an account.",
    images: "/images/logo.png",
  },
};

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