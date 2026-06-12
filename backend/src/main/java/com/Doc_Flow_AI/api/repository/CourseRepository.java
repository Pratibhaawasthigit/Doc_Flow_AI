package com.Doc_Flow_AI.api.repository;

import com.Doc_Flow_AI.api.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    java.util.List<Course> findByCategory(String category);
}
