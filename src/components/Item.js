import React, { useState, useRef, useEffect } from "react";
import styles from "./Item.module.css";

const Item = ({
  blank,
  forCart,
  forInvoice,
  name: initialName,
  price: initialPrice,
  qty: initialQty,
  imageUrl,
  id,
  onPlusClick,
  onNegativeClick,
  handleCreateItem,
  onRemoveClick,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [itemQty, setItemQty] = useState(blank ? 0 : initialQty);
  const [itemName, setItemName] = useState(initialName);
  const [itemPrice, setItemPrice] = useState(initialPrice);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewUrl(imageUrl);
    }
  }, [selectedImage, imageUrl]);

  const handlePlusClick = () => {
    if (!blank) onPlusClick(id);
    setItemQty(itemQty + 1);
  };

  const handleNegativeClick = () => {
    if (itemQty > 0) {
      if (!blank) onNegativeClick(id);
      setItemQty(itemQty - 1);
    }
  };

  const handleCreate = () => {
    handleCreateItem(itemName, itemPrice, itemQty, selectedImage);
  };

  const handleRemoveClick = () => {
    onRemoveClick(id);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handlePriceChange = (event) => {
    setItemPrice(event.target.value);
  };

  const handleQtyChange = (event) => {
    const newQty = parseInt(event.target.value, 10);
    if (!isNaN(newQty)) {
      setItemQty(newQty);
    }
  };

  const handleNameChange = (event) => {
    setItemName(event.target.value);
  };

  return (
    <div className={`${styles.item} ${forInvoice ? styles.itemInvoice : ""}`}>
      {!forInvoice && (
        <div className={styles.imageContainer}>
          <img
            src={previewUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src =
                "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
            }}
            alt={itemName}
            className={styles.itemImage}
          />
          {blank && (
            <div className={styles.overlay} onClick={handleImageClick}>
              <span>Click To Add Image</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className={styles.fileInput}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      )}
      <div className={styles.itemDetails}>
        <input
          className={`${forInvoice ? styles.itemInvoiceName : styles.itemName} ${blank ? styles.blank : styles.notblank}`}
          value={itemName}
          onChange={handleNameChange}
          disabled={!blank}
        />

        {forInvoice && (
          <>
            <p className={styles.multiplySymbol}>x</p>
            <p className={styles.qtyInvoice}>{itemQty}</p>
          </>
        )}
        {!forInvoice && (
          <input
            className={`${styles.itemPrice} ${blank ? styles.blank : styles.notblank}`}
            value={itemPrice}
            onChange={handlePriceChange}
            disabled={!blank}
          />
        )}

        {!forInvoice && (
          <div className={styles.itemQty}>
            <svg
              className={styles.plusNegative}
              onClick={handleNegativeClick}
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm4.253 7.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"
                fillRule="nonzero"
              />
            </svg>
            {!blank && <p className={styles.itemQtyValue}>{itemQty}</p>}
            {blank && (
              <input
                className={styles.itemQtyInput}
                value={itemQty}
                onChange={handleQtyChange}
                disabled={!blank}
              />
            )}
            <svg
              className={styles.plusNegative}
              onClick={handlePlusClick}
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm0 1.5c-4.69 0-8.497 3.808-8.497 8.498s3.807 8.497 8.497 8.497 8.498-3.807 8.498-8.497-3.808-8.498-8.498-8.498zm-.747 7.75h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                fillRule="nonzero"
              />
            </svg>
          </div>
        )}

        {forInvoice && (
          <p className={styles.itemPriceInvoice}>Rp {itemQty * itemPrice}</p>
        )}
      </div>
      {forCart && (
        <div className={styles.remove} onClick={handleRemoveClick}>
          ⓧ
        </div>
      )}
      {blank && (
        <button className={styles.createItem} onClick={handleCreate}>
          Create Item
        </button>
      )}
    </div>
  );
};

export default Item;
