const https = require('https');

https.get('https://cloudflare-dns.com/dns-query?name=_mongodb._tcp.cluster0.3ujqdqh.mongodb.net&type=SRV', { headers: { accept: 'application/dns-json' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('SRV:', d));
});

https.get('https://cloudflare-dns.com/dns-query?name=cluster0.3ujqdqh.mongodb.net&type=TXT', { headers: { accept: 'application/dns-json' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('TXT:', d));
});
