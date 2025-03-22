import { AppShell, Button, Group, Text } from "@mantine/core";
import { setting } from "@/configs/setting";
import { useSignOut } from "@/lib/hooks/use_sign_out";
import Link from "next/link";
import { askConfirmation, For, If } from "@folie/cobalt/components";
import { Crumbs } from "@/lib/types";

type Props = {
  children: React.ReactNode;
  fullHeight?: boolean;
  crumbs?: Crumbs;
};

export const AppLayout = (props: Props) => {
  const signOutM = useSignOut();

  return (
    <>
      <AppShell
        header={{ height: setting.header.height }}
        padding="md"
        layout="alt"
      >
        <AppShell.Header withBorder={false}>
          <Group justify="space-between" px="md" h="100%">
            {props.crumbs && (
              <>
                <Group gap="xs">
                  <For each={props.crumbs}>
                    {(crumb, crumbIndex) => (
                      <>
                        <Text
                          size="sm"
                          fw="500"
                          truncate="end"
                          maw={150}
                          component={Link}
                          href={crumb.href}
                        >
                          {crumb.label}
                        </Text>

                        <If
                          isTrue={
                            props.crumbs?.length === 1 ||
                            crumbIndex !== (props.crumbs?.length ?? 0) - 1
                          }
                        >
                          <Text size="sm" fw="500">
                            /
                          </Text>
                        </If>
                      </>
                    )}
                  </For>
                </Group>
              </>
            )}

            <Group gap="xs">
              <Button
                size="sm"
                fw="500"
                variant="transparent"
                px="xs"
                component={Link}
                href="https://github.com/mohitxskull/Coupon"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </Button>

              <Button
                size="sm"
                fw="500"
                variant="transparent"
                px="xs"
                disabled={signOutM.isPending}
                component={Link}
                href="/app/settings"
              >
                Setting
              </Button>

              <Button
                fw="500"
                variant="transparent"
                disabled={signOutM.isPending}
                c="red"
                px="xs"
                onClick={async () => {
                  const res = await askConfirmation({
                    message: "Are you sure you want to logout?",
                    labels: {
                      confirm: "Logout",
                    },
                  });

                  if (res) {
                    signOutM.mutate(undefined);
                  }
                }}
              >
                Logout
              </Button>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main h={props.fullHeight ? `100vh` : "100%"}>
          {props.children}
        </AppShell.Main>
      </AppShell>
    </>
  );
};
