# Market hours: every US stock (Calgary time)

Generated 2026-10-29 07:53 UTC. 518 stocks / ETFs, Alpaca 30-minute bars (2016-01-04 to 2026-10-28, median 10.8 years). Summary, method and caveats: [Market_Hours.md](Market_Hours.md). Calgary time; New York = Calgary + 2 h. Descriptive only, no profit claim.

## In plain words

- **Weekdays, stocks:** day activity Mon 0.98x / Tue 1.00x / Wed 1.01x / Thu 1.02x / Fri 0.99x - only 4% between the busiest and the quietest weekday. Best weekday reliable for 25.3% of instruments (mostly Thu 83, Wed 32, Mon 9).
- **All 518 stocks:** strongest half-hours 07:30 (2.06x), 13:30 (1.95x) Calgary. The 07:30 open: volume 1.62x, range 2.63x, big-move days 75.3%. The 13:30 last half-hour: volume 3.63x but range 1.05x.
- **Each stock's own best half-hour:** 07:30 for 307 stocks, 13:30 for 211 stocks; best times reliable for 96.3% of stocks.
- **NFP Fridays:** opening half-hour range 1.08x other Fridays (median stock); **FOMC days** 12:30 Calgary 1.94x.
- **Era:** median rho last 2 y vs all 0.99, before vs since 2020 0.99; 19.3% of stocks shifted.

![Stocks heatmap](market_hours_stocks.png)

## By sector (group profile)

| Sector | Stocks | Group peaks (Calgary) | Day activity Mon-Fri | NFP open ratio | FOMC 12:30 ratio | Shifted era |
|---|---|---|---|---|---|---|
| Communication Services | 14 | 07:30 (2.23x), 13:30 (1.86x) | Mon 0.98x / Tue 0.99x / Wed 1.00x / Thu 1.02x / Fri 0.99x | 1.08x | 1.98x | 7.1% |
| Consumer Discretionary | 34 | 07:30 (2.24x), 13:30 (1.83x) | Mon 0.99x / Tue 1.00x / Wed 1.00x / Thu 1.02x / Fri 0.99x | 1.08x | 1.92x | 23.5% |
| Consumer Staples | 21 | 07:30 (2.05x), 13:30 (2.00x) | Mon 0.97x / Tue 1.00x / Wed 1.01x / Thu 1.01x / Fri 0.98x | 1.06x | 1.70x | 19.0% |
| Energy | 20 | 07:30 (2.13x), 13:30 (1.68x) | Mon 0.98x / Tue 1.00x / Wed 1.03x / Thu 1.01x / Fri 0.98x | 1.14x | 1.79x | 5.0% |
| Financials | 63 | 13:30 (2.00x), 07:30 (1.99x) | Mon 0.96x / Tue 1.00x / Wed 1.01x / Thu 1.03x / Fri 0.99x | 1.07x | 2.08x | 14.3% |
| Health Care | 40 | 07:30 (2.09x), 13:30 (1.96x) | Mon 0.97x / Tue 1.00x / Wed 1.01x / Thu 1.02x / Fri 0.99x | 1.07x | 1.77x | 25.0% |
| Industrials | 56 | 13:30 (2.05x), 07:30 (1.94x) | Mon 0.97x / Tue 1.00x / Wed 1.01x / Thu 1.02x / Fri 0.99x | 1.07x | 2.00x | 28.6% |
| Information Technology | 48 | 07:30 (2.21x), 13:30 (1.84x) | Mon 0.97x / Tue 1.00x / Wed 1.01x / Thu 1.03x / Fri 1.00x | 1.08x | 2.00x | 18.8% |
| Materials | 34 | 07:30 (2.29x), 13:30 (1.71x) | Mon 0.96x / Tue 1.00x / Wed 1.02x / Thu 1.02x / Fri 1.00x | 1.08x | 2.53x | 11.8% |
| Other (top liquid) | 147 | 07:30 (2.02x), 13:30 (1.96x) | Mon 0.99x / Tue 0.99x / Wed 1.01x / Thu 1.02x / Fri 0.98x | 1.09x | 1.92x | 18.4% |
| Real Estate | 18 | 13:30 (2.18x), 07:30 (1.83x) | Mon 0.98x / Tue 0.99x / Wed 1.02x / Thu 1.02x / Fri 1.00x | 1.08x | 1.98x | 11.1% |
| Utilities | 23 | 13:30 (2.21x), 07:30 (1.91x) | Mon 0.97x / Tue 0.99x / Wed 1.02x / Thu 1.03x / Fri 1.00x | 1.08x | 1.87x | 39.1% |

## Every stock, by sector

Columns: the three best half-hour windows (Calgary, peak in bold, activity x typical); best and quietest weekday with the ratio and its 95% CI; reliability of times / days ("weak" = within noise); NFP = range of the 07:30 Calgary opening half-hour on NFP Fridays vs other Fridays; FOMC = 12:30 Calgary half-hour on FOMC days vs other Wednesdays; era = before vs since 2020.

### Communication Services (14)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **AMX** | America Movil | 10.8 | 13:30-14:00 **13:30** 2.10x | 07:30-08:30 **07:30** 1.82x | - | Wed / Mon 1.09x (1.03-1.15) | reliable / weak | 1.03x | 1.80x | stable |
| **APP** | AppLovin | 5.5 | 07:30-08:00 **07:30** 2.39x | 13:30-14:00 **13:30** 1.64x | - | Thu / Tue 1.08x (1.0-1.15) | reliable / reliable | 1.26x | 2.37x | stable |
| **BCE** | BCE Inc. | 10.8 | 07:30-08:00 **07:30** 2.12x | 13:30-14:00 **13:30** 1.86x | - | Wed / Mon 1.05x (1.02-1.09) | reliable / weak | 1.12x | 1.97x | stable |
| **BIDU** | Baidu | 10.8 | 07:30-08:00 **07:30** 3.15x | 13:30-14:00 **13:30** 1.58x | - | Wed / Thu 1.03x (0.98-1.07) | reliable / weak | 1.00x | 1.90x | stable |
| **BILI** | Bilibili | 8.6 | 07:30-08:00 **07:30** 3.36x | 13:30-14:00 **13:30** 1.43x | - | Thu / Fri 1.06x (1.0-1.15) | reliable / reliable | 1.01x | 2.18x | stable |
| **CHTR** | Charter Communications | 10.8 | 07:30-08:30 **07:30** 2.04x | 13:30-14:00 **13:30** 1.90x | - | Thu / Fri 1.04x (1.0-1.09) | reliable / weak | 1.10x | 1.71x | stable |
| **CMCSA** | Comcast | 10.8 | 07:30-08:00 **07:30** 2.25x | 13:30-14:30 **13:30** 1.86x | - | Fri / Mon 1.08x (1.03-1.13) | reliable / weak | 0.93x | 1.98x | stable |
| **DIS** | Walt Disney Company (The) | 10.8 | 07:30-08:00 **07:30** 2.36x | 13:30-14:30 **13:30** 1.57x | - | Thu / Tue 1.03x (0.99-1.08) | reliable / weak | 1.06x | 2.03x | stable |
| **ECHO** | EchoStar | 10.8 | 13:30-14:00 **13:30** 2.10x | 07:30-08:00 **07:30** 1.95x | - | Mon / Tue 1.02x (0.97-1.07) | reliable / weak | 1.16x | 1.75x | stable |
| **FOX** | Fox Corporation (Class B) | 10.8 | 07:30-08:00 **07:30** 2.20x | 13:30-14:00 **13:30** 2.00x | - | Wed / Mon 1.07x (1.04-1.12) | reliable / weak | 1.04x | 2.03x | stable |
| **FOXA** | Fox Corporation (Class A) | 10.8 | 07:30-08:00 **07:30** 2.09x | 13:30-14:00 **13:30** 2.01x | - | Thu / Mon 1.06x (1.02-1.11) | reliable / weak | 1.09x | 1.98x | shifted |
| **GOOG** | Alphabet Inc. (Class C) | 10.8 | 07:30-08:00 **07:30** 2.66x | 13:30-14:30 **13:30** 1.67x | - | Thu / Tue 1.03x (0.99-1.07) | reliable / weak | 1.11x | 2.17x | stable |
| **GOOGL** | Alphabet Inc. (Class A) | 10.8 | 07:30-08:00 **07:30** 2.68x | 13:30-14:30 **13:30** 1.68x | - | Fri / Tue 1.03x (0.99-1.09) | reliable / weak | 1.09x | 2.13x | stable |
| **LYV** | Live Nation Entertainment | 10.8 | 13:30-14:00 **13:30** 2.03x | 07:30-08:30 **07:30** 1.73x | - | Thu / Fri 1.04x (0.99-1.08) | reliable / weak | 1.06x | 1.80x | stable |

### Consumer Discretionary (34)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **ABNB** | Airbnb | 5.9 | 07:30-08:00 **07:30** 2.53x | 13:30-14:00 **13:30** 1.65x | - | Thu / Mon 1.06x (0.99-1.13) | reliable / weak | 1.12x | 2.73x | stable |
| **AMZN** | Amazon | 10.8 | 07:30-08:00 **07:30** 2.71x | 13:30-14:30 **13:30** 1.43x | - | Thu / Tue 1.05x (1.0-1.08) | reliable / weak | 1.14x | 2.09x | stable |
| **APTV** | Aptiv | 8.9 | 07:30-08:30 **07:30** 2.06x | 13:30-14:00 **13:30** 1.96x | - | Thu / Mon 1.11x (1.07-1.18) | reliable / reliable | 1.14x | 2.28x | stable |
| **AZO** | AutoZone | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.86x | - | Thu / Fri 1.05x (1.02-1.09) | reliable / weak | 0.97x | 1.45x | shifted |
| **BABA** | Alibaba Group | 10.8 | 07:30-08:00 **07:30** 3.06x | 13:30-14:00 **13:30** 1.34x | - | Thu / Tue 1.03x (0.99-1.09) | reliable / weak | 1.04x | 2.11x | stable |
| **BBY** | Best Buy | 10.8 | 07:30-08:00 **07:30** 2.17x | 13:30-14:00 **13:30** 1.84x | - | Mon / Thu 1.02x (0.97-1.06) | reliable / weak | 0.95x | 1.78x | stable |
| **BKNG** | Booking Holdings | 10.8 | 07:30-08:00 **07:30** 2.46x | 13:30-14:00 **13:30** 1.97x | - | Thu / Tue 1.05x (1.0-1.09) | reliable / reliable | 1.15x | 1.86x | stable |
| **CCL** | Carnival Corporation | 10.8 | 07:30-08:00 **07:30** 2.57x | 13:30-14:00 **13:30** 1.46x | - | Thu / Fri 1.09x (1.04-1.12) | reliable / weak | 1.02x | 2.08x | stable |
| **CMG** | Chipotle Mexican Grill | 10.8 | 07:30-08:00 **07:30** 2.25x | 13:30-14:00 **13:30** 1.83x | - | Mon / Fri 1.06x (1.01-1.09) | reliable / reliable | 0.98x | 1.74x | stable |
| **CVNA** | Carvana | 9.5 | 07:30-08:30 **07:30** 2.30x | 13:30-14:00 **13:30** 1.53x | - | Tue / Fri 1.03x (0.98-1.1) | reliable / weak | 1.43x | 1.83x | stable |
| **DASH** | DoorDash | 5.9 | 07:30-08:00 **07:30** 2.32x | 13:30-14:00 **13:30** 1.74x | - | Thu / Tue 1.07x (1.0-1.13) | reliable / weak | 1.19x | 2.31x | stable |
| **DECK** | Deckers Brands | 10.8 | 13:30-14:00 **13:30** 2.00x | 07:30-08:30 **07:30** 1.95x | - | Thu / Wed 1.04x (1.0-1.08) | reliable / weak | 1.08x | 1.88x | shifted |
| **DHI** | D. R. Horton | 10.8 | 07:30-08:30 **07:30** 2.07x | 13:30-14:00 **13:30** 1.85x | - | Wed / Mon 1.12x (1.07-1.17) | reliable / reliable | 1.09x | 2.39x | stable |
| **DPZ** | Domino's | 10.8 | 13:30-14:00 **13:30** 1.99x | 07:30-08:30 **07:30** 1.93x | - | Mon / Fri 1.09x (1.05-1.12) | weak / reliable | 1.08x | 1.76x | shifted |
| **DRI** | Darden Restaurants | 10.8 | 13:30-14:00 **13:30** 2.06x | 07:30-08:30 **07:30** 1.96x | - | Mon / Fri 1.05x (1.01-1.1) | weak / weak | 0.99x | 1.77x | shifted |
| **EBAY** | eBay Inc. | 10.8 | 07:30-08:00 **07:30** 2.23x | 13:30-14:00 **13:30** 1.92x | - | Wed / Mon 1.04x (1.0-1.08) | reliable / weak | 1.03x | 1.95x | stable |
| **EDU** | New Oriental Education & Tec | 10.8 | 07:30-08:00 **07:30** 2.87x | 13:30-14:00 **13:30** 1.66x | - | Tue / Fri 1.08x (1.01-1.16) | reliable / weak | 1.00x | 1.52x | stable |
| **EXPE** | Expedia Group | 10.8 | 07:30-08:00 **07:30** 2.18x | 13:30-14:00 **13:30** 1.83x | - | Thu / Fri 1.06x (1.02-1.11) | reliable / reliable | 1.11x | 1.96x | stable |
| **F** | Ford Motor Company | 10.8 | 07:30-08:00 **07:30** 2.33x | 13:30-14:30 **13:30** 1.45x | - | Thu / Mon 1.07x (1.03-1.12) | reliable / reliable | 1.17x | 1.89x | stable |
| **FLUT** | Flutter Entertainment | 2.7 | 07:30-08:30 **07:30** 2.11x | 13:30-14:00 **13:30** 2.08x | - | Fri / Thu 1.12x (1.0-1.23) | reliable / weak | 1.00x | 1.85x | stable |
| **GIL** | Gildan Activewear Inc. | 10.8 | 13:30-14:00 **13:30** 1.99x | 07:30-08:30 **07:30** 1.98x | - | Wed / Fri 1.08x (1.03-1.11) | reliable / weak | 1.12x | 2.00x | shifted |
| **GM** | General Motors | 10.8 | 07:30-08:00 **07:30** 2.41x | 13:30-14:30 **13:30** 1.68x | - | Thu / Mon 1.08x (1.03-1.13) | reliable / weak | 1.15x | 1.89x | stable |
| **GPC** | Genuine Parts Company | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-08:30 **07:30** 1.75x | - | Thu / Wed 1.03x (1.0-1.07) | reliable / weak | 0.92x | 1.83x | stable |
| **GRMN** | Garmin | 10.8 | 13:30-14:00 **13:30** 2.27x | 07:30-08:00 **07:30** 1.97x | - | Thu / Mon 1.07x (1.02-1.12) | reliable / weak | 1.11x | 1.98x | shifted |
| **HAS** | Hasbro | 10.8 | 13:30-14:00 **13:30** 2.09x | 07:30-08:00 **07:30** 1.94x | - | Thu / Wed 1.03x (0.98-1.06) | reliable / weak | 1.07x | 1.79x | shifted |
| **HD** | Home Depot (The) | 10.8 | 07:30-08:00 **07:30** 2.35x | 13:30-14:00 **13:30** 1.74x | - | Wed / Mon 1.03x (1.0-1.06) | reliable / weak | 1.04x | 2.22x | stable |
| **HLT** | Hilton Worldwide | 10.8 | 13:30-14:00 **13:30** 1.97x | 07:30-08:30 **07:30** 1.93x | - | Wed / Mon 1.06x (1.01-1.1) | reliable / reliable | 1.09x | 2.05x | shifted |
| **IHG** | InterContinental Hotels Grou | 10.8 | 07:30-08:00 **07:30** 2.54x | 13:30-14:00 **13:30** 1.87x | 08:30-10:00 **09:00** 1.40x | Wed / Mon 1.13x (1.07-1.18) | reliable / reliable | 1.11x | 2.25x | stable |
| **JD** | JD.com | 10.8 | 07:30-08:00 **07:30** 3.16x | 13:30-14:00 **13:30** 1.48x | - | Thu / Fri 1.05x (1.0-1.1) | reliable / weak | 0.96x | 1.95x | stable |
| **LEN** | Lennar | 10.8 | 07:30-08:30 **07:30** 2.04x | 13:30-14:00 **13:30** 1.82x | - | Wed / Mon 1.10x (1.06-1.15) | reliable / reliable | 1.16x | 2.39x | stable |
| **LVS** | Las Vegas Sands | 10.8 | 07:30-08:00 **07:30** 2.32x | 13:30-14:00 **13:30** 1.78x | - | Thu / Wed 1.03x (0.99-1.09) | reliable / weak | 1.01x | 1.85x | stable |
| **MCD** | McDonald's | 10.8 | 07:30-08:00 **07:30** 2.32x | 13:30-14:00 **13:30** 1.86x | - | Thu / Wed 1.03x (1.0-1.06) | reliable / reliable | 1.05x | 1.80x | stable |
| **MELI** | Mercado Libre | 10.8 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.68x | - | Thu / Fri 1.05x (1.01-1.09) | reliable / weak | 1.22x | 1.67x | stable |
| **MGM** | MGM Resorts | 10.8 | 07:30-08:30 **07:30** 2.18x | 13:30-14:00 **13:30** 1.80x | - | Thu / Mon 1.05x (1.0-1.1) | reliable / weak | 1.10x | 2.21x | stable |

