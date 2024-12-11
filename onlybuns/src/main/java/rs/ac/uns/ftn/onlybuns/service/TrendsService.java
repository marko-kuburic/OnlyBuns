package rs.ac.uns.ftn.onlybuns.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.onlybuns.repository.TrendsRepository;

import java.util.List;


@Service
public class TrendsService {

    private final TrendsRepository trendsRepository;

    @Autowired
    public TrendsService(TrendsRepository trendsRepository) {
        this.trendsRepository = trendsRepository;
    }

    public long getTotalPosts() {
        return trendsRepository.countTotalPosts();
    }

    public long getMonthlyPosts() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        return trendsRepository.countByCreatedAtAfter(oneMonthAgo);
    }

    public List<Map<String, Object>> getTopWeeklyPosts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        return trendsRepository.findTopWeeklyPosts();
    }

    public List<Map<String, Object>> getTopAllTimePosts() {
        return trendsRepository.findTopAllTimePosts();
    }

    public List<Map<String, Object>> getTopLikers() {
        return trendsRepository.findTopLikers();
    }
}
