package com.geotrust.controller;

import com.geotrust.model.BusinessProfile;
import com.geotrust.repository.BusinessProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    private static final Map<String, BusinessProfile> mockRegistry = new HashMap<>();

    private static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    static {
        BusinessProfile b1 = new BusinessProfile(); b1.setClaimedIndustry("Tech"); b1.setSqFt(500); 
        b1.setRegisteredLat(8.1833); b1.setRegisteredLng(77.4119); // Nagercoil
        mockRegistry.put("hynastudio", b1);
        
        BusinessProfile b2 = new BusinessProfile(); b2.setClaimedIndustry("Tech"); b2.setSqFt(500000); 
        b2.setRegisteredLat(12.9716); b2.setRegisteredLng(77.5946); // Bengaluru
        mockRegistry.put("google", b2);
        
        BusinessProfile b3 = new BusinessProfile(); b3.setClaimedIndustry("Tech"); b3.setSqFt(300000); 
        mockRegistry.put("microsoft", b3);
        
        BusinessProfile b4 = new BusinessProfile(); b4.setClaimedIndustry("Heavy Manufacturing"); b4.setSqFt(150000); 
        b4.setRegisteredLat(13.0827); b4.setRegisteredLng(80.2707); // Chennai
        mockRegistry.put("titanium steel", b4);
        
        BusinessProfile b5 = new BusinessProfile(); b5.setClaimedIndustry("Finance"); b5.setSqFt(25000); 
        mockRegistry.put("jp morgan", b5);

        // Keep existing ones for backward compatibility
        BusinessProfile b6 = new BusinessProfile(); b6.setClaimedIndustry("Heavy Manufacturing"); b6.setSqFt(200); 
        mockRegistry.put("ghost logistics", b6);

        BusinessProfile b7 = new BusinessProfile(); b7.setClaimedIndustry("Tech"); b7.setSqFt(1200); 
        mockRegistry.put("21 monk", b7);
    }

    private final BusinessProfileRepository repository;

    public ApiController(BusinessProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/cases")
    public List<BusinessProfile> getAllCases() {
        return repository.findAll();
    }

    @GetMapping("/evaluate/{caseId}")
    public ResponseEntity<VerificationResult> evaluate(@PathVariable String caseId) {
        Optional<BusinessProfile> profileOptional = repository.findByCaseId(caseId);

        if (profileOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BusinessProfile profile = profileOptional.get();
        int score = 100;
        List<String> explanations = new ArrayList<>();

        Integer sqFt = profile.getSqFt();
        String claimedIndustry = profile.getClaimedIndustry();

        if (sqFt != null) {
            // Rule 1: The Zero-Footprint Check
            if (sqFt == 0) {
                score -= 90;
                explanations.add("🔴 CRITICAL: Zero physical footprint detected. High probability of a mail-drop ghost address.");
            }

            if (claimedIndustry != null) {
                // Rule 2: Heavy Industry Contradiction
                if ((claimedIndustry.contains("Manufacturing") || claimedIndustry.contains("Logistics")) && sqFt < 1000) {
                    score -= 75;
                    explanations.add("🔴 CRITICAL: Physical contradiction. " + claimedIndustry + " requires significant space, but only " + sqFt + " sq ft is claimed.");
                }

                // Rule 3: High-Density Office (Virtual Office/Coworking)
                if ((claimedIndustry.contains("Tech") || claimedIndustry.contains("Finance") || claimedIndustry.contains("Consulting")) && sqFt < 300 && sqFt > 0) {
                    score -= 40;
                    explanations.add("🟡 WARNING: Extremely small footprint for corporate entity. Possible shared workspace or virtual office.");
                }
            }
        }

        if (score == 100) {
            explanations.add("✅ VERIFIED: Claimed industry matches physical building constraints.");
            explanations.add("✅ VERIFIED: No spatial contradictions detected.");
        }

        VerificationResult result = new VerificationResult(score, explanations);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/evaluate-live")
    public ResponseEntity<VerificationResult> evaluateLive(@RequestBody BusinessProfile input) {
        int score = 100;
        List<String> explanations = new ArrayList<>();

        String rawName = input.getBusinessName();
        String businessName = rawName != null ? rawName.toLowerCase() : "";

        // Rule 1 (Registry Check)
        String searchString = input.getBusinessName().toLowerCase();
        BusinessProfile registered = null;

        // Loop through registry keys to see if the search string contains any known company keyword
        for (String key : mockRegistry.keySet()) {
            if (searchString.contains(key)) {
                registered = mockRegistry.get(key);
                break;
            }
        }

        // If no keyword matched, return the FATAL error
        if (registered == null) {
            score = 0;
            explanations.add("🚨 FATAL: Business entity not found in Government MCA Registry.");
            return ResponseEntity.ok(new VerificationResult(score, explanations));
        }

        // Rule 2 (Asset Overstatement)
        if (input.getSqFt() != null && input.getSqFt() > (registered.getSqFt() * 1.5)) {
            score -= 50;
            explanations.add("🚩 CRITICAL: Asset Overstatement. Investigator claimed " + input.getSqFt() + " sqft, but entity is legally registered for only " + registered.getSqFt() + " sqft.");
        }

        // Rule 3 (Industry Mismatch)
        if (input.getClaimedIndustry() != null && !input.getClaimedIndustry().equalsIgnoreCase(registered.getClaimedIndustry())) {
            score -= 30;
            explanations.add("⚠️ WARNING: Industry mismatch. Claimed " + input.getClaimedIndustry() + " but registered as " + registered.getClaimedIndustry() + ".");
        }

        // Rule 4 (Invalid Coordinates)
        Double latitude = input.getLatitude();
        Double longitude = input.getLongitude();
        if (latitude == null || longitude == null || latitude == 0.0 || longitude == 0.0) {
            score -= 100;
            explanations.add("🚨 FATAL: Invalid or null geographic coordinates provided.");
        } else if (registered.getRegisteredLat() != null && registered.getRegisteredLng() != null) {
            double distance = calculateDistance(latitude, longitude, registered.getRegisteredLat(), registered.getRegisteredLng());

            // If the claimed location is more than 50km away from the registered location
            if (distance > 50.0) {
                score -= 60;
                explanations.add("🚨 FATAL LOCATION ANOMALY: Claimed location is " + String.format("%.1f", distance) + " km away from the officially registered headquarters.");
            }
        }

        // Rule 5 (Success)
        if (score == 100) {
            explanations.add("✅ VERIFIED: Claimed data perfectly matches Government Registry and spatial constraints.");
        }

        VerificationResult result = new VerificationResult(score, explanations);
        return ResponseEntity.ok(result);
    }

    public static class VerificationResult {
        public int score;
        public List<String> explanations;

        public VerificationResult() {}

        public VerificationResult(int score, List<String> explanations) {
            this.score = score;
            this.explanations = explanations;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public List<String> getExplanations() {
            return explanations;
        }

        public void setExplanations(List<String> explanations) {
            this.explanations = explanations;
        }
    }
}
