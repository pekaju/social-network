import React from "react";

export default function UserDataField({label, data}) {
    return (
        <div className="user-data-field">
            <div className="user-data-field__label">
                {label}
            </div>
            <div className="user-data-field__data">
                {data}
            </div>
        </div>
    )
}