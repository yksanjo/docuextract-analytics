/**
 * DocuExtract Analytics
 * Analytics and reporting for DocuExtract Gateway
 */

const axios = require('axios');

/**
 * Analytics Client
 */
class AnalyticsClient {
  /**
   * Create analytics client
   * @param {Object} options
   * @param {string} options.gatewayUrl - DocuExtract Gateway URL
   */
  constructor(options = {}) {
    this.gatewayUrl = options.gatewayUrl || 'http://localhost:3000';
    this.client = axios.create({
      baseURL: this.gatewayUrl,
      timeout: 30000
    });
  }

  /**
   * Get comprehensive analytics report
   * @param {string} clientId - Client ID
   * @returns {Promise<Object>}
   */
  async getReport(clientId = 'default') {
    const [usage, providers, pricing] = await Promise.all([
      this.client.get(`/api/usage/${clientId}`),
      this.client.get('/api/providers'),
      this.client.get('/api/pricing')
    ]);

    return this.generateReport(usage.data, providers.data, pricing.data);
  }

  /**
   * Generate analytics report
   * @private
   */
  generateReport(usage, providers, pricing) {
    const totalPages = usage.pages || 0;
    const totalRequests = usage.requests || 0;
    const avgPagesPerRequest = totalRequests > 0 ? totalPages / totalRequests : 0;
    
    // Calculate costs
    let totalCost = 0;
    for (const provider of providers.providers) {
      const providerUsage = 0; // Would need to track per-provider usage
      totalCost += providerUsage * provider.pricePerPage;
    }

    return {
      summary: {
        totalPages,
        totalRequests,
        avgPagesPerRequest: avgPagesPerRequest.toFixed(2),
        currentDiscount: usage.currentDiscount,
        nextTierThreshold: usage.nextTierThreshold,
        progressToNextTier: usage.progressToNextTier
      },
      costs: {
        totalCost,
        discountApplied: usage.currentDiscount
      },
      providers: providers.providers,
      pricingTiers: pricing.volumeDiscounts
    };
  }

  /**
   * Get provider usage breakdown
   * @returns {Promise<Object>}
   */
  async getProviderBreakdown() {
    const response = await this.client.get('/api/providers');
    return {
      providers: response.data.providers.map(p => ({
        name: p.name,
        enabled: p.enabled,
        pricePerPage: p.pricePerPage,
        routingPriority: p.routingPriority
      }))
    };
  }

  /**
   * Export report as CSV
   * @param {Object} report - Analytics report
   * @returns {string} CSV string
   */
  static toCSV(report) {
    const lines = ['Metric,Value'];
    lines.push(`Total Pages,${report.summary.totalPages}`);
    lines.push(`Total Requests,${report.summary.totalRequests}`);
    lines.push(`Avg Pages/Request,${report.summary.avgPagesPerRequest}`);
    lines.push(`Current Discount,${report.summary.currentDiscount}%`);
    return lines.join('\n');
  }
}

module.exports = AnalyticsClient;
