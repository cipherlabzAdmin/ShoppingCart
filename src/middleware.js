import acceptLanguage from 'accept-language';
import { NextResponse } from "next/server";
import { fallbackLng, languages } from "./app/i18n/settings";

acceptLanguage.languages(languages)

const cookieName = 'i18next'

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    let lng
    if (request.cookies.has(cookieName)) lng = acceptLanguage.get(request.cookies.get(cookieName).value)
    if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
    if (!lng) lng = fallbackLng

    if (request.cookies.has("maintenance") && path !== `/${lng}/maintenance`) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${request.cookies.get("uat")?.value}`);
        let requestOptions = {
            method: "GET",
            headers: myHeaders,
        };
        let data = await (await fetch(process.env.API_PROD_URL + "settings", requestOptions))?.json();

        if (data?.values?.maintenance?.maintenance_mode && path !== `/${lng}/maintenance`) {
            return NextResponse.redirect(new URL(`/${lng}/maintenance`, request.url));
        } else {
            if (request.cookies.get("maintenance")) {
                return NextResponse.next();
            } else {
                const response = NextResponse.next();
                response.cookies.delete('maintenance');
                return NextResponse.redirect(new URL(`/`, request.url));
            }
        }
    }

    if (request.headers.get("x-redirected")) {
        // Request is already redirected, skip middleware
        return NextResponse.next();
    }

    // Redirect if lng in path is not supported
    if (
        !languages.some(loc => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !request.nextUrl.pathname.startsWith('/_next')
    ) {
        return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url))
    }
    if (request.headers.has('referer')) {
        const refererUrl = new URL(request.headers.get('referer'))
        const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
        const response = NextResponse.next()
        if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
        return response
    }

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};