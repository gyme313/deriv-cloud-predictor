// This file reads the market data directly from the system storage layer, skipping cloud firewalls entirely!
const fs = require('fs');

try {
    const rawData = fs.readFileSync('market_data.json', 'utf8');
    const response = JSON.parse(rawData);

    if (response && response.candles) {
        const candles = response.candles;
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

        let signal = "🎰 HOLD (Market is consolidating)";
        if (trendIsStrong && buyCross) signal = "🚀 BUY SIGNAL TRIGGERED";
        if (trendIsStrong && sellCross) signal = "📉 SELL SIGNAL TRIGGERED";

        console.log(`\n==========================================`);
        console.log(`  Volatility 10 (1s) Cloud Signal Report  `);
        console.log(`==========================================`);
        console.log(` Target Asset : Volatility 10 (1s) Index`);
        console.log(` Live Price   : ${currentPrice.toFixed(2)}`);
        console.log(` ADX Strength : ${currentAdx.toFixed(2)} (${trendIsStrong ? 'STRONG TREND' : 'WEAK CHOP'})`);
        console.log(` Fast EMA (9) : ${currentEma9.toFixed(2)}`);
        console.log(` Slow EMA (21): ${currentEma21.toFixed(2)}`);
        console.log(`------------------------------------------`);
        console.log(` FINAL SIGNAL : ${signal}`);
        console.log(`==========================================\n`);
    } else {
        console.log("⚠️ Loaded temporary data store, but the candle list structural frame was empty.");
    }
} catch (err) {
    console.log("❌ Core Processing Error: Temporary system storage data payload is missing.");
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
