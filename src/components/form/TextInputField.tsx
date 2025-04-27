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
        <div className='flex flex-col gap-2 w-full'>
            <Label htmlFor={name}>{label}</Label>
            <Textarea
                // className='border-2 border-slate-700 rounded p-2 focus:border-gray-500 focus:ring-1 focus:ring-gray-500'
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
}
