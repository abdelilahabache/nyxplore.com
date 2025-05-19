export default async (request, context) => {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-nf-client-connection-ip'); // Netlify provides IP
  
  // Block common bots + suspicious IPs
  const isBot = /bot|crawl|spider|scrapy|nmap|sqlmap|python|curl|wget/i.test(userAgent);
  
  if (isBot) {
    return new Response('Access Denied: Automated traffic not allowed.', { 
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  return context.next();
};