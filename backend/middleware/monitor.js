const metrics = {
  startedAt: Date.now(),
  totalRequests: 0,
  totalErrors: 0,
  byRoute: {},
  avgResponseMs: 0,
};

function monitor(req, res, next) {
  const t0 = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - t0;
    metrics.totalRequests++;
    const key = `${req.method} ${req.baseUrl}${req.route?.path || req.path}`;
    metrics.byRoute[key] = (metrics.byRoute[key] || 0) + 1;
    if (res.statusCode >= 500) metrics.totalErrors++;
    // rolling average
    metrics.avgResponseMs = Math.round(
      (metrics.avgResponseMs * (metrics.totalRequests - 1) + ms) / metrics.totalRequests
    );
    // structured log line
    console.log(
      `${new Date().toISOString()} | ${req.method.padEnd(6)} ${req.originalUrl} | ${res.statusCode} | ${ms}ms`
    );
  });
  next();
}

function metricsHandler(req, res) {
  res.json({
    uptimeSec: Math.round(process.uptime()),
    startedAt: new Date(metrics.startedAt).toISOString(),
    totalRequests: metrics.totalRequests,
    totalErrors: metrics.totalErrors,
    avgResponseMs: metrics.avgResponseMs,
    requestsByRoute: metrics.byRoute,
    memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
}

module.exports = { monitor, metricsHandler };