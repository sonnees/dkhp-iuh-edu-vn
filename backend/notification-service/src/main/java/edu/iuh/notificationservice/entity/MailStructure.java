package edu.iuh.notificationservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class MailStructure {
    private String toMail;
    private String subject;
    private String message;
}
