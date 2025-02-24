import I18NextProvider from '@/Helper/I18NextContext/I18NextProvider'
import '../../../public/assets/scss/app.scss'
import NoSSR from '@/Utils/NoSSR'
import Logo from '../../../public/assets/images/logo/1.jpg'

export async function generateMetadata() {
    // fetch data
    const themeOption = await fetch(`${process.env.API_PROD_URL}themeOptions`).then((res) => res.json()).catch((err) => console.log("err", err))
    return {
        metadataBase: new URL(process.env.API_PROD_URL),
        title: themeOption?.options?.seo?.meta_tags,
        description: themeOption?.options?.seo?.meta_description,
        icons: {
            icon: '../../../public/assets/images/logo/1.jpg',
            link: {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Public+Sans&display=swap"
            },
        },
        openGraph: {
            title: 'pickPack',
            description: themeOption?.options?.seo?.og_description,
            images: [themeOption?.options?.seo?.og_image?.original_url, []],
        },
    }
}

export default function CustomLayout({ children, params: { lng } }) {
    return (<>
        <html lang={lng}>
            <head>
            <link rel="icon" href="https://www.smartpickpack.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F111.47a04e4c.png&w=128&q=75" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Public+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap" />
            </head>
            <body suppressHydrationWarning={true}>
                <I18NextProvider>
                    <NoSSR>{children}</NoSSR>
                </I18NextProvider>
            </body>
        </html>
    </>
    )
}