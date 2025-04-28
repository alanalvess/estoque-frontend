import {ChangeEvent} from 'react';
import {Label, TextInput} from "flowbite-react";

type InputProps = {
    className?: string;
    label?: string;
    name: string;
    type?: string;
    value?: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
};

export default function InputField({
                                       label,
                                       name,
                                       type = 'text',
                                       value,
                                       onChange,
                                       required = false,
                                       placeholder = '',
                                       className = '',
                                   }: InputProps) {
    return (
        <div className='flex flex-col  w-full'>
            <Label htmlFor={name}>{label}</Label>
            <TextInput
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                required={required}
            />
        </div>
    );
}