### Consumer Staples (21)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **ABEV** | Ambev | 10.8 | 07:30-09:30 **07:30** 1.50x | 13:30-14:00 **13:30** 1.37x | - | Wed / Mon 1.09x (1.05-1.15) | reliable / reliable | 1.04x | 1.67x | stable |
| **ADM** | Archer Daniels Midland | 10.8 | 07:30-08:00 **07:30** 2.14x | 13:30-14:00 **13:30** 2.04x | - | Tue / Mon 1.05x (1.0-1.08) | reliable / weak | 1.03x | 1.79x | stable |
| **BF.B** | Brown–Forman | 10.8 | 13:30-14:00 **13:30** 2.29x | 07:30-08:30 **07:30** 1.73x | - | Thu / Tue 1.02x (0.98-1.06) | reliable / weak | 1.05x | 1.80x | stable |
| **BG** | Bunge Global | 10.8 | 13:30-14:00 **13:30** 2.06x | 07:30-08:30 **07:30** 1.94x | - | Wed / Fri 1.09x (1.03-1.14) | reliable / reliable | 1.09x | 1.90x | stable |
| **BTI** | British American Tobacco | 10.8 | 07:30-08:30 **07:30** 2.25x | 13:30-14:00 **13:30** 1.53x | - | Thu / Mon 1.07x (1.01-1.11) | reliable / reliable | 1.05x | 2.05x | stable |
| **BUD** | Anheuser-Busch InBev | 10.8 | 07:30-08:30 **07:30** 2.01x | 13:30-14:00 **13:30** 1.71x | - | Thu / Mon 1.07x (1.01-1.12) | reliable / reliable | 1.12x | 2.30x | stable |
| **CASY** | Casey's | 10.8 | 13:30-14:00 **13:30** 2.29x | 07:30-08:30 **07:30** 1.66x | - | Thu / Tue 1.03x (0.98-1.06) | reliable / weak | 0.98x | 1.41x | stable |
| **CCEP** | Coca-Cola Europacific Partne | 10.8 | 13:30-14:00 **13:30** 2.11x | 07:30-08:30 **07:30** 2.06x | - | Wed / Mon 1.10x (1.05-1.14) | reliable / weak | 1.16x | 1.67x | shifted |
| **CHD** | Church & Dwight | 10.8 | 13:30-14:00 **13:30** 2.23x | 07:30-08:30 **07:30** 1.98x | - | Tue / Fri 1.04x (1.0-1.08) | reliable / weak | 1.09x | 1.80x | stable |
| **CL** | Colgate-Palmolive | 10.8 | 07:30-08:00 **07:30** 2.24x | 13:30-14:00 **13:30** 2.02x | - | Fri / Mon 1.05x (1.02-1.08) | reliable / reliable | 0.97x | 1.70x | stable |
| **CLX** | Clorox | 10.8 | 07:30-08:30 **07:30** 2.05x | 13:30-14:00 **13:30** 2.02x | - | Tue / Fri 1.02x (0.99-1.06) | reliable / weak | 1.18x | 1.65x | shifted |
| **COST** | Costco | 10.8 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.81x | - | Thu / Tue 1.08x (1.04-1.12) | reliable / reliable | 1.20x | 1.94x | stable |
| **DEO** | Diageo | 10.8 | 07:30-08:30 **07:30** 2.03x | 13:30-14:00 **13:30** 1.54x | 08:30-10:00 **09:00** 1.28x | Thu / Mon 1.08x (1.04-1.12) | reliable / weak | 1.09x | 2.30x | stable |
| **DG** | Dollar General | 10.8 | 07:30-08:00 **07:30** 2.10x | 13:30-14:00 **13:30** 1.91x | - | Mon / Fri 1.04x (1.0-1.09) | reliable / weak | 1.12x | 1.55x | stable |
| **DLTR** | Dollar Tree | 10.8 | 07:30-08:00 **07:30** 2.10x | 13:30-14:00 **13:30** 1.95x | - | Thu / Fri 1.06x (1.0-1.1) | reliable / weak | 1.05x | 1.64x | shifted |
| **EL** | Estée Lauder Companies (The) | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 1.89x | - | Fri / Mon 1.04x (0.99-1.08) | reliable / weak | 1.10x | 2.13x | stable |
| **FMX** | Fomento Economico Mexicano | 10.8 | 13:30-14:00 **13:30** 2.00x | 07:30-09:00 **07:30** 1.66x | - | Wed / Mon 1.08x (1.03-1.13) | reliable / reliable | 1.02x | 1.79x | stable |
| **GIS** | General Mills | 10.8 | 07:30-08:00 **07:30** 2.18x | 13:30-14:00 **13:30** 1.93x | - | Wed / Mon 1.06x (1.02-1.1) | reliable / weak | 1.00x | 1.63x | stable |
| **HRL** | Hormel Foods | 10.8 | 13:30-14:00 **13:30** 2.21x | 07:30-08:30 **07:30** 1.98x | - | Thu / Mon 1.05x (1.02-1.11) | reliable / reliable | 1.06x | 1.62x | shifted |
| **HSY** | Hershey Company (The) | 10.8 | 13:30-14:00 **13:30** 2.14x | 07:30-08:30 **07:30** 1.96x | - | Wed / Fri 1.05x (1.0-1.1) | reliable / weak | 1.02x | 1.61x | stable |
| **KR** | Kroger | 10.8 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 1.88x | - | Thu / Mon 1.07x (1.03-1.12) | reliable / reliable | 1.08x | 1.55x | stable |

### Energy (20)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **APA** | APA Corporation | 10.8 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 1.64x | - | Wed / Mon 1.07x (1.03-1.11) | reliable / reliable | 1.19x | 1.79x | stable |
| **BEP** | Brookfield Renewable Partner | 10.8 | 07:30-08:00 **07:30** 2.11x | 13:30-14:00 **13:30** 1.80x | - | Thu / Fri 1.05x (1.01-1.11) | reliable / weak | 1.22x | 1.82x | stable |
| **BKR** | Baker Hughes | 9.3 | 07:30-08:30 **07:30** 2.02x | 13:30-14:00 **13:30** 1.90x | - | Wed / Mon 1.06x (1.02-1.12) | reliable / weak | 1.03x | 1.87x | shifted |
| **BP** | BP plc | 10.8 | 07:30-08:30 **07:30** 2.25x | 13:30-14:00 **13:30** 1.46x | - | Wed / Mon 1.10x (1.06-1.14) | reliable / reliable | 1.15x | 2.16x | stable |
| **BTE** | Baytex Energy Corp. | 3.7 | 07:30-09:30 **07:30** 1.71x | 12:30-14:00 **13:30** 1.11x | - | Wed / Fri 1.05x (0.98-1.13) | reliable / weak | 1.29x | 1.91x | stable |
| **CCJ** | Cameco Corporation | 10.8 | 07:30-08:00 **07:30** 2.37x | 13:30-14:00 **13:30** 1.55x | - | Thu / Mon 1.06x (1.02-1.13) | reliable / reliable | 1.00x | 1.97x | stable |
| **CNQ** | Canadian Natural Resources L | 10.8 | 07:30-08:00 **07:30** 2.12x | 13:30-14:00 **13:30** 1.73x | - | Wed / Mon 1.08x (1.04-1.13) | reliable / weak | 1.20x | 1.78x | stable |
| **COP** | ConocoPhillips | 10.8 | 07:30-08:00 **07:30** 2.15x | 13:30-14:00 **13:30** 1.69x | - | Wed / Mon 1.06x (1.02-1.09) | reliable / weak | 1.06x | 1.73x | stable |
| **CVE** | Cenovus Energy Inc. | 10.8 | 07:30-08:00 **07:30** 2.05x | 13:30-14:00 **13:30** 1.55x | - | Wed / Fri 1.11x (1.06-1.14) | reliable / weak | 1.16x | 1.69x | stable |
| **CVX** | Chevron Corporation | 10.8 | 07:30-08:00 **07:30** 2.25x | 13:30-14:30 **13:30** 1.69x | - | Wed / Mon 1.02x (0.99-1.08) | reliable / weak | 1.08x | 1.82x | stable |
| **DNN** | Denison Mines Corp. | 10.8 | 07:30-08:30 **07:30** 2.15x | 12:30-14:00 **13:30** 1.23x | - | Tue / Fri 1.04x (1.0-1.1) | reliable / weak | 1.04x | 1.67x | stable |
| **DVN** | Devon Energy | 10.8 | 07:30-08:00 **07:30** 2.20x | 13:30-14:00 **13:30** 1.56x | - | Wed / Fri 1.09x (1.05-1.14) | reliable / reliable | 1.17x | 1.79x | stable |
| **E** | Eni | 10.8 | 07:30-08:30 **07:30** 1.97x | 13:30-14:00 **13:30** 1.65x | - | Thu / Fri 1.07x (1.02-1.13) | reliable / reliable | 1.13x | 2.46x | stable |
| **ENB** | Enbridge Inc. | 10.8 | 07:30-08:00 **07:30** 2.14x | 13:30-14:00 **13:30** 1.81x | - | Wed / Mon 1.05x (1.01-1.08) | reliable / reliable | 1.04x | 1.97x | stable |
| **EOG** | EOG Resources | 10.8 | 07:30-08:30 **07:30** 2.05x | 13:30-14:00 **13:30** 1.80x | - | Wed / Fri 1.06x (1.03-1.1) | reliable / reliable | 1.23x | 1.75x | stable |
| **EQNR** | Equinor | 10.8 | 07:30-08:30 **07:30** 2.43x | 13:30-14:00 **13:30** 1.68x | - | Wed / Mon 1.12x (1.08-1.16) | reliable / reliable | 1.19x | 2.20x | stable |
| **EQT** | EQT Corporation | 10.8 | 07:30-08:30 **07:30** 1.96x | 13:30-14:00 **13:30** 1.76x | - | Thu / Fri 1.05x (1.0-1.09) | reliable / weak | 1.08x | 1.61x | stable |
| **EXE** | Expand Energy | 10.8 | 07:30-08:00 **07:30** 2.10x | 13:30-14:00 **13:30** 1.68x | - | Wed / Fri 1.10x (1.03-1.14) | reliable / weak | 1.15x | 1.55x | stable |
| **FANG** | Diamondback Energy | 10.8 | 07:30-08:00 **07:30** 2.09x | 13:30-14:00 **13:30** 1.74x | - | Wed / Fri 1.07x (1.03-1.14) | reliable / weak | 1.13x | 1.63x | stable |
| **HAL** | Halliburton | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 1.66x | - | Wed / Mon 1.08x (1.03-1.12) | reliable / reliable | 1.09x | 1.67x | stable |

