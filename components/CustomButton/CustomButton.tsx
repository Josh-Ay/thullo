import React from 'react'
import styles from './styles.module.css'
import { IconType } from "react-icons";
import Link from 'next/link';

const CustomButton = ({
    title = "",
    icon: Icon,
    className = "",
    handleClick = () => { },
    fontSize,
    padding,
    borderRadius,
    iconSize,
    backgroundColor,
    color,
    border,
    width,
    useLink,
    linkLocation = '',
    fontWeight,
    gap,
    disabled = false,
    isTrailingIcon = false,
    justifyContent,
    margin,
    cursor = 'pointer'
}: {
    title?: string;
    icon?: IconType;
    className?: string;
    handleClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    iconSize?: string;
    backgroundColor?: string;
    color?: string;
    border?: string;
    width?: string;
    useLink?: boolean;
    linkLocation?: string;
    fontWeight?: string;
    gap?: string;
    disabled?: boolean;
    isTrailingIcon?: boolean;
    justifyContent?: string;
    margin?: string;
    cursor?: string;
}) => {
    if (useLink) return (
        <Link
            className={`${styles.btn} ${className}`}
            href={linkLocation}
            style={{
                fontSize,
                padding,
                borderRadius,
                backgroundColor,
                color,
                border,
                width,
                fontWeight,
                gap,
                justifyContent,
                margin,
                cursor: disabled === true ? 'not-allowed' : cursor,
            }}
        >
            {
                !isTrailingIcon && Icon &&
                <Icon
                    size={iconSize}
                />
            }

            {
                title?.length > 0 &&
                <span>{title}</span>
            }

            {
                isTrailingIcon && Icon &&
                <Icon
                    size={iconSize}
                />
            }
        </Link>
    );

    return (
        <button
            className={`${styles.btn} ${className}`}
            onClick={handleClick}
            style={{
                fontSize,
                padding,
                borderRadius,
                backgroundColor,
                color,
                border,
                width,
                fontWeight,
                gap,
                justifyContent,
                margin,
                cursor: disabled === true ? 'not-allowed' : cursor,
            }}
            disabled={disabled}
        >
            {
                !isTrailingIcon && Icon &&
                <Icon
                    size={iconSize}
                />
            }

            {
                title?.length > 0 &&
                <span>{title}</span>
            }

            {
                isTrailingIcon && Icon &&
                <Icon
                    size={iconSize}
                />
            }
        </button>
    )
}

export default CustomButton