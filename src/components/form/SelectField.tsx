import {ChangeEvent} from 'react';
import {Label, Select} from "flowbite-react";

type Option = { value: string | number; label: string };

type SelectFieldProps = {
    label: string;
    name: string;
    value: string | number;
    options: Option[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
};

export default function SelectField({
                                        label,
                                        name,
                                        value,
                                        options,
                                        onChange,
                                        required = false,
                                    }: SelectFieldProps) {
    return (
        <div className='flex flex-col w-full'>
            <Label htmlFor={name}>{label}</Label>
            <Select
                // className='border-2 border-slate-700 rounded p-2 focus:border-gray-500 focus:ring-1 focus:ring-gray-500'
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                theme={{
                    field: {
                        select: {
                            base: "border border-gray-500 focus:outline-none focus:ring-1",
                            colors: {
                                gray: "focus:border-gray-400 focus:ring-gray-400 dark:focus:border-gray-600 dark:focus:ring-gray-600",
                            },
                        },
                    }
                }}
            >
                <option value='' disabled>
                    Selecione...
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </Select>
        </div>
    );
}
