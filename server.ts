interface NotificationRequest {
  title: string;
  message: string;
  sound?: boolean;
}

const CONFIG = {
  port: 8000,
  headers: {
    "Content-Type": "text/plain",
  },
};

function createResponse(message: string, status: number = 200): Response {
  return new Response(message, {
    status,
    headers: CONFIG.headers,
  });
}

function createErrorResponse(message: string, status: number = 500): Response {
  return createResponse(message, status);
}

function handlePing(): Response {
  return createResponse("pong");
}

async function sendNotification(request: NotificationRequest): Promise<boolean> {
  const { title, message, sound = false } = request;
  
  const osascript = sound 
    ? `display notification "${message}" with title "${title}" sound name "default"`
    : `display notification "${message}" with title "${title}"`;
  
  try {
    const command = new Deno.Command("osascript", {
      args: ["-e", osascript],
    });
    
    const { code } = await command.output();
    return code === 0;
  } catch {
    return false;
  }
}

async function handleNotify(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }
  
  try {
    const body = await req.json();
    const { title, message, sound = false } = body as NotificationRequest;
    
    if (!title || !message) {
      return createErrorResponse("Missing title or message", 400);
    }
    
    const success = await sendNotification({ title, message, sound });
    
    return success 
      ? createResponse("Notification sent successfully")
      : createErrorResponse("Failed to send notification");
  } catch (error) {
    return createErrorResponse(`Error: ${error.message}`);
  }
}

function createRouter() {
  const routes = new Map<string, (req: Request) => Response | Promise<Response>>();
  
  routes.set("/ping", handlePing);
  routes.set("/notify", handleNotify);
  
  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const handler = routes.get(url.pathname);
    
    if (handler) {
      return await handler(req);
    }
    
    return createErrorResponse("Not Found", 404);
  };
}

const router = createRouter();
const server = Deno.serve({ port: CONFIG.port }, router);

console.log(`Server running on http://localhost:${CONFIG.port}`);
console.log(`Try: curl http://localhost:${CONFIG.port}/ping`);
console.log(`Try: curl -X POST -H 'Content-Type: application/json' -d '{\"title\":\"Test\",\"message\":\"Hello World\",\"sound\":true}' http://localhost:${CONFIG.port}/notify`);