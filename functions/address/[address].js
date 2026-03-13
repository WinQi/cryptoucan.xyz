export async function onRequest(context) {
  const url = new URL(context.request.url);
  const assetUrl = new URL('/address.html', url.origin);
  
  const response = await context.env.ASSETS.fetch(assetUrl.toString());
  
  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}