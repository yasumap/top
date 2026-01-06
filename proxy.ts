import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAuthorized(request: NextRequest): boolean {
  const username = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return false;
  }

  const [scheme, encoded] = authorization.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return false;
  }

  const decoded = atob(encoded);
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    return false;
  }

  const providedUser = decoded.slice(0, separatorIndex);
  const providedPass = decoded.slice(separatorIndex + 1);

  return providedUser === username && providedPass === password;
}

export function proxy(request: NextRequest) {
  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  if (!process.env.BASIC_AUTH_USER || !process.env.BASIC_AUTH_PASSWORD) {
    return new NextResponse("Basic auth is not configured.", { status: 500 });
  }

  const response = new NextResponse("Authentication required.", {
    status: 401,
  });
  response.headers.set("WWW-Authenticate", "Basic realm=\"Admin\"");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
