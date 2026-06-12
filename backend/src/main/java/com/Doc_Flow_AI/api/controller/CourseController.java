package com.Doc_Flow_AI.api.controller;

import com.Doc_Flow_AI.api.model.Course;
import com.Doc_Flow_AI.api.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/subject/{subjectId}")
    public List<Course> getCoursesBySubject(@PathVariable Long subjectId) {
        return courseService.getCoursesBySubjectId(subjectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/enroll")
    public Course enrollInCourse(@PathVariable Long id) {
        return courseService.enrollCourse(id);
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }
}
