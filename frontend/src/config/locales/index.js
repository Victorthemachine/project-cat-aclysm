import React from 'react';
import { en_messages } from './en';
import { cz_messages } from './cz';

// Add loop method to import everything just based on locales?
// Though frontend got no file system... and the building would be hard...
export const locales = {
    "en": en_messages,
    "cz": cz_messages,
};

export const LocaleContext = React.createContext({
    // Senpai >///<...
    lang: 'en',
    toggleLocale: () => { }
});