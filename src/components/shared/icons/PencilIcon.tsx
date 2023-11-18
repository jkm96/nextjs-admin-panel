import React from "react";
import { IconSvgProps } from "@/boundary/types/IconSvgProps";

export const PencilIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M9.24264 18.9964H21V20.9964H3V16.7538L12.8995 6.85431L17.1421 11.0969L9.24264 18.9964ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z">
        </path>
    </svg>
);
