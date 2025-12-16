import { ITheme, lightTheme, darkTheme } from "../models/theme.model";

export interface IThemeService {
    getThemes(): Promise<readonly ITheme[]>;
    getCurrentTheme(): Promise<ITheme>;
    setTheme(themeId: string): Promise<void>;
    createCustomTheme(name: string, colors: any): Promise<ITheme>;
}

export class MockThemeService implements IThemeService {
    
    private currentThemeId: string | null = null;

    async getThemes(): Promise<readonly ITheme[]> {
        const baseThemes = [lightTheme, darkTheme];
        const customThemes = this.getCustomThemes();
        return [...baseThemes, ...customThemes];
    }

    async getCurrentTheme(): Promise<ITheme> {
        if (this.currentThemeId === 'dark') return darkTheme;
        if (this.currentThemeId === 'light') return lightTheme;
        
        const savedThemeId = localStorage.getItem('theme');
        this.currentThemeId = savedThemeId;

        if (savedThemeId === 'dark') {
            return darkTheme;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentThemeId = 'dark';
            return darkTheme;
        }

        this.currentThemeId = 'light';
        return lightTheme;
    }

    async setTheme(themeId: string): Promise<void> {
        this.currentThemeId = themeId;
        localStorage.setItem('theme', themeId);
        this.applyTheme(themeId);
    }

    private applyTheme(themeId: string): void {
        const root = document.documentElement;

        if (themeId === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
        }
    }

    async createCustomTheme(name: string, colors: any): Promise<ITheme> {
        const customTheme: ITheme = {
            id: `custom_${Date.now()}`,
            name: name,
            isDark: colors.isDark || false
        };

        const customThemes = this.getCustomThemes();
        customThemes.push(customTheme);
        localStorage.setItem('customThemes', JSON.stringify(customThemes));

        localStorage.setItem(`theme_colors_${customTheme.id}`, JSON.stringify(colors));

        return customTheme;
    }

    private getCustomThemes(): ITheme[] {
        const saved = localStorage.getItem('customThemes');
        return saved ? JSON.parse(saved) : [];
    }
}