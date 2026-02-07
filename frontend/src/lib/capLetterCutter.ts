export const capLetterCutter = (text: string): string => {
    return text
        .split(' ')
        .filter(word => word)
        .map(word => word[0].toUpperCase())
        .join('')
}