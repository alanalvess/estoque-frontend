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
    color?: string;
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
                                       color = 'gray',
                                   }: InputProps) {
    return (
        <div className='flex flex-col w-full'>
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
                color={color}
                theme={{
                    field: {
                        input: {
                            base: "border border-gray-500 focus:outline-none focus:ring-1",
                            colors: {
                                gray: "focus:border-gray-400 focus:ring-gray-400 dark:focus:border-gray-600 dark:focus:ring-gray-600",
                            },
                        },
                    }
                }}
            />
        </div>
    );
}
