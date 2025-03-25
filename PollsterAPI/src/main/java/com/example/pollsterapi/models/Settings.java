package com.example.pollsterapi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.jackson.Jacksonized;
import org.springframework.data.util.Pair;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Builder
@Jacksonized
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonTypeInfo(
//        use = JsonTypeInfo.Id.NAME,
//        include = JsonTypeInfo.As.PROPERTY,
//        property = "type"
//)
public class Settings implements Serializable {
//    private Pair<Integer, Integer> amountOfSelections;
    private Integer fromAmountOfSelections;
    private Integer toAmountOfSelections;
    private boolean requireParticipantsName;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LocalDateTime closePollOnDate;
    private boolean allowComments;
    private boolean hideShareButton;
    // TODO: Change these to enum?
    private String votingSecurity;
    private String resultVisibility;

    public Settings() {}

//    public Pair<Integer, Integer> getAmountOfSelections() {
//        return amountOfSelections;
//    }
//
//    public void setAmountOfSelections(Pair<Integer, Integer> amountOfSelections) {
//        this.amountOfSelections = amountOfSelections;
//    }

    public boolean isRequireParticipantsName() {
        return requireParticipantsName;
    }

    public void setRequireParticipantsName(boolean requireParticipantsName) {
        this.requireParticipantsName = requireParticipantsName;
    }

    public LocalDateTime getClosePollOnDate() {
        return closePollOnDate;
    }

    public void setClosePollOnDate(LocalDateTime closePollOnDate) {
        this.closePollOnDate = closePollOnDate;
    }

    public boolean isAllowComments() {
        return allowComments;
    }

    public void setAllowComments(boolean allowComments) {
        this.allowComments = allowComments;
    }

    public boolean isHideShareButton() {
        return hideShareButton;
    }

    public void setHideShareButton(boolean hideShareButton) {
        this.hideShareButton = hideShareButton;
    }

    public String getVotingSecurity() {
        return votingSecurity;
    }

    public void setVotingSecurity(String votingSecurity) {
        this.votingSecurity = votingSecurity;
    }

    public String getResultVisibility() {
        return resultVisibility;
    }

    public void setResultVisibility(String resultVisibility) {
        this.resultVisibility = resultVisibility;
    }
}
