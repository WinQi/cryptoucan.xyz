export async function onRequest(context) {
  const slug = context.params.slug;
  const html = await context.env.ASSETS.fetch(
    new Request(`https://host/blog/${slug}.html`)
  );
  if (html.status === 404) {
    return context.next();
  }
  return new Response(html.body, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
