import {ChangeEvent} from 'react';
import {Label, Textarea} from "flowbite-react";

type TextAreaProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
};

export default function TextAreaField({
                                          label,
                                          name,
                                          value,
                                          onChange,
                                          required = false,
                                      }: TextAreaProps) {
    return (
        <div className='flex flex-col w-full'>
            <Label htmlFor={name}>{label}</Label>
            <Textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                theme={{
                    base: "border border-gray-500 focus:outline-none focus:ring-1",
                    colors: {
                        gray: "focus:border-gray-400 focus:ring-gray-400 dark:focus:border-gray-600 dark:focus:ring-gray-600",
                    },
                }}
            />
        </div>
    )
}
