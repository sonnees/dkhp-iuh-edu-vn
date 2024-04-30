package edu.iuh.administratorservice.serialization;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.iuh.administratorservice.dto.StaffDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class JsonConverter {
    private ObjectMapper objectMapper;

    public <T> String objToString(T obj) {
        ObjectMapper objectMapper = new ObjectMapper();
        String objStr = null;
        try {
            objStr = objectMapper.writeValueAsString(obj);
        } catch (Exception e){
            return e.getMessage();
        }
        return objStr;
    }


    public StaffDTO stringToObj(String str) {
        ObjectMapper objectMapper = new ObjectMapper();
        StaffDTO objStr = null;
        try {
            objStr = objectMapper.readValue(str, StaffDTO.class);
        } catch (Exception e){
            return null;
        }
        return objStr;
    }
}
