import { useForm } from "react-hook-form";
import { subtractDates } from "../../utils/helpers";
import { isBefore } from "date-fns";
import { useSettings } from "../settings/useSettings";
import { useState } from "react";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";
import Spinner from "../../ui/Spinner";
import { useGuests } from "../../hooks/useGuests";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import { useCabins } from "../cabins/useCabins";
import { useCreateBooking } from "./useCreateBooking";

function NewBooking({ onCloseModal }) {
  const {
    settings: {
      breakfastPrice,
      maxBookingLength,
      maxGuestsPerBooking,
      minBookingLength,
    },
    isLoading: isLoadingSettings,
  } = useSettings();
  const { cabins, isLaoding: isLoadingCabins } = useCabins();
  const { guests, isLoading: isLoadingGuests } = useGuests();
  const { createBooking, isCreating } = useCreateBooking();
  const { register, handleSubmit, getValues, formState } = useForm();

  const { errors } = formState;
  const [numGuests, setNumGuests] = useState(1);
  const [breakfast, setBreakfast] = useState(false);
  if (isLoadingSettings || isLoadingGuests || isLoadingCabins)
    return <Spinner />;

  const numNights =
    subtractDates(getValues().endDate, getValues().startDate) - 1;
  function validateNumNights(value) {
    if (isBefore(value, new Date()) || isBefore(value, getValues().startDate)) {
      return "Pick a valid date";
    }

    if (numNights > maxBookingLength || numNights < minBookingLength) {
      return `Booking length should be ${minBookingLength} to ${maxBookingLength} nights`;
    }

    return true;
  }

  function onSubmit(data) {
    const cabin = cabins.find((cabin) => cabin.id === Number(data.cabinId));
    const { regularPrice, discount } = cabin;
    const cabinPrice =
      (regularPrice - (discount ? (regularPrice * discount) / 100 : 0)) *
      numNights;
    const extrasPrice = (breakfast ? breakfastPrice : 0) * numGuests;
    const newData = {
      ...data,
      hasBreakfast: breakfast,
      numGuests,
      numNights,
      status: "unconfirmed",
      isPaid: false,
      extrasPrice,
      totalPrice: cabinPrice + extrasPrice,
      cabinPrice,
    };
    console.log(newData);
     createBooking(newData);
    //onCloseModal();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Guests">
        <select
          id="guestId"
          {...register("guestId", {
            required: "This field is required",
            validate: (value) => value !== "default" || "Choose a guest",
          })}
        >
          <option value="default">Choose a guest</option>
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName}
            </option>
          ))}
        </select>
      </FormRow>
      <FormRow label="startDate" error={errors?.startDate?.message}>
        <Input
          type="datetime-local"
          id="startDate"
          {...register("startDate", {
            validate: (value) =>
              isBefore(new Date(), value) || "Pick a valid date",
          })}
        />
      </FormRow>
      <FormRow label="endDate" error={errors?.endDate?.message}>
        <Input
          type="datetime-local"
          id="endDate"
          {...register("endDate", {
            validate: validateNumNights,
          })}
        />
      </FormRow>
      <FormRow label="Num Guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          value={numGuests}
          onChange={(e) => setNumGuests(Number(e.target.value))}

          //   {...register("numGuests", {
          //     validate: (value) =>
          //       value <= maxGuestsPerBooking ||
          //       `Max guests per booking is ${maxGuestsPerBooking}`,
          //   })}
        />
      </FormRow>
      <FormRow label="Want breakfast?" errors={errors?.hasBreakfast?.message}>
        <Checkbox
          value={breakfast}
          checked={breakfast}
          onChange={() => setBreakfast((breakfast) => !breakfast)}
          id="hasBreakfast"
          //   {...register("hasBreakfast")}
        >
          {breakfast ? "Yes" : "No"}
        </Checkbox>
      </FormRow>
      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea type="text" id="observations" {...register("observations")} />
      </FormRow>
      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <select
          id="cabinId"
          {...register("cabinId", {
            required: "This field is required",
            validate: (value) => value !== "default" || "Choose a cabin",
          })}
        >
          <option value="default">Choose a cabin</option>
          {cabins.map(
            (cabin) =>
              cabin.maxCapacity >= numGuests && (
                <option value={Number(cabin.id)} key={cabin.id}>
                  {cabin.name}
                </option>
              )
          )}
        </select>
      </FormRow>
      <ButtonGroup>
        <Button variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button>Create </Button>
      </ButtonGroup>
    </Form>
  );
}

export default NewBooking;
