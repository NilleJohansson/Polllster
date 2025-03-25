import React from "react";
import { Controller } from "react-hook-form";
import { FormControlLabel, Switch, FormHelperText } from "@mui/material";
import { FormInputProps } from "./FormInputProps";

export const FormSwitch = ({
  name,
  control,
  labelProps,
  switchProps = {},
  rulesProps,
  onChangeHandler,
}: FormInputProps & {
  labelProps?: string;
  switchProps?: object;
  onChangeHandler?: (checked: boolean) => void;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rulesProps}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
        <>
          <FormControlLabel
            control={
              <Switch
                {...field}
                checked={!!value}
                onChange={(e) => {
                    const checked = e.target.checked;
                  onChange(checked);
                  if (onChangeHandler) {
                    onChangeHandler(checked); 
                  }
                }}
                {...switchProps}
              />
            }
            label={labelProps}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </>
      )}
    />
  );
};
