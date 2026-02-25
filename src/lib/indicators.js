export function calcMA(candles, period) {
    const result = [];
    for (let i = 0; i < candles.length; i++) {
        if (i < period - 1) {
            continue;
        }
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += candles[i - j].close;
        }
        result.push({
            time: candles[i].time,
            value: sum / period,
        });
    }
    return result;
}

export function calcRSI(candles, period = 14) {
    const result = [];
    if (candles.length < period) return result;

    let avgGain = 0;
    let avgLoss = 0;
    for (let i = 1; i <= period; i++) {
        const change = candles[i].close - candles[i - 1].close;
        if (change > 0) avgGain += change;
        else avgLoss -= change;
    }
    avgGain /= period;
    avgLoss /= period;

    let rs = avgGain / avgLoss;
    let rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

    result.push({ time: candles[period].time, value: rsi });


    for (let i = period + 1; i < candles.length; i++) {
        const change = candles[i].close - candles[i - 1].close;
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        rs = avgGain / avgLoss;
        rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
        result.push({ time: candles[i].time, value: rsi });
    }

    return result;
}
