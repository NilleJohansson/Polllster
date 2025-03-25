import { ChangeEvent, ReactElement } from "react";
import { FieldValues, RegisterOptions } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormInputProps {
    name: string;
    control: any;
    label?: string;
    setValue?: any;
    endAdornmentProps?: ReactElement,
    multilineProps?: boolean 
    rowsProps?: number,
    placeHolderProps?: string;
    valueProps?: string;
    onChangeProps?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    typeProps?: string;
    rulesProps?: Omit<RegisterOptions<FieldValues, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined;
    inputValue?: any;
    onKeyEvent?: React.KeyboardEventHandler<HTMLDivElement | undefined | void>;
    selectRef?: any;
  }