package org.hihn.ampd.server.model.db.repo;

import org.hihn.ampd.server.model.db.RadioStream;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RadioRepository extends JpaRepository<RadioStream, Long> {

	List<RadioStream> findAllByOrderByNameAsc();

}