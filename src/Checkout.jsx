import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import styles from "./Styles.module.css";
import { pluralizeMonster } from "./monsterPlurals";
import mastercard from './Mastercard.png';
import visa from './Visa.png';

function Checkout({ setToastMessage, horde, setHorde, setPurchased, user }) {
  const navigate = useNavigate();

  const total = horde.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shakeField, setShakeField] = useState("");
  const [cardType, setCardType] = useState(null);

  // Check if the card is valid
  const isValidCardNumber = (number) => {
    const digits = number.replace(/\s/g, "");
    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Allow only letters and spaces for names
    if (name === "firstName" || name === "lastName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return; // reject invalid character
      }
    }

    if (name === "cardNumber") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "").slice(0, 16);

      // Detect card type
      if (/^4/.test(digits)) {
        setCardType("visa");
      } else if (
        /^(5[1-5])/.test(digits) ||
        /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(digits)
      ) {
        setCardType("mastercard");
      } else {
        setCardType(null);
      }

      // Insert space every 4 digits
      formattedValue = digits.match(/.{1,4}/g)?.join(" ") || "";
    }

    //automatically format expiry date
    if (name === "expiryDate") {
      const digits = value.replace(/\D/g, "").slice(0, 4);

      if (digits.length >= 3) {
        formattedValue = digits.slice(0, 2) + "/" + digits.slice(2);
      } else {
        formattedValue = digits;
      }
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  //Validate if the fields are properly filled
  const validate = () => {
    const newErrors = {};

    // Required field check
    Object.keys(formData).forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = "Required";
      }
    });
    const rawCard = formData.cardNumber.replace(/\s/g, "");

    if (formData.firstName && !/^[A-Za-z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "Letters only";
    }

    if (formData.lastName && !/^[A-Za-z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Letters only";
    }

    if (rawCard && rawCard.length !== 16) {
      newErrors.cardNumber = "Must be 16 digits";
    } else if (rawCard && !isValidCardNumber(rawCard)) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (formData.expiryDate) {
      const match = formData.expiryDate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

      if (!match) {
        newErrors.expiryDate = "Format MM/YY";
      } else {
        const month = parseInt(match[1], 10);
        const year = parseInt("20" + match[2], 10);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          newErrors.expiryDate = "Card has expired";
        }
      }
    }

    if (formData.cvv && formData.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);

    const firstError = Object.keys(newErrors)[0];
    if (firstError) {
      setShakeField(firstError);
      setTimeout(() => setShakeField(""), 500);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPayment = () => {
    setConfirmOpen(false);

    const order = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: horde,
      total
    };

    // Get existing orders for this user
    const existingOrders =
      JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];

    // Save updated orders
    localStorage.setItem(
      `orders_${user.email}`,
      JSON.stringify([...existingOrders, order])
    );

    setPurchased(true);
    setToastMessage("Payment successful!");

    // Clear horde for this user
    localStorage.removeItem(`horde_${user.email}`);
    setHorde([]);

    navigate("/");
  };

  const rawCard = formData.cardNumber.replace(/\s/g, "");
  const isCardComplete = rawCard.length === 16;
  const isCardValid = isCardComplete && isValidCardNumber(rawCard);

  //ENTER button works for payment confirmation
  const confirmButtonRef = useRef(null);

  const formatList = (arr) => {
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(" and ");
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  };

  useEffect(() => {
    if (confirmOpen) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 0);
    }
  }, [confirmOpen]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Checkout</h1>

      <h2>Order Summary</h2>

      {horde.length === 0 ? (
        <p>No monsters selected.</p>
      ) : (
        <>
          {horde.map((item, index) => (
            <p key={index}>
              {item.quantity} x{" "}
              {formatList(item.colors)}{" "}
              {pluralizeMonster(item.monster, item.quantity)} —
              {item.price * item.quantity} €
            </p>
          ))}
          <h3>Total: {total}€</h3>
        </>
      )}

      <form onSubmit={(e) => {
        e.preventDefault();
        // in case someone bypasses navigation
        if (!user) {
          setToastMessage("You must be logged in to pay");
          return;
        }

        if (!validate()) return;

        setConfirmOpen(true);
      }}>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={shakeField === "firstName" ? styles.shake : ""}
            style={{
              padding: "8px",
              border: errors.firstName ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>
            {errors.firstName}
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={shakeField === "lastName" ? styles.shake : ""}
            style={{
              padding: "8px",
              border: errors.lastName ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>
            {errors.lastName}
          </div>
        </div>

        <div style={{ marginBottom: "10px", position: "relative" }}>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            className={shakeField === "cardNumber" ? styles.shake : ""}
            style={{
              padding: "8px 40px 8px 8px", // extra right padding for icon
              width: "250px",
              border: errors.cardNumber ? "2px solid red" : isCardValid ? "2px solid #00cc66" : "1px solid #ccc",
              boxShadow: isCardValid ? "0 0 8px rgba(0, 255, 100, 0.6)" : "none",
              borderRadius: "4px",
              transition: "all 0.2s ease"
            }}
          />

          {/* Card Icon */}
          {cardType && (
            <img
              src={
                cardType === "visa"
                  ? visa //Visa logo
                  : mastercard //Mastercard logo
              }
              alt={cardType}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                height: "20px",
                pointerEvents: "none"
              }}
            />
          )}

          <div style={{ color: "red", fontSize: "12px" }}>
            {errors.cardNumber}
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            className={shakeField === "expiryDate" ? styles.shake : ""}
            style={{
              padding: "8px",
              border: errors.expiryDate ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>
            {errors.expiryDate}
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            className={shakeField === "cvv" ? styles.shake : ""}
            style={{
              padding: "8px",
              border: errors.cvv ? "2px solid red" : "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
          <div style={{ color: "red", fontSize: "12px" }}>
            {errors.cvv}
          </div>
        </div>

        <button
          type="submit"
          className={styles.mybutton}>
          Pay Now
        </button>

        <Modal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmPayment}
        >
          {({ selected, onConfirm, onClose }) => (
            <>
              <h2>Confirm Purchase</h2>
              <p>Are you sure you want to hire these monsters?</p>

              <button
                data-action="confirm"
                onClick={onConfirm}
                className={`${styles.mybutton} ${selected === "confirm" ? styles.modalSelected : ""
                  }`}
                style={{ backgroundColor: "green" }}
              >
                Yes, Pay
              </button>

              <button
                data-action="cancel"
                onClick={onClose}
                className={`${styles.mybutton} ${selected === "cancel" ? styles.modalSelected : ""
                  }`}
                style={{ backgroundColor: "#777" }}
              >
                Cancel
              </button>
            </>
          )}
        </Modal>

      </form>
    </div>
  );
}

export default Checkout;