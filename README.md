# GreenThread

GreenThread is an intelligent wastewater monitoring and compliance platform designed for textile manufacturing facilities. It provides real-time sensor monitoring, AI-powered analytics, and automated compliance reporting to help facilities meet wastewater discharge standards.

## Core Features

- **Real-Time Sensor Monitoring** - Track water quality parameters including pH, dissolved oxygen, turbidity, conductivity, and flow rate with live gauges and visualizations
- **Compliance Dashboard** - Monitor regulatory compliance status with instant alerts for threshold violations
- **Historical Data Analysis** - Analyze trends over 7, 30, or 90-day periods with statistical summaries and interactive charts
- **AI Explain** - AI-powered causal factor analysis that identifies root causes of sensor parameter changes
- **AI Plan** - Automated generation of corrective action recommendations with detailed implementation steps
- **Security & Audit Trail** - Enterprise-grade security with encryption and immutable audit logs

## Key Features Detail

### Real-Time Monitoring
- Live sensor gauges with compliance status indicators
- Automated alerts for parameter violations
- 30-second auto-refresh for current readings
- Visual status dashboard with color-coded warnings

### Water Quality Parameters
Monitor all critical wastewater quality indicators:
- **pH Level** (6.5 - 8.5 range)
- **Dissolved Oxygen** (5 - 8 mg/L)
- **Turbidity** (≤ 50 NTU)
- **Conductivity** (≤ 2500 µS/cm)
- **Flow Rate** (≤ 90 m³/h)

### Historical Analytics
- Trend analysis over 7, 30, or 90-day periods
- Statistical summaries (min, max, average values)
- Multi-parameter correlation charts
- Export functionality for compliance reporting

### AI-Powered Insights
- **AI Explain**: Identifies causal factors for parameter changes (e.g., coagulant efficiency, settling tank retention time, fiber content)
- **AI Plan**: Generates actionable recommendations with step-by-step implementation guides
- Priority-based recommendation system (critical, high, medium, low)
- Expected impact forecasting

### Compliance Management
- Standard compliance tracking
- Real-time violation alerts with cost impact calculation
- Compliance rate monitoring
- Automated reporting capabilities

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with React 19
- **Runtime**: [Bun](https://bun.sh/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query](https://tanstack.com/query)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)


## Getting Started

### Prerequisites

1. **Node.js** (v20 or later recommended)
2. **Bun** - Install from [bun.sh](https://bun.sh/)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
3. **Docker Desktop** - Required for running the local Supabase database. Download from [docker.com](https://www.docker.com/products/docker-desktop/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/greenthread.git
   cd greenthread
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the local Supabase instance (make sure Docker Desktop is running):
   ```bash
   bun sb:start
   ```

4. After Supabase starts, you'll see output containing connection details (can be re-printed with `bun sb:status`).
Create a `.env.local` file based on `.env.example` and configure the following variables from the Supabase output:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<Studio URL from `bun sb:status` output>
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Publishable key from `bun sb:status` output>
   SUPABASE_SECRET_KEY=<Secret key from `bun sb:status` output>
   
   # Application settings
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Run the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

7. For quickstart, you can use the following command to start both Supabase and the dev server:
   ```bash
   bun devx
   ```

## Key Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun sb:start` | Start local Supabase instance |
| `bun sb:stop` | Stop local Supabase instance |
| `bun sb:reset` | Reset local database (runs migrations) |
| `bun sb:typegen` | Generate TypeScript types from database schema |
| `bun format-and-lint:fix` | Format and lint code with Biome |

## License

MIT
