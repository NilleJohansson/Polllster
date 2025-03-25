package com.example.pollsterapi.models.documents;

import com.example.pollsterapi.payload.request.CreateDraftRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "drafts")
public class Draft extends CreateDraftRequest {
    @Id
    private String id;

    private String userID;
}
