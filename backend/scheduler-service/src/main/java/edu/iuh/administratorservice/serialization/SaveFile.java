package edu.iuh.administratorservice.serialization;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.N;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@NoArgsConstructor
@Component
public class SaveFile {

    @Value("${root.file.name}")
    String rootFile;
    public String saveFile(MultipartFile file) {
        if (file.isEmpty())
            return "";
        try {
            byte[] bytes = file.getBytes();
            Path path = Paths.get(rootFile + file.getOriginalFilename()+ UUID.randomUUID());
            Files.write(path, bytes);
            return path.getFileName().toString();

        } catch (IOException e) {
            return "";
        }
    }
}
