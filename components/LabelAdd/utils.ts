export const availableLabelColors = [
    '#219653',
    '#F2C94C',
    '#F2994A',
    '#EB5757',
    '#2F80ED',
    '#56CCF2',
    '#6FCF97',
    '#333333',
    '#4F4F4F',
    '#828282',
    '#BDBDBD',
    '#E0E0E0',
]

export const initialLabelDetails = {
    name: '',
    color: '',
}

export const hexToRgbWithOpacity = (hex: string, opacity: number) => {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b}, ${opacity})`;
}
