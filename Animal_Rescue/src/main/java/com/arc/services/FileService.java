package com.arc.services;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    String saveFile(MultipartFile file) throws IOException;
}
