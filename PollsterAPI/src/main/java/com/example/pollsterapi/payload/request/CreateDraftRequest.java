package com.example.pollsterapi.payload.request;
import com.example.pollsterapi.models.PollOption;
import com.example.pollsterapi.models.Settings;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.bson.types.ObjectId;


import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class CreateDraftRequest {
    private String title;
    private String description;
    private String imageLink;
    private String votingType;
    private ArrayList<PollOption> votingOptions;
    private Settings settings;
}