### Financials (63)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **ACGL** | Arch Capital Group | 10.8 | 13:30-14:00 **13:30** 2.29x | 07:30-08:30 **07:30** 1.95x | - | Wed / Mon 1.05x (1.01-1.09) | reliable / weak | 1.09x | 1.72x | stable |
| **AFL** | Aflac | 10.8 | 13:30-14:00 **13:30** 2.11x | 07:30-08:00 **07:30** 2.08x | - | Thu / Tue 1.03x (1.0-1.07) | reliable / reliable | 1.04x | 1.82x | stable |
| **AIG** | American International Group | 10.8 | 13:30-14:00 **13:30** 2.02x | 07:30-08:30 **07:30** 1.97x | - | Thu / Mon 1.09x (1.04-1.14) | reliable / weak | 1.06x | 1.77x | shifted |
| **AIZ** | Assurant | 10.8 | 13:30-14:00 **13:30** 2.45x | 07:30-08:30 **07:30** 1.71x | - | Thu / Fri 1.06x (1.02-1.09) | reliable / weak | 1.10x | 1.79x | stable |
| **AJG** | Arthur J. Gallagher & Co. | 10.8 | 13:30-14:00 **13:30** 2.30x | 07:30-08:30 **07:30** 1.76x | - | Wed / Mon 1.05x (1.01-1.09) | reliable / weak | 0.98x | 1.84x | stable |
| **ALL** | Allstate | 10.8 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.90x | - | Thu / Mon 1.10x (1.05-1.14) | reliable / weak | 1.12x | 1.76x | stable |
| **AMP** | Ameriprise Financial | 10.8 | 13:30-14:00 **13:30** 2.10x | 07:30-08:30 **07:30** 1.89x | - | Thu / Mon 1.07x (1.03-1.11) | reliable / weak | 1.09x | 2.32x | shifted |
| **AON** | Aon plc | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.92x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 0.94x | 1.82x | stable |
| **APO** | Apollo Global Management | 10.8 | 13:30-14:00 **13:30** 2.02x | 07:30-08:30 **07:30** 1.89x | - | Thu / Fri 1.08x (1.04-1.12) | reliable / reliable | 1.17x | 1.95x | stable |
| **ARES** | Ares Management | 10.8 | 13:30-14:00 **13:30** 2.19x | 07:30-09:00 **07:30** 1.61x | - | Thu / Mon 1.09x (1.04-1.14) | reliable / reliable | 1.11x | 1.97x | stable |
| **AXP** | American Express | 10.8 | 07:30-08:00 **07:30** 2.16x | 13:30-14:00 **13:30** 1.81x | - | Thu / Mon 1.07x (1.01-1.12) | reliable / weak | 1.03x | 2.12x | stable |
| **BAC** | Bank of America | 10.8 | 07:30-08:00 **07:30** 2.51x | 13:30-14:30 **13:30** 1.59x | - | Thu / Mon 1.07x (1.03-1.12) | reliable / weak | 1.09x | 2.48x | stable |
| **BAM** | Brookfield Asset Management  | 10.8 | 07:30-08:30 **07:30** 1.97x | 13:30-14:00 **13:30** 1.91x | - | Thu / Mon 1.12x (1.07-1.17) | reliable / reliable | 1.09x | 2.08x | shifted |
| **BAP** | Credicorp | 10.8 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.85x | - | Thu / Mon 1.08x (1.04-1.15) | reliable / weak | 1.16x | 1.82x | shifted |
| **BBD** | Banco Bradesco | 10.8 | 07:30-09:00 **07:30** 1.60x | 13:30-14:00 **13:30** 1.47x | - | Thu / Mon 1.13x (1.08-1.18) | reliable / reliable | 1.10x | 1.87x | stable |
| **BBVA** | Banco Bilbao Vizcaya Argenta | 10.8 | 07:30-09:30 **07:30** 1.94x | 13:30-14:00 **13:30** 1.48x | - | Thu / Mon 1.09x (1.05-1.16) | reliable / reliable | 1.12x | 2.28x | stable |
| **BCS** | Barclays | 10.8 | 07:30-09:00 **07:30** 2.09x | 13:30-14:00 **13:30** 1.32x | - | Thu / Mon 1.12x (1.08-1.15) | reliable / reliable | 1.03x | 2.46x | stable |
| **BEN** | Franklin Resources | 10.8 | 13:30-14:00 **13:30** 2.05x | 07:30-08:30 **07:30** 1.98x | - | Wed / Mon 1.05x (1.0-1.1) | reliable / reliable | 1.12x | 2.44x | shifted |
| **BLK** | BlackRock | 10.8 | 07:30-08:30 **07:30** 2.04x | 13:30-14:00 **13:30** 2.00x | - | Thu / Mon 1.09x (1.04-1.13) | reliable / reliable | 1.07x | 2.18x | shifted |
| **BMO** | Bank of Montreal | 10.8 | 07:30-08:00 **07:30** 2.36x | 13:30-14:00 **13:30** 2.13x | - | Thu / Mon 1.12x (1.06-1.18) | reliable / weak | 1.12x | 2.45x | stable |
| **BN** | Brookfield Corporation | 3.9 | 13:30-14:00 **13:30** 1.95x | 07:30-08:30 **07:30** 1.90x | - | Wed / Mon 1.11x (1.03-1.21) | reliable / weak | 1.10x | 3.33x | stable |
| **BNS** | Bank of Nova Scotia | 10.8 | 07:30-08:00 **07:30** 2.30x | 13:30-14:00 **13:30** 2.05x | - | Thu / Mon 1.12x (1.06-1.16) | reliable / weak | 1.14x | 2.51x | stable |
| **BNY** | BNY Mellon | 10.8 | 07:30-08:30 **07:30** 2.02x | 13:30-14:00 **13:30** 1.95x | - | Thu / Mon 1.10x (1.06-1.14) | reliable / weak | 1.05x | 2.22x | stable |
| **BRK.B** | Berkshire Hathaway | 10.8 | 07:30-08:00 **07:30** 2.27x | 13:30-14:30 **13:30** 1.93x | - | Fri / Tue 1.04x (1.0-1.08) | reliable / weak | 1.05x | 1.96x | stable |
| **BRO** | Brown & Brown | 10.8 | 13:30-14:00 **13:30** 2.31x | 07:30-08:30 **07:30** 1.78x | - | Tue / Fri 1.03x (0.99-1.06) | reliable / weak | 0.98x | 1.71x | stable |
| **BX** | Blackstone Inc. | 10.8 | 07:30-08:30 **07:30** 2.11x | 13:30-14:00 **13:30** 1.72x | - | Thu / Mon 1.11x (1.06-1.16) | reliable / reliable | 1.14x | 2.14x | stable |
| **C** | Citigroup | 10.8 | 07:30-08:00 **07:30** 2.44x | 13:30-14:30 **13:30** 1.62x | - | Wed / Mon 1.07x (1.03-1.11) | reliable / weak | 1.04x | 2.55x | stable |
| **CB** | Chubb Limited | 10.8 | 13:30-14:00 **13:30** 2.07x | 07:30-08:00 **07:30** 2.01x | - | Thu / Mon 1.10x (1.06-1.14) | reliable / reliable | 1.07x | 1.81x | shifted |
| **CBOE** | Cboe Global Markets | 10.8 | 13:30-14:00 **13:30** 2.43x | 07:30-08:30 **07:30** 1.89x | - | Tue / Thu 1.02x (0.98-1.07) | reliable / weak | 1.21x | 1.58x | stable |
| **CFG** | Citizens Financial Group | 10.8 | 07:30-08:30 **07:30** 2.12x | 13:30-14:00 **13:30** 1.87x | - | Thu / Mon 1.08x (1.03-1.12) | reliable / weak | 1.06x | 2.36x | stable |
| **CINF** | Cincinnati Financial | 10.8 | 13:30-14:00 **13:30** 2.47x | 07:30-08:00 **07:30** 2.00x | - | Thu / Tue 1.03x (1.0-1.06) | reliable / weak | 1.06x | 1.79x | stable |
| **CM** | Canadian Imperial Bank of Co | 10.8 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 2.03x | - | Wed / Mon 1.12x (1.07-1.15) | reliable / weak | 1.09x | 2.43x | stable |
| **CME** | CME Group | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 2.03x | - | Wed / Mon 1.12x (1.07-1.17) | reliable / weak | 1.07x | 1.82x | stable |
| **COF** | Capital One | 10.8 | 07:30-08:30 **07:30** 2.07x | 13:30-14:00 **13:30** 1.85x | - | Thu / Mon 1.09x (1.04-1.14) | reliable / weak | 1.02x | 2.30x | stable |
| **COIN** | Coinbase | 5.5 | 07:30-08:00 **07:30** 2.66x | 13:30-14:00 **13:30** 1.24x | - | Thu / Tue 1.02x (0.96-1.09) | reliable / weak | 1.11x | 2.82x | stable |
| **CPAY** | Corpay | 10.8 | 13:30-14:00 **13:30** 2.18x | 07:30-08:30 **07:30** 1.71x | - | Thu / Mon 1.08x (1.04-1.12) | reliable / reliable | 1.17x | 2.16x | stable |
| **DB** | Deutsche Bank | 10.8 | 07:30-08:30 **07:30** 2.14x | 13:30-14:00 **13:30** 1.44x | - | Thu / Mon 1.06x (1.02-1.12) | reliable / weak | 1.08x | 2.55x | stable |
| **EG** | Everest Group | 10.8 | 13:30-14:00 **13:30** 2.39x | 07:30-08:30 **07:30** 1.69x | - | Wed / Mon 1.05x (1.02-1.09) | reliable / weak | 1.06x | 1.68x | stable |
| **ERIE** | Erie Indemnity | 10.8 | 13:30-14:00 **13:30** 3.36x | 07:30-08:00 **07:30** 1.69x | - | Mon / Tue 1.02x (0.98-1.08) | reliable / weak | 0.86x | 1.62x | stable |
| **FDS** | FactSet | 10.8 | 13:30-14:00 **13:30** 2.37x | 07:30-09:00 **07:30** 1.58x | - | Tue / Fri 1.05x (1.01-1.09) | reliable / reliable | 0.97x | 1.60x | stable |
| **FIS** | Fidelity National Informatio | 10.8 | 13:30-14:00 **13:30** 2.00x | 07:30-08:30 **07:30** 1.88x | - | Thu / Mon 1.05x (1.01-1.11) | reliable / reliable | 1.13x | 1.98x | stable |
| **FISV** | Fiserv | 10.8 | 07:30-08:00 **07:30** 2.12x | 13:30-14:00 **13:30** 1.95x | - | Wed / Mon 1.05x (0.99-1.09) | reliable / weak | 1.05x | 1.87x | stable |
| **FITB** | Fifth Third Bancorp | 10.8 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 1.89x | - | Thu / Mon 1.09x (1.05-1.13) | reliable / reliable | 1.02x | 2.28x | stable |
| **GGAL** | Grupo Financiero Galicia | 10.8 | 07:30-08:30 **07:30** 1.89x | 13:30-14:00 **13:30** 1.47x | - | Tue / Mon 1.04x (0.98-1.09) | reliable / weak | 0.99x | 1.49x | stable |
| **GL** | Globe Life | 10.8 | 13:30-14:00 **13:30** 2.43x | 07:30-08:30 **07:30** 1.66x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 0.97x | 1.75x | stable |
| **GPN** | Global Payments | 10.8 | 13:30-14:00 **13:30** 2.03x | 07:30-08:30 **07:30** 1.85x | - | Thu / Mon 1.06x (1.01-1.11) | reliable / weak | 1.10x | 2.11x | stable |
| **GS** | Goldman Sachs | 10.8 | 07:30-08:00 **07:30** 2.44x | 13:30-14:00 **13:30** 1.63x | - | Thu / Mon 1.09x (1.05-1.13) | reliable / weak | 1.09x | 2.38x | stable |
| **HBAN** | Huntington Bancshares | 10.8 | 07:30-08:00 **07:30** 2.13x | 13:30-14:00 **13:30** 1.69x | - | Thu / Mon 1.11x (1.07-1.16) | reliable / reliable | 1.06x | 2.10x | stable |
| **HDB** | HDFC Bank | 10.8 | 07:30-08:00 **07:30** 2.75x | 13:30-14:00 **13:30** 1.94x | - | Wed / Fri 1.04x (0.98-1.09) | reliable / weak | 1.11x | 1.94x | stable |
| **HIG** | Hartford (The) | 10.8 | 13:30-14:00 **13:30** 2.17x | 07:30-08:30 **07:30** 1.83x | - | Thu / Mon 1.06x (1.03-1.09) | reliable / reliable | 1.09x | 1.69x | stable |
| **HSBC** | HSBC Holdings | 10.8 | 07:30-08:30 **07:30** 2.19x | 13:30-14:00 **13:30** 1.66x | - | Thu / Mon 1.11x (1.07-1.15) | reliable / weak | 1.07x | 2.71x | stable |
| **IBKR** | Interactive Brokers | 10.8 | 13:30-14:00 **13:30** 1.95x | 07:30-08:30 **07:30** 1.89x | - | Thu / Mon 1.06x (1.01-1.11) | reliable / reliable | 1.21x | 1.93x | shifted |
| **IBN** | ICICI Bank | 10.8 | 07:30-08:00 **07:30** 2.51x | 13:30-14:00 **13:30** 2.05x | - | Thu / Fri 1.05x (1.0-1.1) | reliable / weak | 1.07x | 1.89x | stable |
| **ING** | ING Groep | 10.8 | 07:30-08:30 **07:30** 2.19x | 13:30-14:00 **13:30** 1.39x | - | Thu / Mon 1.11x (1.07-1.16) | reliable / reliable | 1.15x | 2.71x | stable |
| **ITUB** | Itau Unibanco Holding | 10.8 | 07:30-09:00 **07:30** 1.60x | 13:30-14:00 **13:30** 1.42x | - | Thu / Mon 1.13x (1.09-1.18) | reliable / reliable | 1.06x | 1.97x | stable |
| **IVZ** | Invesco | 10.8 | 07:30-08:30 **07:30** 1.99x | 13:30-14:00 **13:30** 1.93x | - | Thu / Mon 1.04x (1.01-1.08) | weak / weak | 1.12x | 2.47x | shifted |
| **JKHY** | Jack Henry & Associates | 10.8 | 13:30-14:00 **13:30** 2.36x | 07:30-08:00 **07:30** 1.88x | - | Thu / Mon 1.05x (1.01-1.09) | reliable / weak | 1.07x | 1.85x | stable |
| **JPM** | JPMorgan Chase | 10.8 | 07:30-08:00 **07:30** 2.42x | 13:30-14:30 **13:30** 1.64x | - | Fri / Mon 1.07x (1.03-1.11) | reliable / weak | 1.05x | 2.42x | stable |
| **KB** | KB Financial Group | 10.8 | 07:30-08:00 **07:30** 2.17x | 13:30-14:00 **13:30** 2.08x | - | Thu / Mon 1.10x (1.04-1.14) | reliable / weak | 0.96x | 2.36x | stable |
| **KEY** | KeyCorp | 10.8 | 07:30-08:30 **07:30** 2.06x | 13:30-14:00 **13:30** 1.70x | - | Thu / Mon 1.09x (1.04-1.14) | reliable / weak | 1.09x | 2.39x | stable |
| **KKR** | KKR & Co. | 10.8 | 07:30-08:30 **07:30** 1.97x | 13:30-14:00 **13:30** 1.89x | - | Thu / Mon 1.05x (1.01-1.11) | reliable / weak | 1.02x | 2.27x | stable |
| **MA** | Mastercard | 10.8 | 07:30-08:00 **07:30** 2.30x | 13:30-14:00 **13:30** 1.83x | - | Thu / Tue 1.07x (1.03-1.11) | reliable / reliable | 1.02x | 2.05x | stable |
| **MCO** | Moody's Corporation | 10.8 | 13:30-14:00 **13:30** 2.15x | 07:30-08:30 **07:30** 1.98x | - | Thu / Mon 1.11x (1.07-1.15) | reliable / reliable | 1.06x | 2.08x | stable |

### Health Care (40)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **A** | Agilent Technologies | 10.8 | 13:30-14:00 **13:30** 2.10x | 07:30-08:30 **07:30** 1.99x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 1.04x | 1.91x | stable |
| **ABBV** | AbbVie | 10.8 | 07:30-08:00 **07:30** 2.25x | 13:30-14:00 **13:30** 1.81x | - | Thu / Mon 1.06x (1.01-1.11) | reliable / weak | 1.00x | 1.63x | stable |
| **ABT** | Abbott Laboratories | 10.8 | 07:30-08:00 **07:30** 2.10x | 13:30-14:00 **13:30** 1.91x | - | Fri / Mon 1.05x (1.02-1.09) | reliable / reliable | 1.07x | 1.85x | stable |
| **ALC** | Alcon | 7.6 | 13:30-14:00 **13:30** 1.97x | 07:30-08:30 **07:30** 1.81x | 08:30-10:00 **09:00** 1.30x | Wed / Fri 1.09x (1.03-1.14) | reliable / weak | 1.18x | 2.41x | stable |
| **ALGN** | Align Technology | 10.8 | 07:30-08:30 **07:30** 2.21x | 13:30-14:00 **13:30** 1.80x | - | Fri / Tue 1.04x (1.0-1.08) | reliable / weak | 1.19x | 2.43x | stable |
| **ALNY** | Alnylam Pharmaceuticals | 10.8 | 07:30-08:30 **07:30** 2.06x | 13:30-14:00 **13:30** 2.02x | - | Mon / Wed 1.06x (1.01-1.11) | weak / reliable | 1.13x | 1.48x | shifted |
| **AMGN** | Amgen | 10.8 | 07:30-08:00 **07:30** 2.35x | 13:30-14:00 **13:30** 1.94x | - | Fri / Mon 1.04x (1.0-1.07) | reliable / weak | 1.11x | 1.74x | stable |
| **ARGX** | argenx | 9.4 | 07:30-08:00 **07:30** 2.23x | 13:30-14:00 **13:30** 2.14x | - | Tue / Fri 1.04x (0.98-1.09) | reliable / weak | 1.11x | 1.76x | stable |
| **AZN** | AstraZeneca | 10.8 | 07:30-08:30 **07:30** 2.15x | 13:30-14:00 **13:30** 1.56x | - | Thu / Mon 1.10x (1.05-1.15) | reliable / reliable | 0.99x | 1.92x | stable |
| **BAX** | Baxter International | 10.8 | 13:30-14:00 **13:30** 1.96x | 07:30-08:30 **07:30** 1.84x | - | Thu / Mon 1.08x (1.03-1.12) | reliable / reliable | 1.05x | 1.78x | stable |
| **BDX** | Becton Dickinson | 10.8 | 13:30-14:00 **13:30** 2.01x | 07:30-08:30 **07:30** 1.95x | - | Thu / Mon 1.08x (1.03-1.11) | reliable / reliable | 1.09x | 1.79x | shifted |
| **BHC** | Bausch Health Companies Inc. | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 1.68x | - | Wed / Fri 1.04x (1.0-1.1) | reliable / weak | 1.06x | 1.74x | stable |
| **BIIB** | Biogen | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 1.92x | - | Thu / Tue 1.04x (0.99-1.08) | reliable / weak | 1.10x | 1.72x | stable |
| **BMY** | Bristol Myers Squibb | 10.8 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 1.82x | - | Thu / Mon 1.03x (0.99-1.07) | reliable / weak | 1.03x | 1.49x | stable |
| **BSX** | Boston Scientific | 10.8 | 07:30-08:00 **07:30** 2.07x | 13:30-14:00 **13:30** 1.90x | - | Wed / Mon 1.09x (1.03-1.16) | reliable / weak | 1.07x | 1.83x | stable |
| **CAH** | Cardinal Health | 10.8 | 13:30-14:00 **13:30** 2.06x | 07:30-08:30 **07:30** 1.99x | - | Thu / Mon 1.07x (1.03-1.11) | reliable / reliable | 1.10x | 1.54x | shifted |
| **CI** | Cigna | 10.8 | 07:30-08:30 **07:30** 2.06x | 13:30-14:00 **13:30** 1.98x | - | Fri / Mon 1.06x (1.02-1.11) | reliable / weak | 1.17x | 1.47x | stable |
| **CNC** | Centene Corporation | 10.8 | 07:30-08:30 **07:30** 2.03x | 13:30-14:00 **13:30** 1.91x | - | Thu / Fri 1.08x (1.03-1.13) | reliable / reliable | 1.06x | 1.51x | stable |
| **COO** | Cooper Companies (The) | 10.8 | 13:30-14:00 **13:30** 2.23x | 07:30-08:30 **07:30** 1.82x | - | Thu / Mon 1.05x (1.01-1.11) | reliable / weak | 1.27x | 1.78x | stable |
| **COR** | Cencora | 10.8 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.94x | - | Thu / Mon 1.09x (1.03-1.13) | reliable / reliable | 1.09x | 1.54x | shifted |
| **CRL** | Charles River Laboratories | 10.8 | 13:30-14:00 **13:30** 2.14x | 07:30-09:00 **07:30** 1.65x | - | Thu / Mon 1.09x (1.04-1.14) | reliable / weak | 1.06x | 1.93x | stable |
| **CVS** | CVS Health | 10.8 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 1.72x | - | Wed / Mon 1.06x (1.01-1.1) | reliable / weak | 1.10x | 1.44x | stable |
| **DGX** | Quest Diagnostics | 10.8 | 13:30-14:00 **13:30** 2.18x | 07:30-08:30 **07:30** 1.85x | - | Thu / Mon 1.06x (1.03-1.1) | reliable / reliable | 0.93x | 1.63x | stable |
| **DHR** | Danaher Corporation | 10.8 | 07:30-08:00 **07:30** 2.13x | 13:30-14:00 **13:30** 1.92x | - | Thu / Mon 1.09x (1.04-1.12) | reliable / weak | 1.06x | 1.90x | stable |
| **DVA** | DaVita | 10.8 | 13:30-14:00 **13:30** 2.16x | 07:30-08:30 **07:30** 1.80x | - | Wed / Mon 1.03x (0.99-1.07) | reliable / weak | 1.16x | 1.74x | shifted |
| **DXCM** | Dexcom | 10.8 | 07:30-08:00 **07:30** 2.20x | 13:30-14:00 **13:30** 1.78x | - | Thu / Fri 1.02x (0.98-1.06) | reliable / weak | 1.05x | 1.73x | stable |
| **ELV** | Elevance Health | 10.8 | 07:30-08:00 **07:30** 2.15x | 13:30-14:00 **13:30** 1.95x | - | Wed / Mon 1.06x (1.02-1.11) | reliable / weak | 1.01x | 1.75x | stable |
| **EW** | Edwards Lifesciences | 10.8 | 07:30-08:00 **07:30** 2.10x | 13:30-14:00 **13:30** 1.88x | - | Wed / Mon 1.03x (1.0-1.09) | reliable / weak | 1.10x | 1.85x | stable |
| **GEHC** | GE HealthCare | 3.9 | 13:30-14:00 **13:30** 2.10x | 07:30-08:30 **07:30** 1.97x | - | Thu / Mon 1.11x (1.04-1.2) | reliable / weak | 1.10x | 2.65x | stable |
| **GILD** | Gilead Sciences | 10.8 | 07:30-08:00 **07:30** 2.44x | 13:30-14:30 **13:30** 1.85x | - | Fri / Wed 1.07x (1.03-1.11) | reliable / weak | 1.03x | 1.71x | stable |
| **GMAB** | Genmab | 7.3 | 07:30-09:00 **07:30** 2.12x | 13:30-14:00 **13:30** 1.87x | - | Wed / Fri 1.07x (1.02-1.12) | reliable / reliable | 1.06x | 2.47x | shifted |
| **GSK** | GSK plc | 10.8 | 07:30-08:30 **07:30** 2.09x | 13:30-14:00 **13:30** 1.61x | - | Thu / Mon 1.10x (1.06-1.16) | reliable / reliable | 0.99x | 2.05x | stable |
| **HCA** | HCA Healthcare | 10.8 | 07:30-08:30 **07:30** 2.12x | 13:30-14:00 **13:30** 1.96x | - | Thu / Mon 1.09x (1.05-1.13) | reliable / weak | 1.03x | 1.67x | stable |
| **HSIC** | Henry Schein | 10.8 | 13:30-14:00 **13:30** 2.17x | 07:30-08:00 **07:30** 1.99x | - | Wed / Tue 1.04x (1.0-1.09) | reliable / weak | 1.03x | 1.80x | shifted |
| **HUM** | Humana | 10.8 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.99x | - | Thu / Fri 1.05x (1.0-1.1) | reliable / weak | 1.05x | 1.56x | shifted |
| **IDXX** | Idexx Laboratories | 10.8 | 07:30-08:00 **07:30** 2.05x | 13:30-14:00 **13:30** 2.00x | - | Thu / Mon 1.03x (1.0-1.08) | reliable / weak | 1.08x | 2.06x | shifted |
| **INCY** | Incyte | 10.8 | 07:30-08:00 **07:30** 2.17x | 13:30-14:00 **13:30** 2.00x | - | Mon / Wed 1.03x (0.98-1.08) | reliable / weak | 1.09x | 1.73x | shifted |
| **IQV** | IQVIA | 10.8 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.90x | - | Wed / Mon 1.06x (1.02-1.13) | reliable / weak | 1.10x | 1.86x | stable |
| **ISRG** | Intuitive Surgical | 10.8 | 07:30-08:00 **07:30** 2.31x | 13:30-14:00 **13:30** 1.88x | - | Thu / Mon 1.04x (0.99-1.08) | reliable / weak | 1.09x | 2.15x | stable |
| **JNJ** | Johnson & Johnson | 10.8 | 07:30-08:00 **07:30** 2.36x | 13:30-14:30 **13:30** 1.91x | - | Thu / Mon 1.07x (1.04-1.11) | reliable / weak | 0.97x | 1.77x | stable |

