'use client';

import {Datepicker, Label} from 'flowbite-react';

interface DatePickerFieldProps {
    className?: string;
    label?: string;
    name: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    title?: string;
}

export default function DatePickerField({
                                            label,
                                            name,
                                            value,
                                            onChange,
                                            required = false,
                                            disabled = false,
                                            placeholder = '',
                                            className = '',
                                            title = '',
                                            minDate,
                                            maxDate
                                        }: DatePickerFieldProps) {

    function parseLocalDateString(dateString: string | undefined): Date | null {
        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;

        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // mês começa em 0
    }

    const dateValue = parseLocalDateString(value);

    function handleChange(date: Date | null) {
        if (!date) return;

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro = 0
        const day = date.getDate().toString().padStart(2, '0');

        const formatted = `${year}-${month}-${day}`; // formato yyyy-MM-dd

        const syntheticEvent = {
            target: {
                name,
                value: formatted,
            }
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
    }

    return (
        <div className="flex flex-col w-full">
            {label && <Label htmlFor={name}>{label}</Label>}
            <Datepicker
                id={name}
                value={dateValue}
                onChange={handleChange}
                required={required}
                className={className}
                placeholder={placeholder}
                language="pt-BR"
                minDate={minDate}
                maxDate={maxDate}
                labelTodayButton="Hoje"
                labelClearButton="Limpar"
                title={title}
                disabled={disabled}
                theme={{
                    popup: {
                        footer: {
                            button: {
                                base: "focus:ring-0 focus:ring-teal-300",
                                today: "bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700",
                            }
                        }
                    },
                    views: {
                        days: {
                            items: {
                                item: {
                                    selected: "bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-500",
                                }
                            }
                        },
                        decades: {
                            items: {
                                item: {
                                    selected: "bg-teal-700 hover:bg-teal-600",
                                    disabled: "text-gray-500"
                                }
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

