import {ToggleSwitch} from "flowbite-react";

type ToggleSwitchProps = {
    className?: string;
    label?: string;
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    required?: boolean;
};

export default function ToggleSwitchField({
                                              label,
                                              name,
                                              checked,
                                              onChange,
                                              className = '',
                                          }: ToggleSwitchProps) {
    return (
        <div className="flex flex-col w-full">
            <ToggleSwitch
                label={label}
                checked={checked}
                onChange={onChange}
                className={className}
                name={name}
                theme={{
                    toggle: {
                        base: "group-focus:ring-0",
                        checked: {
                            color: {
                                default: "bg-teal-500 dark:bg-teal-600",
                            }
                        }
                    }
                }}
            />
        </div>
    )
}
