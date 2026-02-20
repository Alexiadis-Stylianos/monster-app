import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import styles from "./Styles.module.css";
import { pluralizeMonster } from "./monsterPlurals";

function Checkout({ setToastMessage, horde, setHorde, setPurchased }) {
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

  // Valid card
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

    setPurchased(true);
    setToastMessage("Payment successful!");
    setHorde([]);
    navigate("/");
  };

  const rawCard = formData.cardNumber.replace(/\s/g, "");
  const isCardComplete = rawCard.length === 16;
  const isCardValid = isCardComplete && isValidCardNumber(rawCard);

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
              {item.quantity} ×{" "}
              {item.colors.length > 1
                ? item.colors.slice(0, -1).join(", ") + " and " + item.colors.at(-1)
                : item.colors[0]}{" "}
              {pluralizeMonster(item.monster, item.quantity)} —
              {item.price * item.quantity} €
            </p>
          ))}
          <h3>Total: {total}€</h3>
        </>
      )}


      <form onSubmit={(e) => {
        e.preventDefault();

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
                  ? "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  : "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"//Mastercard
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
        <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <h2>Confirm Purchase</h2>
          <p>Are you sure you want to hire these monsters?</p>

          <button
            onClick={handleConfirmPayment}
            className={styles.mybutton}
            style={{ backgroundColor: "green" }}
          >
            Yes, Pay
          </button>

          <button
            onClick={() => setConfirmOpen(false)}
            className={styles.mybutton}
            style={{ backgroundColor: "#777" }}
          >
            Cancel
          </button>
        </Modal>

      </form>
    </div>
  );
}

export default Checkout;