package rs.ac.uns.ftn.onlybuns.service;

// src/main/java/com/example/security/LoginAttemptService.java

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {

    private final int MAX_ATTEMPTS = 5;
    private final long LOCK_TIME_DURATION = TimeUnit.MINUTES.toMillis(1); // 1 minute lock duration

    private ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, Long> lockTimeCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String ipAddress) {
        attemptsCache.remove(ipAddress);
        lockTimeCache.remove(ipAddress);
    }

    public void loginFailed(String ipAddress) {
        int attempts = attemptsCache.getOrDefault(ipAddress, 0) + 1;
        attemptsCache.put(ipAddress, attempts);

        if (attempts >= MAX_ATTEMPTS) {
            lockTimeCache.put(ipAddress, System.currentTimeMillis());
            System.out.println("IP Blocked: " + ipAddress); // Log IP being blocked
        } else {
            System.out.println("Login failed attempt #" + attempts + " from IP: " + ipAddress);
        }
    }

    public boolean isBlocked(String ipAddress) {
        if (!lockTimeCache.containsKey(ipAddress)) return false;

        long lockTime = lockTimeCache.get(ipAddress);
        if (System.currentTimeMillis() - lockTime > LOCK_TIME_DURATION) {
            // Clear block after duration
            lockTimeCache.remove(ipAddress);
            attemptsCache.remove(ipAddress);
            return false;
        }
        return true;
    }

}
