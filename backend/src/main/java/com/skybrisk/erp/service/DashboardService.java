package com.skybrisk.erp.service;

import java.util.Map;
import java.util.List;

public interface DashboardService {

    Map<String, Object> getSalesSummary();

    Map<String, Object> getPurchaseSummary();

    List<?> getStockAlerts();
}