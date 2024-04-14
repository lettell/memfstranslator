addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    // Replace 'my.server.com' with your actual domain
    const url = new URL(request.url)
    if (url.hostname) {
        // Replace '/path' with your actual path
        if (url.pathname.startsWith('/lettell')) {
            // Construct the GitHub URL
            const githubUrl = 'https://github.com' + url.pathname

            // Fetch from GitHub
            let response = await fetch(githubUrl, request)

            // Add CORS headers
            let newHeaders = new Headers(response.headers)
            newHeaders.set('Access-Control-Allow-Origin', '*')
            newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
            newHeaders.set('Access-Control-Allow-Headers', '*')

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders
            })
        }
    }

    // If not a proxied path, handle the request normally
    return fetch(request)
}
