export const allColors: string[] = [
    '#e51235',
    '#d81b60',
    '#8e24aa',
    '#6e45c1',
    '#4959cc',
    '#1e88e5',
    '#039be5',
    '#00acc1',
    '#00897b',
    '#43a047',
    '#7cb342',
    '#c0ca33',
    '#ffc215',
    '#ffab00',
    '#ff6d00',
    '#f4511e'
];

export function getRandomColor(color?: string | null, exclude: (string | undefined)[] = []): string {
    if (!color || !allColors.includes(color)) {
        let availableColors = allColors.filter(c => !exclude.includes(c));
        if (availableColors.length === 0) availableColors = allColors;
        return availableColors[Math.floor(Math.random() * availableColors.length)];
    } else {
        return color;
    }
}
