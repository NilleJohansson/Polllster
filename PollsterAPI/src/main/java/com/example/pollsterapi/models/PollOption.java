package com.example.pollsterapi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Builder
@Jacksonized
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonTypeInfo(
//        use = JsonTypeInfo.Id.NAME,
//        include = JsonTypeInfo.As.WRAPPER_ARRAY,
//        property = "type"
//)
public class PollOption implements Serializable {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;
    @Getter
    private String option;
    private boolean isOtherOption;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private long voteAmount;

    public PollOption() {
        this.id = UUID.randomUUID().toString();
    }

    public void setOption(String option) {
        this.option = option;
    }

    public boolean isOtherOption() {
        return isOtherOption;
    }

    public void setOtherOption(boolean otherOption) {
        isOtherOption = otherOption;
    }

    public String getId() {
        return id;
    }

    public String getOption() {
        return option;
    }

    public long getVoteAmount() {
        return voteAmount;
    }

    public void setVoteAmount(long voteAmount) {
        this.voteAmount = voteAmount;
    }
}
