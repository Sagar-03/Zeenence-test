export function formatPrice(value, decimals = 2) {
    if (value === undefined || value === null || isNaN(value)) return '0.00';
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export function formatVolume(value) {
    if (value === undefined || value === null || isNaN(value)) return '0';
    const num = Number(value);
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    return Number(num.toFixed(2)).toString();
}

export function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return '0.00%';
    const num = Number(value);
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}
