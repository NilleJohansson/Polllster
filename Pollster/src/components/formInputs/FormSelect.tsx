import React from "react";
import { Controller } from "react-hook-form";
import { Select, FormControl, FormHelperText, SelectChangeEvent } from "@mui/material";
import { FormInputProps } from "./FormInputProps";

export const FormSelect = ({
  name,
  control,
  rulesProps,
  valueProps,
  onChangeProps,
  selectRef,
  children,
  onChangeHandler,
  formControlProps = {},
  selectProps = {},
}: FormInputProps & { 
    children: React.ReactNode,
    formControlProps?: object;
    selectProps?: object;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChangeHandler?: (event: SelectChangeEvent<any>) => void;
 }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rulesProps}
      render={({
        field: { ref, onChange, value, ...field },
        fieldState: { error },
      }) => (
        <FormControl fullWidth error={!!error} {...formControlProps}>
          <Select
            {...field}
            value={value || ""}
            onChange={(e) => {
              onChange(e);
              if (onChangeProps) {
                onChangeProps(e);
              }
              if (onChangeHandler) {
                onChangeHandler(e)
              }
            }}
            inputRef={ref || selectRef}
            displayEmpty
            {...selectProps}
          >
            {children}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
