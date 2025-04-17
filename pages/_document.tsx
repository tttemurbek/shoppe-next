import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="index,follow" />
        <link rel="icon" type="image/png" href="/img/logo/favicon.png" />

        {/* SEO */}
        <meta name="keyword" content={'shoppe, shoppe.uz, devex mern, mern nestjs fullstack'} />
        <meta
          name={'description'}
          content={
            'At Shoppe.uz, we bring you the finest jewelry collections—handpicked for sophistication, luxury, and unmatched craftsmanship. | ' +
            'В Shoppe.uz мы предлагаем вам самые изысканные ювелирные коллекции — тщательно отобранные для утонченности, роскоши и безупречного мастерства | ' +
            'Shoppe.uz에서는 정교한 세공, 고급스러움, 그리고 비교할 수 없는 장인 정신으로 엄선된 최고의 주얼리 컬렉션을 선보입니다'
          }
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
