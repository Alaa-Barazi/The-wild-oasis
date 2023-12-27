import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import NewBooking from "./newBooking";

function AddBooking() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="newBooking">
          <Button>Add New booking</Button>
        </Modal.Open>
        <Modal.Window name="newBooking">
          <NewBooking />
        </Modal.Window>
        
      </Modal>
    </div>
  );
}


export default AddBooking;
