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

    const url = new URL(request.url)

    if (url.pathname.startsWith('/lettell')) {
        const url_hostname = url.hostname;
        const githubUrl = 'https://github.com' + url.pathname
        const method = request.method;
        const request_headers = request.headers;
        const new_request_headers = new Headers(request_headers);

        new_request_headers.set('Host', 'github.com');
        new_request_headers.set('Referer', url.protocol + '//' + url_hostname);

        let original_response = await fetch(githubUrl, {
            method: method,
            headers: new_request_headers
        })

        let original_response_clone = original_response.clone();
        let response_headers = original_response.headers;
        let new_response_headers = new Headers(response_headers);
        let status = original_response.status;

        if (disable_cache) {
            new_response_headers.set('Cache-Control', 'no-store');
        }

        new_response_headers.set('access-control-allow-origin', '*');
        new_response_headers.set('access-control-allow-credentials', true);
        new_response_headers.delete('content-security-policy');
        new_response_headers.delete('content-security-policy-report-only');
        new_response_headers.delete('clear-site-data');




        return new Response(original_response_clone.body, {
            status,
            headers: new_response_headers
        })
    } else {
        return await next()

    }
}
