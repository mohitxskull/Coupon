import { Logo } from "@/components/logo";
import { gateClient } from "@/configs/gate_client";
import { gateServer } from "@/configs/gate_server";
import { gateTan } from "@/configs/gate_tan";
import { setting } from "@/configs/setting";
import {
  AppShell,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";

export const getServerSideProps = gateServer.checkpoint({
  condition: ({ session }) => {
    return {
      allow: !session,
      redirect: "/app",
    };
  },
});

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);

  const couponQ = gateTan.useQuery({
    endpoint: "V1_COUPON_PUBLIC_SHOW",
    enabled: loggedIn,
    retry: false,
  });
  
  // const {} = gateT

  const newTokenM = gateTan.useMutation({
    endpoint: "V1_AUTH_SIGN_IN_GUEST",
    onSuccess: (data) => {
      gateClient.setCookie("guestSession", data.session);
      setLoggedIn(true);
    },
  });

  useEffect(() => {
    if (gateClient.getCookie("guestSession")) {
      setLoggedIn(true);
    } else {
      newTokenM.mutate(undefined);
    }
  }, []);

  if (!loggedIn) {
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );
  }

  return (
    <AppShell header={{ height: setting.header.height }} padding="md">
      <AppShell.Header withBorder={false} px="md" bg="transparent">
        <Group justify="left" h="100%">
          <Logo size="lg" />
        </Group>
      </AppShell.Header>

      <AppShell.Main h={`calc(100vh - ${setting.header.height}px)`}>
        <Center h="100%">
          {(() => {
            if (!loggedIn) {
              return <Loader />;
            }

            if (couponQ.isLoading) {
              return <Loader />;
            }

            const coupon = couponQ.data?.coupon;

            if (coupon) {
              return (
                <>
                  <Text>{coupon.title}</Text>
                </>
              );
            }

            return (
              <>
                <Paper withBorder>
                  <Form>
                    <Stack>
                      <Text>
                        Just enter your name and hit the button to claim your
                        coupon!
                      </Text>
                    </Stack>
                  </Form>
                </Paper>
              </>
            );
          })()}
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}
