import { methodNotAllowedProblem, notFoundProblem } from "@/lib/problem";

export const runtime = "edge";

type Ctx = { params: Promise<{ path: string[] }> };

async function notFound(_request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const instance = `/api/${path.join("/")}`;
  return notFoundProblem(instance);
}

export async function GET(request: Request, ctx: Ctx) {
  return notFound(request, ctx);
}
export async function HEAD(request: Request, ctx: Ctx) {
  return notFound(request, ctx);
}
export async function POST(request: Request, ctx: Ctx) {
  return notFound(request, ctx);
}
export async function PUT(request: Request, ctx: Ctx) {
  return notFound(request, ctx);
}
export async function PATCH(request: Request, ctx: Ctx) {
  return notFound(request, ctx);
}
export async function DELETE(request: Request, ctx: Ctx) {
  return notFound(request, ctx);
}
export async function OPTIONS(request: Request) {
  const instance = new URL(request.url).pathname;
  return methodNotAllowedProblem(instance, ["GET", "HEAD"]);
}
