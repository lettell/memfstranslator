const originalAPIHostname = "github.com";
const originalAPISecondHostname = "gitlab.com";

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

  if (url.pathname.startsWith('/github')) {
    const url = new URL(request.url);
    url.hostname = originalAPIHostname;


    // Best practice is to always use the original request to construct the new request
    // to clone all the attributes. Applying the URL also requires a constructor
    // since once a Request has been constructed, its URL is immutable.
    const newRequest = new Request(url.toString().replace('/github', ''), request);
    try {
      const response = await fetch(newRequest);

      // Copy over the response
      const modifiedResponse = new Response(response.body, response);

      // Delete the set-cookie from the response so it doesn't override existing cookies
      modifiedResponse.headers.delete("set-cookie");

      return modifiedResponse;
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
      });
    }
  } else if (url.pathname.startsWith('/gitlab')) {
    const url = new URL(request.url);
    url.hostname = originalAPISecondHostname;

    const newRequest = new Request(url.toString().replace('/gitlab', ''), request);
    try {
      const response = await fetch(newRequest);

      const modifiedResponse = new Response(response.body, response);

      modifiedResponse.headers.delete("set-cookie");

      return modifiedResponse;
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
      });
    }
  } else {
    return await next()

  }
}
