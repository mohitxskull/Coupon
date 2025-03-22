import { AppLayout } from "@/components/layout/app";
import { LocalQueryLoader } from "@/components/query_loader";
import {
  Button,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { gateServer } from "@/configs/gate_server";
import { couponCrumbs } from "@/lib/crumbs";
import { gateTan } from "@/configs/gate_tan";
import { For, Show } from "@folie/cobalt/components";
import { timeAgo } from "@/lib/helpers/date";
import { PaginationRange } from "@/components/pagination_range";
import { SimplePagination } from "@/components/simple_pagination";
import { useRouter } from "next/router";
import { DotProp } from "@folie/lib";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { ICON_SIZE } from "@folie/cobalt";
import { notifications } from "@mantine/notifications";

export const getServerSideProps = gateServer.checkpoint();

export default function Page() {
  const router = useRouter();

  const { body, query, setBody } = gateTan.useList({
    endpoint: "V1_COUPON_LIST",
    input: {
      query: {
        page: 1,
        limit: 10,
        order: {
          by: "updatedAt",
          dir: "desc",
        },
      },
    },
    refetchInterval: 5000,
    debounce: {
      timeout: 500,
    },
  });

  const createM = gateTan.useMutation({
    endpoint: "V1_COUPON_CREATE",
    onSuccess: (updatedData) => {
      notifications.show({
        message: updatedData.message,
      });

      router.push(`/app/coupons/${updatedData.coupon.id}`);
    },
  });

  return (
    <>
      <AppLayout crumbs={couponCrumbs.get()}>
        <Container pt="xl">
          <Stack>
            <Group justify="space-between">
              <Title>Coupons</Title>

              <Group>
                <Button
                  leftSection={<IconPlus size={ICON_SIZE.SM} />}
                  onClick={() => createM.mutate(undefined)}
                  loading={createM.isPending}
                >
                  Create
                </Button>

                <Button
                  px="xs"
                  variant="outline"
                  disabled={query.isFetching}
                  onClick={() => query.refetch()}
                >
                  <IconRefresh size={ICON_SIZE.SM} />
                </Button>
              </Group>
            </Group>

            <SegmentedControl
              data={["Not Claimed", "Claimed"]}
              value={body.query?.filter?.claimed ? "Claimed" : "Not Claimed"}
              onChange={(value) => {
                setBody({
                  query: {
                    ...body.query,
                    filter:
                      value === "Claimed"
                        ? { claimed: true }
                        : { claimed: false },
                  },
                });
              }}
            />

            <TextInput
              minLength={1}
              maxLength={100}
              placeholder="Search coupons..."
              value={DotProp.lookup(body, "query.filter.value", "")}
              onChange={(e) => {
                const newValue = e.currentTarget.value;

                setBody({
                  query: {
                    ...body.query,
                    filter: newValue !== "" ? { value: newValue } : undefined,
                  },
                });
              }}
            />

            <Divider />

            <LocalQueryLoader
              query={query}
              isLoading={
                <>
                  <Center h="100vh">
                    <Loader />
                  </Center>
                </>
              }
            >
              {({ data, meta }) => (
                <>
                  <Show>
                    <Show.When isTrue={data.length === 0}>
                      <>
                        <Center h="50vh">
                          <Text fs="italic" fw="bold">
                            {(() => {
                              const filterValue = DotProp.lookup(
                                body,
                                "query.filter.value",
                                "",
                              );

                              if (filterValue !== "") {
                                return `No coupons found for "${filterValue}"`;
                              } else {
                                return `"No coupons found."`;
                              }
                            })()}
                          </Text>
                        </Center>
                      </>
                    </Show.When>

                    <Show.Else>
                      <>
                        <For each={data}>
                          {(note) => (
                            <>
                              <Paper
                                p="md"
                                withBorder
                                onClick={() =>
                                  router.push(`/app/coupons/${note.id}`)
                                }
                                style={{
                                  cursor: "pointer",
                                }}
                                bg="gray.1"
                              >
                                <Stack gap={0}>
                                  <Group justify="space-between">
                                    <Title order={4} flex={1}>
                                      <Text inherit truncate="end" maw="60%">
                                        {note.title}
                                      </Text>
                                    </Title>

                                    <Text c="dimmed" size="sm">
                                      {timeAgo(note.updatedAt)}
                                    </Text>
                                  </Group>

                                  <Group>
                                    <Text
                                      size="sm"
                                      c={note.isActive ? "teal.5" : "red.5"}
                                      fw="500"
                                    >
                                      {note.isActive ? "Active" : "Not Active"}
                                    </Text>
                                  </Group>
                                </Stack>
                              </Paper>
                            </>
                          )}
                        </For>

                        <Group justify="space-between">
                          <PaginationRange
                            page={DotProp.lookup(body, "query.page", 1)}
                            limit={DotProp.lookup(body, "query.limit", 10)}
                            total={meta.total}
                          />

                          <SimplePagination
                            page={DotProp.lookup(body, "query.page", 1)}
                            limit={DotProp.lookup(body, "query.limit", 10)}
                            total={meta.total}
                            onChange={(page) => {
                              setBody(
                                DotProp.assignOrOmit(
                                  body,
                                  "query.page",
                                  page,
                                  1,
                                ),
                              );
                            }}
                          />
                        </Group>

                        <Space h="xl" />
                      </>
                    </Show.Else>
                  </Show>
                </>
              )}
            </LocalQueryLoader>
          </Stack>
        </Container>
      </AppLayout>
    </>
  );
}
