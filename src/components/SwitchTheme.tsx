// "use client";
//
// import { useState } from 'react';
// import 'bulma/css/bulma.min.css';
// import 'bulma-switch/dist/css/bulma-switch.min.css';
//
// const SwitchExample = () => {
//     const [isChecked, setIsChecked] = useState(true);
//
//     const handleToggle = () => {
//         setIsChecked(!isChecked);
//
//         document.documentElement.classList.toggle('theme-light');
//         document.documentElement.classList.toggle('theme-dark');
//
//     };
//
//     return (
//         <div className="is-flex field">
//             <input
//                 id="switchRoundedDefault"
//                 type="checkbox"
//                 name="switchRoundedDefault"
//                 className="switch is-rounded is-large is-middle"
//                 checked={isChecked}
//                 onChange={handleToggle}
//             />
//             <label htmlFor="switchRoundedDefault"></label>
//         </div>
//     );
// };
//
// export default SwitchExample;

// components/SwitchExample.tsx
"use client";

import { useTheme } from '@/contexts/ThemeContext';
import 'bulma/css/bulma.min.css';
import 'bulma-switch/dist/css/bulma-switch.min.css';

const SwitchExample = () => {
    const { isLight, setIsLight } = useTheme();

    const handleToggle = () => {
        const newState = !isLight;
        setIsLight(newState);

        // Toggle theme classes
        document.documentElement.classList.toggle('theme-light');
        document.documentElement.classList.toggle('theme-dark');

        // Save to cookie
        document.cookie = `theme=${newState ? 'light' : 'dark'}; path=/; max-age=31536000; SameSite=Strict`;
    };

    return (
        <div className="is-flex field">
            <input
                id="switchRoundedDefault"
                type="checkbox"
                name="switchRoundedDefault"
                className="switch is-rounded is-large is-middle"
                checked={isLight}
                onChange={handleToggle}
            />
            <label htmlFor="switchRoundedDefault"></label>
        </div>
    );
};

export default SwitchExample;