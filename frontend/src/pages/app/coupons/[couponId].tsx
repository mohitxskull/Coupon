import { AppLayout } from "@/components/layout/app";
import { gateServer } from "@/configs/gate_server";
import { gateTan } from "@/configs/gate_tan";
import { gateClient } from "@/configs/gate_client";
import { LocalQueryLoader } from "@/components/query_loader";
import { CouponUpdateForm } from "@/components/ui/coupons/update_form";
import { Container } from "@mantine/core";
import { couponCrumbs } from "@/lib/crumbs";

export const getServerSideProps = gateServer.checkpoint();

export default function Page() {
  const { isReady, param } = gateClient.useParams();

  const couponId = param.bind(null, "couponId");

  const couponQ = gateTan.useQuery({
    endpoint: "V1_COUPON_SHOW",
    input: {
      params: {
        couponId: couponId(),
      },
    },
    enabled: isReady,
  });

  return (
    <>
      <AppLayout
        crumbs={couponCrumbs.get([
          {
            label: couponQ.data?.coupon.title || "Loading...",
            href: couponId(),
          },
        ])}
      >
        <Container my="xl">
          <LocalQueryLoader query={couponQ}>
            {({ coupon }) => (
              <>
                <CouponUpdateForm coupon={coupon} refetch={couponQ.refetch} />
              </>
            )}
          </LocalQueryLoader>
        </Container>
      </AppLayout>
    </>
  );
}
