import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormInputText } from "../../components/formInputs/FormInputTextField";
import { useForm } from "react-hook-form";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import useAuth from "../../context/useAuth";
import { useAlert } from '../../context/useAlert';


interface ILoginFormInput {
  email: string;
  password: string;
}

const defaultFormValues = {
  email: "",
  password: "",
};

function LoginPage() {
  const { register, handleSubmit, reset, control, setValue } =
    useForm<ILoginFormInput>({
      defaultValues: defaultFormValues,
    });

  const { showAlert } = useAlert();

  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data: ILoginFormInput) => {
    console.log(data);
    const loggedIn: boolean = await login(data.email, data.password);
    if (!loggedIn) {
      showAlert("Incorrect user credentials", "error", 3000);
      return;
    }
    console.log("Navigate to previous page");
    navigate(from, { replace: true});
  } 

  function goToSignupPage(): void {
    navigate("/signup");
  }

  function goToForgotYourPasswordPage(): void {
    console.log("Go to forgot your password page");
  }

  return (
    <>
      <div className="flex flex-col mt-10 items-center">
        <h1>Log in to your account</h1>
        <p className="mt-2">
          Or
          <span>
            <Link style={{ cursor: "pointer" }} onClick={goToSignupPage}>
              {" "}
              create a free account
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
            <h4 className="mb-2 text-gray-300">Email</h4>
            <FormInputText
              name={"email"}
              control={control}
              typeProps={"email"}
              textFieldProps={{ className: "w-full" }}
              rulesProps={{ required: true,
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
              rulesProps={{ required: true}}
              textFieldProps={{ className: "w-full" }}
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
              Log in
            </Button>
          </div>
        </Card>
        <span className="text-gray-300 mt-8">
          Don't have an account yet?
          <Link style={{ cursor: "pointer" }} onClick={goToSignupPage}>
            {" "}
            Sign up
          </Link>
        </span>
      </div>
    </>
  );
}

export default LoginPage;
