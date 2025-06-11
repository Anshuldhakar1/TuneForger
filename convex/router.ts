import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/spotify/callback",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error || !code || !state) {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Spotify Connection Error</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">Connection Failed</h1>
            <p>Error: ${error || 'Missing authorization parameters'}</p>
            <script>
              console.log('Sending error message to parent');
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'spotify-error', 
                  error: ${JSON.stringify(error || 'Missing code or state')}
                }, '*');
              }
              setTimeout(() => { 
                console.log('Closing popup');
                window.close(); 
              }, 3000);
            </script>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { "Content-Type": "text/html" } 
      });
    }

    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Connected</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: #28a745; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Spotify Connected!</h1>
          <p>Redirecting back to the app...</p>
          <script>
            console.log('Sending success message to parent');
            console.log('Code:', ${JSON.stringify(code)});
            console.log('State:', ${JSON.stringify(state)});
            
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'spotify-code', 
                code: ${JSON.stringify(code)}, 
                state: ${JSON.stringify(state)}
              }, '*');
              console.log('Message sent to parent');
            } else {
              console.log('No window.opener found');
            }
            
            setTimeout(() => { 
              console.log('Closing popup');
              window.close(); 
            }, 2000);
          </script>
        </body>
      </html>
    `, { 
      status: 200,
      headers: { "Content-Type": "text/html" } 
    });
  }),
});

export default http;
