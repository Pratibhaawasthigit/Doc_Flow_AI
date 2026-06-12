package com.Doc_Flow_AI.api.service;

import com.Doc_Flow_AI.api.model.Course;
import com.Doc_Flow_AI.api.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final SubjectService subjectService;

    public CourseService(CourseRepository courseRepository, SubjectService subjectService) {
        this.courseRepository = courseRepository;
        this.subjectService = subjectService;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getCoursesBySubjectId(Long subjectId) {
        return subjectService.getSubjectById(subjectId)
                .map(subject -> courseRepository.findByCategory(subject.getName()))
                .orElse(List.of());
    }

    @SuppressWarnings("null")
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @SuppressWarnings("null")
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    @SuppressWarnings("null")
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    @SuppressWarnings("null")
    public Course enrollCourse(Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    // Simulation logic for enrollment
                    return courseRepository.save(course);
                })
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
