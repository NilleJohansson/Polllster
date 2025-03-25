import React from "react";
import { Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormInputProps } from "./FormInputProps";
import { FormHelperText, FormControl } from "@mui/material";

export const FormInputDateTimePicker = ({
  name,
  control,
  rulesProps,
  onChangeProps,
  dateTimePickerProps = {},
  formControlProps = {},
}: FormInputProps & {
  dateTimePickerProps?: object;
  formControlProps?: object;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rulesProps}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} {...formControlProps}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              {...dateTimePickerProps}
              value={value || null}
              onChange={(newValue) => {
                onChange(newValue);
                if (onChangeProps) {
                  onChangeProps(newValue);
                }
              }}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error ? error.message : null,
                },
              }}
            />
          </LocalizationProvider>
          {/* {error && <FormHelperText>{error.message}</FormHelperText>} */}
        </FormControl>
      )}
    />
  );
};
