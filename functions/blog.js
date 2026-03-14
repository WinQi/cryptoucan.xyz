export async function onRequest(context) {
  const html = await context.env.ASSETS.fetch(new Request('https://host/blog.html'));
  return new Response(html.body, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
