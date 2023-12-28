import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { isBefore } from "date-fns";
import { useSettings } from "../settings/useSettings";
import { subtractDates } from "../../utils/helpers";
import Select from "react-select";

import { useGuests } from "../guests/useGuests";
import { useCabins } from "../cabins/useCabins";
import { useCreateBooking } from "./useCreateBooking";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";
import Spinner from "../../ui/Spinner";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import CreateGuest from "../guests/CreateGuest";
import Row from "../../ui/Row";

function NewBooking() {
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
  const { register, handleSubmit, getValues, formState, control } = useForm();

  const { errors } = formState;
  const [numGuests, setNumGuests] = useState(1);
  const [breakfast, setBreakfast] = useState(false);
  const [openGuestForm, setOpenGuestForm] = useState(false);
  const navigate = useNavigate();
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
    console.log(breakfastPrice);
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
      guestId: data.guestId.value,
    };
    createBooking(newData);
    navigate("/bookings");
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Add New Booking</Heading>
        <Button
          variation="primary"
          size="medium"
          onClick={() => setOpenGuestForm((cur) => !cur)}
        >
          New Guest
        </Button>
      </Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Guest">
          <Controller
            name="guestId"
            control={control}
            rules={{
              validate: { notEmpty: (value) => value || "Choose a guest" },
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={guests.map((guest) => ({
                  value: guest.id,
                  label: guest.fullName,
                }))}
                isSearchable
                placeholder="Choose a guest"
              />
            )}
          />
          {/* <select
            disabled={isCreating}
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
          </select> */}
        </FormRow>

        <FormRow label="startDate" error={errors?.startDate?.message}>
          <Input
            type="datetime-local"
            id="startDate"
            disabled={isCreating}
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
            disabled={isCreating}
            {...register("endDate", {
              validate: validateNumNights,
            })}
          />
        </FormRow>
        <FormRow label="Num Guests" error={errors?.numGuests?.message}>
          <Input
            type="number"
            id="numGuests"
            disabled={isCreating}
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
            disabled={isCreating}
            onChange={() => setBreakfast((breakfast) => !breakfast)}
            id="hasBreakfast"
            //   {...register("hasBreakfast")}
          >
            {breakfast ? "Yes" : "No"}
          </Checkbox>
        </FormRow>
        <FormRow label="Observations" error={errors?.observations?.message}>
          <Textarea
            type="text"
            id="observations"
            {...register("observations")}
            disabled={isCreating}
          />
        </FormRow>
        <FormRow label="Cabin" error={errors?.cabinId?.message}>
          <select
            disabled={isCreating}
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
          <Button variation="secondary">Cancel</Button>
          <Button>Create </Button>
        </ButtonGroup>
      </Form>
      {openGuestForm && (
        <CreateGuest onChange={() => setOpenGuestForm(false)} />
      )}
    </>
  );
}

export default NewBooking;
