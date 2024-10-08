import React, { useRef, useEffect, useState } from "react";
import styles from "./ItemType.module.css";

export default function ItemType({
  onClick,
  onCreate,
  blank,
  name: initialName = "",
  imageUrl,
  selected,
  rectangular,
}) {
  const inputRef = useRef(null);
  const [name, setName] = useState(initialName);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  useEffect(() => {
    if (blank && inputRef.current) {
      inputRef.current.focus();
    }
  }, [blank]);

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onClick(reader.result);
        // setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewUrl(imageUrl);
      // onClick(getImageUrl(imageUrl));
    }
  }, [selectedImage, imageUrl]);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCreate = async () => {
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }

    onCreate(name, selectedImage);
  };

  return (
    <div
      className={
        styles[
          name
            ? "item-type"
            : rectangular
            ? "item-type-rectangular"
            : "item-type-nomargin"
        ]
      }
      style={{ zIndex: blank ? 301 : "inherit" }}
    >
      <div
        onClick={
          rectangular ? (blank ? null : () => onClick(imageUrl)) : onClick
        }
        className={styles["item-type-rect"]}
        style={{
          top: selected ? "-10px" : "initial",
        }}
      >
        <img
          src={previewUrl}
          alt={name}
          className={styles["item-type-image"]}
        />
        {blank && (
          <div className={styles["item-type-image-container"]}>
            <input
              type="file"
              accept="image/*"
              className={styles["item-type-image-input"]}
              onChange={handleImageChange}
              id="image-input"
            />
          </div>
        )}
      </div>
      {(rectangular || !blank) && (
        <input
          ref={inputRef}
          className={`${styles["item-type-name"]} ${styles.noborder}`}
          value={name}
          onChange={handleNameChange}
          disabled={true}
          style={{
            top: selected ? "-5px" : "initial",
            borderBottom: selected ? "1px solid #000" : "none",
          }}
        />
      )}
      {/* {blank && (
        <button className={styles["item-type-create"]} onClick={handleCreate}>
          create
        </button>
      )} */}
    </div>
  );
}
