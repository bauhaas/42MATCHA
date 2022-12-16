import React from 'react';
import { useEffect, useState } from 'react';

const PreferencesForm = () => {
    return (
        <>
            <div className="form-control">
                <label className="label cursor-pointer">
                    <span className="label-text">Red pill</span>
                    <input type="radio" name="radio-10" className="radio checked:bg-red-500" checked />
                </label>
            </div>
            <div className="form-control">
                <label className="label cursor-pointer">
                    <span className="label-text">Blue pill</span>
                    <input type="radio" name="radio-10" className="radio checked:bg-blue-500" checked />
                </label>
            </div>
            <div className="form-control">
                <label className="label cursor-pointer">
                    <span className="label-text">Purple pill</span>
                    <input type="radio" name="radio-10" className="radio checked:bg-purple-500" checked />
                </label>
            </div>
        </>
    );
}

export default PreferencesForm;