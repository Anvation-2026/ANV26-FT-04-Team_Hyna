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
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

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

        // Rule 4: Credible Baseline
        if (score == 100) {
            explanations.add("🟢 VERIFIED: Claimed industry matches physical building constraints.");
            explanations.add("🟢 VERIFIED: No spatial contradictions detected.");
        }

        VerificationResult result = new VerificationResult(score, explanations);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/evaluate-live")
    public ResponseEntity<VerificationResult> evaluateLive(@RequestBody BusinessProfile liveProfile) {
        int score = 100;
        List<String> explanations = new ArrayList<>();

        Integer sqFt = liveProfile.getSqFt();
        if (sqFt == null) {
            sqFt = 500;
        }

        String claimedIndustry = liveProfile.getClaimedIndustry();
        if (claimedIndustry == null) {
            claimedIndustry = "Tech";
        }

        // Rule 1: The Zero-Footprint Check
        if (sqFt == 0) {
            score -= 90;
            explanations.add("🔴 CRITICAL: Zero physical footprint detected. High probability of a mail-drop ghost address.");
        }

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

        // Rule 4: Credible Baseline
        if (score == 100) {
            explanations.add("🟢 VERIFIED: Claimed industry matches physical building constraints.");
            explanations.add("🟢 VERIFIED: No spatial contradictions detected.");
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
