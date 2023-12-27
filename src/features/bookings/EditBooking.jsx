import { isBefore } from "date-fns";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import { subtractDates } from "../../utils/helpers";
import { useUpdateBooking } from "./useUpdateBooking";

import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
3;
import Textarea from "../../ui/Textarea";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";

function EditBooking({ booking, onCloseModal }) {
  const [breakfast, setBreakfast] = useState(booking?.hasBreakfast || false);
  const [guests, setGuests] = useState(booking?.numGuests);

  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const {
    breakfastPrice,
    maxBookingLength,
    maxGuestsPerBooking,
    minBookingLength,
    isLoading: isLoadingSettings,
  } = useSettings();
  //if the previous isnt working pass the etting as props
  const { register, handleSubmit, getValues, formState } = useForm({
    defaultValues: booking,
  });
  const { updateBooking, isUpdating } = useUpdateBooking();

  if (isLoadingCabins || isLoadingSettings || isUpdating) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const { errors } = formState;
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

  function onSubmit() {
    const cabinPrice = cabins.find(
      (cabin) => cabin.id === Number(getValues().cabinId)
    ).regularPrice;
    const extraPrice = breakfast ? breakfastPrice * getValues().numGuests : 0;
    const priceStay = numNights * cabinPrice;

    const updatedBooking = {
      startDate: getValues().startDate,
      endDate: getValues().endDate,
      hasBreakfast: breakfast,
      numGuests: getValues().numGuests,
      observation: getValues().observation,
      numNights,
      totalPrice: extraPrice + priceStay,
      extrasPrice: extraPrice,
      cabinId: getValues().cabinId,
    };
    updateBooking({ id: booking.id, obj: updatedBooking });
    onCloseModal();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          //     {...register("numGuests", {
          //       validate: (value) =>
          //         value <= maxGuestsPerBooking ||
          //         `Max guests per booking is ${maxGuestsPerBooking}`,
          //     })}
        />
      </FormRow>
      <FormRow label="Has BreakFast" error={errors?.hasBreakfast?.message}>
        <Checkbox
          value={breakfast}
          checked={breakfast}
          onChange={() => setBreakfast((breakfast) => !breakfast)}
          id="hasBreakfast"
        >
          {breakfast ? "Yes" : "No"}
        </Checkbox>
      </FormRow>
      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea type="text" id="observations" {...register("observations")} />
      </FormRow>
      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <select id="cabinId" {...register("cabinId")}>
          {cabins.map(
            (cabin) =>
              cabin.maxCapacity >= guests && (
                <option value={Number(cabin.id)} key={cabin.id}>
                  {cabin.name}
                </option>
              )
          )}
        </select>
      </FormRow>

      <ButtonGroup>
        <Button
          variation="secondary"
          onClick={onCloseModal}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button variation="primary" disabled={isUpdating}>
          Edit
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default EditBooking;
