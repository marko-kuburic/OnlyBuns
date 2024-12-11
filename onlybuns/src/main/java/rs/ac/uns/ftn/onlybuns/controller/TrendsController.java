package rs.ac.uns.ftn.onlybuns.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.ac.uns.ftn.onlybuns.service.PostService;
import rs.ac.uns.ftn.onlybuns.service.TrendsService;
import rs.ac.uns.ftn.onlybuns.service.UserService;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/trends")
@CrossOrigin(origins = "http://localhost:3000")
public class TrendsController {

    private final TrendsService trendsService;

    @Autowired
    public TrendsController(TrendsService trendsService) {
        this.trendsService = trendsService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getTrends() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalPosts", trendsService.getTotalPosts());
        response.put("monthlyPosts", trendsService.getMonthlyPosts());
        response.put("topWeeklyPosts", trendsService.getTopWeeklyPosts());
        response.put("topAllTimePosts", trendsService.getTopAllTimePosts());
        response.put("topLikers", trendsService.getTopLikers());

        return ResponseEntity.ok(response);
    }
}
