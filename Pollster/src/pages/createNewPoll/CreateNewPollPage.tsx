import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AddIcon from "@mui/icons-material/Add";
import React, { ChangeEvent, useEffect, useState } from "react";
import { votingTypes } from "../../utils/VotingTypes";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { MultiChoiceType } from "../../components/draggableList/MultiChoiceType";
import { reorder } from "../../utils/ListUtils";
import { DropResult } from "react-beautiful-dnd";
import DraggableList from "../../components/draggableList/DraggableList";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import {
  UNLIMITED,
  EXACT_NUMBER,
  RANGE,
  multipleOptionsTypes,
} from "../../utils/MultipleOptionsTypes";
import * as VotingSecurity from "../../utils/VotingSecurityTypes";
import * as ResultVisibility from "../../utils/ResultVisibilityTypes";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useForm } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
import OutsideClickAlerter from "../../hooks/OutsideClickAlerter";
import { FormInputText } from "../../components/formInputs/FormInputTextField";
import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import useApiClient from "../../api/ApiClient";
import Dialog from "../../components/dialog/Dialog.tsx";
import UploadImageDialog from "../../components/dialog/UploadImageDialog.tsx";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { FormSelect } from "../../components/formInputs/FormSelect.tsx";
import { FormSwitch } from "../../components/formInputs/FormSwitch.tsx";
import { FormInputDateTimePicker } from "../../components/formInputs/FormInputDateTimePicker.tsx";

interface ICreatePollFormInput {
  optionText: string;
  pasteAnswers: string;
}

const defaultFormValues = {
  optionText: "",
  pasteAnswers: "",
  votingType: "Multiple choice",
  multipleOptionsExactNumber: 0,
  allowSelectionQuantity: "Unlimited",
  multipleOptionsRangeFrom: 1,
  multipleOptionsRangeTo: 2,
  votingSecurity: "One vote per IP address",
  resultVisibility: "Always public"
};

