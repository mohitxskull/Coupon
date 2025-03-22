import { Logo } from "@/components/logo";
import { env } from "@/configs/env";
import { gateClient } from "@/configs/gate_client";
import { gateServer } from "@/configs/gate_server";
import { gateTan } from "@/configs/gate_tan";
import { setting } from "@/configs/setting";
import { formatDate, timeLeft } from "@/lib/helpers/date";
import { Form } from "@folie/gate-tan/components";
import {
  AppShell,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";

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

  const [captchaReady, setCaptchaReady] = useState(false);

  const captchaRef = useRef<TurnstileInstance>(undefined);

  const couponQ = gateTan.useQuery({
    endpoint: "V1_COUPON_PUBLIC_SHOW",
    enabled: loggedIn,
    retry: false,
    token: () => gateClient.getCookie("guestSession"),
  });

  const { form, inputProps, mutation } = gateTan.useForm({
    endpoint: "V1_COUPON_PUBLIC_CLAIM",
    initialValues: {
      name: "",
    },
    onSuccess: () => {
      couponQ.refetch();
    },
    mutation: {
      token: () => gateClient.getCookie("guestSession"),
      onErrorHook: {
        after: () => {
          captchaRef.current?.reset();
          setCaptchaReady(false);
          gateClient.removeCookie("captcha");
        },
      },
    },
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell header={{ height: setting.header.height }} padding="md">
      <AppShell.Header withBorder={false} px="md" bg="transparent">
        <Group justify="left" h="100%">
          <Logo size="lg" />
        </Group>
      </AppShell.Header>

      <AppShell.Main h={`calc(100vh - ${setting.header.height}px)`}>
        <Container size="400px" h="100%">
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
                    <Paper withBorder w="100%" p="md">
                      <Stack>
                        <Stack gap={0}>
                          <Title>{coupon.title}</Title>
                          {coupon.description && (
                            <Text size="sm" c="dimmed">
                              {coupon.description}
                            </Text>
                          )}
                        </Stack>

                        <PasswordInput
                          variant="unstyled"
                          readOnly
                          value={coupon.code}
                        />

                        {coupon.expiresAt && (
                          <Text size="sm" c="dimmed">
                            Expires at {formatDate(coupon.expiresAt)} ( In{" "}
                            {timeLeft(coupon.expiresAt)} )
                          </Text>
                        )}
                      </Stack>
                    </Paper>
                  </>
                );
              }

              return (
                <>
                  <Paper withBorder w="100%" p="md">
                    <Stack>
                      <Text size="sm">
                        Just enter your name and hit the button to claim your
                        coupon!
                      </Text>

                      <Form
                        mutation={mutation}
                        submit={mutation.mutate}
                        form={form}
                      >
                        {({ dirty, loading }) => (
                          <>
                            <TextInput
                              label="Name"
                              placeholder="Enter your name"
                              type="text"
                              {...inputProps("name")}
                              key={form.key("name")}
                              required
                              withAsterisk={false}
                            />

                            {dirty && (
                              <Turnstile
                                ref={captchaRef}
                                siteKey={env.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY}
                                onSuccess={(t) => {
                                  gateClient.setCookie("captcha", t);
                                  setCaptchaReady(true);
                                }}
                                onExpire={() => {
                                  notifications.show({
                                    title: "Captcha Expired",
                                    message: "Complete it again",
                                  });

                                  setCaptchaReady(false);
                                  gateClient.removeCookie("captcha");
                                }}
                                onError={() => {
                                  notifications.show({
                                    title: "Captcha Error",
                                    message: "Please try again",
                                  });

                                  setCaptchaReady(false);
                                  gateClient.removeCookie("captcha");
                                }}
                                options={{
                                  size: "flexible",
                                }}
                              />
                            )}

                            <Button
                              type="submit"
                              loading={loading}
                              disabled={!dirty || !captchaReady}
                            >
                              Claim
                            </Button>
                          </>
                        )}
                      </Form>
                    </Stack>
                  </Paper>
                </>
              );
            })()}
          </Center>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
