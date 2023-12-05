const units = [
    {unit: 'year', divisor: 31536000000}, // 1 year in milliseconds
    {unit: 'month', divisor: 2592000000},  // 1 month in milliseconds
    {unit: 'day', divisor: 86400000},      // 1 day in milliseconds
    {unit: 'hour', divisor: 3600000},       // 1 hour in milliseconds
    {unit: 'minute', divisor: 60000},       // 1 minute in milliseconds
    {unit: 'second', divisor: 1000}         // 1 second in milliseconds
];
const humanizeDuration = (milliseconds: number): string => {
    if (milliseconds === 0 || !isFinite(milliseconds)) {
        return 'Never'
    }
    let count = 0;
    const recursive = (milliseconds: number): string => {
        for (const unit of units) {
            const value = Math.floor(milliseconds / unit.divisor);
            if (value > 0 && count < 2) {
                count++;
                const unitLabel = unit.unit + (value > 1 ? 's' : '');
                return `${value} ${unitLabel} ${recursive(milliseconds % unit.divisor)}`;
            }
        }
        return '';
    }
    const result = recursive(milliseconds);
    return result === '' ? '0 seconds' : result;
}

export default humanizeDuration;
