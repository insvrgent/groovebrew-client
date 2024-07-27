import React, { useRef, useEffect, useState } from 'react';
import styles from './ItemType.module.css';
import { getImageUrl } from '../helpers/itemHelper';

export default function ItemType({ onClick, onCreate, blank, name: initialName = '', imageUrl }) {
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
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewUrl(getImageUrl(imageUrl));
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
      console.error('No image selected');
      return;
    }
    
    onCreate(name, selectedImage);
  };

  return (
    <div className={styles["item-type"]}>
      <div onClick={onClick} className={styles["item-type-rect"]}>
        <img src={previewUrl} alt={name} className={styles["item-type-image"]} />
        {blank && (
          <input
            type="file"
            accept="image/*"
            className={styles["item-type-image-input"]}
            onChange={handleImageChange}
          />
        )}
      </div>
      <input
        ref={inputRef}
        className={`${styles["item-type-name"]} ${blank ? styles.border : styles.noborder}`}
        value={name}
        onChange={handleNameChange}
        disabled={!blank}
      />
      {blank && (
        <button className={styles["item-type-create"]} onClick={handleCreate}>
          create
        </button>
      )}
    </div>
  );
}
