package com.arc.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileServiceImpl implements FileService {

    private final String UPLOAD_DIR = "uploads/";

    @Override
    public String saveFile(MultipartFile file) throws IOException {

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String fileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        Files.copy(file.getInputStream(),
                Paths.get(UPLOAD_DIR + fileName));

        return "uploads/" + fileName;
    }
}
