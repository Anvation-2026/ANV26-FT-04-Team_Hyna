package com.geotrust.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class BusinessProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String caseId;
    private String businessName;
    private String claimedIndustry;
    private Integer sqFt;
    private Double latitude;
    private Double longitude;
    private Double registeredLat;
    private Double registeredLng;

    public BusinessProfile() {
    }

    public BusinessProfile(Long id, String caseId, String businessName, String claimedIndustry, Integer sqFt, Double latitude, Double longitude) {
        this.id = id;
        this.caseId = caseId;
        this.businessName = businessName;
        this.claimedIndustry = claimedIndustry;
        this.sqFt = sqFt;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getClaimedIndustry() {
        return claimedIndustry;
    }

    public void setClaimedIndustry(String claimedIndustry) {
        this.claimedIndustry = claimedIndustry;
    }

    public Integer getSqFt() {
        return sqFt;
    }

    public void setSqFt(Integer sqFt) {
        this.sqFt = sqFt;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getRegisteredLat() {
        return registeredLat;
    }

    public void setRegisteredLat(Double registeredLat) {
        this.registeredLat = registeredLat;
    }

    public Double getRegisteredLng() {
        return registeredLng;
    }

    public void setRegisteredLng(Double registeredLng) {
        this.registeredLng = registeredLng;
    }
}
