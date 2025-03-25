import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormInputText } from "../../components/formInputs/FormInputTextField";
import { useForm } from "react-hook-form";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import useAuth from "../../context/useAuth";
import { useAlert } from '../../context/useAlert';

interface ILoginFormInput {
  name: string;
  email: string;
  password: string;
}

const defaultFormValues = {
  name: "",
  email: "",
  password: "",
};

function SignupPage() {
  const { register, handleSubmit, reset, control, setValue } =
    useForm<ILoginFormInput>({
      defaultValues: defaultFormValues,
    });
  const { signUp } = useAuth();

  const { showAlert } = useAlert();

  const navigate = useNavigate();

  function goToLoginPage(): void {
    navigate("/login");
  }

  function goToForgotYourPasswordPage(): void {
    console.log("Go to forgot your password page");
  }

  const onSubmit = async (data: ILoginFormInput) => {
    console.log(data);
    const signUpErrorMessage: string = await signUp(data.email, data.name, data.password);
    if (signUpErrorMessage) {
      showAlert(signUpErrorMessage, "error", 3000);
    }
  };

  return (
    <>
      <div className="flex flex-col mt-10 items-center">
        <h1>Create a free account</h1>
        <p className="mt-2">
          Or
          <span>
            <Link style={{ cursor: "pointer" }} onClick={goToLoginPage}>
              {" "}
              log in to your account
            </Link>
          </span>
        </p>
        <Card
          sx={{
            minWidth: 600,
            maxWidth: 1500,
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
          variant="elevation"
          className="mt-10"
        >
          {" "}
          <div className="mt-5">
            <h4 className="mb-2 text-gray-300">Name</h4>
            <FormInputText
              name={"name"}
              control={control}
              typeProps={"name"}
              textFieldProps={{ className: "w-full" }}
              rulesProps={{
                required: true,
                minLength: {
                  value: 6,
                  message:
                    "The username needs to be at least 6 characters long",
                },
              }}
            />
            <h4 className="mt-5 mb-2 text-gray-300">Email address</h4>
            <FormInputText
              name={"email"}
              control={control}
              typeProps={"email"}
              textFieldProps={{ className: "w-full" }}
              rulesProps={{
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match a valid email format",
                },
              }}
            />
            <h4 className="mt-5 mb-2 text-gray-300">Password</h4>
            <FormInputText
              name={"password"}
              control={control}
              typeProps={"password"}
              textFieldProps={{ className: "w-full" }}
              rulesProps={{
                required: true,
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message:
                    "Password must be at least eight characters and include a number",
                },
              }}
              onKeyEvent={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <div className="flex justify-between mt-5 items-center">
              <div>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Remember me"
                  />
                </FormGroup>
              </div>
              <Link
                style={{ cursor: "pointer" }}
                onClick={goToForgotYourPasswordPage}
              >
                {" "}
                Forgot your password?
              </Link>{" "}
            </div>
            <Button
              variant="contained"
              color="primary"
              className="min-w-full mt-3 mb-10"
              onClick={handleSubmit(onSubmit)}
            >
              Sign up
            </Button>
          </div>
        </Card>
        <span className="text-gray-300 mt-8">
          Already have an account?
          <Link style={{ cursor: "pointer" }} onClick={goToLoginPage}>
            {" "}
            Log in
          </Link>
        </span>
      </div>
    </>
  );
}

export default SignupPage;
