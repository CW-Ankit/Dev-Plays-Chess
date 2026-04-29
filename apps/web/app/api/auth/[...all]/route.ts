import { handler } from "@/lib/authServer";

export async function GET(req: Request) {
  return handler.GET(req);
}

export async function POST(req: Request) {
  return handler.POST(req);
}


