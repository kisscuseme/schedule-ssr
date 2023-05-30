// 로그인 페이지 메타 정보
export const metadata = {
  title: "SCHEDULE - Sign In",
  description: "Please log in.",
  openGraph: {
    title: "SCHEDULE - Sign In",
    description: "Please log in.",
    images: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
