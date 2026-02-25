# ZENENCE Trading Dashboard

A modern, responsive cryptocurrency trading dashboard built with React and Vite, featuring real-time market data, interactive financial charts, and an order book—all powered by the Binance WebSocket and REST APIs.

## 🚀 Features

- **Real-Time Data**: Live order book, price updates, and ticker statistics streamed via Binance WebSockets.
- **Interactive Multi-Pane Charting**: Highly performant candlestick charts using `lightweight-charts` with support for:
  - Candlestick (OHLC) Price Data
  - Moving Averages (MA5, MA10, MA30, MA60)
  - RSI (Relative Strength Index)
  - Volume Bar Overlays
  - Dedicated legends for each pane (Price, RSI, Volume)
- **Order Book Viewer**: Live-updating Bids and Asks with visual depth bars and flashing animations on quantity changes. Displays the best Bid/Ask spread in the center.
- **Drawing Tool Sidebar**: A vertical toolbar (mimicking standard exchange UIs like MEXC) ready for drawing tool integrations.
- **Responsive Layout**: Seamless transition between desktop and mobile views. The mobile view includes a toggleable order book and bottom action bar.
- **Order Entry Simulation**: A dedicated UI panel for placing Buy/Sell orders (Market, Limit, etc.).

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Charting**: Lightweight Charts (`lightweight-charts`)
- **Icons**: Lucide React (`lucide-react`)
- **Styling**: Vanilla CSS Modules with custom variables for theme management.
- **Data Source**: Binance API (REST API for historical klines/candles, WebSocket for live order book and tickers).

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components (Chart, OrderBook, Navbars, etc.)
│   ├── Chart.jsx        # Main charting component (multi-pane, legends, indicators)
│   ├── OrderBook.jsx    # Real-time WebSocket order book
│   └── OrderEntry.jsx   # Trading interface for Buy/Sell orders
├── hooks/               # Custom React hooks for data fetching
│   ├── useKlines.js     # Fetches historical candlestick data (REST)
│   ├── useMarketTicker.js # Subscribes to 24hr ticker updates (WebSocket)
│   └── useOrderBook.js  # Subscribes to live depth/order book updates (WebSocket)
├── lib/                 # Utility functions and formatters
│   ├── indicators.js    # Technical indicator math (MA, RSI)
│   └── formatters.js    # Price & number formatting
├── styles/              # Global CSS, themes, and variables
└── App.jsx              # Main application layout and responsive orchestration
```

## 💻 Running the Project Locally

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone this repository and navigate into the project directory:

   ```bash
   cd trading-dashboard
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## 💡 Customization

- **Theme Colors**: Modify the CSS variables inside `src/styles/global.css` to tweak primary, secondary, text, and border colors (including custom green/red trading colors).
- **Default Pair**: Change the `SYMBOL` constant inside `App.jsx` from `"ETHUSDT"` to any active Binance trading pair (e.g., `"BTCUSDT"`, `"SOLUSDT"`) to view different market data.
- **Indicators**: Modify `src/lib/indicators.js` to add or alter how technical indicators like MACD or Bollinger Bands are calculated, then render them using the `LineSeries` or `HistogramSeries` in `Chart.jsx`.

## 📄 License

This project is intended for demonstration and educational purposes. Data provided by Binance public APIs.
