export interface ITheme {
    id: string;
    name:string;
    isDark: boolean;
}

export const lightTheme: ITheme = {
    id: 'light',
    name: 'light theme',
    isDark: false
};

export const darkTheme: ITheme = {
    id: 'dark',
    name: 'dark theme',
    isDark: true
};