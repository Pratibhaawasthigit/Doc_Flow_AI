package com.Doc_Flow_AI.api.service;

import com.Doc_Flow_AI.api.model.Subject;
import com.Doc_Flow_AI.api.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @SuppressWarnings("null")
    public Optional<Subject> getSubjectById(Long id) {
        return subjectRepository.findById(id);
    }

    @SuppressWarnings("null")
    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @SuppressWarnings("null")
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}
