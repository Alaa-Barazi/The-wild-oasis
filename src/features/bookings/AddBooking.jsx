import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import NewBooking from "./NewBooking";

function AddBooking() {
  return (
    <div>
      <Link to="/newBooking">
        <Button>Add New booking</Button>
      </Link>
      {/* <Modal>
        <Modal.Open opens="newBooking">
          <Button>Add New booking</Button>
        </Modal.Open>
        <Modal.Window name="newBooking">
          <NewBooking />
        </Modal.Window>
      </Modal> */}
    </div>
  );
}

export default AddBooking;
