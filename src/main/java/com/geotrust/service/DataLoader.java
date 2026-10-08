package com.geotrust.service;

import com.geotrust.model.BusinessProfile;
import com.geotrust.repository.BusinessProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final BusinessProfileRepository repository;

    public DataLoader(BusinessProfileRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // CASE 1: Credible
        BusinessProfile case1 = new BusinessProfile();
        case1.setCaseId("CASE-001");
        case1.setBusinessName("Apex Retail");
        case1.setClaimedIndustry("Retail");
        case1.setSqFt(2500);
        case1.setLatitude(41.88);
        case1.setLongitude(-87.62);

        // CASE 2: Ghost
        BusinessProfile case2 = new BusinessProfile();
        case2.setCaseId("CASE-002");
        case2.setBusinessName("Titanium Steel Smelting");
        case2.setClaimedIndustry("Heavy Manufacturing");
        case2.setSqFt(150);
        case2.setLatitude(41.89);
        case2.setLongitude(-87.63);

        // CASE 3: Shared Workspace
        BusinessProfile case3 = new BusinessProfile();
        case3.setCaseId("CASE-003");
        case3.setBusinessName("Global Tech Consultants");
        case3.setClaimedIndustry("Consulting");
        case3.setSqFt(450);
        case3.setLatitude(41.90);
        case3.setLongitude(-87.64);

        // CASE 4: Credible (Massive Footprint)
        BusinessProfile case4 = new BusinessProfile();
        case4.setCaseId("CASE-004");
        case4.setBusinessName("Omega Logistics");
        case4.setClaimedIndustry("Logistics");
        case4.setSqFt(50000);
        case4.setLatitude(39.73);
        case4.setLongitude(-104.99);

        // CASE 5: Ghost (Too small for HQ)
        BusinessProfile case5 = new BusinessProfile();
        case5.setCaseId("CASE-005");
        case5.setBusinessName("Shell Corp Alpha");
        case5.setClaimedIndustry("Finance");
        case5.setSqFt(50);
        case5.setLatitude(40.71);
        case5.setLongitude(-74.00);

        // CASE 6: Shared Workspace (Massive Coworking)
        BusinessProfile case6 = new BusinessProfile();
        case6.setCaseId("CASE-006");
        case6.setBusinessName("WeWork Chicago");
        case6.setClaimedIndustry("Coworking");
        case6.setSqFt(12000);
        case6.setLatitude(41.87);
        case6.setLongitude(-87.62);

        // CASE 7: Ghost (Zero footprint)
        BusinessProfile case7 = new BusinessProfile();
        case7.setCaseId("CASE-007");
        case7.setBusinessName("Phantom Holdings");
        case7.setClaimedIndustry("Real Estate");
        case7.setSqFt(0);
        case7.setLatitude(34.05);
        case7.setLongitude(-118.24);

        // CASE 8: Credible (Standard)
        BusinessProfile case8 = new BusinessProfile();
        case8.setCaseId("CASE-008");
        case8.setBusinessName("Corner Bodega");
        case8.setClaimedIndustry("Retail");
        case8.setSqFt(800);
        case8.setLatitude(40.75);
        case8.setLongitude(-73.98);

        // CASE 9: Shared Workspace (Startup)
        BusinessProfile case9 = new BusinessProfile();
        case9.setCaseId("CASE-009");
        case9.setBusinessName("Crypto Innovations");
        case9.setClaimedIndustry("Tech");
        case9.setSqFt(200);
        case9.setLatitude(37.77);
        case9.setLongitude(-122.41);

        // CASE 10: Ghost (Heavy Industry Contradiction)
        BusinessProfile case10 = new BusinessProfile();
        case10.setCaseId("CASE-010");
        case10.setBusinessName("Industrial Smelting Ltd");
        case10.setClaimedIndustry("Heavy Manufacturing");
        case10.setSqFt(200);
        case10.setLatitude(29.76);
        case10.setLongitude(-95.36);

        repository.saveAll(List.of(case1, case2, case3, case4, case5, case6, case7, case8, case9, case10));

        System.out.println("🔥 10 ENTERPRISE DATA PROFILES LOADED SUCCESSFULLY! 🔥");
    }
}