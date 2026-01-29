import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Library } from '../utils/translations';

interface LanguageContextType {
    language: Library;
    setLanguage: (lang: Library) => void;
    t: (key: keyof typeof translations['pt']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Library>('pt');

    const t = (key: keyof typeof translations['pt']): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
