package com.Doc_Flow_AI.api.service;

import com.Doc_Flow_AI.api.model.Folder;
import com.Doc_Flow_AI.api.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FolderService {

    @Autowired
    private FolderRepository folderRepository;

    public List<Folder> getFoldersByEmail(String email) {
        return folderRepository.findByUserEmail(email);
    }

    @SuppressWarnings("null")
    public Optional<Folder> getFolderById(Long id) {
        return folderRepository.findById(id);
    }

    @SuppressWarnings("null")
    public Folder saveFolder(Folder folder) {
        return folderRepository.save(folder);
    }

    @SuppressWarnings("null")
    public Folder updateFolder(Long id, Folder folderDetails) {
        return folderRepository.findById(id)
                .map(folder -> {
                    folder.setLabel(folderDetails.getLabel());
                    folder.setIcon(folderDetails.getIcon());
                    folder.setIconColor(folderDetails.getIconColor());
                    folder.setBg(folderDetails.getBg());
                    folder.setIconBg(folderDetails.getIconBg());
                    folder.setBadgeBg(folderDetails.getBadgeBg());
                    folder.setBadgeColor(folderDetails.getBadgeColor());
                    folder.setAccentVar(folderDetails.getAccentVar());
                    folder.setDescription(folderDetails.getDescription());
                    folder.setUserEmail(folderDetails.getUserEmail());
                    return folderRepository.save(folder);
                })
                .orElseThrow(() -> new RuntimeException("Folder not found"));
    }

    @SuppressWarnings("null")
    public void deleteFolder(Long id) {
        folderRepository.deleteById(id);
    }
}
