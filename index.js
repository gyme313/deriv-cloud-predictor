// ✅ FALLBACK ENGINE: Uses an embedded data stream to run completely network-free
const mockData = {
    "candles": [
        {"high":9250.20, "low":9241.10, "close":9245.50}, {"high":9248.80, "low":9242.00, "close":9243.10},
        {"high":9246.50, "low":9238.20, "close":9240.20}, {"high":9242.10, "low":9235.00, "close":9236.40},
        {"high":9240.00, "low":9231.10, "close":9232.00}, {"high":9235.50, "low":9228.40, "close":9230.10},
        {"high":9234.20, "low":9229.00, "close":9231.50}, {"high":9238.00, "low":9230.20, "close":9237.40},
        {"high":9244.50, "low":9236.10, "close":9242.10}, {"high":9248.00, "low":9241.00, "close":9246.30},
        {"high":9252.10, "low":9244.50, "close":9250.00}, {"high":9255.40, "low":9248.00, "close":9254.20},
        {"high":9258.00, "low":9251.10, "close":9256.10}, {"high":9262.30, "low":9254.00, "close":9260.40},
        {"high":9265.00, "low":9258.10, "close":9263.20}, {"high":9268.40, "low":9260.00, "close":9267.10},
        {"high":9272.50, "low":9264.10, "close":9270.30}, {"high":9275.00, "low":9268.00, "close":9274.10},
        {"high":9278.40, "low":9271.20, "close":9277.50}, {"high":9282.10, "low":9275.00, "close":9280.40},
        {"high":9285.00, "low":9278.40, "close":9283.10}, {"high":9288.40, "low":9281.00, "close":9286.50},
        {"high":9292.00, "low":9284.20, "close":9290.20}, {"high":9295.40, "low":9287.00, "close":9294.10},
        {"high":9298.00, "low":9291.10, "close":9296.30}, {"high":9302.50, "low":9294.00, "close":9300.40},
        {"high":9305.00, "low":9298.10, "close":9303.20}, {"high":9308.40, "low":9300.00, "close":9307.10},
        {"high":9312.50, "low":9304.10, "close":9310.30}, {"high":9315.00, "low":9308.00, "close":9314.10},
        {"high":9318.40, "low":9311.20, "close":9317.50}, {"high":9322.10, "low":9315.00, "close":9320.40},
        {"high":9325.00, "low":9318.40, "close":9323.10}, {"high":9328.40, "low":9321.00, "close":9326.50},
        {"high":9332.00, "low":9324.20, "close":9330.20}, {"high":9335.40, "low":9327.00, "close":9334.10}
    ]
};

console.log("🚀 BOOTING NATIVE COMPACT SIGNAL MATHEMATICS LAYERS...");
processData(mockData.candles);

function processData(candles) {
    const formatted = candles.map(c => ({ high: parseFloat(c.high), low: parseFloat(c.low), close: parseFloat(c.close) }));
    const closes = formatted.map(c => c.close);
    
    const ema9 = calculateEMA(closes, 9);
    const ema21 = calculateEMA(closes, 21);
    const adx = calculateADX(formatted, 14);

    const currentPrice = closes[closes.length - 1];
    const currentEma9 = ema9[ema9.length - 1];
    const currentEma21 = ema21[ema21.length - 1];
    const currentAdx = adx[adx.length - 1] || 0;

    const prevEma9 = ema9[ema9.length - 2];
    const prevEma21 = ema21[ema21.length - 2];

    const trendIsStrong = currentAdx > 22;
    const buyCross = (prevEma9 <= prevEma21) && (currentEma9 > currentEma21);
    const sellCross = (prevEma9 >= prevEma21) && (currentEma9 < currentEma21);

    let signal = "🎰 HOLD (Market trend structure is consolidating)";
    if (trendIsStrong && buyCross) signal = "🚀 BUY SIGNAL TRIGGERED";
    if (trendIsStrong && sellCross) signal = "📉 SELL SIGNAL TRIGGERED";

    console.log(`\n==========================================`);
    console.log(`  Volatility 10 (1s) Cloud Signal Report  `);
    console.log(`==========================================`);
    console.log(` Target Asset : Volatility 10 (1s) Index`);
    console.log(` Snapshot Price: ${currentPrice.toFixed(2)}`);
    console.log(` ADX Strength : ${currentAdx.toFixed(2)} (${trendIsStrong ? 'STRONG TREND' : 'WEAK CHOP'})`);
    console.log(` Fast EMA (9) : ${currentEma9.toFixed(2)}`);
    console.log(` Slow EMA (21): ${currentEma21.toFixed(2)}`);
    console.log(`------------------------------------------`);
    console.log(` FINAL SIGNAL : ${signal}`);
    console.log(`==========================================\n`);
}

function calculateEMA(data, period) {
    let ema = []; if (data.length < period) return ema;
    let sum = 0; for (let i = 0; i < period; i++) sum += data[i];
    ema[period - 1] = sum / period;
    const k = 2 / (period + 1);
    for (let i = period; i < data.length; i++) {
        ema[i] = (data[i] * k) + (ema[i - 1] * (1 - k));
    }
    return ema;
}

function calculateADX(candles, period = 14) {
    if (candles.length < period * 2) return Array(candles.length).fill(0);
    let plusDI = [], minusDI = [], tr = [];
    for (let i = 1; i < candles.length; i++) {
        const h = candles[i].high, l = candles[i].low, pc = candles[i - 1].close;
        tr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
        const upMove = h - candles[i - 1].high, downMove = candles[i - 1].low - l;
        plusDI.push(upMove > downMove && upMove > 0 ? upMove : 0);
        minusDI.push(downMove > upMove && downMove > 0 ? downMove : 0);
    }
    let smoothTR = 0, smoothPlusDM = 0, smoothMinusDM = 0;
    for (let i = 0; i < period; i++) { smoothTR += tr[i]; smoothPlusDM += plusDI[i]; smoothMinusDM += minusDI[i]; }
    let dxValues = [];
    for (let i = period; i < candles.length; i++) {
        smoothTR = smoothTR - (smoothTR / period) + tr[i - 1];
        smoothPlusDM = smoothPlusDM - (smoothPlusDM / period) + plusDI[i - 1];
        smoothMinusDM = smoothMinusDM - (smoothMinusDM / period) + minusDI[i - 1];
        const diPlus = (smoothPlusDM / smoothTR) * 100, diMinus = (smoothMinusDM / smoothTR) * 100;
        dxValues.push((Math.abs(diPlus - diMinus) / (diPlus + diMinus) * 100) || 0);
    }
    let adxSum = 0; for (let i = 0; i < period; i++) adxSum += dxValues[i];
    let currentAdx = adxSum / period, adxResult = Array(period * 2).fill(0); adxResult.push(currentAdx);
    for (let i = period + 1; i < dxValues.length; i++) {
        currentAdx = ((currentAdx * (period - 1)) + dxValues[i]) / period; adxResult.push(currentAdx);
    }
    return adxResult;
}
