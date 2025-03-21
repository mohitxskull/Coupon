import { gateServer } from "@/configs/gate_server";
import { NextServerError } from "@folie/gate-next";

export const getServerSideProps = gateServer.server(
  () => {
    throw NextServerError.redirect({
      destination: "/app/coupons",
      permanent: true,
    });
  },
  {
    checkpoint: true,
  },
);

export default function Page() {
  return <></>;
}
