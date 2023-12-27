import { useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

export function CreateGuest() {
  //fullName email nationalID nationality countryFlag
  const { register, handleSubmit, formState, getValues } = useForm();
  const { errors } = formState;
  return (
    <Form>
      <FormRow>
        <Input type="text" id="fullName" />
      </FormRow>
    </Form>
  );
}

export default CreateGuest;
