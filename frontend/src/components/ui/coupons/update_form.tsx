import {
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { gateTan } from "@/configs/gate_tan";
import { formatDate, timeAgo } from "@/lib/helpers/date";
import { V1CouponShowRoute } from "@coupon/backend/blueprint";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { Form } from "@folie/gate-tan/components";
import { askConfirmation, HorizontalInput } from "@folie/cobalt/components";
import { StringDateInput } from "@/components/string_date_input";
import dayjs from "dayjs";

type Props = {
  coupon: V1CouponShowRoute["output"]["coupon"];
  refetch: () => void;
};

export const CouponUpdateForm = (props: Props) => {
  const router = useRouter();

  const { form, inputProps, mutation } = gateTan.useForm({
    endpoint: "V1_COUPON_UPDATE",

    initialValues: {
      params: {
        couponId: props.coupon.id,
      },
      title: props.coupon.title,
      description: props.coupon.description,
      code: props.coupon.code,
      isActive: props.coupon.isActive,
      expiresAt: props.coupon.expiresAt,
    },
    onSuccess: (updatedCoupon) => {
      notifications.show({
        message: updatedCoupon.message,
      });

      props.refetch();

      return {
        input: {
          ...updatedCoupon.coupon,
          params: {
            couponId: updatedCoupon.coupon.id,
          },
        },
        queryKeys: (qk) => [qk("V1_COUPON_LIST")],
      };
    },
  });

  const deleteM = gateTan.useMutation({
    endpoint: "V1_COUPON_DELETE",
    onSuccess: () => {
      router.push("/app");
    },
  });

  return (
    <>
      <Stack>
        <Group justify="space-between">
          <Stack gap={0}>
            <Title>{props.coupon.title}</Title>
            {props.coupon.description && (
              <Text size="sm" c="dimmed">
                {props.coupon.description}
              </Text>
            )}
          </Stack>

          <Text size="sm" c="dimmed">
            Updated {timeAgo(props.coupon.updatedAt)}{" "}
          </Text>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }}>
          <TextInput
            label="Claimed"
            readOnly
            variant="unstyled"
            value={props.coupon.claimedAt ? "Yes" : "No"}
          />

          <TextInput
            label="Claimed At"
            readOnly
            variant="unstyled"
            value={formatDate(props.coupon.claimedAt) || "-"}
          />

          <TextInput
            label="Claimed By"
            readOnly
            variant="unstyled"
            value={props.coupon.userDetail?.name || props.coupon.user || "-"}
          />

          <TextInput
            label="IP Address"
            readOnly
            variant="unstyled"
            value={props.coupon.userIp || "-"}
          />
        </SimpleGrid>

        <Divider />

        <Form mutation={mutation} submit={mutation.mutate} form={form}>
          {({ dirty, loading }) => (
            <>
              <HorizontalInput
                label="Active"
                description="Only active coupons will be distributed and you can also deactivate them even if they are claimed."
              >
                <Switch
                  {...inputProps("isActive", {
                    type: "checkbox",
                  })}
                  key={form.key("isActive")}
                />
              </HorizontalInput>

              <HorizontalInput
                label="Title"
                description="This title will be visible to person who gets the coupon."
              >
                <TextInput
                  placeholder="Super Offer"
                  {...inputProps("title")}
                  key={form.key("title")}
                />
              </HorizontalInput>

              <HorizontalInput
                label="Description"
                description="This description will be visible to person who gets the coupon."
              >
                <Textarea
                  placeholder="Get 60% off on your first purchase! Use code during checkout."
                  autosize
                  minRows={3}
                  maxRows={5}
                  {...inputProps("description")}
                  key={form.key("description")}
                />
              </HorizontalInput>

              <HorizontalInput
                label="Code"
                description="This code will be visible to person who gets the coupon."
              >
                <TextInput
                  minLength={6}
                  maxLength={10}
                  placeholder="SUPEROFFER"
                  {...inputProps("code")}
                  key={form.key("code")}
                />
              </HorizontalInput>

              <HorizontalInput
                label="Expiration Date"
                description="This date will be visible to person who gets the coupon."
              >
                <StringDateInput
                  minDate={dayjs(new Date()).add(1, "day").toDate()}
                  maxDate={dayjs(new Date()).add(1, "month").toDate()}
                  clearable
                  placeholder="Pick a date"
                  {...inputProps("expiresAt")}
                  key={form.key("expiresAt")}
                />
              </HorizontalInput>

              <Group justify="space-between">
                <Button
                  disabled={loading}
                  color="red"
                  variant="outline"
                  onClick={async () => {
                    const confirmed = await askConfirmation({
                      message: `Are you sure you want to delete "${props.coupon.title}" coupon?`,
                      labels: {
                        confirm: "Yes, delete",
                        cancel: "No, keep",
                      },
                    });

                    if (confirmed) {
                      deleteM.mutate({
                        params: {
                          couponId: props.coupon.id,
                        },
                      });
                    }
                  }}
                >
                  Delete
                </Button>

                <Button type="submit" loading={loading} disabled={!dirty}>
                  Update
                </Button>
              </Group>
            </>
          )}
        </Form>
      </Stack>
    </>
  );
};
