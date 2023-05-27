import "./global.css";
import ReactQueryWrapper from "@/components/organisms/ReactQueryWrapper";
import RecoilRootWrapper from "@/components/organisms/RecoilRootWrapper";
import StyledComponentsRegistry from "./registry";
import TranslationFromServer from "@/components/organisms/TranslationFromServer";
import ShowAlert from "@/components/organisms/ShowAlert";

export const metadata = {
  title: 'SCHEDULE',
  description: 'Manage your schedule',
  openGraph: {
    title: 'SCHEDULE',
    description: 'Manage your schedule',
    image: './logo.png'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"
          crossOrigin="anonymous"
          defer
        ></script>

        <script
          src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
          crossOrigin="anonymous"
          defer
        ></script>

        <script
          src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
          crossOrigin="anonymous"
          defer
        ></script>

        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossOrigin="anonymous"
        />

        <link
          rel="preload"
          as="font"
          type="font/woff"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEdu_OTFBoldA.woff"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <TranslationFromServer />
        <ReactQueryWrapper>
          <RecoilRootWrapper>
            <StyledComponentsRegistry>
              {children}
              <ShowAlert />
            </StyledComponentsRegistry>
          </RecoilRootWrapper>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}