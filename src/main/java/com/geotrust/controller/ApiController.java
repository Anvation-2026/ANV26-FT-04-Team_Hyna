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
    static {
        // A legit tech company
        BusinessProfile b1 = new BusinessProfile();
        b1.setClaimedIndustry("Tech"); b1.setSqFt(500); 
        mockRegistry.put("hynastudio nagercoil", b1);
        
        // A legit manufacturing plant
        BusinessProfile b2 = new BusinessProfile();
        b2.setClaimedIndustry("Heavy Manufacturing"); b2.setSqFt(150000); 
        mockRegistry.put("titanium steel bengaluru", b2);
        
        // A shell company (registered as manufacturing, but tiny)
        BusinessProfile b3 = new BusinessProfile();
        b3.setClaimedIndustry("Heavy Manufacturing"); b3.setSqFt(200); 
        mockRegistry.put("ghost logistics chennai", b3);
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

                // Rule 4: The 'Over-Claimed Asset' Vector (Urban Density Contradiction)
                if (sqFt > 10000 && (claimedIndustry.contains("Tech") || claimedIndustry.contains("Consulting") || claimedIndustry.contains("Finance"))) {
                    score -= 50;
                    explanations.add("🚩 CRITICAL: Asset Overstatement. Claimed square footage (" + sqFt + ") is highly anomalous for a " + claimedIndustry + " entity in this zone. High probability of loan fraud.");
                }
            }
        }

        Double latitude = profile.getLatitude();
        Double longitude = profile.getLongitude();

        // Rule 5: The 'Middle of the Ocean / Invalid Coordinates' Vector
        if (latitude == null || longitude == null || latitude == 0.0 || longitude == 0.0 || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            score -= 100;
            explanations.add("🚨 FATAL: Invalid or null geographic coordinates provided. Cannot verify physical existence.");
        }

        // Rule 6: The Verification Check
        if (score == 100) {
            explanations.add("✅ VERIFIED: Claimed industry matches physical building constraints.");
            explanations.add("✅ VERIFIED: No spatial contradictions detected.");
        }

        VerificationResult result = new VerificationResult(score, explanations);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/evaluate-live")
    public ResponseEntity<VerificationResult> evaluateLive(@RequestBody BusinessProfile liveProfile) {
        int score = 100;
        List<String> explanations = new ArrayList<>();

        String businessName = liveProfile.getBusinessName();
        String searchKey = businessName != null ? businessName.toLowerCase() : "";

        // Check 1: Registry Match
        if (!mockRegistry.containsKey(searchKey)) {
            score = 0;
            explanations.add("🚨 FATAL: Business not found in Government MCA Registry.");
            return ResponseEntity.ok(new VerificationResult(score, explanations));
        }

        // Check 2: Asset Verification
        BusinessProfile registered = mockRegistry.get(searchKey);
        
        Integer liveSqFt = liveProfile.getSqFt();
        if (liveSqFt == null) {
            liveSqFt = 500;
        }

        String liveIndustry = liveProfile.getClaimedIndustry();
        if (liveIndustry == null) {
            liveIndustry = "Tech";
        }

        if (liveSqFt > (registered.getSqFt() * 1.5)) {
            score -= 50;
            explanations.add("🚩 CRITICAL: Asset Overstatement. Claimed " + liveSqFt + " sqft, but registered for only " + registered.getSqFt() + " sqft.");
        }

        // Check 3: Industry Verification
        if (!liveIndustry.equalsIgnoreCase(registered.getClaimedIndustry())) {
            score -= 30;
            explanations.add("⚠️ WARNING: Industry mismatch. Claimed " + liveIndustry + " but registered as " + registered.getClaimedIndustry() + ".");
        }

        // Check 4: The Physical Reality check
        Integer regSqFt = registered.getSqFt();
        String regIndustry = registered.getClaimedIndustry();

        if (regSqFt != null) {
            if (regSqFt == 0) {
                score -= 90;
                explanations.add("🔴 CRITICAL: Zero physical footprint detected. High probability of a mail-drop ghost address.");
            }

            if (regIndustry != null) {
                if ((regIndustry.contains("Manufacturing") || regIndustry.contains("Logistics")) && regSqFt < 1000) {
                    score -= 75;
                    explanations.add("🔴 CRITICAL: Physical contradiction. " + regIndustry + " requires significant space, but only " + regSqFt + " sq ft is claimed.");
                }

                if ((regIndustry.contains("Tech") || regIndustry.contains("Finance") || regIndustry.contains("Consulting")) && regSqFt < 300 && regSqFt > 0) {
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
