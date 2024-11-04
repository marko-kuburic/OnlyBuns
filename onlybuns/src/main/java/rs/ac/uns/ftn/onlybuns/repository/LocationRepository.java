package rs.ac.uns.ftn.onlybuns.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.ac.uns.ftn.onlybuns.model.Location;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // Custom query method to find locations by type, e.g., "shelter" or "veterinarian"
    List<Location> findByServiceType(String serviceType);

    // Additional custom queries can be added as needed

}
