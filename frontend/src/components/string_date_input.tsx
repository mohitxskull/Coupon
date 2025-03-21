import { DatePickerInput, DatePickerInputProps } from "@mantine/dates";
import { useUncontrolled } from "@mantine/hooks";
import dayjs from "dayjs";

type Props = Omit<
  DatePickerInputProps,
  "value" | "defaultValue" | "onChange"
> & {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
};

export const StringDateInput = (props: Props) => {
  const { value, defaultValue, onChange, ...rest } = props;

  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: dayjs().format("YYYY-MM-DD"),
    onChange,
  });

  return (
    <>
      <DatePickerInput
        {...rest}
        value={!!_value ? dayjs(_value).toDate() : null}
        onChange={(d) => {
          if (d instanceof Date) {
            handleChange(dayjs(d).format("YYYY-MM-DD"));
          } else {
            handleChange(null);
          }
        }}
      />
    </>
  );
};