### Industrials (56)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **ADP** | Automatic Data Processing | 10.8 | 07:30-08:00 **07:30** 2.16x | 13:30-14:00 **13:30** 2.09x | - | Wed / Mon 1.09x (1.05-1.13) | reliable / reliable | 1.13x | 2.16x | shifted |
| **AER** | AerCap Holdings | 10.8 | 13:30-14:00 **13:30** 1.97x | 07:30-08:30 **07:30** 1.95x | - | Wed / Fri 1.08x (1.03-1.12) | weak / weak | 1.12x | 1.88x | shifted |
| **ALLE** | Allegion | 10.8 | 13:30-14:00 **13:30** 2.25x | 07:30-08:30 **07:30** 1.71x | - | Fri / Mon 1.10x (1.04-1.15) | reliable / weak | 1.12x | 2.19x | stable |
| **AME** | Ametek | 10.8 | 13:30-14:00 **13:30** 2.26x | 07:30-08:30 **07:30** 1.78x | - | Thu / Mon 1.08x (1.03-1.14) | reliable / reliable | 1.09x | 2.05x | stable |
| **AOS** | A. O. Smith | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.87x | - | Thu / Mon 1.05x (1.01-1.09) | reliable / weak | 0.94x | 2.13x | stable |
| **ATS** | ATS Corporation | 3.4 | 13:30-14:00 **13:30** 2.56x | 07:30-08:30 **07:30** 1.69x | - | Thu / Wed 1.09x (0.96-1.17) | reliable / weak | 1.39x | 2.02x | stable |
| **AXON** | Axon Enterprise | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 1.90x | - | Tue / Fri 1.06x (1.02-1.09) | reliable / weak | 1.08x | 1.80x | stable |
| **BA** | Boeing | 10.8 | 07:30-08:00 **07:30** 2.51x | 13:30-14:00 **13:30** 1.40x | - | Wed / Fri 1.09x (1.05-1.14) | reliable / reliable | 1.03x | 2.03x | stable |
| **BBUC** | Brookfield Business Corporat | 4.6 | 13:30-14:00 **13:30** 3.36x | 07:30-08:30 **07:30** 1.41x | - | Thu / Tue 1.02x (0.94-1.11) | reliable / weak | 1.13x | 2.55x | stable |
| **BE** | Bloom Energy | 8.3 | 07:30-08:00 **07:30** 2.52x | 13:30-14:00 **13:30** 1.56x | - | Wed / Mon 1.05x (0.99-1.1) | reliable / weak | 1.15x | 2.10x | stable |
| **BR** | Broadridge Financial Solutio | 10.8 | 13:30-14:00 **13:30** 2.35x | 07:30-08:30 **07:30** 1.78x | - | Wed / Mon 1.04x (1.0-1.09) | reliable / weak | 1.10x | 1.98x | stable |
| **CAE** | CAE Inc. | 10.8 | 07:30-08:00 **07:30** 2.09x | 13:30-14:00 **13:30** 2.01x | - | Thu / Mon 1.06x (1.01-1.11) | reliable / weak | 1.05x | 1.99x | stable |
| **CARR** | Carrier Global | 6.6 | 07:30-08:30 **07:30** 2.01x | 13:30-14:00 **13:30** 2.00x | - | Thu / Mon 1.10x (1.01-1.14) | reliable / weak | 1.16x | 2.67x | stable |
| **CAT** | Caterpillar Inc. | 10.8 | 07:30-08:00 **07:30** 2.45x | 13:30-14:00 **13:30** 1.66x | - | Thu / Mon 1.10x (1.05-1.14) | reliable / weak | 1.06x | 2.36x | stable |
| **CHRW** | C.H. Robinson | 10.8 | 13:30-14:00 **13:30** 2.10x | 07:30-08:30 **07:30** 1.94x | - | Fri / Mon 1.05x (1.01-1.1) | reliable / reliable | 1.09x | 1.99x | shifted |
| **CMI** | Cummins | 10.8 | 07:30-08:30 **07:30** 2.02x | 13:30-14:00 **13:30** 1.99x | - | Wed / Mon 1.07x (1.02-1.11) | weak / weak | 1.03x | 2.25x | shifted |
| **CNI** | Canadian National Railway Co | 10.8 | 07:30-08:00 **07:30** 2.07x | 13:30-14:00 **13:30** 2.04x | - | Wed / Mon 1.11x (1.06-1.16) | reliable / weak | 1.10x | 2.19x | shifted |
| **CP** | Canadian Pacific Kansas City | 10.8 | 13:30-14:00 **13:30** 1.97x | 07:30-08:30 **07:30** 1.97x | - | Thu / Mon 1.08x (1.04-1.13) | reliable / weak | 1.07x | 1.89x | shifted |
| **CPRT** | Copart | 10.8 | 13:30-14:00 **13:30** 2.03x | 07:30-08:00 **07:30** 1.92x | - | Thu / Mon 1.04x (1.0-1.09) | reliable / weak | 1.01x | 1.88x | stable |
| **CSX** | CSX Corporation | 10.8 | 07:30-08:00 **07:30** 2.18x | 13:30-14:00 **13:30** 1.97x | - | Thu / Mon 1.05x (1.01-1.09) | reliable / weak | 1.01x | 1.81x | stable |
| **CTAS** | Cintas | 10.8 | 13:30-14:00 **13:30** 2.32x | 07:30-08:00 **07:30** 2.08x | - | Thu / Mon 1.05x (1.01-1.09) | reliable / reliable | 1.00x | 1.86x | shifted |
| **DAL** | Delta Air Lines | 10.8 | 07:30-08:00 **07:30** 2.49x | 13:30-14:00 **13:30** 1.62x | - | Wed / Fri 1.06x (1.02-1.1) | reliable / weak | 1.04x | 2.01x | stable |
| **DD** | DuPont | 10.8 | 07:30-08:30 **07:30** 1.94x | 13:30-14:00 **13:30** 1.92x | - | Tue / Mon 1.05x (1.0-1.09) | weak / weak | 1.12x | 1.92x | shifted |
| **DE** | Deere & Company | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 1.85x | - | Thu / Mon 1.07x (1.02-1.1) | reliable / reliable | 0.96x | 1.85x | stable |
| **DOV** | Dover Corporation | 10.8 | 13:30-14:00 **13:30** 2.25x | 07:30-08:30 **07:30** 1.76x | - | Wed / Mon 1.08x (1.03-1.13) | reliable / weak | 1.10x | 2.12x | stable |
| **EFX** | Equifax | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-08:30 **07:30** 1.74x | - | Wed / Mon 1.07x (1.03-1.13) | reliable / weak | 1.18x | 1.99x | stable |
| **EFXT** | Enerflex Ltd. | 4.0 | 13:30-14:00 **13:30** 2.14x | 07:30-08:00 **07:30** 2.06x | - | Thu / Mon 1.09x (0.99-1.19) | reliable / weak | 1.27x | 2.48x | stable |
| **EME** | Emcor | 10.8 | 13:30-14:00 **13:30** 2.36x | 07:30-08:30 **07:30** 1.69x | - | Thu / Mon 1.05x (1.0-1.09) | reliable / weak | 0.91x | 2.01x | stable |
| **EMR** | Emerson Electric | 10.8 | 07:30-08:30 **07:30** 1.98x | 13:30-14:00 **13:30** 1.94x | - | Wed / Mon 1.08x (1.04-1.13) | reliable / weak | 1.06x | 2.07x | shifted |
| **ETN** | Eaton Corporation | 10.8 | 07:30-08:30 **07:30** 2.01x | 13:30-14:00 **13:30** 1.88x | - | Thu / Mon 1.08x (1.03-1.12) | reliable / reliable | 1.04x | 2.10x | stable |
| **EXPD** | Expeditors International | 10.8 | 13:30-14:00 **13:30** 2.23x | 07:30-08:00 **07:30** 1.99x | - | Thu / Mon 1.03x (0.98-1.07) | reliable / weak | 1.00x | 1.86x | shifted |
| **FAST** | Fastenal | 10.8 | 07:30-08:00 **07:30** 2.06x | 13:30-14:00 **13:30** 2.00x | - | Thu / Mon 1.06x (1.01-1.09) | reliable / reliable | 1.07x | 1.82x | shifted |
| **FDX** | FedEx | 10.8 | 07:30-08:30 **07:30** 2.09x | 13:30-14:00 **13:30** 1.87x | - | Tue / Fri 1.02x (0.97-1.06) | reliable / weak | 1.02x | 1.95x | stable |
| **FER** | Ferrovial | 2.5 | 13:30-14:00 **13:30** 1.98x | 07:30-09:00 **07:30** 1.71x | 09:00-10:00 **09:30** 1.51x | Thu / Wed 1.08x (0.97-1.18) | reliable / weak | 1.16x | 2.65x | stable |
| **FERG** | Ferguson Enterprises | 5.6 | 13:30-14:00 **13:30** 2.25x | 07:30-08:30 **07:30** 2.02x | - | Thu / Fri 1.12x (1.02-1.18) | reliable / weak | 1.11x | 2.97x | stable |
| **FIX** | Comfort Systems USA | 10.8 | 13:30-14:00 **13:30** 2.32x | 07:30-08:30 **07:30** 1.70x | - | Tue / Mon 1.02x (0.99-1.06) | reliable / weak | 0.99x | 1.80x | stable |
| **FTV** | Fortive | 10.3 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.74x | - | Thu / Mon 1.02x (1.0-1.08) | reliable / weak | 1.07x | 1.94x | stable |
| **GD** | General Dynamics | 10.8 | 13:30-14:00 **13:30** 2.02x | 07:30-08:30 **07:30** 1.92x | - | Thu / Mon 1.04x (1.01-1.1) | reliable / weak | 0.97x | 1.88x | shifted |
| **GE** | GE Aerospace | 10.8 | 07:30-08:00 **07:30** 2.36x | 13:30-14:30 **13:30** 1.65x | - | Tue / Mon 1.06x (1.02-1.1) | reliable / weak | 1.04x | 1.79x | stable |
| **GEV** | GE Vernova | 2.6 | 07:30-08:00 **07:30** 2.67x | 13:30-14:00 **13:30** 1.51x | - | Thu / Mon 1.20x (1.1-1.31) | reliable / reliable | 1.07x | 2.40x | stable |
| **GFL** | GFL Environmental Inc. | 6.7 | 13:30-14:00 **13:30** 2.21x | 07:30-08:30 **07:30** 1.72x | - | Thu / Mon 1.06x (1.01-1.16) | reliable / weak | 1.08x | 1.87x | stable |
| **GNRC** | Generac | 10.8 | 13:30-14:00 **13:30** 1.96x | 07:30-08:30 **07:30** 1.93x | - | Thu / Mon 1.03x (0.98-1.09) | reliable / weak | 1.16x | 1.98x | shifted |
| **GRAB** | Grab Holdings | 5.9 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.59x | - | Wed / Mon 1.07x (1.01-1.14) | reliable / weak | 0.96x | 2.07x | stable |
| **GWW** | W. W. Grainger | 10.8 | 13:30-14:00 **13:30** 2.18x | 07:30-08:30 **07:30** 1.78x | - | Thu / Fri 1.05x (1.0-1.08) | reliable / weak | 1.19x | 1.67x | shifted |
| **HII** | Huntington Ingalls Industrie | 10.8 | 13:30-14:00 **13:30** 2.27x | 07:30-08:30 **07:30** 1.84x | - | Thu / Mon 1.05x (1.0-1.09) | reliable / weak | 1.00x | 1.84x | stable |
| **HON** | Honeywell Technologies | 10.8 | 07:30-08:00 **07:30** 1.99x | 13:30-14:00 **13:30** 1.92x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 0.97x | 2.10x | stable |
| **HUBB** | Hubbell Incorporated | 10.8 | 13:30-14:00 **13:30** 2.34x | 07:30-09:00 **07:30** 1.65x | - | Wed / Mon 1.07x (1.02-1.11) | reliable / weak | 1.02x | 2.08x | stable |
| **IEX** | IDEX Corporation | 10.8 | 13:30-14:00 **13:30** 2.51x | 07:30-08:30 **07:30** 1.70x | - | Thu / Mon 1.07x (1.04-1.11) | reliable / weak | 1.12x | 2.23x | stable |
| **IR** | Ingersoll Rand | 9.5 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.72x | - | Thu / Mon 1.07x (1.02-1.11) | reliable / weak | 1.12x | 2.17x | stable |
| **ITW** | Illinois Tool Works | 10.8 | 13:30-14:00 **13:30** 2.11x | 07:30-08:30 **07:30** 1.88x | - | Thu / Mon 1.07x (1.02-1.12) | reliable / weak | 1.10x | 2.22x | stable |
| **J** | Jacobs Solutions | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-08:30 **07:30** 1.73x | - | Wed / Fri 1.04x (1.0-1.07) | reliable / weak | 1.02x | 1.90x | stable |
| **JBHT** | J.B. Hunt | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.86x | - | Thu / Mon 1.05x (1.0-1.11) | reliable / reliable | 1.02x | 1.94x | shifted |
| **JCI** | Johnson Controls | 10.8 | 13:30-14:00 **13:30** 1.94x | 07:30-08:30 **07:30** 1.90x | - | Thu / Mon 1.06x (1.01-1.1) | reliable / weak | 1.15x | 2.10x | shifted |
| **LDOS** | Leidos | 10.8 | 13:30-14:00 **13:30** 2.32x | 07:30-08:30 **07:30** 1.78x | - | Mon / Tue 1.03x (1.0-1.07) | reliable / weak | 1.12x | 1.66x | stable |
| **LHX** | L3Harris | 10.8 | 13:30-14:00 **13:30** 2.06x | 07:30-08:30 **07:30** 1.85x | - | Thu / Wed 1.03x (0.99-1.07) | reliable / weak | 1.02x | 1.88x | stable |
| **MDA** | MDA Space Ltd. | 0.6 | 07:30-08:00 **07:30** 2.51x | 13:30-14:00 **13:30** 1.90x | - | Thu / Mon 1.22x (1.08-1.52) | reliable / weak | 1.18x | 1.89x | stable |

