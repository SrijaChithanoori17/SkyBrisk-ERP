package com.skybrisk.erp.service;

import com.skybrisk.erp.entity.GRN;

import java.util.List;

public interface GRNService {

    List<GRN> getAllGRNs();

    GRN getGRNById(Long id);

    GRN createGRN(GRN grn);
}