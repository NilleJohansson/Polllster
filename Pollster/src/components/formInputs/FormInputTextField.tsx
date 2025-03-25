import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormInputProps } from "./FormInputProps";
import { ChangeEvent } from "react";
import React from "react";

export const FormInputText = ({ name, control, endAdornmentProps, placeHolderProps, multilineProps, rowsProps, onChangeProps,
typeProps, rulesProps, onKeyEvent, selectRef, textFieldProps = {} }: FormInputProps & {
  textFieldProps?: object;
}) => {
  function handleFocus(event): void {
    const { target } = event;
    target.selectionStart = target.selectionEnd = target.value.length;
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rulesProps}

      render={({
        field: { ref, ...field},
        fieldState: { error },
      }) => (
        <TextField
          {...field}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={(e) => {
            field.onChange(e);
            if (onChangeProps) {
              onChangeProps(e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
            }
          }}
          {...textFieldProps}
          value={field.value}
          onFocus={handleFocus}
          InputLabelProps={{ shrink: true }}
          placeholder={placeHolderProps}
          multiline={multilineProps}
          rows={rowsProps}
          type={typeProps}
          onKeyDown={onKeyEvent}
          inputRef={ref || selectRef}
          InputProps={{
          endAdornment: (
            endAdornmentProps
          ),
        }}          
        />
      )}
    />
  );
};