### Information Technology (48)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **AAPL** | Apple Inc. | 10.8 | 07:30-08:00 **07:30** 2.58x | 13:30-14:30 **13:30** 1.49x | - | Fri / Tue 1.04x (1.0-1.07) | reliable / weak | 1.16x | 2.19x | stable |
| **ACN** | Accenture | 10.8 | 07:30-08:00 **07:30** 2.26x | 13:30-14:00 **13:30** 1.89x | - | Thu / Mon 1.11x (1.06-1.14) | reliable / weak | 0.96x | 2.04x | stable |
| **ADBE** | Adobe Inc. | 10.8 | 07:30-08:00 **07:30** 2.52x | 13:30-14:00 **13:30** 1.69x | - | Fri / Mon 1.06x (1.0-1.11) | reliable / weak | 1.13x | 2.15x | stable |
| **ADI** | Analog Devices | 10.8 | 07:30-08:00 **07:30** 2.14x | 13:30-14:00 **13:30** 2.04x | - | Thu / Mon 1.09x (1.05-1.14) | reliable / weak | 1.01x | 2.00x | shifted |
| **ADSK** | Autodesk | 10.8 | 07:30-08:00 **07:30** 2.17x | 13:30-14:00 **13:30** 1.90x | - | Thu / Tue 1.09x (1.04-1.13) | reliable / weak | 1.07x | 2.11x | stable |
| **AKAM** | Akamai Technologies | 10.8 | 07:30-08:00 **07:30** 2.08x | 13:30-14:00 **13:30** 2.02x | - | Thu / Mon 1.05x (1.01-1.09) | weak / weak | 1.13x | 1.92x | shifted |
| **ALAB** | Astera Labs | 2.6 | 07:30-08:00 **07:30** 2.73x | 13:30-14:00 **13:30** 1.63x | - | Wed / Mon 1.05x (0.96-1.16) | reliable / weak | 1.00x | 2.33x | stable |
| **AMAT** | Applied Materials | 10.8 | 07:30-08:00 **07:30** 2.57x | 13:30-14:30 **13:30** 1.71x | - | Thu / Mon 1.11x (1.05-1.15) | reliable / weak | 1.02x | 2.11x | stable |
| **AMD** | Advanced Micro Devices | 10.8 | 07:30-08:00 **07:30** 2.80x | 13:00-14:00 **13:30** 1.14x | - | Thu / Fri 1.07x (1.03-1.1) | reliable / weak | 1.08x | 2.22x | stable |
| **ANET** | Arista Networks | 10.8 | 07:30-08:00 **07:30** 2.31x | 13:30-14:00 **13:30** 1.74x | - | Thu / Tue 1.05x (0.99-1.1) | reliable / weak | 1.19x | 2.00x | stable |
| **APH** | Amphenol | 10.8 | 13:30-14:00 **13:30** 2.00x | 07:30-08:00 **07:30** 1.97x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 1.00x | 2.27x | shifted |
| **ARM** | Arm Holdings | 3.1 | 07:30-08:00 **07:30** 2.98x | 13:30-14:00 **13:30** 1.51x | - | Thu / Wed 1.13x (1.0-1.24) | reliable / reliable | 1.15x | 2.82x | stable |
| **ASML** | ASML Holding | 10.8 | 07:30-08:00 **07:30** 2.47x | 13:30-14:00 **13:30** 1.73x | - | Thu / Mon 1.09x (1.06-1.16) | reliable / weak | 1.10x | 2.35x | stable |
| **ASX** | ASE Technology Holding | 10.8 | 07:30-08:00 **07:30** 2.11x | 13:30-14:00 **13:30** 1.96x | - | Thu / Tue 1.08x (1.03-1.12) | reliable / reliable | 1.02x | 2.19x | stable |
| **AVGO** | Broadcom | 10.8 | 07:30-08:00 **07:30** 2.43x | 13:30-14:30 **13:30** 1.77x | - | Thu / Mon 1.11x (1.07-1.15) | reliable / weak | 1.13x | 2.04x | stable |
| **BB** | BlackBerry Limited | 10.8 | 07:30-08:00 **07:30** 2.21x | 13:30-14:00 **13:30** 1.39x | - | Thu / Mon 1.04x (1.0-1.1) | reliable / reliable | 1.09x | 1.86x | stable |
| **CDNS** | Cadence Design Systems | 10.8 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 1.94x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 1.05x | 2.07x | stable |
| **CDW** | CDW Corporation | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:00 **07:30** 1.92x | - | Thu / Mon 1.06x (1.03-1.1) | reliable / reliable | 1.08x | 1.73x | shifted |
| **CHKP** | Check Point Software Technol | 10.8 | 07:30-08:00 **07:30** 2.19x | 13:30-14:00 **13:30** 1.97x | - | Tue / Fri 1.05x (1.0-1.08) | reliable / weak | 1.05x | 1.78x | shifted |
| **CIEN** | Ciena | 10.8 | 07:30-08:30 **07:30** 2.01x | 13:30-14:00 **13:30** 1.83x | - | Thu / Mon 1.08x (1.04-1.13) | reliable / reliable | 1.07x | 1.71x | shifted |
| **CLS** | Celestica Inc. | 10.8 | 07:30-08:00 **07:30** 2.20x | 13:30-14:00 **13:30** 1.74x | - | Thu / Mon 1.09x (1.03-1.14) | reliable / weak | 1.06x | 2.00x | stable |
| **COHR** | Coherent Corp. | 10.8 | 07:30-08:00 **07:30** 2.17x | 13:30-14:00 **13:30** 1.82x | - | Thu / Wed 1.03x (0.97-1.09) | reliable / weak | 1.16x | 1.96x | stable |
| **CRM** | Salesforce | 10.8 | 07:30-08:00 **07:30** 2.49x | 13:30-14:30 **13:30** 1.61x | - | Thu / Mon 1.10x (1.06-1.14) | reliable / weak | 0.99x | 1.95x | stable |
| **CRWD** | CrowdStrike | 7.4 | 07:30-08:00 **07:30** 2.92x | 13:30-14:00 **13:30** 1.45x | - | Thu / Fri 1.04x (0.98-1.1) | reliable / weak | 1.14x | 2.03x | stable |
| **CRWV** | CoreWeave | 1.6 | 07:30-08:00 **07:30** 2.83x | 13:30-14:00 **13:30** 1.26x | - | Fri / Wed 1.10x (0.95-1.27) | reliable / weak | 1.03x | 2.14x | stable |
| **CSCO** | Cisco | 10.8 | 07:30-08:00 **07:30** 2.38x | 13:30-14:30 **14:00** 1.94x | - | Fri / Mon 1.11x (1.08-1.17) | reliable / reliable | 1.04x | 1.99x | stable |
| **CTSH** | Cognizant | 10.8 | 07:30-08:00 **07:30** 2.19x | 13:30-14:00 **13:30** 2.00x | - | Thu / Mon 1.07x (1.04-1.11) | reliable / weak | 1.14x | 1.96x | stable |
| **DDOG** | Datadog | 7.1 | 07:30-08:00 **07:30** 2.65x | 13:30-14:00 **13:30** 1.65x | - | Thu / Tue 1.06x (1.01-1.14) | reliable / weak | 1.14x | 2.15x | stable |
| **DELL** | Dell Technologies | 7.8 | 07:30-08:30 **07:30** 2.20x | 13:30-14:00 **13:30** 1.76x | - | Thu / Mon 1.09x (1.02-1.13) | reliable / reliable | 1.08x | 2.02x | stable |
| **DSGX** | Descartes Systems Group Inc. | 10.8 | 13:30-14:00 **13:30** 2.07x | 07:30-08:00 **07:30** 1.95x | - | Thu / Fri 1.05x (1.01-1.11) | reliable / weak | 1.17x | 1.81x | stable |
| **ERIC** | Ericsson | 10.8 | 07:30-09:30 **07:30** 2.03x | 13:30-14:00 **13:30** 1.56x | - | Wed / Mon 1.08x (1.03-1.13) | reliable / weak | 1.09x | 2.42x | stable |
| **FFIV** | F5, Inc. | 10.8 | 13:30-14:00 **13:30** 2.15x | 07:30-08:00 **07:30** 2.00x | - | Thu / Mon 1.07x (1.02-1.12) | weak / reliable | 1.01x | 1.95x | shifted |
| **FICO** | Fair Isaac | 10.8 | 13:30-14:00 **13:30** 2.35x | 07:30-08:30 **07:30** 1.74x | - | Thu / Mon 1.05x (1.0-1.11) | reliable / weak | 1.14x | 1.80x | stable |
| **FLEX** | Flex Ltd. | 10.8 | 07:30-08:30 **07:30** 1.99x | 13:30-14:00 **13:30** 1.87x | - | Thu / Mon 1.09x (1.04-1.14) | reliable / weak | 1.03x | 2.05x | stable |
| **FSLR** | First Solar | 10.8 | 07:30-08:00 **07:30** 2.50x | 13:30-14:00 **13:30** 1.57x | - | Wed / Tue 1.04x (0.99-1.09) | reliable / weak | 1.25x | 1.87x | stable |
| **FTNT** | Fortinet | 10.8 | 07:30-08:00 **07:30** 2.36x | 13:30-14:00 **13:30** 1.80x | - | Thu / Fri 1.04x (0.98-1.09) | reliable / weak | 1.13x | 1.86x | stable |
| **GDDY** | GoDaddy | 10.8 | 13:30-14:00 **13:30** 2.06x | 07:30-08:30 **07:30** 1.81x | - | Tue / Fri 1.03x (0.98-1.08) | reliable / weak | 1.22x | 1.87x | stable |
| **GEN** | Gen Digital | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:00 **07:30** 2.04x | - | Thu / Fri 1.03x (0.98-1.07) | reliable / weak | 1.20x | 1.81x | shifted |
| **GIB** | CGI Inc. | 10.8 | 07:30-08:00 **07:30** 2.27x | 13:30-14:00 **13:30** 2.19x | - | Tue / Mon 1.05x (1.01-1.1) | reliable / weak | 1.14x | 2.15x | shifted |
| **GLW** | Corning Inc. | 10.8 | 07:30-08:30 **07:30** 2.00x | 13:30-14:00 **13:30** 1.90x | - | Wed / Mon 1.05x (1.01-1.1) | reliable / weak | 1.02x | 2.07x | stable |
| **HPE** | Hewlett Packard Enterprise | 10.8 | 07:30-08:30 **07:30** 1.98x | 13:30-14:00 **13:30** 1.85x | - | Fri / Mon 1.04x (1.0-1.08) | reliable / weak | 1.03x | 1.63x | stable |
| **IBM** | IBM | 10.8 | 07:30-08:00 **07:30** 2.30x | 13:30-14:30 **13:30** 1.77x | - | Thu / Mon 1.08x (1.05-1.13) | reliable / weak | 1.12x | 1.86x | stable |
| **INFY** | Infosys | 10.8 | 07:30-08:00 **07:30** 2.32x | 13:30-14:00 **13:30** 1.95x | - | Thu / Mon 1.09x (1.03-1.14) | reliable / weak | 0.98x | 1.99x | stable |
| **INTC** | Intel | 10.8 | 07:30-08:00 **07:30** 2.53x | 13:30-14:30 **13:30** 1.67x | - | Fri / Mon 1.09x (1.04-1.14) | reliable / reliable | 1.04x | 2.18x | stable |
| **INTU** | Intuit | 10.8 | 07:30-08:00 **07:30** 2.25x | 13:30-14:00 **13:30** 1.93x | - | Fri / Mon 1.09x (1.03-1.13) | reliable / weak | 1.07x | 1.96x | stable |
| **IT** | Gartner | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-08:30 **07:30** 1.66x | - | Thu / Mon 1.06x (1.01-1.1) | reliable / weak | 1.11x | 1.79x | stable |
| **LITE** | Lumentum | 10.8 | 07:30-08:00 **07:30** 2.28x | 13:30-14:00 **13:30** 1.79x | - | Tue / Fri 1.04x (1.0-1.09) | reliable / weak | 1.00x | 1.90x | stable |
| **LSPD** | Lightspeed Commerce Inc. | 6.1 | 07:30-08:30 **07:30** 2.17x | 13:30-14:00 **13:30** 1.90x | - | Thu / Fri 1.08x (1.0-1.15) | weak / reliable | 1.23x | 3.07x | stable |

### Materials (34)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **AAUC** | Allied Gold Corporation | 1.4 | 07:30-08:00 **07:30** 2.69x | 13:30-14:00 **13:30** 2.20x | - | Thu / Wed 1.15x (0.96-1.3) | reliable / weak | 0.95x | 3.91x | stable |
| **AEM** | Agnico Eagle Mines Limited | 10.8 | 07:30-08:00 **07:30** 2.38x | 13:30-14:00 **13:30** 1.68x | - | Wed / Mon 1.10x (1.06-1.14) | reliable / reliable | 1.04x | 3.29x | stable |
| **AG** | First Majestic Silver Corp. | 10.8 | 07:30-08:00 **07:30** 2.62x | 13:30-14:00 **13:30** 1.27x | - | Thu / Tue 1.04x (0.99-1.09) | reliable / weak | 1.12x | 3.08x | stable |
| **AGI** | Alamos Gold Inc. | 10.8 | 07:30-08:00 **07:30** 2.27x | 13:30-14:00 **13:30** 1.65x | - | Thu / Mon 1.07x (1.03-1.12) | reliable / reliable | 1.04x | 2.92x | stable |
| **ALB** | Albemarle Corporation | 10.8 | 07:30-08:00 **07:30** 2.45x | 13:30-14:00 **13:30** 1.73x | - | Thu / Mon 1.05x (1.01-1.1) | reliable / weak | 1.13x | 1.83x | stable |
| **AMCR** | Amcor | 7.4 | 13:30-14:00 **13:30** 2.21x | 07:30-08:30 **07:30** 1.88x | - | Thu / Mon 1.06x (1.01-1.1) | reliable / weak | 1.01x | 2.02x | stable |
| **APD** | Air Products | 10.8 | 13:30-14:00 **13:30** 2.07x | 07:30-08:30 **07:30** 1.86x | - | Thu / Wed 1.03x (0.99-1.08) | reliable / weak | 1.01x | 1.83x | stable |
| **ASM** | Avino Silver & Gold Mines Lt | 10.8 | 07:30-08:00 **07:30** 2.69x | 13:30-14:00 **13:30** 1.26x | - | Thu / Fri 1.06x (1.0-1.1) | reliable / weak | 1.05x | 1.85x | stable |
| **AVY** | Avery Dennison | 10.8 | 13:30-14:00 **13:30** 2.36x | 07:30-08:30 **07:30** 1.71x | - | Thu / Mon 1.04x (1.0-1.09) | reliable / weak | 1.01x | 2.08x | stable |
| **AYA** | Aya Gold & Silver Inc. | 0.5 | 07:30-08:00 **07:30** 2.68x | 13:30-14:00 **13:30** 1.59x | - | Wed / Mon 1.22x (0.96-1.39) | reliable / weak | 1.02x | - | stable |
| **B** | Barrick Mining Corporation | 10.8 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.45x | - | Wed / Mon 1.09x (1.05-1.13) | reliable / reliable | 1.17x | 3.13x | stable |
| **BALL** | Ball Corporation | 10.8 | 13:30-14:00 **13:30** 2.07x | 07:30-08:30 **07:30** 1.84x | - | Thu / Mon 1.05x (1.0-1.09) | reliable / weak | 1.19x | 1.91x | stable |
| **BHP** | BHP Group | 10.8 | 07:30-08:30 **07:30** 2.30x | 13:30-14:00 **13:30** 1.62x | - | Wed / Mon 1.12x (1.06-1.17) | reliable / weak | 1.08x | 3.24x | stable |
| **BTG** | B2Gold Corp. | 10.8 | 07:30-08:30 **07:30** 2.11x | 13:30-14:00 **13:30** 1.46x | - | Wed / Mon 1.07x (1.03-1.11) | reliable / weak | 1.09x | 2.86x | stable |
| **CF** | CF Industries | 10.8 | 07:30-08:00 **07:30** 2.23x | 13:30-14:00 **13:30** 1.85x | - | Wed / Mon 1.04x (1.01-1.09) | reliable / weak | 1.11x | 1.69x | stable |
| **CGAU** | Centerra Gold Inc. | 5.5 | 07:30-08:00 **07:30** 2.58x | 13:30-14:00 **13:30** 1.93x | - | Wed / Mon 1.08x (1.0-1.17) | reliable / weak | 1.10x | 3.97x | stable |
| **CRH** | CRH plc | 10.8 | 07:30-08:30 **07:30** 2.23x | 13:30-14:00 **13:30** 1.65x | 08:30-10:00 **09:00** 1.55x | Thu / Mon 1.11x (1.06-1.18) | reliable / weak | 1.00x | 2.41x | stable |
| **CX** | Cemex | 10.8 | 07:30-08:30 **07:30** 1.79x | 13:30-14:00 **13:30** 1.75x | - | Thu / Mon 1.15x (1.1-1.2) | reliable / reliable | 1.02x | 2.01x | shifted |
| **DOW** | Dow Inc. | 10.8 | 07:30-08:00 **07:30** 2.25x | 13:30-14:00 **13:30** 1.80x | - | Thu / Mon 1.05x (1.01-1.1) | reliable / weak | 1.12x | 2.09x | stable |
| **ECL** | Ecolab | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:00 **07:30** 2.02x | - | Wed / Mon 1.03x (0.99-1.08) | reliable / weak | 1.15x | 1.85x | shifted |
| **EGO** | Eldorado Gold Corporation | 10.8 | 07:30-08:00 **07:30** 2.43x | 13:30-14:00 **13:30** 1.64x | - | Wed / Mon 1.07x (1.03-1.11) | reliable / weak | 1.12x | 2.84x | stable |
| **EQX** | Equinox Gold Corp. | 7.1 | 07:30-08:00 **07:30** 2.37x | 13:30-14:00 **13:30** 1.53x | - | Thu / Tue 1.06x (1.0-1.13) | reliable / weak | 1.12x | 2.93x | stable |
| **ERO** | Ero Copper Corp. | 5.4 | 07:30-08:00 **07:30** 2.62x | 13:30-14:00 **13:30** 1.84x | - | Tue / Fri 1.04x (0.95-1.09) | reliable / weak | 1.36x | 3.50x | stable |
| **EXK** | Endeavour Silver Corp. | 10.8 | 07:30-08:00 **07:30** 2.59x | 13:30-14:00 **13:30** 1.24x | - | Thu / Mon 1.07x (1.02-1.12) | reliable / weak | 1.07x | 2.88x | stable |
| **FCX** | Freeport-McMoRan | 10.8 | 07:30-08:00 **07:30** 2.56x | 13:30-14:00 **13:30** 1.55x | - | Thu / Mon 1.13x (1.08-1.18) | reliable / weak | 1.05x | 2.53x | stable |
| **FNV** | Franco-Nevada Corporation | 10.8 | 07:30-08:00 **07:30** 2.28x | 13:30-14:00 **13:30** 1.91x | - | Wed / Mon 1.10x (1.06-1.14) | reliable / weak | 1.16x | 3.14x | stable |
| **FSM** | Fortuna Mining Corp. | 10.8 | 07:30-08:00 **07:30** 2.29x | 13:30-14:00 **13:30** 1.30x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / reliable | 1.07x | 2.73x | stable |
| **GFI** | Gold Fields | 10.8 | 07:30-08:30 **07:30** 2.43x | 13:30-14:00 **13:30** 1.73x | - | Wed / Mon 1.09x (1.04-1.13) | reliable / reliable | 1.10x | 3.15x | stable |
| **HBM** | Hudbay Minerals Inc. | 10.8 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.56x | - | Wed / Mon 1.12x (1.05-1.17) | reliable / weak | 1.15x | 2.20x | stable |
| **IAG** | Iamgold Corporation | 10.8 | 07:30-08:30 **07:30** 2.13x | 13:30-14:00 **13:30** 1.41x | - | Wed / Mon 1.08x (1.03-1.14) | reliable / reliable | 1.08x | 2.83x | stable |
| **IAUX** | I-80 Gold Corp. | 4.4 | 07:30-08:00 **07:30** 2.14x | 13:30-14:00 **13:30** 1.46x | - | Thu / Mon 1.03x (0.97-1.1) | reliable / weak | 1.09x | 2.36x | stable |
| **IFF** | International Flavors & Frag | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.88x | - | Thu / Mon 1.08x (1.03-1.12) | reliable / reliable | 1.05x | 1.89x | stable |
| **IP** | International Paper | 10.8 | 07:30-08:30 **07:30** 2.02x | 13:30-14:00 **13:30** 2.00x | - | Thu / Tue 1.02x (0.98-1.08) | reliable / weak | 1.09x | 1.76x | shifted |
| **LIN** | Linde plc | 8.0 | 07:30-08:00 **07:30** 2.15x | 13:30-14:00 **13:30** 2.07x | - | Thu / Mon 1.08x (1.02-1.13) | reliable / weak | 1.03x | 2.24x | shifted |

