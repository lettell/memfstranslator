// addEventListener('fetch', event => {
//     event.respondWith(handleRequest(event.request))
// })

// async function handleRequest(request) {
//     // Replace 'my.server.com' with your actual domain
//     const url = new URL(request.url)
//     if (url.hostname) {
//         // Replace '/path' with your actual path
//         if (url.pathname.startsWith('/lettell')) {
//             // Construct the GitHub URL
//             const githubUrl = 'https://github.com' + url.pathname

//             // Fetch from GitHub
//             let response = await fetch(githubUrl, request)

//             // Add CORS headers
//             let newHeaders = new Headers(response.headers)
//             newHeaders.set('Access-Control-Allow-Origin', '*')
//             newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
//             newHeaders.set('Access-Control-Allow-Headers', '*')

//             return new Response(response.body, {
//                 status: response.status,
//                 statusText: response.statusText,
//                 headers: newHeaders
//             })
//         }
//     }

//     // If not a proxied path, handle the request normally
//     return fetch(request)
// }

export async function onRequest(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context
    const res = await next()
    const { pathname } = new URL(request.url)

    if (pathname === '/lettell') {
        return new Response.redirect('https://github.com' + pathname, '307')
    }

    return res
}
