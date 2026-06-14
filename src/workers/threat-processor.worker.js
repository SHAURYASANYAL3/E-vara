self.onmessage = function (e) {
  const { rawData } = e.data;

  try {
    const parsedData =
      typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    const normalizedData = normalizeThreatData(parsedData);
    self.postMessage({ success: true, data: normalizedData });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};

function normalizeThreatData(data) {
  const items = Array.isArray(data) ? data : data.feeds || [];
  return items.map((item) => ({
    id: item.id || Math.random().toString(36).substr(2, 9),
    timestamp: item.timestamp || new Date().toISOString(),
    severity: (item.severity || "low").toLowerCase(),
    indicator: item.indicator || "Unknown IOC",
    type: item.type || "Generic Threat Data",
  }));
}