### Other (top liquid) (147)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **AA** | Alcoa Corporation | 10.1 | 07:30-08:00 **07:30** 2.49x | 13:30-14:00 **13:30** 1.62x | - | Thu / Mon 1.10x (1.05-1.15) | reliable / reliable | 1.08x | 2.26x | stable |
| **AAL** | American Airlines Group Inc. | 10.8 | 07:30-08:00 **07:30** 2.40x | 13:30-14:00 **13:30** 1.44x | - | Thu / Fri 1.10x (1.06-1.16) | reliable / reliable | 1.24x | 2.03x | stable |
| **AAOI** | Applied Optoelectronics, Inc | 10.8 | 07:30-08:00 **07:30** 2.58x | 13:30-14:00 **13:30** 1.50x | - | Thu / Tue 1.05x (0.99-1.1) | reliable / weak | 1.15x | 1.68x | stable |
| **AEHR** | Aehr Test Systems | 10.2 | 07:30-08:00 **07:30** 2.43x | 13:30-14:00 **13:30** 1.64x | - | Wed / Fri 1.05x (0.99-1.12) | reliable / weak | 1.28x | 2.18x | shifted |
| **AEIS** | Advanced Energy Industries,  | 10.8 | 13:30-14:00 **13:30** 2.19x | 07:30-08:00 **07:30** 2.06x | - | Wed / Mon 1.09x (1.05-1.14) | reliable / weak | 1.02x | 1.96x | shifted |
| **AFRM** | Affirm Holdings, Inc. | 5.8 | 07:30-08:00 **07:30** 2.57x | 13:30-14:00 **13:30** 1.44x | - | Thu / Mon 1.04x (0.99-1.11) | reliable / weak | 1.20x | 3.11x | stable |
| **AGNC** | AGNC Investment Corp. | 10.8 | 07:30-08:00 **07:30** 2.31x | 13:30-14:00 **13:30** 1.72x | - | Tue / Fri 1.02x (0.97-1.06) | reliable / weak | 1.16x | 1.92x | stable |
| **AGX** | Argan, Inc | 10.8 | 13:30-14:00 **13:30** 2.27x | 07:30-08:30 **07:30** 1.74x | - | Tue / Wed 1.02x (0.98-1.07) | reliable / weak | 1.05x | 1.83x | stable |
| **AHR** | American Healthcare REIT, In | 2.7 | 13:30-14:00 **13:30** 2.40x | 07:30-08:30 **07:30** 1.69x | - | Thu / Mon 1.11x (0.99-1.22) | reliable / weak | 1.17x | 1.79x | stable |
| **ALK** | Alaska Air Group, Inc. | 10.8 | 07:30-08:00 **07:30** 2.12x | 13:30-14:00 **13:30** 1.86x | - | Thu / Fri 1.07x (1.03-1.12) | reliable / weak | 1.15x | 2.08x | stable |
| **ALLY** | Ally Financial Inc. | 10.8 | 13:30-14:00 **13:30** 2.00x | 07:30-08:30 **07:30** 1.98x | - | Thu / Mon 1.08x (1.03-1.13) | reliable / reliable | 1.12x | 2.02x | shifted |
| **AMKR** | Amkor Technology, Inc. | 10.8 | 07:30-08:00 **07:30** 2.18x | 13:30-14:00 **13:30** 1.93x | - | Thu / Mon 1.02x (0.99-1.06) | reliable / weak | 1.09x | 2.16x | stable |
| **AMRZ** | Amrize Ltd | 1.3 | 07:30-08:30 **07:30** 2.16x | 13:30-14:00 **13:30** 2.03x | 08:30-10:00 **09:00** 1.34x | Wed / Tue 1.09x (0.95-1.2) | reliable / weak | 1.22x | 2.87x | stable |
| **ANF** | Abercrombie & Fitch Co. | 10.8 | 07:30-08:30 **07:30** 2.15x | 13:30-14:00 **13:30** 1.83x | - | Mon / Thu 1.09x (1.05-1.14) | reliable / reliable | 1.11x | 1.68x | stable |
| **APLD** | Applied Digital Corporation | 4.5 | 07:30-08:00 **07:30** 2.51x | 13:30-14:00 **13:30** 1.38x | - | Fri / Thu 1.02x (0.95-1.11) | reliable / weak | 1.06x | 2.29x | stable |
| **AR** | ANTERO RESOURCES CORPORATION | 10.8 | 07:30-08:00 **07:30** 2.06x | 13:30-14:00 **13:30** 1.71x | - | Thu / Fri 1.06x (1.03-1.11) | reliable / weak | 1.10x | 1.71x | stable |
| **AS** | Amer Sports, Inc. | 2.7 | 13:30-14:00 **13:30** 2.19x | 07:30-08:30 **07:30** 2.08x | - | Tue / Fri 1.04x (0.97-1.18) | reliable / weak | 1.08x | 2.60x | stable |
| **ASND** | Ascendis Pharma A/S Ordinary | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-08:30 **07:30** 1.68x | - | Thu / Fri 1.08x (1.01-1.13) | reliable / weak | 1.06x | 1.40x | stable |
| **ASST** | Strive, Inc. | 3.7 | 07:30-08:00 **07:30** 2.56x | 13:30-14:00 **13:30** 1.37x | - | Thu / Tue 1.10x (1.02-1.25) | reliable / weak | 1.08x | 1.61x | stable |
| **ASTS** | AST SpaceMobile, Inc. | 5.9 | 07:30-08:00 **07:30** 2.59x | 13:30-14:00 **13:30** 1.33x | - | Mon / Wed 1.06x (0.98-1.15) | reliable / weak | 1.11x | 2.17x | stable |
| **ATI** | ATI Inc. | 10.8 | 13:30-14:00 **13:30** 2.01x | 07:30-08:30 **07:30** 1.89x | - | Thu / Mon 1.04x (1.0-1.11) | reliable / weak | 1.08x | 2.15x | shifted |
| **AU** | AngloGold Ashanti plc | 10.8 | 07:30-08:00 **07:30** 2.49x | 13:30-14:00 **13:30** 1.71x | - | Thu / Mon 1.09x (1.04-1.14) | reliable / reliable | 1.13x | 3.26x | stable |
| **AVAV** | AeroVironment, Inc. | 10.8 | 07:30-08:00 **07:30** 2.12x | 13:30-14:00 **13:30** 2.03x | - | Thu / Fri 1.04x (0.99-1.09) | reliable / weak | 1.08x | 1.74x | stable |
| **AVT** | Avnet, Inc. | 10.8 | 13:30-14:00 **13:30** 2.21x | 07:30-08:30 **07:30** 1.78x | - | Wed / Fri 1.04x (0.99-1.08) | reliable / weak | 1.12x | 2.06x | stable |
| **AVTR** | Avantor, Inc. | 7.4 | 13:30-14:00 **13:30** 2.00x | 07:30-08:30 **07:30** 1.84x | - | Wed / Mon 1.11x (1.02-1.16) | reliable / reliable | 1.19x | 1.83x | stable |
| **AXSM** | Axsome Therapeutics, Inc. | 10.8 | 07:30-08:30 **07:30** 2.09x | 13:30-14:00 **13:30** 1.85x | - | Tue / Thu 1.07x (1.01-1.11) | reliable / weak | 1.07x | 1.73x | stable |
| **AXTI** | AXT Inc | 10.8 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.77x | - | Thu / Wed 1.05x (1.0-1.1) | reliable / weak | 0.97x | 1.75x | stable |
| **BBIO** | BridgeBio Pharma, Inc. | 7.3 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.86x | - | Fri / Wed 1.05x (1.0-1.11) | reliable / weak | 1.02x | 1.80x | stable |
| **BBWI** | Bath & Body Works, Inc. | 5.2 | 13:30-14:00 **13:30** 2.11x | 07:30-08:30 **07:30** 1.95x | - | Mon / Fri 1.07x (1.02-1.19) | reliable / weak | 1.15x | 2.66x | stable |
| **BJ** | BJs Wholesale Club Holdings, | 8.3 | 13:30-14:00 **13:30** 2.10x | 07:30-08:30 **07:30** 1.78x | - | Thu / Tue 1.03x (0.98-1.09) | reliable / weak | 1.05x | 1.57x | stable |
| **BLDR** | Builders FirstSource, Inc. | 10.8 | 07:30-08:30 **07:30** 2.00x | 13:30-14:00 **13:30** 1.87x | - | Thu / Fri 1.04x (1.0-1.09) | reliable / weak | 1.15x | 2.05x | stable |
| **BMNR** | BitMine Immersion Technologi | 1.4 | 07:30-08:00 **07:30** 2.35x | 13:30-14:30 **13:30** 1.36x | - | Thu / Tue 1.18x (1.08-1.3) | reliable / reliable | 1.03x | 2.35x | stable |
| **BMRN** | BioMarin Pharmaceutical Inc. | 10.8 | 07:30-08:30 **07:30** 2.00x | 13:30-14:00 **13:30** 1.96x | - | Thu / Mon 1.06x (1.01-1.11) | weak / weak | 0.97x | 1.63x | shifted |
| **BRK.A** | Berkshire Hathaway Inc. | 10.8 | 07:30-08:00 **07:30** 3.38x | 13:30-14:00 **13:30** 1.31x | - | Mon / Fri 1.11x (1.07-1.16) | reliable / reliable | 1.07x | 2.02x | stable |
| **BRKR** | Bruker Corporation | 10.8 | 13:30-14:00 **13:30** 2.17x | 07:30-08:30 **07:30** 1.77x | - | Wed / Mon 1.07x (1.03-1.11) | reliable / weak | 1.16x | 1.65x | stable |
| **BROS** | Dutch Bros Inc. | 5.1 | 07:30-08:30 **07:30** 2.09x | 13:30-14:00 **13:30** 1.83x | - | Wed / Fri 1.09x (1.02-1.15) | reliable / weak | 1.16x | 2.46x | stable |
| **BURL** | BURLINGTON STORES, INC. | 10.8 | 13:30-14:00 **13:30** 1.99x | 07:30-08:30 **07:30** 1.91x | - | Thu / Tue 1.05x (1.01-1.09) | weak / reliable | 1.03x | 1.65x | shifted |
| **BWA** | BorgWarner Inc. | 10.8 | 13:30-14:00 **13:30** 2.00x | 07:30-08:30 **07:30** 1.97x | - | Thu / Mon 1.12x (1.08-1.17) | reliable / weak | 1.02x | 1.97x | shifted |
| **BWXT** | BWX Technologies, Inc. | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-09:00 **07:30** 1.66x | - | Thu / Fri 1.06x (1.02-1.1) | reliable / weak | 0.98x | 1.84x | stable |
| **CACI** | CACI INTERNATIONAL CLA | 10.8 | 13:30-14:00 **13:30** 2.60x | 07:30-09:00 **07:30** 1.52x | - | Wed / Fri 1.03x (0.96-1.07) | reliable / weak | 1.14x | 1.71x | stable |
| **CAG** | Conagra Brands, Inc. | 10.8 | 13:30-14:00 **13:30** 2.00x | 07:30-08:30 **07:30** 1.95x | - | Wed / Fri 1.06x (1.01-1.1) | reliable / weak | 1.05x | 1.50x | shifted |
| **CAKE** | Cheesecake Factory Incorpora | 10.8 | 07:30-08:30 **07:30** 2.02x | 13:30-14:00 **13:30** 1.96x | - | Thu / Wed 1.03x (0.97-1.08) | reliable / weak | 1.03x | 1.98x | stable |
| **CART** | Maplebear Inc. | 7.3 | 13:30-14:00 **13:30** 2.22x | 07:30-08:00 **07:30** 2.05x | - | Thu / Fri 1.17x (1.06-1.28) | weak / reliable | 1.04x | 1.68x | stable |
| **CAVA** | CAVA Group, Inc. | 3.4 | 07:30-08:30 **07:30** 2.16x | 13:30-14:00 **13:30** 1.84x | - | Mon / Fri 1.10x (1.0-1.19) | reliable / weak | 1.13x | 1.98x | stable |
| **CBRS** | Cerebras Systems Inc. | 0.5 | 07:30-08:00 **07:30** 2.94x | 13:30-14:00 **13:30** 1.49x | - | Fri / Thu 1.13x (0.84-1.4) | reliable / weak | - | - | stable |
| **CCC** | CCC Intelligent Solutions Ho | 6.1 | 13:30-14:00 **13:30** 2.25x | 07:30-08:30 **07:30** 1.78x | - | Mon / Tue 1.07x (0.98-1.14) | reliable / weak | 1.21x | 2.31x | stable |
| **CDE** | Coeur Mining, Inc. | 10.8 | 07:30-08:00 **07:30** 2.50x | 13:30-14:00 **13:30** 1.48x | - | Thu / Mon 1.07x (1.02-1.1) | reliable / weak | 1.09x | 2.76x | stable |
| **CELC** | Celcuity Inc. | 9.1 | 13:30-14:00 **13:30** 2.71x | 07:30-08:30 **07:30** 1.75x | - | Thu / Tue 1.01x (0.95-1.09) | reliable / weak | 1.03x | 1.42x | stable |
| **CELH** | Celsius Holdings, Inc. | 9.4 | 07:30-08:00 **07:30** 2.36x | 13:30-14:00 **13:30** 1.74x | - | Mon / Fri 1.05x (0.99-1.12) | reliable / weak | 1.12x | 1.59x | stable |
| **CG** | The Carlyle Group Inc. | 10.8 | 13:30-14:00 **13:30** 2.01x | 07:30-08:30 **07:30** 1.98x | - | Thu / Fri 1.08x (1.03-1.14) | reliable / weak | 1.20x | 2.03x | shifted |
| **CHWY** | Chewy, Inc. | 7.4 | 07:30-08:30 **07:30** 2.28x | 13:30-14:00 **13:30** 1.74x | - | Mon / Fri 1.02x (0.96-1.08) | reliable / weak | 1.02x | 1.74x | stable |
| **CIFR** | Cipher Digital Inc. | 5.9 | 07:30-08:00 **07:30** 2.40x | 13:30-14:00 **13:30** 1.42x | - | Mon / Tue 1.06x (1.0-1.14) | reliable / weak | 1.19x | 2.30x | stable |
| **CLF** | Cleveland-Cliffs Inc. | 10.8 | 07:30-08:00 **07:30** 2.39x | 13:30-14:00 **13:30** 1.52x | - | Wed / Mon 1.07x (1.02-1.12) | reliable / reliable | 1.09x | 2.00x | stable |
| **CLH** | Clean Harbors, Inc | 10.8 | 13:30-14:00 **13:30** 2.43x | 07:30-09:00 **07:30** 1.62x | - | Wed / Fri 1.08x (1.03-1.12) | reliable / reliable | 1.10x | 1.98x | stable |
| **CLSK** | CleanSpark, Inc. | 6.7 | 07:30-08:00 **07:30** 2.57x | 13:00-14:00 **13:30** 1.18x | - | Mon / Wed 1.03x (0.97-1.1) | reliable / weak | 1.04x | 2.13x | stable |
| **CNH** | CNH INDUSTRIAL N.V. | 10.8 | 07:30-08:30 **07:30** 2.12x | 13:30-14:00 **13:30** 1.81x | - | Thu / Mon 1.09x (1.05-1.13) | reliable / weak | 1.12x | 2.11x | stable |
| **COMP** | Compass, Inc. | 5.6 | 07:30-08:30 **07:30** 2.02x | 13:30-14:00 **13:30** 1.83x | - | Thu / Fri 1.07x (1.03-1.14) | reliable / weak | 1.06x | 3.17x | stable |
| **CORZ** | Core Scientific, Inc. | 5.3 | 07:30-08:30 **07:30** 2.17x | 13:30-14:00 **13:30** 1.61x | - | Thu / Wed 1.09x (1.01-1.14) | reliable / weak | 1.05x | 2.17x | stable |
| **CPB** | The Campbell's Company | 10.8 | 13:30-14:00 **13:30** 2.04x | 07:30-08:30 **07:30** 2.02x | - | Wed / Mon 1.04x (1.0-1.09) | reliable / weak | 1.07x | 1.58x | shifted |
| **CPNG** | Coupang, Inc. | 5.6 | 07:30-08:00 **07:30** 2.33x | 13:30-14:00 **13:30** 1.83x | - | Thu / Fri 1.05x (0.97-1.14) | reliable / weak | 1.04x | 2.25x | stable |
| **CRBG** | Corebridge Financial, Inc. | 4.1 | 13:30-14:00 **13:30** 2.28x | 07:30-09:00 **07:30** 1.74x | - | Wed / Mon 1.07x (1.01-1.17) | reliable / weak | 1.00x | 2.50x | stable |
| **CRCL** | Circle Internet Group, Inc. | 1.4 | 07:30-08:00 **07:30** 3.05x | 13:30-14:30 **13:30** 1.34x | - | Fri / Tue 1.12x (0.94-1.25) | reliable / weak | 1.16x | 2.69x | stable |
| **CRDO** | Credo Technology Group Holdi | 4.8 | 07:30-08:00 **07:30** 2.46x | 13:30-14:00 **13:30** 1.78x | - | Thu / Fri 1.09x (1.01-1.18) | reliable / reliable | 1.12x | 2.62x | stable |
| **CROX** | Crocs, Inc. | 10.8 | 07:30-08:00 **07:30** 2.19x | 13:30-14:00 **13:30** 1.88x | - | Mon / Thu 1.05x (1.0-1.08) | reliable / weak | 0.98x | 1.83x | stable |
| **CRS** | Carpenter Technology Corp | 10.8 | 13:30-14:00 **13:30** 2.17x | 07:30-08:30 **07:30** 1.81x | - | Thu / Mon 1.03x (0.99-1.07) | reliable / weak | 1.07x | 2.14x | stable |
| **CSL** | Carlisle Companies, Inc. | 10.8 | 13:30-14:00 **13:30** 2.28x | 07:30-09:00 **07:30** 1.57x | - | Thu / Mon 1.04x (0.99-1.08) | reliable / weak | 0.98x | 2.18x | stable |
| **CTVA** | Corteva, Inc. | 7.4 | 13:30-14:00 **13:30** 2.14x | 07:30-08:30 **07:30** 1.98x | - | Thu / Tue 1.05x (1.0-1.1) | reliable / weak | 1.09x | 1.91x | shifted |
| **CW** | Curtiss-Wright Corp. | 10.8 | 13:30-14:00 **13:30** 2.52x | 07:30-09:00 **07:30** 1.57x | - | Thu / Fri 1.06x (1.0-1.12) | reliable / weak | 1.05x | 1.79x | stable |
| **CYTK** | Cytokinetics, Incorporated | 10.8 | 13:30-14:00 **13:30** 2.10x | 07:30-08:30 **07:30** 1.85x | - | Mon / Thu 1.06x (1.01-1.12) | reliable / reliable | 1.11x | 1.54x | stable |
| **CZR** | Caesars Entertainment, Inc. | 10.8 | 07:30-08:30 **07:30** 1.96x | 13:30-14:00 **13:30** 1.87x | - | Fri / Mon 1.03x (0.98-1.07) | reliable / weak | 1.18x | 1.90x | shifted |
| **DAR** | DARLING INGREDIENTS INC. | 10.8 | 13:30-14:00 **13:30** 2.11x | 07:30-08:30 **07:30** 1.75x | - | Wed / Mon 1.06x (1.01-1.11) | reliable / weak | 1.09x | 1.87x | stable |
| **DHT** | DHT HOLDINGS, INC. | 10.8 | 07:30-08:00 **07:30** 2.39x | 13:30-14:00 **13:30** 1.84x | - | Wed / Mon 1.03x (0.98-1.07) | reliable / weak | 1.12x | 1.50x | stable |
| **DINO** | HF Sinclair Corporation | 10.8 | 07:30-08:30 **07:30** 1.92x | 13:30-14:00 **13:30** 1.88x | - | Wed / Fri 1.10x (1.06-1.14) | reliable / reliable | 1.14x | 1.66x | shifted |
| **DK** | Delek US Holdings, Inc. | 10.8 | 13:30-14:00 **13:30** 1.97x | 07:30-08:30 **07:30** 1.83x | - | Wed / Fri 1.09x (1.05-1.15) | reliable / reliable | 1.16x | 1.78x | shifted |
| **DKNG** | DraftKings Inc. | 6.9 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.50x | - | Fri / Mon 1.05x (0.98-1.1) | reliable / weak | 1.24x | 2.11x | stable |
| **DKS** | Dick's Sporting Goods, Inc. | 10.8 | 07:30-08:30 **07:30** 2.02x | 13:30-14:00 **13:30** 1.94x | - | Mon / Fri 1.03x (0.99-1.08) | reliable / weak | 1.01x | 1.49x | shifted |
| **DOCN** | DigitalOcean Holdings, Inc. | 5.6 | 07:30-08:30 **07:30** 2.10x | 13:30-14:00 **13:30** 1.95x | - | Wed / Tue 1.06x (0.98-1.11) | reliable / weak | 1.21x | 3.14x | stable |
| **DOCU** | DocuSign, Inc. | 8.5 | 07:30-08:00 **07:30** 2.40x | 13:30-14:00 **13:30** 1.70x | - | Thu / Fri 1.06x (1.02-1.1) | reliable / reliable | 1.25x | 1.92x | stable |
| **DT** | Dynatrace, Inc. | 7.2 | 07:30-08:30 **07:30** 1.99x | 13:30-14:00 **13:30** 1.95x | - | Thu / Mon 1.07x (1.0-1.11) | reliable / weak | 1.21x | 2.15x | stable |
| **DUOL** | Duolingo, Inc. | 5.3 | 07:30-08:00 **07:30** 2.22x | 13:30-14:00 **13:30** 1.91x | - | Mon / Fri 1.06x (0.98-1.15) | reliable / weak | 1.13x | 2.26x | stable |
| **DY** | Dycom Industries, Inc. | 10.8 | 13:30-14:00 **13:30** 2.19x | 07:30-09:00 **07:30** 1.68x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 1.13x | 1.82x | stable |
| **EAT** | Brinker International, Inc. | 10.8 | 13:30-14:00 **13:30** 1.97x | 07:30-08:30 **07:30** 1.92x | - | Mon / Fri 1.06x (1.02-1.1) | weak / weak | 1.00x | 1.92x | shifted |
| **EHC** | Encompass Health Corporation | 10.8 | 13:30-14:00 **13:30** 2.30x | 07:30-09:00 **07:30** 1.58x | - | Wed / Mon 1.05x (1.0-1.1) | reliable / weak | 1.04x | 1.61x | stable |
| **ELF** | e.l.f. Beauty, Inc. | 10.1 | 13:30-14:00 **13:30** 1.99x | 07:30-08:30 **07:30** 1.96x | - | Tue / Thu 1.04x (0.99-1.1) | reliable / weak | 1.03x | 1.75x | shifted |
| **ELS** | Equity Lifestyle Properties, | 10.8 | 13:30-14:00 **13:30** 2.36x | 07:30-08:30 **07:30** 1.67x | - | Thu / Fri 1.05x (1.01-1.09) | reliable / weak | 1.07x | 1.80x | stable |
| **ENPH** | Enphase Energy, Inc. | 10.8 | 07:30-08:00 **07:30** 2.60x | 13:30-14:00 **13:30** 1.44x | - | Wed / Fri 1.04x (0.99-1.09) | reliable / weak | 1.09x | 1.85x | stable |
| **ENTG** | Entegris, Inc. | 10.8 | 13:30-14:00 **13:30** 2.14x | 07:30-08:30 **07:30** 1.92x | - | Thu / Mon 1.07x (1.02-1.11) | reliable / weak | 1.04x | 2.14x | stable |
| **EPAM** | EPAM SYSTEMS, INC. | 10.8 | 13:30-14:00 **13:30** 2.07x | 07:30-08:30 **07:30** 1.85x | - | Thu / Mon 1.07x (1.03-1.12) | reliable / weak | 1.15x | 1.87x | stable |
| **EPD** | Enterprise Products Partners | 10.8 | 07:30-08:30 **07:30** 1.93x | 13:30-14:00 **13:30** 1.76x | - | Mon / Fri 1.05x (1.02-1.09) | reliable / weak | 1.03x | 1.60x | stable |
| **EQH** | Equitable Holdings, Inc. | 8.5 | 13:30-14:00 **13:30** 2.15x | 07:30-08:30 **07:30** 1.82x | - | Thu / Mon 1.10x (1.06-1.15) | reliable / weak | 1.12x | 2.29x | stable |
| **ESI** | Element Solutions Inc. | 10.8 | 13:30-14:00 **13:30** 2.16x | 07:30-09:00 **07:30** 1.70x | - | Thu / Fri 1.08x (1.04-1.13) | reliable / weak | 1.08x | 1.88x | stable |
| **ESTC** | Elastic N.V. | 8.1 | 07:30-08:30 **07:30** 2.04x | 13:30-14:00 **13:30** 1.98x | - | Thu / Tue 1.08x (1.0-1.13) | weak / reliable | 1.25x | 2.01x | stable |
| **ET** | Energy Transfer LP | 10.8 | 07:30-08:30 **07:30** 2.01x | 13:30-14:00 **13:30** 1.59x | - | Wed / Fri 1.04x (0.99-1.1) | reliable / weak | 1.09x | 1.65x | stable |
| **ETSY** | Etsy, Inc. | 10.8 | 07:30-08:00 **07:30** 2.31x | 13:30-14:00 **13:30** 1.74x | - | Thu / Fri 1.06x (1.0-1.11) | reliable / weak | 1.25x | 1.92x | stable |
| **EVR** | Evercore Inc. | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-08:30 **07:30** 1.69x | - | Wed / Fri 1.06x (1.01-1.11) | reliable / weak | 1.17x | 1.95x | stable |
| **EXEL** | Exelixis, Inc. | 10.8 | 07:30-08:00 **07:30** 2.07x | 13:30-14:00 **13:30** 2.00x | - | Tue / Fri 1.04x (0.99-1.08) | weak / weak | 1.08x | 1.49x | shifted |
| **FCNCA** | First Citizens BancShares, I | 10.8 | 13:30-14:00 **13:30** 3.13x | 07:30-08:30 **07:30** 1.78x | - | Wed / Fri 1.04x (0.99-1.08) | reliable / weak | 0.92x | 2.56x | stable |
| **FHN** | First Horizon Corporation | 10.8 | 13:30-14:00 **13:30** 1.98x | 07:30-08:30 **07:30** 1.91x | - | Wed / Mon 1.09x (1.05-1.14) | reliable / reliable | 1.03x | 2.09x | stable |
| **FIG** | Figma, Inc. | 1.2 | 07:30-08:00 **07:30** 2.81x | 13:30-14:00 **13:30** 1.58x | - | Thu / Mon 1.20x (1.0-1.42) | reliable / weak | 1.30x | 1.93x | stable |
| **FIGR** | Figure Technology Solutions, | 1.1 | 07:30-08:00 **07:30** 2.39x | 13:30-14:00 **13:30** 1.73x | - | Thu / Tue 1.10x (1.01-1.28) | reliable / weak | 0.80x | 2.14x | stable |
| **FIVE** | Five Below, Inc. | 10.8 | 07:30-08:30 **07:30** 1.95x | 13:30-14:00 **13:30** 1.94x | - | Mon / Wed 1.06x (1.02-1.12) | weak / weak | 1.17x | 1.55x | shifted |
| **FN** | Fabrinet | 10.8 | 13:30-14:00 **13:30** 2.17x | 07:30-08:30 **07:30** 1.81x | - | Wed / Mon 1.04x (1.0-1.08) | reliable / weak | 1.08x | 1.89x | shifted |
| **FND** | Floor & Decor Holdings, Inc. | 9.5 | 13:30-14:00 **13:30** 2.02x | 07:30-09:00 **07:30** 1.77x | - | Thu / Fri 1.05x (0.99-1.12) | reliable / weak | 1.14x | 1.98x | stable |
| **FORM** | FormFactor, Inc. FormFactor, | 10.8 | 13:30-14:00 **13:30** 2.07x | 07:30-08:00 **07:30** 2.05x | - | Wed / Tue 1.03x (0.99-1.08) | reliable / weak | 1.08x | 1.91x | shifted |
| **FPS** | Forgent Power Solutions, Inc | 0.7 | 07:30-08:00 **07:30** 2.28x | 13:30-14:00 **13:30** 1.77x | - | Thu / Tue 1.23x (0.95-1.39) | reliable / weak | 1.28x | 2.34x | stable |
| **FRO** | Frontline Plc | 10.8 | 07:30-08:00 **07:30** 2.67x | 13:30-14:00 **13:30** 1.71x | - | Wed / Fri 1.05x (1.01-1.1) | reliable / weak | 1.06x | 1.55x | stable |
| **FROG** | JFrog Ltd. | 6.1 | 07:30-08:30 **07:30** 2.01x | 13:30-14:00 **13:30** 1.94x | - | Thu / Tue 1.04x (0.98-1.12) | reliable / weak | 1.21x | 2.11x | stable |
| **FSLY** | Fastly, Inc. | 7.4 | 07:30-08:00 **07:30** 2.42x | 13:30-14:00 **13:30** 1.70x | - | Mon / Fri 1.02x (0.95-1.08) | reliable / weak | 1.12x | 2.29x | stable |
| **FTAI** | FTAI Aviation Ltd. | 10.8 | 13:30-14:00 **13:30** 2.03x | 07:30-08:30 **07:30** 1.70x | - | Thu / Tue 1.08x (1.0-1.15) | reliable / weak | 1.02x | 1.61x | stable |
| **FTI** | TechnipFMC plc Ordinary Shar | 9.8 | 07:30-08:30 **07:30** 1.96x | 13:30-14:00 **13:30** 1.87x | - | Wed / Mon 1.10x (1.05-1.15) | reliable / reliable | 1.16x | 1.87x | stable |
| **FUTU** | Futu Holdings Limited | 7.6 | 07:30-08:00 **07:30** 3.49x | 13:30-14:00 **13:30** 1.36x | - | Thu / Wed 1.04x (0.97-1.12) | reliable / weak | 1.13x | 1.90x | stable |
| **FWONK** | Liberty Media Corporation Se | 10.5 | 13:30-14:00 **13:30** 2.18x | 07:30-08:30 **07:30** 1.64x | - | Thu / Fri 1.03x (0.97-1.07) | reliable / weak | 1.21x | 1.57x | stable |
| **GAP** | The Gap, Inc. | 10.8 | 07:30-08:30 **07:30** 2.20x | 13:30-14:00 **13:30** 1.80x | - | Mon / Fri 1.05x (1.01-1.1) | reliable / reliable | 1.03x | 1.65x | stable |
| **GFS** | GlobalFoundries Inc. | 5.0 | 07:30-08:30 **07:30** 2.12x | 13:30-14:00 **13:30** 1.99x | - | Thu / Wed 1.09x (1.03-1.13) | reliable / reliable | 1.00x | 3.12x | stable |
| **GGG** | Graco Inc | 10.8 | 13:30-14:00 **13:30** 2.37x | 07:30-09:00 **07:30** 1.64x | - | Thu / Mon 1.06x (1.02-1.11) | reliable / weak | 1.01x | 2.02x | stable |
| **GH** | Guardant Health, Inc. | 8.1 | 07:30-08:30 **07:30** 2.05x | 13:30-14:00 **13:30** 1.84x | - | Mon / Wed 1.04x (0.99-1.09) | reliable / weak | 1.20x | 2.12x | stable |
| **GKOS** | Glaukos Corporation | 10.8 | 13:30-14:00 **13:30** 2.23x | 07:30-09:00 **07:30** 1.58x | - | Wed / Fri 1.05x (0.99-1.1) | reliable / weak | 1.17x | 1.75x | stable |
| **GLXY** | Galaxy Digital Inc. | 1.5 | 07:30-08:00 **07:30** 2.34x | 13:30-14:30 **13:30** 1.53x | - | Wed / Mon 1.11x (0.93-1.2) | reliable / weak | 1.03x | 2.43x | stable |
| **GME** | GameStop Corp. Class A | 10.8 | 07:30-08:00 **07:30** 2.18x | 13:30-14:00 **13:30** 1.56x | - | Mon / Fri 1.08x (1.02-1.13) | reliable / weak | 1.03x | 1.47x | stable |
| **GRAL** | GRAIL, Inc. | 2.4 | 07:30-08:30 **07:30** 2.19x | 13:30-14:00 **13:30** 1.82x | - | Wed / Mon 1.10x (0.96-1.22) | reliable / weak | 1.02x | 1.96x | stable |
| **GTLB** | GitLab Inc. | 5.0 | 07:30-08:00 **07:30** 2.26x | 13:30-14:00 **13:30** 1.78x | - | Thu / Mon 1.06x (0.98-1.13) | reliable / weak | 1.18x | 2.34x | stable |
| **GWRE** | GUIDEWIRE SOFTWARE, INC. | 10.8 | 13:30-14:00 **13:30** 2.16x | 07:30-09:00 **07:30** 1.68x | - | Wed / Mon 1.02x (0.98-1.07) | reliable / weak | 1.26x | 1.75x | stable |
| **H** | Hyatt Hotels Corporation | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-09:00 **07:30** 1.71x | - | Thu / Fri 1.09x (1.05-1.14) | reliable / weak | 1.07x | 2.06x | stable |
| **HALO** | Halozyme Therapeutics, Inc. | 10.8 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.94x | - | Wed / Mon 1.04x (0.99-1.09) | reliable / weak | 1.03x | 1.72x | shifted |
| **HEI** | HEICO Corporation | 10.8 | 13:30-14:00 **13:30** 2.37x | 07:30-08:30 **07:30** 1.67x | - | Thu / Fri 1.06x (1.02-1.1) | reliable / weak | 0.98x | 1.84x | stable |
| **HIMS** | Hims & Hers Health, Inc. | 6.2 | 07:30-08:00 **07:30** 2.46x | 13:30-14:00 **13:30** 1.53x | - | Thu / Fri 1.03x (0.99-1.11) | reliable / weak | 1.04x | 2.34x | stable |
| **HL** | Hecla Mining Company | 10.8 | 07:30-08:00 **07:30** 2.43x | 13:30-14:00 **13:30** 1.44x | - | Tue / Mon 1.05x (1.01-1.09) | reliable / weak | 1.05x | 2.74x | stable |
| **HNGE** | Hinge Health, Inc. | 1.4 | 13:30-14:00 **13:30** 2.17x | 07:30-08:30 **07:30** 2.02x | - | Thu / Mon 1.09x (0.95-1.24) | reliable / weak | 1.08x | 1.85x | stable |
| **HUT** | Hut 8 Corp. | 5.4 | 07:30-08:00 **07:30** 2.47x | 13:00-14:00 **13:30** 1.18x | - | Thu / Wed 1.02x (0.97-1.1) | reliable / weak | 1.14x | 2.60x | stable |
| **IBRX** | ImmunityBio, Inc. | 10.8 | 07:30-08:00 **07:30** 2.15x | 13:30-14:00 **13:30** 1.59x | - | Mon / Thu 1.07x (1.01-1.12) | reliable / reliable | 1.04x | 1.49x | stable |
| **ICLR** | ICON plc | 10.8 | 13:30-14:00 **13:30** 2.02x | 07:30-08:30 **07:30** 1.99x | - | Thu / Mon 1.09x (1.04-1.15) | reliable / weak | 0.95x | 1.61x | shifted |
| **INSM** | Insmed Incorporated | 10.8 | 13:30-14:00 **13:30** 2.05x | 07:30-08:30 **07:30** 1.87x | - | Mon / Wed 1.04x (0.99-1.09) | reliable / weak | 1.07x | 1.54x | stable |
| **IONQ** | IonQ, Inc. | 5.8 | 07:30-08:00 **07:30** 2.97x | 13:30-14:00 **13:30** 1.27x | - | Thu / Tue 1.05x (0.98-1.14) | reliable / weak | 1.11x | 2.63x | stable |
| **IONS** | Ionis Pharmaceuticals, Inc. | 10.8 | 13:30-14:00 **13:30** 2.02x | 07:30-08:30 **07:30** 1.92x | - | Thu / Fri 1.04x (1.01-1.08) | weak / weak | 1.11x | 1.71x | shifted |
| **IOT** | Samsara Inc. | 4.9 | 07:30-08:30 **07:30** 2.13x | 13:30-14:00 **13:30** 1.88x | - | Wed / Mon 1.08x (1.0-1.15) | reliable / weak | 1.44x | 2.58x | stable |
| **IOVA** | Iovance Biotherapeutics, Inc | 10.8 | 07:30-08:00 **07:30** 2.10x | 13:30-14:00 **13:30** 1.78x | - | Mon / Thu 1.07x (1.02-1.12) | reliable / reliable | 1.06x | 1.47x | stable |
| **IREN** | IREN Limited | 4.9 | 07:30-08:00 **07:30** 2.75x | 13:30-14:00 **13:30** 1.31x | - | Mon / Thu 1.04x (0.95-1.13) | reliable / weak | 1.18x | 2.31x | stable |
| **JAZZ** | Jazz Pharmaceuticals plc | 10.8 | 13:30-14:00 **13:30** 2.04x | 07:30-08:30 **07:30** 1.86x | - | Thu / Fri 1.05x (1.0-1.1) | reliable / weak | 1.17x | 1.55x | shifted |
| **JHX** | James Hardie Industries plc | 10.8 | 13:30-14:00 **13:30** 2.47x | 07:30-08:00 **07:30** 1.99x | 08:30-11:00 **09:00** 1.05x | Tue / Fri 1.10x (1.03-1.17) | reliable / reliable | 1.01x | 2.38x | stable |
| **JLL** | Jones Lang LaSalle, Inc. | 10.8 | 13:30-14:00 **13:30** 2.28x | 07:30-08:30 **07:30** 1.70x | - | Wed / Mon 1.07x (1.03-1.11) | reliable / weak | 1.10x | 2.10x | stable |
| **JOBY** | Joby Aviation, Inc. | 6.0 | 07:30-08:00 **07:30** 2.53x | 13:30-14:00 **13:30** 1.48x | - | Fri / Wed 1.03x (0.97-1.09) | reliable / weak | 1.05x | 2.58x | stable |
| **KMX** | CarMax Inc. | 10.8 | 07:30-08:30 **07:30** 1.94x | 13:30-14:00 **13:30** 1.86x | - | Wed / Mon 1.12x (1.07-1.16) | reliable / weak | 1.00x | 1.91x | shifted |
| **LQDA** | Liquidia Corporation | 8.3 | 07:30-08:00 **07:30** 2.01x | 13:30-14:00 **13:30** 1.97x | - | Thu / Fri 1.05x (0.97-1.12) | reliable / weak | 1.07x | 1.71x | shifted |
| **LW** | Lamb Weston Holdings, Inc. | 10.0 | 13:30-14:00 **13:30** 2.20x | 07:30-09:00 **07:30** 1.64x | - | Wed / Fri 1.06x (1.02-1.11) | reliable / weak | 1.07x | 1.62x | stable |
| **MANH** | Manhattan Associates, Inc. | 10.8 | 13:30-14:00 **13:30** 2.17x | 07:30-08:30 **07:30** 1.69x | - | Tue / Fri 1.04x (1.01-1.09) | reliable / weak | 1.12x | 1.93x | stable |
| **MDLN** | Medline Inc. | 0.9 | 13:30-14:00 **13:30** 2.14x | 07:30-08:30 **07:30** 1.92x | - | Thu / Mon 1.32x (1.12-1.43) | reliable / weak | 1.31x | 1.70x | stable |
| **MEDP** | Medpace Holdings, Inc. | 10.2 | 13:30-14:00 **13:30** 2.14x | 07:30-08:30 **07:30** 1.77x | - | Wed / Mon 1.06x (1.0-1.12) | reliable / weak | 1.02x | 1.68x | stable |

