const redirectToPrerender = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    if (request.headers['x-prerender-token'] && request.headers['x-prerender-host']) {
      request.origin = {
          custom: {
              domainName: 'service.prerender.io',
              port: 443,
              protocol: 'https',
              readTimeout: 20,
              keepaliveTimeout: 5,
              customHeaders: {},
              sslProtocols: ['TLSv1', 'TLSv1.1'],
              path: '/https%3A%2F%2F' + request.headers['x-prerender-host'][0].value
          }
      };
   }
   callback(null, request);
};

const setPrerenderHeader = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const user_agent = headers['user-agent'];
    const host = headers['host'];
    console.log(JSON.stringify(request));
    if (user_agent && host) {
      var prerender = /googlebot|adsbot\-google|Feedfetcher\-Google|bingbot|yandex|baiduspider|Facebot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/i.test(user_agent[0].value);
      prerender = prerender || /_escaped_fragment_/.test(request.querystring);
      prerender = prerender && ! /\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|svg|eot)$/i.test(request.uri);
      if (prerender) {
        headers['x-prerender-token'] = [{ key: 'X-Prerender-Token', value: 'PRERENDER_TOKEN'}];
        headers['x-prerender-host'] = [{ key: 'X-Prerender-Host', value: host[0].value}];
        headers['x-prerender-cachebuster'] = [{ key: 'X-Prerender-Cachebuster', value: Date.now().toString()}];
      }
    }
    callback(null, request);
};

module.exports.viewerRequest = setPrerenderHeader;
module.exports.originRequest = redirectToPrerender;