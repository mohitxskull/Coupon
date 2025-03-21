import { GateNextClient } from "@folie/gate-next";

export const gateClient = new GateNextClient({
  cookieKeys: {
    session: "session_token",
    captcha: "captcha_token",
    guestSession: "guest_session_token",
  },
  paramKeys: ["userId", "couponId"] as const,
});