### Real Estate (18)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **AMT** | American Tower | 10.8 | 07:30-08:00 **07:30** 2.09x | 13:30-14:00 **13:30** 1.97x | - | Thu / Mon 1.04x (1.0-1.07) | reliable / weak | 1.01x | 1.91x | stable |
| **ARE** | Alexandria Real Estate Equit | 10.8 | 13:30-14:00 **13:30** 2.25x | 07:30-08:30 **07:30** 1.73x | - | Tue / Mon 1.04x (0.99-1.08) | reliable / weak | 1.09x | 1.99x | stable |
| **BEKE** | KE Holdings | 6.2 | 07:30-08:00 **07:30** 3.25x | 13:30-14:00 **13:30** 1.82x | - | Tue / Mon 1.05x (0.99-1.12) | reliable / weak | 0.97x | 2.40x | stable |
| **BXP** | BXP, Inc. | 10.8 | 13:30-14:00 **13:30** 2.22x | 07:30-08:30 **07:30** 1.80x | - | Wed / Mon 1.09x (1.03-1.13) | reliable / reliable | 1.12x | 2.31x | stable |
| **CBRE** | CBRE Group | 10.8 | 13:30-14:00 **13:30** 2.13x | 07:30-08:30 **07:30** 1.84x | - | Thu / Mon 1.05x (1.02-1.1) | reliable / reliable | 1.07x | 2.07x | stable |
| **CCI** | Crown Castle | 10.8 | 13:30-14:00 **13:30** 1.98x | 07:30-08:30 **07:30** 1.92x | - | Thu / Fri 1.05x (1.0-1.08) | reliable / weak | 1.01x | 1.89x | stable |
| **CIGI** | Colliers International Group | 10.8 | 13:30-14:00 **13:30** 2.31x | 07:30-08:30 **07:30** 1.84x | - | Thu / Tue 1.05x (0.96-1.1) | reliable / weak | 1.09x | 2.00x | stable |
| **CPT** | Camden Property Trust | 10.8 | 13:30-14:00 **13:30** 2.38x | 07:30-08:30 **07:30** 1.67x | - | Wed / Tue 1.02x (0.97-1.06) | reliable / weak | 1.20x | 1.78x | stable |
| **CSGP** | CoStar Group | 10.8 | 13:30-14:00 **13:30** 2.05x | 07:30-08:30 **07:30** 1.78x | - | Thu / Mon 1.07x (1.02-1.13) | reliable / weak | 1.04x | 2.04x | stable |
| **DLR** | Digital Realty | 10.8 | 13:30-14:00 **13:30** 2.05x | 07:30-08:30 **07:30** 1.89x | - | Thu / Mon 1.06x (1.01-1.12) | reliable / reliable | 1.13x | 1.87x | stable |
| **DOC** | Healthpeak Properties | 10.8 | 13:30-14:00 **13:30** 2.08x | 07:30-08:30 **07:30** 1.88x | - | Wed / Mon 1.06x (1.03-1.1) | reliable / weak | 1.14x | 2.11x | shifted |
| **EQIX** | Equinix | 10.8 | 13:30-14:00 **13:30** 2.12x | 07:30-08:00 **07:30** 2.04x | - | Thu / Mon 1.05x (1.01-1.11) | reliable / reliable | 1.07x | 1.69x | shifted |
| **ESS** | Essex Property Trust | 10.8 | 13:30-14:00 **13:30** 2.45x | 07:30-08:30 **07:30** 1.74x | - | Wed / Tue 1.06x (1.02-1.1) | reliable / weak | 1.10x | 1.92x | stable |
| **EXR** | Extra Space Storage | 10.8 | 13:30-14:00 **13:30** 2.29x | 07:30-08:30 **07:30** 1.83x | - | Wed / Thu 1.03x (0.99-1.07) | reliable / weak | 1.01x | 2.07x | stable |
| **FRT** | Federal Realty Investment Tr | 10.8 | 13:30-14:00 **13:30** 2.42x | 07:30-08:30 **07:30** 1.79x | - | Wed / Mon 1.02x (0.98-1.07) | reliable / weak | 1.14x | 2.03x | stable |
| **FSV** | FirstService Corporation | 10.8 | 13:30-14:00 **13:30** 2.43x | 07:30-08:30 **07:30** 1.82x | - | Fri / Tue 1.07x (1.0-1.13) | reliable / weak | 1.03x | 1.98x | stable |
| **INVH** | Invitation Homes | 9.7 | 13:30-14:00 **13:30** 2.25x | 07:30-08:30 **07:30** 1.79x | - | Thu / Mon 1.05x (1.01-1.09) | reliable / weak | 1.07x | 1.84x | stable |
| **IRM** | Iron Mountain | 10.8 | 13:30-14:00 **13:30** 2.14x | 07:30-08:30 **07:30** 1.90x | - | Wed / Mon 1.05x (1.02-1.1) | reliable / reliable | 1.11x | 1.90x | stable |

