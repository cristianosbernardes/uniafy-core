
/**
 * Converts a Hex color string (e.g. #BF4D20) to HSL values object.
 * Returns { h, s, l } numbers.
 */
/**
 * Converts a Hex color string (e.g. #BF4D20 or #BF4D20FF) to HSL values object.
 * Returns { h, s, l, a } numbers. alpha is 0-1.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number; a: number } {
    let r = 0, g = 0, b = 0, a = 1;

    if (hex.length === 5 || hex.length === 9) {
        // Has alpha
        if (hex.length === 5) {
            // #RGBA
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
            a = parseInt(hex[4] + hex[4], 16) / 255;
        } else {
            // #RRGGBBAA
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
            a = parseInt(hex.slice(7, 9), 16) / 255;
        }
    } else {
        // Standard Hex
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return { h: 0, s: 0, l: 0, a: 1 };
        r = parseInt(result[1], 16);
        g = parseInt(result[2], 16);
        b = parseInt(result[3], 16);
    }

    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), a };
}

/**
 * Converts HSL values to a Hex string.
 */
export function hslToHex(h: number, s: number, l: number, a: number = 1): string {
    l /= 100;
    const aVal = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - aVal * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    const hex = `#${f(0)}${f(8)}${f(4)}`;
    if (a < 1) {
        const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
        return `${hex}${alphaHex}`;
    }
    return hex;
}

/**
 * Converts our internal HSL string format "H S% L% / A" (e.g., "24 100% 52% / 0.5")
 * to a Hex string for the color picker.
 */
export function tailwindHslToHex(hslString: string): string {
    if (!hslString) return "#000000";

    // Remove functions if present (hsl(...))
    const clean = hslString.replace(/hsl\(|\)/g, '').trim();

    // Check for Slash separator for alpha
    let alpha = 1;
    let colorPart = clean;

    if (clean.includes('/')) {
        const [c, a] = clean.split('/');
        colorPart = c.trim();
        alpha = parseFloat(a.trim());
    }

    const parts = colorPart.split(' ').map(p => parseFloat(p));

    if (parts.length < 3) return "#000000";

    return hslToHex(parts[0], parts[1], parts[2], alpha);
}

/**
 * Converts a Hex string to our internal HSL string format "H S% L% / A".
 */
export function hexToTailwindHsl(hex: string): string {
    const { h, s, l, a } = hexToHsl(hex);
    if (a < 1) {
        // Round alpha to 2 decimals
        const roundedAlpha = Math.round(a * 100) / 100;
        return `${h} ${s}% ${l}% / ${roundedAlpha}`;
    }
    return `${h} ${s}% ${l}%`;
}
