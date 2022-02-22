import React from 'react';
import { en_messages } from './en';
import { cs_messages } from './cs';
import { defineMessages } from 'react-intl'

// Add loop method to import everything just based on locales?
// Though frontend got no file system... and the building would be hard...
export const locales = {
    "en": defineMessages(en_messages),
    "cs": defineMessages(cs_messages),
};

export const LocaleContext = React.createContext({
    // Senpai >///<...
    lang: 'en',
    availibleLangs: Object.keys(locales),
    toggleLocale: () => { }
});