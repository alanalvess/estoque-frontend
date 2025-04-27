import {ChangeEvent} from 'react';
import {Label, TextInput} from "flowbite-react";

type InputProps = {
    label: string;
    name: string;
    type?: string;
    value: string | number;
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
                                   }: InputProps) {
    return (
        <div className='flex flex-col gap-2 w-full'>
            <Label htmlFor={name}>{label}</Label>
            <TextInput
                // className='border-2 border-slate-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500'
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}
