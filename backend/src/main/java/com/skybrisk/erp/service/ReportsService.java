
        package com.skybrisk.erp.service;

import java.time.LocalDate;
import java.util.Map;

public interface ReportsService {

    Map<String, Object> getReportSummary(
            LocalDate from,
            LocalDate to
    );
}

