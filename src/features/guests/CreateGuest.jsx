import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import { useCountries } from "./useCountries";
import { useNewGuest } from "./useNewGuest";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";

const BASE_FLAG_URL = "https://flagcdn.com/";
function CreateGuest() {
  const { createGuest, isCreating } = useNewGuest();
  const { register, handleSubmit, formState, getValues, control, reset } =
    useForm();
  const { isLoading, data: countries } = useCountries();
  const { errors } = formState;
  if (isLoading) return <Spinner />;
  function onSubmit(data) {
    const { fullName, email, nationalID, country } = data;
    const newGuest = {
      fullName,
      email,
      nationalID,
      nationality: country.label,
      countryFlag: `${BASE_FLAG_URL}${country.value.toLowerCase()}.svg`,
    };
    createGuest(newGuest);
    reset();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          disabled={isCreating}
          id="fullName"
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          disabled={isCreating}
          id="email"
          {...register("email", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          disabled={isCreating}
          id="nationalID"
          {...register("nationalID", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Country">
        <Controller
          control={control}
          disabled={isCreating}
          id="country"
          name="country"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={countries}
              isSearchable
              placeholder="Select a country"
              onChange={(selectedOption) => {
                // Set the selected value to the form state
                field.onChange(selectedOption);
              }}
            />
          )}
        />
      </FormRow>

      <ButtonGroup>
        <Button variation="secondary" type="reset" disabled={isCreating}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Create New Guest</Button>
      </ButtonGroup>
    </Form>
  );
}

export default CreateGuest;