### Utilities (23)

| Symbol | Name | Years | Best 1 | Best 2 | Best 3 | Best / quiet day | Reliability (times / days) | NFP | FOMC | Era |
|---|---|---|---|---|---|---|---|---|---|---|
| **AEE** | Ameren | 10.8 | 13:30-14:00 **13:30** 2.39x | 07:30-08:30 **07:30** 1.77x | - | Thu / Mon 1.05x (1.02-1.11) | reliable / weak | 1.00x | 1.94x | stable |
| **AEP** | American Electric Power | 10.8 | 13:30-14:00 **13:30** 2.09x | 07:30-08:30 **07:30** 2.01x | - | Thu / Tue 1.05x (1.01-1.09) | reliable / reliable | 1.07x | 1.92x | shifted |
| **AES** | AES Corporation | 10.8 | 13:30-14:00 **13:30** 2.05x | 07:30-08:30 **07:30** 1.85x | - | Thu / Mon 1.08x (1.04-1.12) | reliable / weak | 1.25x | 1.83x | stable |
| **AQN** | Algonquin Power & Utilities  | 9.9 | 07:30-08:00 **07:30** 1.94x | 13:30-14:00 **13:30** 1.78x | - | Thu / Tue 1.05x (1.0-1.09) | reliable / weak | 0.99x | 1.99x | stable |
| **ATO** | Atmos Energy | 10.8 | 13:30-14:00 **13:30** 2.47x | 07:30-08:30 **07:30** 1.80x | - | Wed / Mon 1.07x (1.02-1.12) | reliable / weak | 1.06x | 1.86x | stable |
| **AWK** | American Water Works | 10.8 | 13:30-14:00 **13:30** 2.18x | 07:30-08:00 **07:30** 2.06x | - | Thu / Mon 1.07x (1.02-1.11) | reliable / reliable | 1.06x | 1.86x | shifted |
| **BIP** | Brookfield Infrastructure Pa | 10.8 | 07:30-08:00 **07:30** 1.91x | 13:30-14:00 **13:30** 1.87x | - | Thu / Fri 1.07x (1.02-1.12) | weak / reliable | 1.11x | 1.84x | shifted |
| **CEG** | Constellation Energy | 4.7 | 07:30-08:00 **07:30** 2.26x | 13:30-14:00 **13:30** 1.83x | - | Thu / Tue 1.08x (1.01-1.16) | reliable / weak | 1.20x | 2.30x | stable |
| **CMS** | CMS Energy | 10.8 | 13:30-14:00 **13:30** 2.26x | 07:30-08:30 **07:30** 1.89x | - | Thu / Mon 1.07x (1.03-1.1) | reliable / weak | 1.09x | 1.80x | shifted |
| **CNP** | CenterPoint Energy | 10.8 | 13:30-14:00 **13:30** 2.21x | 07:30-08:30 **07:30** 1.91x | - | Thu / Mon 1.10x (1.06-1.15) | reliable / reliable | 1.12x | 1.73x | stable |
| **D** | Dominion Energy | 10.8 | 13:30-14:00 **13:30** 2.05x | 07:30-08:30 **07:30** 1.95x | - | Thu / Mon 1.06x (1.02-1.09) | reliable / reliable | 1.13x | 1.84x | shifted |
| **DTE** | DTE Energy | 10.8 | 13:30-14:00 **13:30** 2.40x | 07:30-08:30 **07:30** 1.76x | - | Thu / Mon 1.06x (1.01-1.11) | reliable / reliable | 1.05x | 1.97x | stable |
| **DUK** | Duke Energy | 10.8 | 13:30-14:00 **13:30** 2.05x | 07:30-08:30 **07:30** 2.02x | - | Thu / Mon 1.08x (1.04-1.11) | reliable / reliable | 1.06x | 1.87x | shifted |
| **ED** | Consolidated Edison | 10.8 | 13:30-14:00 **13:30** 2.24x | 07:30-08:30 **07:30** 1.95x | - | Fri / Mon 1.04x (1.0-1.09) | reliable / weak | 1.13x | 1.83x | stable |
| **EIX** | Edison International | 10.8 | 13:30-14:00 **13:30** 2.16x | 07:30-08:30 **07:30** 1.86x | - | Wed / Mon 1.08x (1.03-1.14) | reliable / weak | 1.01x | 1.89x | stable |
| **EMA** | Emera Incorporated | 1.4 | 13:30-14:00 **13:30** 3.18x | 07:30-08:00 **07:30** 1.92x | - | Thu / Mon 1.12x (1.0-1.18) | reliable / reliable | 1.09x | 1.58x | stable |
| **ES** | Eversource Energy | 10.8 | 13:30-14:00 **13:30** 2.23x | 07:30-08:30 **07:30** 1.86x | - | Thu / Mon 1.06x (1.03-1.09) | reliable / weak | 1.19x | 1.84x | stable |
| **ETR** | Entergy | 10.8 | 13:30-14:00 **13:30** 2.26x | 07:30-08:30 **07:30** 1.81x | - | Thu / Mon 1.06x (1.02-1.1) | reliable / weak | 1.08x | 1.88x | stable |
| **EVRG** | Evergy | 8.4 | 13:30-14:00 **13:30** 2.41x | 07:30-08:30 **07:30** 1.77x | - | Thu / Mon 1.03x (0.97-1.08) | reliable / weak | 1.04x | 1.61x | stable |
| **EXC** | Exelon | 10.8 | 13:30-14:00 **13:30** 2.17x | 07:30-08:00 **07:30** 2.11x | - | Thu / Mon 1.08x (1.04-1.11) | reliable / weak | 1.14x | 1.90x | shifted |
| **FE** | FirstEnergy | 10.8 | 13:30-14:00 **13:30** 2.19x | 07:30-08:30 **07:30** 1.85x | - | Wed / Mon 1.05x (1.0-1.11) | reliable / weak | 1.09x | 1.91x | stable |
| **FTS** | Fortis Inc. | 10.0 | 13:30-14:00 **13:30** 2.33x | 07:30-08:00 **07:30** 2.18x | - | Wed / Mon 1.08x (1.04-1.12) | reliable / reliable | 1.00x | 2.00x | shifted |
| **KEP** | Korea Electric Power | 10.8 | 07:30-08:00 **07:30** 2.40x | 13:30-14:00 **13:30** 2.36x | 08:30-11:00 **09:00** 1.01x | Tue / Fri 1.05x (1.0-1.1) | reliable / weak | 0.92x | 2.50x | shifted |