function CreateNewPoll() {
  const pollAPI = useApiClient("http://localhost:8080/api/poll/");
  const [showDescription, setShowDescription] = useState(false);
  const [votingType, setVotingType] = useState(votingTypes[0].name);
  const [otherOptionAdded, setOtherOptionAdded] = useState(false);
  const [multiChoiceOptions, setMultiChoiceOptions] = useState([
    { option: "", id: uuidv4() },
  ] as Array<MultiChoiceType>);
  const [showPasteAnswers, setShowPasteAnswers] = useState(false);
  const [pasteAnswersValue, setPasteAnswersValue] = useState("");
  const [allowMultipleOptions, setAllowMultipleOptions] = useState(false);
  const [multipleOptionsType, setMultipleOptionsType] = useState(UNLIMITED);
  const [exactNumberOfOptions, setExactNumberOfOptions] = useState(0);
  const [rangeOfOptions, setRangeOfOptions] = useState({ from: 1, to: 2 });
  const [requireParticipantsName, setRequireParticipantsName] =
    useState<boolean>(false);
  const [allowComments, setAllowComments] = useState<boolean>(false);
  const [hideShareButton, setHideShareButton] = useState<boolean>(false);
  const [closePollOnSchedule, setClosePollOnSchedule] =
    useState<boolean>(false);
  const [securityType, setSecurityType] = useState<string>(
    VotingSecurity.ONE_VOTE_PER_IP_ADDRESS
  );
  const [resultVisibility, setResultVisiblity] = useState<string>(
    ResultVisibility.ALWAYS_PUBLIC
  );
  const [saveDraftTooltipOpen, setSaveDraftTooltipOpen] =
    useState<boolean>(false);
  const [savePollTooltipOpen, setSavePollTooltipOpen] =
    useState<boolean>(false);
  const { handleSubmit, control, setValue, setFocus } =
    useForm<ICreatePollFormInput>({
      defaultValues: defaultFormValues,
    });
  const [showAddImageModal, setShowAddImageModal] = useState<boolean>(false);
  const [selectedFileImage, setSelectedFileImage] = useState<
    Blob | MediaSource | undefined | null
  >(null);
  const [pollImage, setPollImage] = useState<unknown>(null);

  // TODO: Fix this
  // let saveDraftTimerId: ReturnType<typeof setTimeout>;

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const otherOptionFound = multiChoiceOptions.find(
      (option) => option.isOtherOption
    );
    setOtherOptionAdded(otherOptionFound ? true : false);
    updatePasteAnswersValue();
  }, [multiChoiceOptions]);

  useEffect(() => {
    if (!selectedFileImage) {
      setPollImage(undefined);
      return;
    }

    const imageURL = URL.createObjectURL(selectedFileImage);
    setPollImage(imageURL);

    return () => URL.revokeObjectURL(imageURL);
  }, [selectedFileImage]);

  const updateVotingType = (event: SelectChangeEvent) => {
    setVotingType(event.target.value as string);
  };

  const votingTypesList = votingTypes.map((v) => {
    return (
      <MenuItem value={v.name} key={v.name}>
        {v.icon} <span className="ml-1"></span> {v.name}
      </MenuItem>
    );
  });

  const multipleOptionsTypesList = multipleOptionsTypes.map((v) => {
    return (
      <MenuItem value={v} key={v}>
        <span> {v} </span>
      </MenuItem>
    );
  });

  const votingSecurityTypeList = VotingSecurity.votingSecurityTypeList.map(
    (v) => {
      return (
        <MenuItem value={v} key={v}>
          <span> {v} </span>
        </MenuItem>
      );
    }
  );

  const resultVisibilityTypeList =
    ResultVisibility.resultVisibilityTypeList.map((v) => {
      return (
        <MenuItem value={v} key={v}>
          <span> {v} </span>
        </MenuItem>
      );
    });

  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;

    const newMultiChoiceOptions = reorder(
      multiChoiceOptions,
      source.index,
      destination.index
    );

    setMultiChoiceOptions(newMultiChoiceOptions);
  };

  const deleteItem = (index: number) => {
    if (multiChoiceOptions.length == 1) {
      return;
    }

    setMultiChoiceOptions((oldValues) => {
      return oldValues.filter((_, i) => i !== index);
    });
  };

  const addOption = (pSetFocus: boolean = false) => {
    const multiChoiceOptionsCopy = [...multiChoiceOptions];
    const newOption = {
      option: "",
      id: uuidv4(),
      isOtherOption: false,
      setFocus: pSetFocus,
    };

    if (otherOptionAdded) {
      multiChoiceOptionsCopy.splice(
        multiChoiceOptionsCopy.length - 1,
        0,
        newOption
      );
    } else {
      multiChoiceOptionsCopy.push(newOption);
    }
    setMultiChoiceOptions(multiChoiceOptionsCopy);
  };

  const addOtherOption = () => {
    console.log("Add other option");
    setMultiChoiceOptions([
      ...multiChoiceOptions,
      { option: "", id: uuidv4(), isOtherOption: true },
    ]);
  };

  const updatePasteAnswersValue = () => {
    if (multiChoiceOptions.length > 0) {
      const newPasteAnswers = multiChoiceOptions
        .map((option) => option.option)
        .join("\n");
      setPasteAnswersValue(newPasteAnswers);
      setValue("pasteAnswers", newPasteAnswers);
    }
  };

  const setPasteAnswersAsVisible = () => {
    updatePasteAnswersValue();
    setShowPasteAnswers(true);
    setTimeout(() => {
      setFocus("pasteAnswers");
    }, 100);
  };

  const setPasteAnswersAsHidden = (saveValues: boolean) => {
    if (saveValues) {
      const newMultiChoiceTextOptions =
        control._formValues.pasteAnswers.split("\n");

      const newMultiChoiceOptions = newMultiChoiceTextOptions.map(
        (optionValue) => {
          return {
            option: optionValue,
            id: uuidv4(),
            isOtherOption: false,
          };
        }
      );
      const otherOptionValue = multiChoiceOptions.filter(
        (o) => o.isOtherOption
      );
      setMultiChoiceOptions(newMultiChoiceOptions.concat(otherOptionValue));
    }

    setShowPasteAnswers(false);
  };

  const editOptionValue = (optionValue: string, index: number) => {
    const newMultiChoiceOptions = multiChoiceOptions.map((option, i) => {
      if (index === i) {
        option.option = optionValue;
      }

      return option;
    });
    setMultiChoiceOptions(newMultiChoiceOptions);
  };

  const onMultipleOptionsChange = (checked: boolean) => {
    setAllowMultipleOptions(checked);
  };

  const updateMultipleOptionsType = (event: SelectChangeEvent) => {
    setMultipleOptionsType(event.target.value as string);
  };

  const handleTooltipClose = (): void => {
    setSaveDraftTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setSaveDraftTooltipOpen(true);

    // TODO: Fix
    // if (saveDraftTimerId > 0) {
    //   clearTimeout(saveDraftTimerId);
    //   saveDraftTimerId = 0;
    // }

    // saveDraftTimerId = setTimeout(() => {
    //   setSaveDraftTooltipOpen(false);
    // }, 3000);
  };

  const handleSavePoolTooltipClose = (): void => {
    setSavePollTooltipOpen(false);
  };

  const hideShowImageModal = () => {
    setShowAddImageModal(false);
  };

  const handleSavePollTooltipOpen = () => {
    setSavePollTooltipOpen(true);

    // TODO: Fix
    // if (saveDraftTimerId > 0) {
    //   clearTimeout(saveDraftTimerId);
    //   saveDraftTimerId = 0;
    // }

    // saveDraftTimerId = setTimeout(() => {
    //   setSavePollTooltipOpen(false);
    // }, 3000);
  };

  const getMultipleSelectionType = (pollData): [number, number] => {
    const allowSelectionQuantityType: string = pollData.allowSelectionQuantity;

    switch(allowSelectionQuantityType) {
      case "Unlimited":
        return [-1, -1];
      case "Exact number":
        return [pollData.multipleOptionsExactNumber, pollData.multipleOptionsExactNumber];
      case "Range":
        return [pollData.multipleOptionsRangeFrom, pollData.multipleOptionsRangeTo];
      default:
        return [1, 1];      
    }
  }

  const createPoll = async (data) => {
    console.log(data);

    console.log(multiChoiceOptions);

    const allowMultipleOptions = data.multipleOptions;

    const amountOfSelections: [number, number] = allowMultipleOptions ? getMultipleSelectionType(data) : [1, 1];
    
    const poll = {
      title: data.question,
      description: data.description ? data.description : "false",
      votingType: data.votingType,
      votingOptions: multiChoiceOptions.filter(o => o.isOtherOption !== true),
      createTime: new Date(),
      hasOtherOption: multiChoiceOptions.some(o => o.isOtherOption === true),
      settings: {
        fromAmountOfSelections: amountOfSelections[0],
        toAmountOfSelections: amountOfSelections[1],
        requireParticipantsName: data.requireParticipantsName,
        allowComments: data.allowComments,
        hideShareButton: data.hideShareButton,
        votingSecurity: data.votingSecurity,
        resultVisibility: data.resultVisibility,
        closePollOnDate: data.closePollOnDate,
      },
    };

    console.log(poll);

    const image = selectedFileImage as Blob;

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(poll)], { type: "application/json" })
    );
    formData.append("image", image ? image : new Blob());

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    console.log("Formdata", formData);

    try {
      await pollAPI.post("createpoll", formData, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.log(err);
      return;
    }

    navigate("/account");
  };

  function addImage(image: Blob | MediaSource): void {
    console.log("Add image", image);
    console.log(typeof image);
    setSelectedFileImage(image[0]);
    setShowAddImageModal(false);
  }

  function removePollImage() {
    setPollImage(undefined);
    setSelectedFileImage(undefined);
  }

  return (
    <>
      <Dialog
        showDialog={showAddImageModal}
        hideDialog={hideShowImageModal}
        title={<div>Media gallery</div>}
        content={
          <UploadImageDialog onImageSelected={addImage} ></UploadImageDialog>
        }
        footer={
          <div className="min-w-full">
            <Button
              className="min-w-full"
              onClick={hideShowImageModal}
              variant="greyVariant"
              color="secondary"
            >
              Cancel
            </Button>
          </div>
        }
      />
      <div className="flex flex-col items-center mt-10">
        <h1>Create a Poll</h1>
        <p className="text-grey-sub-color mb-9">
          Complete the below fields to create your poll.
        </p>
        <form>
          <Card
            sx={{
              minWidth: 1000,
              maxWidth: 1500,
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
            variant="borderTop"
          >
            <div className="mt-5">
              <h4 className="mb-2">Title</h4>
              <FormInputText
                name={"question"}
                control={control}
                label={""}
                textFieldProps={{ className: "w-full" }}
                rulesProps={{ required: "Please enter a question" }}
                placeHolderProps="Enter your question here"
                endAdornmentProps={
                  <InputAdornment position="end">
                    <ImageOutlinedIcon
                      aria-label="Upload image"
                      onClick={() => setShowAddImageModal(true)}
                      className="cursor-pointer"
                    />
                  </InputAdornment>
                }
              />
              {selectedFileImage && (
                <div className="p-9 ">
                  <div className="flex justify-end">
                    <CloseIcon
                      className="text-gray-400 hover cursor-pointer"
                      onClick={removePollImage}
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <img src={pollImage as string} />
                  </div>
                </div>
              )}
              {!showDescription ? (
                <div className="mt-2">
                  <div className="flex text-grey-sub-color">
                    <span
                      className="cursor-pointer flex hover:text-grey-sub-color-hover"
                      onClick={() => setShowDescription(true)}
                    >
                      <AddIcon className="mr-2" />
                      Add description
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <h4>
                    Description{" "}
                    <span className="text-grey-sub-color">(optional)</span>
                  </h4>
                  <FormInputText
                    name={"description"}
                    control={control}
                    label={""}
                    textFieldProps={{ className: "w-full" }}
                    multilineProps={true}
                    rowsProps={4}
                  />
                  <div className="flex justify-end mt-2">
                    <p
                      className="cursor-pointer text-grey-sub-color hover:text-grey-sub-color-hover"
                      onClick={() => setShowDescription(false)}
                    >
                      Hide description
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5">
              <h3>Voting type</h3>
              <FormSelect
                name="votingType"
                control={control}
                rulesProps={{ required: "Please select a voting type" }}
                formControlProps={{ className: "mt-5" }}
              >
                {votingTypesList}
              </FormSelect>
              <div>
                <div className="flex justify-between items-end">
                  <h3 className="mt-3">Answer options</h3>
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={setPasteAnswersAsVisible}
                  >
                    {" "}
                    Paste answers
                  </Link>
                </div>
                {showPasteAnswers ? (
                  <div>
                    <FormInputText
                      name={"pasteAnswers"}
                      control={control}
                      multilineProps={true}
                      rowsProps={4}
                      placeHolderProps="Enter one answer option per line"
                      // onChangeProps={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      //   setF
                      //   setPasteAnswersValue(event.target.value);
                      //     }}
                    />
                    {/* <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={4}
                  className="mt-3"
                  value={pasteAnswersValue}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    console.log("TEST");
                    setPasteAnswersValue(event.target.value);
                  }}
                  InputLabelProps={{ shrink: false }}
                  placeholder="Enter one answer option per line"
                  sx={{ minWidth: "100%" }}
                /> */}
                    <div className="mt-1">
                      <Button
                        variant="contained"
                        style={{ marginRight: "5px" }}
                        onClick={() => setPasteAnswersAsHidden(true)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="contained"
                        style={{ marginRight: "5px" }}
                        onClick={() => setPasteAnswersAsHidden(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <DraggableList
                      multiChoiceOptions={multiChoiceOptions}
                      onDragEnd={onDragEnd}
                      deleteItem={deleteItem}
                      editOptionValue={editOptionValue}
                      onEnter={() => addOption(true)}
                    />
                    <Button
                      variant="greyVariant"
                      style={{ marginRight: "5px" }}
                      onClick={() => addOption(false)}
                    >
                      <AddIcon className="cursor-pointer mr-2" />
                      Add option
                    </Button>
                    {otherOptionAdded === false ? (
                      <span>
                        <span className="text-grey-sub-color ml-1 mr-1">
                          or
                        </span>
                        <span>
                          <Link
                            style={{ cursor: "pointer" }}
                            onClick={addOtherOption}
                          >
                            {" "}
                            Add "other"
                          </Link>
                        </span>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
                <Divider className="mt-7" variant="middle" />
                <div>
                  <h3 className="mt-4 mb-5">Settings</h3>
                  <div className="grid grid-cols-2">
                    <div className="flex flex-row">
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between">
                          <p>
                            <b>Allow selection of multiple options</b>
                          </p>
                          {/* <Switch onChange={onMultipleOptionsChange} /> */}
                          <FormSwitch
                            name="multipleOptions"
                            control={control}
                            onChangeHandler={(checked) => {
                              onMultipleOptionsChange(checked);
                            }}
                          />
                        </div>
                        {allowMultipleOptions ? (
                          <div className="flex items-center">
                            <SubdirectoryArrowRightIcon className="text-grey-sub-color w-10" />
                            <FormSelect
                              name={"allowSelectionQuantity"}
                              control={control}
                              onChangeHandler={updateMultipleOptionsType}
                            >
                              {multipleOptionsTypesList}
                            </FormSelect>
                            {multipleOptionsType === EXACT_NUMBER ? (
                              <>
                                <FormInputText
                                  name={"multipleOptionsExactNumber"}
                                  control={control}
                                  textFieldProps={{
                                    className: "inline ml-2 mr-2",
                                  }}
                                  typeProps="number"
                                />
                                {/* <TextField
                                id="outlined-number"
                                type="number"
                                className="inline ml-2 mr-2"
                                value={exactNumberOfOptions}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setExactNumberOfOptions(
                                    event.target.valueAsNumber
                                  );
                                } } /> */}
                              </>
                            ) : (
                              ""
                            )}
                            {multipleOptionsType === RANGE ? (
                              <div className="flex">
                                <FormInputText
                                  name={"multipleOptionsRangeFrom"}
                                  control={control}
                                  textFieldProps={{
                                    className: "inline ml-2 mr-2",
                                  }}
                                  typeProps="number"
                                />
                                <FormInputText
                                  name={"multipleOptionsRangeTo"}
                                  control={control}
                                  textFieldProps={{
                                    className: "inline ml-2 mr-2",
                                  }}
                                  typeProps="number"
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="flex justify-between">
                          <p>
                            <b>Require participants name</b>
                          </p>
                          <FormSwitch
                            name={"requireParticipantsName"}
                            control={control}
                          />
                          {/* <Switch
                            value={requireParticipantsName}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setRequireParticipantsName(event.target.checked);
                            }} */}
                          {/* /> */}
                        </div>
                        <div className="flex justify-between">
                          <p>
                            <b>Close poll on a scheduled date</b>
                          </p>
                          <FormSwitch
                            name={"closeOnDate"}
                            control={control}
                            onChangeHandler={(event) =>
                              setClosePollOnSchedule(event)
                            }
                          />
                        </div>
                        {closePollOnSchedule ? (
                          <div className="flex items-center">
                             <SubdirectoryArrowRightIcon className="text-grey-sub-color w-10" /> 
                            <FormInputDateTimePicker
                              name="closePollOnDate"
                              control={control}
                              rulesProps={{
                                required: "Please select a date and time",
                              }}
                              formControlProps={{ className: "mt-5" }}
                              dateTimePickerProps={{
                                label: "Pick a Date and Time",
                              }}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="flex justify-between">
                          <p>
                            <b>Allow comments</b>
                          </p>
                          <FormSwitch
                            name={"allowComments"}
                            control={control}
                            />
                        </div>
                        <div className="flex justify-between">
                          <p>
                            <b>Hide share button </b>
                          </p>
                          <FormSwitch
                            name={"hideShareButton"}
                            control={control}
                            />
                        </div>
                      </div>
                      <Divider
                        orientation="vertical"
                        className="self-end w-1"
                      />
                    </div>
                    <div className="ml-3">
                      <div>
                        <h4>Voting security</h4>
                        <FormSelect
                              name={"votingSecurity"}
                              control={control}
                            >
                              {votingSecurityTypeList}
                            </FormSelect>             
                      </div>
                      <div className="mt-5">
                        <h4>Results visibility</h4>
                        <FormSelect
                              name={"resultVisibility"}
                              control={control}
                            >
                            {resultVisibilityTypeList}
                            </FormSelect>
                      </div>
                    </div>
                  </div>
                  <Divider className="mt-7" variant="middle" />
                  <div className="mt-5 ml-5 mb-5 flex gap-4">
                    {user ? (
                      <Button
                        onClick={handleSubmit(createPoll)}
                        variant="contained"
                        color="primary"
                        style={{ marginRight: "5px" }}
                      >
                        Create poll
                      </Button>
                    ) : (
                      <OutsideClickAlerter
                        handleClick={handleSavePoolTooltipClose}
                      >
                        <Tooltip
                          PopperProps={{
                            disablePortal: true,
                          }}
                          onClose={handleSavePoolTooltipClose}
                          open={savePollTooltipOpen}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          title="This function requires a user account"
                        >
                          <Button
                            onClick={handleSavePollTooltipOpen}
                            variant="contained"
                            color="primary"
                            style={{ marginRight: "5px" }}
                          >
                            Create poll
                          </Button>
                        </Tooltip>
                      </OutsideClickAlerter>
                    )}
                    <OutsideClickAlerter handleClick={handleTooltipClose}>
                      <Tooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={saveDraftTooltipOpen}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="This function requires a user account"
                      >
                        <Button
                          onClick={handleTooltipOpen}
                          variant="greyVariant"
                          color="secondary"
                        >
                          Save as draft
                        </Button>
                      </Tooltip>
                    </OutsideClickAlerter>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </>
  );
}

export default CreateNewPoll;
