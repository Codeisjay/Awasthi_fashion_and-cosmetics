// Analytics Metrics Calculations

/**
 * Calculate click-through rate
 * @param {number} clicks - Total clicks
 * @param {number} impressions - Total impressions
 * @returns {number} CTR percentage (0-100)
 */
const calculateCTR = (clicks, impressions) => {
  if (impressions === 0) return 0;
  return Math.round((clicks / impressions) * 100 * 100) / 100;
};

/**
 * Calculate engagement rate
 * @param {number} visitors - Unique visitors
 * @param {number} clicks - Total clicks
 * @returns {number} Engagement rate percentage
 */
const calculateEngagementRate = (visitors, clicks) => {
  if (visitors === 0) return 0;
  return Math.round((clicks / visitors) * 100 * 100) / 100;
};

/**
 * Calculate average session duration
 * @param {Array} sessions - Array of session durations
 * @returns {number} Average duration in seconds
 */
const calculateAvgSessionDuration = (sessions) => {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum, duration) => sum + duration, 0);
  return Math.round(total / sessions.length);
};

/**
 * Calculate bounce rate
 * @param {number} singlePageSessions - Sessions with 1 page only
 * @param {number} totalSessions - Total sessions
 * @returns {number} Bounce rate percentage
 */
const calculateBounceRate = (singlePageSessions, totalSessions) => {
  if (totalSessions === 0) return 0;
  return Math.round((singlePageSessions / totalSessions) * 100 * 100) / 100;
};

/**
 * Get trend direction (up, down, stable)
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} Trend direction
 */
const getTrendDirection = (current, previous) => {
  if (previous === 0) return 'stable';
  const change = ((current - previous) / previous) * 100;
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
};

/**
 * Calculate trend percentage
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
const calculateTrendPercentage = (current, previous) => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
};

/**
 * Group by category
 * @param {Array} items - Items to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
const groupByCategory = (items, key) => {
  return items.reduce((acc, item) => {
    const category = item[key] || 'Unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};

/**
 * Get top N items by count
 * @param {Object} grouped - Grouped object
 * @param {number} limit - Max items to return
 * @returns {Array} Top items with count
 */
const getTopItems = (grouped, limit = 10) => {
  return Object.entries(grouped)
    .map(([name, items]) => ({
      name,
      count: items.length,
      percentage: Math.round((items.length / Object.values(grouped).flat().length) * 100 * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted string (e.g., "1h 30m")
 */
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ') || '0s';
};

/**
 * Get percentage change with color indicator
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {Object} Object with change, percentage, and color
 */
const getChangeIndicator = (current, previous) => {
  if (previous === 0) {
    return { change: current, percentage: 0, color: 'neutral', direction: 'neutral' };
  }

  const change = current - previous;
  const percentage = Math.round(((change / previous) * 100) * 100) / 100;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
  const color = direction === 'up' ? 'green' : direction === 'down' ? 'red' : 'gray';

  return { change, percentage, color, direction };
};

module.exports = {
  calculateCTR,
  calculateEngagementRate,
  calculateAvgSessionDuration,
  calculateBounceRate,
  getTrendDirection,
  calculateTrendPercentage,
  groupByCategory,
  getTopItems,
  formatDuration,
  getChangeIndicator,
};
