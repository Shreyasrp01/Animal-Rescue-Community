package com.arc.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class DonorStatsDTO {

    private BigDecimal totalDonated;
    private Integer donationCount;
}
