import authApiRequests from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
  try {
    const { payload } = await authApiRequests.sLogin(body);
    const { accessToken, refreshToken } = payload.data;
    const decodedAccessToken = jwt.decode(accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(refreshToken) as {
      exp: number;
    };

    cookieStore.set("accessToken", accessToken, {
      expires: decodedAccessToken.exp * 1000,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true
    });

    cookieStore.set("refreshToken", refreshToken, {
      expires: decodedRefreshToken.exp * 1000,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true
    });

    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      });
    } else {
      return Response.json(
        {
          message: "An unexpected error occurred during login.",
          error: error instanceof Error ? error.message : "Unknown error"
        },
        {
          status: 500
        }
      );
    }
  }
}
