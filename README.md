# DocuExtract Analytics

Analytics and reporting for DocuExtract Gateway.

## Features

- Usage statistics and reporting
- Cost analysis
- Provider breakdown
- CSV export

## Usage

```javascript
const AnalyticsClient = require('docuextract-analytics');

const analytics = new AnalyticsClient({
  gatewayUrl: 'http://localhost:3000'
});

const report = await analytics.getReport('my-client');
console.log('Total Pages:', report.summary.totalPages);
console.log('Total Cost:', report.costs.totalCost);

// Export to CSV
const csv = AnalyticsClient.toCSV(report);
```

## API

### `new AnalyticsClient(options)`

- `gatewayUrl` - Gateway URL (default: http://localhost:3000)

### `analytics.getReport(clientId)`

Get comprehensive analytics report.

### `analytics.getProviderBreakdown()`

Get provider usage breakdown.

### `AnalyticsClient.toCSV(report)`

Export report to CSV format.

## License

MIT
