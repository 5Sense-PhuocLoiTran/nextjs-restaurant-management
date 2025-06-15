import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequests = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  Login: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body, { baseUrl: "" })
};

export default authApiRequests;
