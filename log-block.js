// netlify/functions/log-block.js
exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  console.log('Blocked request:', data);
  
  // Add your analytics service here (e.g., Sentry, GA4)
  return { statusCode: 200 };
};